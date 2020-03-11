import { Component, Input, Output, OnInit, OnDestroy, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { get as getValue, set as isEmpty } from 'lodash';
import { select, NgRedux } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter as rxFilter, map, take, takeUntil } from 'rxjs/operators';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { IdentificationService } from '../identification.service';
import { DocumentsService } from '../documents.service';
import { NewRequestService } from '../../new-request.service';
import { countries } from '../../../requests.config';
import { MultilingualService } from '@setl/multilingual';
import { formHelper } from '@setl/utils/helper';
import { KycMyInformations } from '@ofi/ofi-main/ofi-store/ofi-kyc/my-informations';
import { KycFormHelperService } from '../../../kyc-form-helper.service';
import { PartyCompaniesInterface } from '../../../kyc-form-helper';

@Component({
    selector: 'company-information',
    templateUrl: './company-information.component.html',
    styleUrls: ['./company-information.component.scss'],
})
export class CompanyInformationComponent implements OnInit, OnDestroy {
    // Get access to the FormPercentDirective component instance
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    // Current component formGroup.
    @Input() form: FormGroup;
    // whether the form should render in readonly mode.
    @Input() isFormReadonly = false;
    // current completed step of the kyc form.
    @Input() completedStep: number;
    // Output event to let parent component hande the submit event.
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformations: Observable<KycMyInformations>;

    unsubscribe: Subject<any> = new Subject();
    // countries list that used in dropdown
    countries = countries;
    // regulator supervisory authorities list that used in dropdown
    regulatorSupervisoryAuthoritiesList;
    // regulator status list that used in dropdown
    regulatoryStatusList;
    // regulator status insurer list that used in dropdown
    regulatoryStatusInsurerTypeList;
    // sector activities list that used in dropdown
    sectorActivityList;
    // other sector activities list that used in dropdown
    otherSectorActivityList;
    // cached other sector activities list that used in dropdown? It is used as the base of otherSectorActivityList,
    // because otherSectorActivityList would mutate?
    cachedOtherSectorActivityList;
    // company activities list that used in dropdown
    companyActivitiesList;
    // investor on behalf list that used in dropdown
    investorOnBehalfList;
    // geographical origin type list that used in dropdown
    geographicalOriginTypeList;
    // financial assets invested list that used in dropdown
    financialAssetsInvestedList;
    // geographical area list that used in dropdown
    geographicalAreaList;
    // custodian holder account list that used in dropdown
    custodianHolderAccountList;
    // listing markets list that used in dropdown
    listingMarketsList;
    // multilateral trading facilities list used in dropdown
    multilateralTradingFacilitiesList;
    // type of revenues list used in dropdown
    typeOfRevenuesList;
    // whether 'other listing market' field for the kyc form has error.
    otherListingMarketError = false;
    // whether 'other multilateral trading facilities' field for the kyc form has error.
    otherMultilateralTradingFacilitiesError = false;
    // The parties the investor has selected.
    partyCompanies: PartyCompaniesInterface;
    // data is fetched from database, and patched value to formgroup.
    formDataFilled$ = new BehaviorSubject<boolean>(false);

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
        private documentsService: DocumentsService,
        private ngRedux: NgRedux<any>,
        public translate: MultilingualService,
        private element: ElementRef,
        private formHelper: KycFormHelperService,
    ) {}

    ngOnInit() {
        this.initFormCheck();
        this.getCurrentFormData();

        this.initLists();

        this.requestLanguageObj
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => this.initLists());

        // set current user's investor type.
        this.formHelper.kycPartyCompanies$
            .takeUntil(this.unsubscribe)
            .subscribe((d) => {
                this.partyCompanies = d;
                this.handlePartyFormControls();
            });
    }

    /**
     * Observe specified properties of the form, and change the properties of the current form dynamically.
     */
    initFormCheck() {
        this.form.get('sectorActivity').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                const sectorActivityValue = getValue(data, [0, 'id']);

                // Enable sectorActivityTextControl if sectorActivityValue is 'Other', else disable
                this.formCheckSectorActivity(sectorActivityValue);

                if (sectorActivityValue && sectorActivityValue !== 'Other') {
                    // Remove sectorActivityValue from the otherSectorActivityList
                    this.formFilterOtherSectorActivity(sectorActivityValue);
                }
            });

        this.form.get('otherSectorActivity').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((otherSectorActivityValues) => {
                // Enable otherSectorActivityTextControl if otherSectorActivityValues includes 'Other', else disable
                this.formCheckOtherSectorActivity(otherSectorActivityValues);
            });

        this.form.get('activities').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                const activitiesValue = getValue(data, [0, 'id']);

                this.formCheckActivity(activitiesValue);
            });

        this.form.get('geographicalAreaOfActivity').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                const activityGeographicalAreaValue = getValue(data, [0, 'id']);

                this.formCheckActivityGeographicalArea(activityGeographicalAreaValue);
            });

        this.form.get('activityRegulated').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((isActivityRegulatedValue) => {
                this.formCheckActivityRegulated(isActivityRegulatedValue);
            });

        this.form.get('companyListed').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((isCompanyListedValue) => {
                this.formCheckCompanyListed(isCompanyListedValue);
            });

        this.form.get('listingMarkets').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                this.formCheckListingMarkets(data);
                this.formFilterOtherListingMarkets();
            });

        this.form.get('otherListingMarkets').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                this.otherListingMarketError = false;

                if (data) {
                    this.formFilterOtherListingMarkets();
                }
            });

        this.form.get('multilateralTradingFacilities').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                this.formCheckMultilateralTradingFacilities(data);
                this.formFilterOtherMultilateralTradingFacilities();
            });

        this.form.get('otherMultilateralTradingFacilities').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                this.otherListingMarketError = false;

                if (data) {
                    this.formFilterOtherMultilateralTradingFacilities();
                }
            });

        this.form.get('capitalNature').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                this.formCheckNatureAndOrigin(data);
            });

        this.form.get('geographicalOrigin1').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                const control = this.form.get('geographicalOrigin2');

                if (!control) return;

                control.setValue('');

                const geographicalOriginTypeValue = getValue(data, [0, 'id']);

                this.formCheckGeographicalOrigin(geographicalOriginTypeValue);
            });

        this.form.get('regulatoryStatus').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                const regulatoryStatusValue = getValue(data, [0, 'id']);

                this.formCheckRegulatoryStatus(regulatoryStatusValue);
            });

        this.form.get('regulator').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                this.formCheckRegulator(data);
            });

        this.form.get('companyStateOwned').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                this.formCheckCompanyStateOwned(data);
            });
    }

    /**
     * Constuct the lists for dropdowns. with text tranlsated.
     */
    initLists() {
        this.regulatorSupervisoryAuthoritiesList = this.translate.translate(this.newRequestService.regulatorSupervisoryAuthoritiesList);
        this.regulatoryStatusInsurerTypeList = this.translate.translate(this.newRequestService.regulatoryStatusInsurerTypeList);
        this.regulatoryStatusList = this.translate.translate(this.newRequestService.regulatoryStatusList);
        this.sectorActivityList = this.translate.translate(this.newRequestService.sectorActivityList);
        this.otherSectorActivityList = this.translate.translate(this.newRequestService.otherSectorActivityList);
        this.cachedOtherSectorActivityList = this.translate.translate(this.newRequestService.otherSectorActivityList);
        this.companyActivitiesList = this.translate.translate(this.newRequestService.companyActivitiesList);
        this.investorOnBehalfList = this.translate.translate(this.newRequestService.investorOnBehalfList);
        this.geographicalOriginTypeList = this.translate.translate(this.newRequestService.geographicalOriginTypeList);
        this.financialAssetsInvestedList = this.translate.translate(this.newRequestService.financialAssetsInvestedList);
        this.geographicalAreaList = this.translate.translate(this.newRequestService.geographicalAreaList);
        this.custodianHolderAccountList = this.translate.translate(this.newRequestService.custodianHolderAccountList);
        this.listingMarketsList = this.translate.translate(this.newRequestService.listingMarketsList);
        this.multilateralTradingFacilitiesList = this.translate.translate(this.newRequestService.multilateralTradingFacilitiesList);
        this.typeOfRevenuesList = this.translate.translate(this.newRequestService.typeOfRevenuesList);
    }

    /**
     * Get geographical origin from the formGroup.
     * @return {string}
     */
    get geographicalOrigin():string {
        return getValue(this.form.get('geographicalOrigin1').value, [0, 'id']);
    }

    /**
     * Observe 'sector activity' value and update formgroup dynamically.
     * @param {string} value
     */
    formCheckSectorActivity(value: string): void {
        const control = this.form.get('sectorActivityText');

        if (value === 'Other') {
            control.enable();
        } else {
            control.setValue(null);
            control.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    /**
     * Observe 'Other sector activity' value and update formgroup dynamically.
     * @param {string} value
     */
    formCheckOtherSectorActivity(values) {
        const control = this.form.get('otherSectorActivityText');

        let isOtherSelected = false;

        if (Array.isArray(values)) {
            isOtherSelected = values.find((value) => {
                return value.id === 'Other';
            });
        }

        if (isOtherSelected) {
            control.enable();
        } else {
            control.setValue(null);
            control.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    /**
     * Observe 'Other sector activity' value and update formgroup dynamically.
     * Make sure 'Primary Sector of Activity' dropdown and 'Other sector(s) of Activity' value does not conflict.
     * If confict, remove remove value in 'Other sector(s) of Activity' dropdown, and clear the dropdown value.
     *
     * @param {string} value
     */
    formFilterOtherSectorActivity(value) {
        // Reset the otherSectorActivityList
        this.otherSectorActivityList = [...this.cachedOtherSectorActivityList];

        // If value is in the otherSectorActivity list, remove it
        this.otherSectorActivityList.forEach((item, index) => {
            if (item.id === value) {
                delete this.otherSectorActivityList[index];
            }
        });

        const control = this.form.get('otherSectorActivity');

        // Get the otherSectorActivity form control values
        const otherSectorActivityFormValues = control.value;

        // If value is in otherSectorActivityFormValues, reset the form control
        if (otherSectorActivityFormValues && otherSectorActivityFormValues[0] !== null) {
            otherSectorActivityFormValues.forEach((item) => {
                if (item.id === value) {
                    control.reset();
                }
            });
        }
    }

    /**
     * Observe 'activity' value and update formgroup dynamically.
     *
     * @param {string} value
     */
    formCheckActivity(value) {
        const form = this.form;
        const investorOnBehalfControl = form.get('investorOnBehalfThirdParties');

        investorOnBehalfControl.disable();

        switch (value) {
            case 'onBehalfOfThirdParties':
                investorOnBehalfControl.enable();
                break;
        }

        this.formPercent.refreshFormPercent();
    }

    /**
     * Observe 'capital nature' value and update formgroup dynamically.
     *
     * @param {string} value
     */
    formCheckNatureAndOrigin(value) {
        const control = this.form.get('otherCapitalNature');

        if (value.others) {
            control.enable();
        } else {
            control.setValue(null);
            control.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    /**
     * Observe 'geographical origin type' value and update formgroup dynamically.
     *
     * @param {string} value
     */
    formCheckGeographicalOrigin(value) {
        const control = this.form.get('geographicalOrigin2');

        if (!value) {
            control.disable();
        } else {
            control.enable();
        }

        this.formPercent.refreshFormPercent();
    }

    /**
     * Observe 'activity geographical area' value and update formgroup dynamically.
     *
     * @param {string} value
     */
    formCheckActivityGeographicalArea(value) {
        const activityGeographicalAreaTextControl = this.form.get('geographicalAreaOfActivitySpecification');

        if (value === 'oecd' || value === 'outsideOecd') {
            activityGeographicalAreaTextControl.enable();
        } else {
            activityGeographicalAreaTextControl.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    /**
     * Observe 'activity regulated' value and update formgroup dynamically.
     *
     * @param {string} value
     */
    formCheckActivityRegulated(value) {
        const activityAuthorityControl = this.form.get('regulator');
        const activityApprovalNumberControl = this.form.get('approvalNumber');
        const regulatoryStatusControl = this.form.get('regulatoryStatus');

        if (value) {
            activityAuthorityControl.enable();
            activityApprovalNumberControl.enable();
            regulatoryStatusControl.enable();
        } else {
            activityAuthorityControl.disable();
            activityApprovalNumberControl.disable();
            regulatoryStatusControl.disable();
        }

        regulatoryStatusControl.updateValueAndValidity();
        this.formPercent.refreshFormPercent();
    }

    /**
     * Observe 'Regulatory status' value and update formgroup dynamically.
     *
     * @param {string} value
     */
    formCheckRegulatoryStatus(value) {
        const form = this.form;
        const controls = ['regulatoryStatusInsurerType', 'regulatoryStatusListingOther'];

        for (const control of controls) {
            form.get(control).disable();
        }

        switch (value) {
            case 'insurer':
                form.get('regulatoryStatusInsurerType').enable();
                break;
            case 'other' :
                form.get('regulatoryStatusListingOther').enable();
                break;
        }

        this.formPercent.refreshFormPercent();
    }

    /**
     * Observe company listed value and update formgroup dynamically.
     * @param {any} value
     */
    formCheckCompanyListed(value) {
        const listingMarketsControl = this.form.get('listingMarkets');
        const multilateralTradingFacilitiesControl = this.form.get('multilateralTradingFacilities');
        const otherMultilateralTradingFacilitiesControl = this.form.get('otherMultilateralTradingFacilities');
        const bloombergCodesControl = this.form.get('bloombergCode');
        const listedShareISINControl = this.form.get('isinCode');
        const floatableSharesControl = this.form.get('floatableShares');
        const balanceSheetTotalControl = this.form.get('balanceSheetTotal');
        const netRevenuesNetIncomeControl = this.form.get('netRevenuesNetIncome');
        const shareholderEquityControl = this.form.get('shareholderEquity');

        if (value) {
            listingMarketsControl.enable();
            listedShareISINControl.enable();
            bloombergCodesControl.enable();
            floatableSharesControl.enable();
            // Leave disabled if user is ONLY ID2S
            if (!this.isOnlyID2S()) {
                multilateralTradingFacilitiesControl.enable();
                otherMultilateralTradingFacilitiesControl.enable();
            }

            balanceSheetTotalControl.disable();
            netRevenuesNetIncomeControl.disable();
            shareholderEquityControl.disable();
        } else {
            listingMarketsControl.disable();
            multilateralTradingFacilitiesControl.disable();
            otherMultilateralTradingFacilitiesControl.disable();
            listedShareISINControl.disable();
            bloombergCodesControl.disable();
            floatableSharesControl.disable();

            balanceSheetTotalControl.enable();
            netRevenuesNetIncomeControl.enable();
            shareholderEquityControl.enable();
        }

        this.formPercent.refreshFormPercent();
    }

    /**
     * Observe 'listed market' value, and update formGroup dynamically.
     * @param {any} selectedMarkets.
     */
    formCheckListingMarkets(selectedMarkets: any) {
        const control = this.form.get('otherListingMarkets');

        let isOtherSelected = false;

        if (Array.isArray(selectedMarkets)) {
            isOtherSelected = selectedMarkets.find((market) => {
                return market.id === 'lmXXX'; // Other
            });
        }

        if (isOtherSelected) {
            control.enable();
        } else {
            control.setValue(null);
            control.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    /**
     * Make sure other market field value is not within the 'listing market list'?
     */
    formFilterOtherListingMarkets() {
        const control = this.form.get('otherListingMarkets');
        const otherListingMarketsFormValue = control.value;

        if (otherListingMarketsFormValue) {
            let duplicateMarket = false;

            duplicateMarket = this.listingMarketsList.find((market) => {
                return otherListingMarketsFormValue.toLowerCase().replace(/\s+/g, '') === market.text.toLowerCase().replace(/\s+/g, '');
            });

            if (duplicateMarket) {
                this.otherListingMarketError = true;
                control.setErrors({ otherListingMarkets: true });
            } else {
                control.setErrors(null);
            }
        }
    }

    /**
     * Observe multilateral trading facilities value, and update formGroup dynamically.
     * @param {any} selectedFacilities
     */
    formCheckMultilateralTradingFacilities(selectedFacilities: any) {
        const control = this.form.get('otherMultilateralTradingFacilities');

        let isOtherSelected = false;

        if (Array.isArray(selectedFacilities)) {
            isOtherSelected = selectedFacilities.find((market) => {
                return market.id === 'mtfXXX'; // Other
            });
        }

        if (isOtherSelected) {
            control.enable();
        } else {
            control.setValue(null);
            control.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    /**
     * Make sure other multilateral trading facilities is not within the 'multilateral trading facilities'?
     */
    formFilterOtherMultilateralTradingFacilities() {
        const control = this.form.get('otherMultilateralTradingFacilities');
        const otherMultilateralTradingFacilityFormValue = control.value;

        if (otherMultilateralTradingFacilityFormValue) {
            let duplicateFacility = false;

            duplicateFacility = this.multilateralTradingFacilitiesList.find((market) => {
                return otherMultilateralTradingFacilityFormValue.toLowerCase().replace(/\s+/g, '') === market.text.toLowerCase().replace(/\s+/g, '');
            });

            if (duplicateFacility) {
                this.otherMultilateralTradingFacilitiesError = true;
                control.setErrors({ otherMultilateralTradingFacility: true });
            } else {
                control.setErrors(null);
            }
        }
    }

    /**
     * Observe the 'regulator' value, and update formGroup dynamically.
     * @param {string} selectedRegulators
     */
    formCheckRegulator(selectedRegulators: any) {
        const control = this.form.get('otherRegulator');

        let isOtherSelected = false;

        if (Array.isArray(selectedRegulators)) {
            isOtherSelected = selectedRegulators.find((regulator) => {
                return regulator.id === 'other';
            });
        }

        if (isOtherSelected) {
            control.enable();
        } else {
            control.disable();
        }

        this.formPercent.refreshFormPercent();
    }
    /**
     * Observe the 'companyStateOwned' value, and update formGroup dynamically.
     * @param {number} isStateOwned
     */
    formCheckCompanyStateOwned(isStateOwned: number) {
        const control = this.form.get('percentCapitalHeldByState');

        if (isStateOwned === 1) {
            control.enable();
        } else {
            control.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    isOnlyID2S(): boolean {
        return this.partyCompanies.id2s && !this.partyCompanies.iznes && !this.partyCompanies.nowcp;
    }

    handlePartyFormControls(): void {
        // ID2S is in list of party companies...
        if (this.partyCompanies.id2s){
            this.regulatoryStatusList = this.translate.translate(this.newRequestService.regulatoryStatusListID2S);
        }

        // ONLY selected ID2S...
        if (this.isOnlyID2S()) {
            // Hide Multilateral trading facility
            this.form.get('multilateralTradingFacilities').disable();
            this.form.get('otherMultilateralTradingFacilities').disable();

            // Update Bloomberg Code to optional (setting overwrites existing)
            this.form.get('bloombergCode').setValidators(Validators.maxLength(45));
        }

        // Hide for ID2S and NowCP
        if (!this.partyCompanies.iznes) {
            this.form.get('activities').disable();
            this.form.get('investorOnBehalfThirdParties').disable();
            this.form.get('totalFinancialAssetsAlreadyInvested').disable();
        }
    }

    /**
     * Check a formControl has specified type of error.
     */
    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    /**
     * Check a field within the formGroup of the current component is disable, in order to hide it in the form.
     * @param {string} path
     * @return {boolean}
     */
    isDisabled(path): boolean {
        const control = this.form.get(path);
        return control.disabled;
    }

    /**
     * Get kyc Identification -> Company Information, from membernode, and update the formGroup.
     */
    getCurrentFormData() {
        const requests$ = this.requests$
        .pipe(
            rxFilter(requests => !isEmpty(requests)),
        );

        requests$.pipe(
            map(requests => requests[0]),
            rxFilter(request => !!request),
            takeUntil(this.unsubscribe),
        )
        .subscribe((request) => {
            this.identificationService.getCurrentFormCompanyData(request.kycID).then((formData) => {
                if (formData) {
                    this.form.patchValue(formData);
                    this.formPercent.refreshFormPercent();
                }
                this.formDataFilled$.next(true);
            });
        });
    }

    /**
     * Helper function to check if specific type of validation error is need to be shown.
     * @param {FormControl} control
     * @param {string[]} errors
     * @return {boolean}
     */
    showHelperText(control, errors) {
        const hasError = errors.filter(error => this.hasError([control], [error]));
        return this.form.get(control).invalid && !hasError.length;
    }

    /**
     * Loop through all the kyc(s) for the current kyc form. and send request to membernode to update 'General Information'.
     * @param {any} e
     * @return {void}
     */
    handleSubmit(e) {
        e.preventDefault();
        if (!this.form.valid) {
            formHelper.dirty(this.form);
            formHelper.scrollToFirstError(this.element.nativeElement);
            return;
        }

        this.requests$
        .pipe(take(1))
        .subscribe((requests) => {
            this
            .identificationService
            .sendRequestCompanyInformation(this.form, requests)
            .then(() => {
                this.submitEvent.emit({
                    completed: true,
                });
            })
            .catch(() => {
                this.newRequestService.errorPop();
            })
            ;
        });
    }

    /**
     * Used by the FormStep component to check if the current component's formGroup is valid
     * @return {boolean}
     */
    isStepValid() {
        return this.form.valid;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
