import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil, filter as rxFilter, tap, map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { ActivatedRoute } from '@angular/router';
import { isEmpty, isNil, keyBy, filter, reduce, find } from 'lodash';
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
    rawManagementCompanies: any[] = [];
    connectedWallet;

    submitted = false;
    alreadyRegistered = false;

    @Input() duplicate;
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
        return filter(this.managementCompanies, company => company.selected).map(company => ({
            id: company.id,
            registered: company.registered,
        }));
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
    }

    populateForm(kycs) {
        kycs.forEach((kyc) => {
            const amcID = kyc.amcID;
            const foundKyc = find(this.kycList, ['kycID', kyc.kycID]);
            const managementCompany = find(this.managementCompanies, ['id', amcID]);

            if (foundKyc) {
                managementCompany.selected = true;
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
        managementCompany.selected = !managementCompany.selected;
        this.onRegisteredChange();
    }

    getQueryParams() {
        this.route.queryParams.subscribe((queryParams) => {
            if (queryParams.invitationToken) {
                const amcID = queryParams.amcID;

                this.selectManagementCompany(amcID);
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

    async handleSubmit($event) {
        $event.preventDefault();

        if (this.submitted) {
            this.validSubmit();
        }

        if (!this.selectedManagementCompanies.length || this.submitted) {
            formHelper.dirty(this.form);
            return;
        }

        let ids;
        if (this.duplicate) {
            ids = await this.selectAmcService.duplicate(this.selectedManagementCompanies, 1, this.connectedWallet);
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

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
