import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil, filter as rxFilter, tap, map, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { ActivatedRoute } from '@angular/router';
import { isEmpty, isNil, keyBy, filter, reduce, find, merge } from 'lodash';
import { formHelper } from '@setl/utils/helper';

import { ClearMyKycListRequested } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';
import { SelectAmcService } from './select-amc.service';

@Component({
    selector: 'kyc-step-select-amc',
    styleUrls: ['./select-amc.component.scss'],
    templateUrl: './select-amc.component.html',
})
export class NewKycSelectAmcComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<any> = new Subject();
    private kycList;

    managementCompanies;
    filteredManagementCompanies;
    rawManagementCompanies: any[] = [];
    connectedWallet;

    submitted = false;
    alreadyRegistered = false;
    preSelectedAm: { amcId: number, invitationToken };

    selectedAMCIDs = new Set();

    searchCompanies: FormControl = new FormControl();
    timeout: any;

    @Input() duplicate;
    @Input() onboarding;
    @Input() form: FormGroup;

    @Input() set disabled(isDisabled) {
        if(isDisabled) {
            this.submitted = true;
        }
    }

    @Output() registered = new EventEmitter<boolean>();
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();

    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requestedKycList$;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'invRequested']) requestedManagementCompanyList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;

    get selectedManagementCompanies() {
        let selected = filter(this.managementCompanies, company => this.selectedAMCIDs.has(company.id)).map(company => ({
            id: company.id,
            registered: company.registered,
            invitationToken: this.getInvitationToken(company.id),
        }));

        return selected;
    }

    constructor(
        private ofiManagementCompanyService: OfiManagementCompanyService,
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        private ofiKycService: OfiKycService,
        private ngRedux: NgRedux<any>,
        private route: ActivatedRoute,
        private selectAmcService: SelectAmcService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.initSubscriptions();
        this.getQueryParams();
    }

    ngAfterViewInit() {
        if(this.onboarding){
            
            combineLatest(
                this.managementCompanyList$, 
                this.myKycList$)
            .subscribe(([managementCompanyList,myKycList]) => {
                if(!this.submitted) this.handleSubmit();
            });
        }
    }

    initSubscriptions() {
        this.requestedManagementCompanyList$
        .pipe(
            rxFilter(requested => !requested),
            takeUntil(this.unsubscribe),
        )
        .subscribe(() => {
            this.getAssetManagementCompanies();
        });

        const companyCombination$ = combineLatest(this.managementCompanyList$, this.myKycList$)
        .pipe(
            rxFilter(([managementCompanies, kycList]) => {
                return managementCompanies && managementCompanies.size > 0;
            }),
            tap(([managementCompanies, kycList]) => {
                this.rawManagementCompanies = keyBy(managementCompanies.toJS(), 'companyID');
                this.kycList = kycList;
            }),
                takeUntil(this.unsubscribe),
        );

        combineLatest(companyCombination$, this.requestedKycList$)
        .pipe(
            map(([company, requestedKycs]) => [company[0], company[1], requestedKycs]),
            takeUntil(this.unsubscribe),
        )
        .subscribe(([managementCompanies, kycList, requestedKycs]) => {
            const managementCompanyList = managementCompanies.toJS();

            this.managementCompanies = this.requestsService
            .extractManagementCompanyData(managementCompanyList, kycList, requestedKycs);
            if (!this.filteredManagementCompanies) this.filteredManagementCompanies = this.managementCompanies;

        });

        combineLatest(companyCombination$, this.requestedKycList$)
        .pipe(
            map(([company, kycs]) => kycs),
            rxFilter((kycs: any[]) => !!kycs.length),
            takeUntil(this.unsubscribe),
        )
        .subscribe((kycs) => {
            this.populateForm(kycs);
        });

        this.connectedWallet$
        .pipe(
            takeUntil(this.unsubscribe),
        )
        .subscribe((connectedWallet) => {
            this.connectedWallet = connectedWallet;
        });

        this.searchCompanies.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(term => this.filterAMCompanies(term));
    }

    filterAMCompanies(term: string) {
        // Debounce: clear any set timers as user has typed again
        clearTimeout(this.timeout);

        // Reset filter if search input cleared
        if (term.length === 0) {
            this.filteredManagementCompanies = this.managementCompanies;
            this.changeDetectorRef.detectChanges();
            return;
        }

        // Filter companies after delay to allow user to finish typing
        this.timeout = setTimeout(
            () => {
                this.filteredManagementCompanies = this.managementCompanies.filter(co => co.text.toLowerCase().includes(term.toLowerCase()));
                this.changeDetectorRef.detectChanges();
            },
            400,
        );
    }

    clearSearch() {
        this.filterAMCompanies('');
        this.searchCompanies.setValue('');
    }

    populateForm(kycs) {
        kycs.forEach((kyc) => {
            const amcID = kyc.amcID;
            const foundKyc = find(this.kycList, ['kycID', kyc.kycID]);
            const managementCompany = find(this.managementCompanies, ['id', amcID]);

            if (foundKyc && managementCompany) {
                this.selectedAMCIDs.add(managementCompany.id)
                managementCompany.registered = foundKyc.alreadyCompleted;
            }
        });


        this.copyToForm();
    }

    selectManagementCompany(amcID) {
        const managementCompany = find(this.managementCompanies, ['id', amcID]);

        if (managementCompany) {
            this.toggleManagementCompany(managementCompany);
        }
    }

    toggleManagementCompany(managementCompany) {
        if (!this.submitted) {
            if (this.selectedAMCIDs.has(managementCompany.id)) {
               this.selectedAMCIDs.delete(managementCompany.id);
            } else {
               this.selectedAMCIDs.add(managementCompany.id);
            }
            this.onRegisteredChange();
        }
    }

    getQueryParams() {
        combineLatest(
            this.route.queryParams,
            this.managementCompanyList$.pipe(
                rxFilter(mcs => Boolean(mcs)),
            ),
        ).subscribe(([queryParams, _]) => {
            if (queryParams.invitationToken) {
                const amcId = Number(queryParams.amcID);

                this.preSelectedAm = {
                    amcId,
                    invitationToken: queryParams.invitationToken,
                };

                this.selectManagementCompany(amcId);
            }
        });
    }

    getAssetManagementCompanies() {
        this.ofiManagementCompanyService.fetchInvestorManagementCompanyList(true);
    }

    onRegisteredChange() {
        const selectedManagementCompanies = this.selectedManagementCompanies;
        let result;

        if (!selectedManagementCompanies.length) {
            result = false;
        } else {
            result = reduce(
                selectedManagementCompanies,
                (result, value) => {
                    return result && value.registered;
                },
                true,
            );
        }

        if (this.alreadyRegistered !== result) {
            this.registered.emit(result);
        }
        this.alreadyRegistered = result;
        this.copyToForm();
    }

    copyToForm() {
        this.form.get('managementCompanies').patchValue(this.selectedManagementCompanies);
    }

    async handleSubmit($event = null) {
        if ($event) {
            $event.preventDefault();
        }

        if (this.submitted) {
            this.validSubmit();
        }

        if (!this.selectedManagementCompanies.length || this.submitted) {
            formHelper.dirty(this.form);
            return;
        }

        let ids;

        if (this.duplicate) {
            ids = await this.selectAmcService.duplicate(this.selectedManagementCompanies, this.duplicate, this.connectedWallet);
        } else {
            ids = await this.selectAmcService.createMultipleDrafts(this.selectedManagementCompanies, this.connectedWallet);
        }

        this.newRequestService.storeCurrentKycs(ids);

        this.ngRedux.dispatch(ClearMyKycListRequested());
        this.submitted = true;
        this.changeDetectorRef.markForCheck();

        this.validSubmit();
    }

    validSubmit() {
        this.submitEvent.emit({
            completed: true,
        });
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    getWebsiteAddress(url: string): string {
        const pattern = new RegExp('^(https?:\/\/)');

        if(pattern.test(url)) return url;

        return `http://${url}`;
    }

    isWebsiteAddressValid(url: string): boolean {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //port
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i');

        return pattern.test(url);
    }

    /* isStepValid
     * - this gets run by the form-steps component to enable/disable the next button
     */
    isStepValid() {
        return (this.selectedManagementCompanies.length && this.selectedManagementCompanies.length > 0) ||
            this.submitted;
    }

    /**
     * Stop enter key submitting Form Steps
     */
    stopSubmit(e) {
        const key = e.charCode || e.keyCode || 0;
        if (key === 13) e.preventDefault();
    }

    /**
     * Get invitation token if amId is same with the amId from preselected am
     * @param amcId
     */
    getInvitationToken(amcId: number): string {
        if (this.preSelectedAm && amcId === this.preSelectedAm.amcId) {
            return this.preSelectedAm.invitationToken;
        }
        return undefined;
    }

    /**
     * Check if amc is selected, for a given amcID
     * @param amcID
     */
    isAMCSelected(amcID: number):boolean {
        return this.selectedAMCIDs.has(amcID);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
