import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { combineLatest, Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, filter as rxFilter, tap, map, distinctUntilChanged, take, first } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { ActivatedRoute } from '@angular/router';
import { isEmpty, isNil, keyBy, filter, reduce, find, merge } from 'lodash';
import { formHelper } from '@setl/utils/helper';
import { SagaHelper } from '../../../../../utils';
import { SET_KYC_PARTY_SELECTIONS } from '../../../../ofi-store/ofi-kyc/my-informations';

import { ClearMyKycListRequested, MyKycRequestedIds } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';
import { SelectAmcService } from './select-amc.service';
import { KycFormHelperService } from '../../kyc-form-helper.service';
import { getPartyNameFromInvestorType } from '../../kyc-form-helper';
import { KycPartySelections } from '../../../../ofi-store/ofi-kyc/my-informations/model';

/**
 * Kyc Asset management companie selection screen
 */
@Component({
    selector: 'kyc-step-select-amc',
    styleUrls: ['./select-amc.component.scss'],
    templateUrl: './select-amc.component.html',
})
export class NewKycSelectAmcComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<any> = new Subject();
    private kycList;

    // full management company list that the am selection screen show show.
    managementCompanies: any[];
    // filtered management company list that the am selection screen show show.
    filteredManagementCompanies: any[];
    // current connected walletID
    connectedWallet: number;

    // whether the current kyc(s) form is already created the draft. that would mean the am selection screen should be readonly.
    // and stop making request to create draft kyc/duplicate kyc, to membernode.
    submitted = false;
    // Same as this.submitted, plus the kyc is current on onboarding status.
    onboardingSubmitted = false;
    // User choose to use "light kyc mode"(short version of kyc). user do this by toggle the 'KYC Completed?' in the am selection screen.
    alreadyRegistered = false;
    // Pre-selected Am, this would be the am that invited the current investor;.
    preSelectedAm: { amcId: number, invitationToken };

    // list of selected management companyIDs
    selectedAMCIDs = new Set();

    // am search form control.
    searchCompanies: FormControl = new FormControl();
    // am search form input timeout.
    timeout: any;

    // observable subject to mark worked triggeried by query params is finished.
    finishHandlingQueryParams$ = new BehaviorSubject(false);

    // managementCompany full list
    fullManagementCompanyList = [];

    // Whether the form is duplicating another kyc. if it is define, this would be the kycID to duplicate from.
    // The property would decide which request to make, when user click "Next" button.
    @Input() duplicate: number;
    // Whether the form is currently in onboarding mode.
    @Input() onboarding;
    // form group of the current kyc selection screen.
    @Input() form: FormGroup;

    // Whether set this kyc selection screen readonly.
    @Input() set disabled(isDisabled) {
        if(isDisabled) {
            this.submitted = true;
        }
    }

    // Whether the kyc is 'light kyc'.
    @Output() registered = new EventEmitter<boolean>();
    // Let parent componet know the am selection screen is submitted and completed.
    @Output() submitEvent: EventEmitter<{completed: boolean; updateView?: boolean}> = new EventEmitter();
    // Emit event when kyc party selection changed.
    @Output() kycPartySelectionsChangedEvent: EventEmitter<boolean> = new EventEmitter();

    // observable for list of kycs belong to the current investor
    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;
    // observable for list of kycs that belong to the current kyc form
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requestedKycList$;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'invRequested']) requestedManagementCompanyList$;
    // obervable for full list of management companies.
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;

    /**
     * @return {any[]}: list of selected management companies, for the current kyc form.
     */
    get selectedManagementCompanies(): any[] {
        let selected = filter(this.fullManagementCompanyList, company => this.selectedAMCIDs.has(company.id)).map(company => ({
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
        private kycFormHelperService: KycFormHelperService,
    ) {
    }

    ngOnInit() {
        this.initSubscriptions();
        this.getQueryParams();
    }

    ngAfterViewInit() {
        // to do with auto submit draft kyc, when onboarding?
        // this would create the draft kyc and go to next step of the kyc?
        if (this.onboarding && !this.submitted) {

            combineLatest(
                this.managementCompanyList$,
                this.finishHandlingQueryParams$.asObservable(),
            )
            .pipe(
                rxFilter(([managementCompanyList, finished])=> {
                    return (!!managementCompanyList && !!finished);
                }),
                first(),
            )
            .subscribe(([managementCompanyList]) => {
                if (this.selectedManagementCompanies.length && !this.onboardingSubmitted) {
                    this.onboardingSubmitted = true;
                    this.handleSubmit();
                }
            });
        }
    }

    initSubscriptions() {
        // Fetch management company list.
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
                this.kycList = kycList;
            }),
                takeUntil(this.unsubscribe),
        );

        combineLatest(companyCombination$, this.requestedKycList$, this.kycFormHelperService.investorType$)
        .pipe(
            map(([company, requestedKycs, investorType]) => [company[0], company[1], requestedKycs, investorType]),
            takeUntil(this.unsubscribe),
        )
        .subscribe(([managementCompanies, kycList, requestedKycs, investorType]) => {
            const managementCompanyList = managementCompanies.toJS();

            this.fullManagementCompanyList = this.requestsService
            .extractManagementCompanyData(managementCompanyList, kycList, requestedKycs);

            // filter out third party management company. if company is third party company and kyc user is iznes investor type.
            this.managementCompanies = this.fullManagementCompanyList.filter(c => this.relevantAMC(c, investorType));
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

    /**
     * Filter management companies list to show.
     * @param {string} term: term to search
     */
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

    /**
     * Clear AMC filter
     */
    clearSearch() {
        this.filterAMCompanies('');
        this.searchCompanies.setValue('');
    }

    /**
     * Update AM selection form from kycList that belong to current user. This would update selected AM, whether they are using 'light kyc'(alreadyCompleted),
     * and fill the form group of current component.
     */
    populateForm(kycs: any[]): void {
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

    /**
     * Programatically Select specified management company in selection screen.
     * @param {number} amcID
     */
    selectManagementCompany(amcID: number): void {
        // find management company detail for the amcID
        const managementCompany = find(this.fullManagementCompanyList, ['id', amcID]);

        if (managementCompany) {
            this.toggleManagementCompany(managementCompany);
        }
    }

    /**
     * Toggle selection for a specified management company in AMC selection screen.
     * @param {any} managementCompany
     */
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

    /**
     * Handle query params
     */
    getQueryParams() {
        combineLatest(
            this.route.queryParams,
            this.managementCompanyList$,
        ).pipe(
            rxFilter(([mcs, _]) => !!mcs),
            first(),
        ).subscribe(([queryParams, _]) => {
            // fetch invitationToken and amcId from query param
            // select management company programatically
            if (queryParams.invitationToken) {
                const invitedAmcId = Number(queryParams.invitedAmcId);
                const selectedAmcIds: number[] = queryParams.selectedAmcIds;

                this.preSelectedAm = {
                    amcId: invitedAmcId,
                    invitationToken: queryParams.invitationToken,
                };

                selectedAmcIds.forEach((amcId) => this.selectManagementCompany(Number(amcId)));
            }

            this.finishHandlingQueryParams$.next(true);
        });
    }

    /**
     * fetch management companies list from membernode
     */
    getAssetManagementCompanies() {
        this.ofiManagementCompanyService.fetchInvestorManagementCompanyList(true);
    }

    /**
     * Update this.alreadyRegistered property(whether using 'light kyc'), base on the selected management companies.
     */
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

    /**
     * Update form group value, of this component, with this.selectedManagementCompanies.
     */
    copyToForm() {
        this.form.get('managementCompanies').patchValue(this.selectedManagementCompanies);
    }

    async handleSubmit($event = null) {
        if ($event) {
            $event.preventDefault();
        }

        // stop here,and emit submit event.
        if (this.submitted) {
            this.validSubmit();
            return;
        }

        // if this.selectedManagementCompanies is not exist. stop here, and mark form dirty, so form can show error?
        if (!this.selectedManagementCompanies.length) {
            formHelper.dirty(this.form);
            return;
        }

        let ids;

        // send duplicate kyc request or create draft kyc accordingly.
        if (this.duplicate) {
            ids = await this.selectAmcService.duplicate(this.selectedManagementCompanies, this.duplicate, this.connectedWallet);
        } else {
            ids = await this.selectAmcService.createMultipleDrafts(this.selectedManagementCompanies, this.connectedWallet);
        }

        // if any one the newly created kyc is iznes. update KycPartySelections to container iznes investor.
        this.updateKycPartySelections(ids);

        // Store the newly created kyc detail to redux
        this.newRequestService.storeCurrentKycs(ids);

        // If this is onboarding, set the newly created kyc completed step to 'introduction'.
        // Setting the completed step to 'introduction' would cause the current step become the next
        if (this.onboarding) {
            const context = this.newRequestService.getContext(ids);
            ids.forEach(entry => this.selectAmcService.sendRequestUpdateCurrentStep(entry.kycID, context, 'introduction'));
        }

        this.ngRedux.dispatch(ClearMyKycListRequested());
        this.submitted = true;
        this.changeDetectorRef.markForCheck();

        this.validSubmit();
    }

    /**
     * Emit submit event. This would let parent componet aware of this step(selection management company) of kyc form is done.
     * And this would cause the form to go next step.
     */
    validSubmit() {
        this.submitEvent.emit({
            completed: true,
        });
    }

    /**
     * Check form control has validation error.
     * @param {FormControl} control: control we checking against
     * @param {any[]} error
     */
    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
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

    /**
     * Update kyc party selections, if a iznes management company kyc is created by the current kyc user.
     * @param {MyKycRequestedIds} kycs
     * return {void}
     */
    async updateKycPartySelections(kycs: MyKycRequestedIds) {
        const hasIznAm = kycs.find(kyc => !kyc.isThirdPartyKyc);
        if (!!hasIznAm) {
            const walletId = await this.connectedWallet$.pipe(take(1)).toPromise();
            let partySelections = await this.kycFormHelperService.kycPartySelections$.pipe(take(1)).toPromise();
            partySelections = {...partySelections, iznes: true};

            await this.sendKycPartySelectionsRequest(partySelections, walletId);
            this.kycPartySelectionsChangedEvent.emit(true);
        }
    }

    sendKycPartySelectionsRequest(partySelections: KycPartySelections, walletId: number): Promise<any> {
        const partySelectionsSerialised = JSON.stringify(partySelections);
        const asyncTaskPipe = this.ofiKycService.setKycPartySelections({ walletId, partySelections: partySelectionsSerialised });
        return new Promise((resolve, reject) => {
            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_KYC_PARTY_SELECTIONS],
                [],
                asyncTaskPipe,
                {},
                () => {
                    resolve();
                },
                () => {
                    reject()
                },
            ));
        });
    }

    /**
     * Show mangement company relevant to the user.
     * 1. if iznes investor. hide all third party management company
     * 2. if nowcp: show nowcp management company and iznes management company
     * 3. if id2s: show id2s management company and iznes management company
     */
    relevantAMC(amc: any, investorType) {
        const investorTypeStr = getPartyNameFromInvestorType(investorType);
        if (investorTypeStr === 'iznes') {
            return !amc.isThirdPartyKyc;
        }
        if (investorTypeStr === 'nowcp') {
            return !amc.isThirdPartyKyc || amc.managementCompanyType === 'nowcp';
        }
        if (investorTypeStr === 'id2s') {
            return !amc.isThirdPartyKyc || amc.managementCompanyType === 'id2s';
        }
        return false;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
