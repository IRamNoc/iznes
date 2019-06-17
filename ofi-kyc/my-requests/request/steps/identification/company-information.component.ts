import { Component, Input, Output, OnInit, OnDestroy, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { get as getValue, set as setValue, filter, isEmpty, castArray, find } from 'lodash';
import { select, NgRedux } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { filter as rxFilter, map, take, takeUntil } from 'rxjs/operators';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { IdentificationService, buildBeneficiaryObject } from '../identification.service';
import { DocumentsService } from '../documents.service';
import { NewRequestService } from '../../new-request.service';
import { BeneficiaryService } from './beneficiary.service';
import { countries } from '../../../requests.config';
import { setMyKycStakeholderRelations } from '@ofi/ofi-main/ofi-store/ofi-kyc/kyc-request';
import { MultilingualService } from '@setl/multilingual';
import { formHelper } from '@setl/utils/helper';
import { PersistRequestService } from '@setl/core-req-services';
import { PersistService } from '@setl/core-persist';
import { setMyKycRequestedPersist } from '@ofi/ofi-main/ofi-store/ofi-kyc';

@Component({
    selector: 'company-information',
    templateUrl: './company-information.component.html',
    styleUrls: ['./company-information.component.scss'],
})
export class CompanyInformationComponent implements OnInit, OnDestroy {
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form: FormGroup;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'formPersist']) persistedForms$;
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    countries = countries;
    regulatorSupervisoryAuthoritiesList;
    regulatoryStatusList;
    regulatoryStatusInsurerTypeList;
    sectorActivityList;
    otherSectorActivityList;
    cachedOtherSectorActivityList;
    companyActivitiesList;
    investorOnBehalfList;
    geographicalOriginTypeList;
    financialAssetsInvestedList;
    geographicalAreaList;
    custodianHolderAccountList;
    listingMarketsList;
    multilateralTradingFacilitiesList;
    otherListingMarketError = false;
    otherMultilateralTradingFacilitiesError = false;

    registeredCompanyName: string = '';

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
        private documentsService: DocumentsService,
        private beneficiaryService: BeneficiaryService,
        private ngRedux: NgRedux<any>,
        public translate: MultilingualService,
        private element: ElementRef,
        private persistRequestService: PersistRequestService,
        private persistService: PersistService,
    ) {
    }

    ngOnInit() {
        this.initFormCheck();
        this.getCurrentFormData();

        this.persistedForms$
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((forms) => {
            if (forms.identification) {
                this.formPercent.refreshFormPercent();
            }
        })
        ;
        this.initLists();

        this.requestLanguageObj
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(() => this.initLists());
    }

    initFormCheck() {
        this.form.get('sectorActivity').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                const sectorActivityValue = getValue(data, [0, 'id']);

                // Enable sectorActivityTextControl if sectorActivityValue is 'other', else disable
                this.formCheckSectorActivity(sectorActivityValue);

                if (sectorActivityValue) {
                    // Remove sectorActivityValue from the otherSectorActivityList
                    this.formFilterOtherSectorActivity(sectorActivityValue);
                }
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

        this.form.get('capitalNature.others').valueChanges
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
    }

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
    }

    get beneficiaries() {
        return (this.form.get('beneficiaries') as FormArray).controls;
    }

    get geographicalOrigin() {
        return getValue(this.form.get('geographicalOrigin1').value, [0, 'id']);
    }

    formCheckSectorActivity(value) {
        const control = this.form.get('sectorActivityText');

        if (value === 'Other') {
            control.enable();
        } else {
            control.disable();
        }

        this.formPercent.refreshFormPercent();
    }

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

    formCheckNatureAndOrigin(value) {
        const control = this.form.get('capitalNature.othersText');

        if (value) {
            control.enable();
        } else {
            control.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    formCheckGeographicalOrigin(value) {
        const control = this.form.get('geographicalOrigin2');

        if (!value) {
            control.disable();
        } else {
            control.enable();
        }

        this.formPercent.refreshFormPercent();
    }

    formCheckActivityGeographicalArea(value) {
        const activityGeographicalAreaTextControl = this.form.get('geographicalAreaOfActivitySpecification');

        if (value === 'oecd' || value === 'outsideOecd') {
            activityGeographicalAreaTextControl.enable();
        } else {
            activityGeographicalAreaTextControl.disable();
        }

        this.formPercent.refreshFormPercent();
    }

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

    formCheckCompanyListed(value) {
        const listingMarketsControl = this.form.get('listingMarkets');
        const multilateralTradingFacilitiesControl = this.form.get('multilateralTradingFacilities');
        const otherMultilateralTradingFacilitiesControl = this.form.get('multilateralTradingFacilities');
        const bloombergCodesControl = this.form.get('bloombergCode');
        const listedShareISINControl = this.form.get('isinCode');
        const floatableSharesControl = this.form.get('floatableShares');
        const balanceSheetTotalControl = this.form.get('balanceSheetTotal');
        const netRevenuesNetIncomeControl = this.form.get('netRevenuesNetIncome');
        const shareholderEquityControl = this.form.get('shareholderEquity');

        if (value) {
            listingMarketsControl.enable();
            multilateralTradingFacilitiesControl.enable();
            otherMultilateralTradingFacilitiesControl.enable();
            listedShareISINControl.enable();
            bloombergCodesControl.enable();
            floatableSharesControl.enable();

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

    formCheckListingMarkets(selectedMarkets: any) {
        const control = this.form.get('otherListingMarkets');

        let otherSelected = false;

        if (Array.isArray(selectedMarkets)) {
            otherSelected = selectedMarkets.find((market) => {
                return market.id === 'other';
            });
        }

        if (otherSelected) {
            control.enable();
        } else {
            control.disable();
        }

        this.formPercent.refreshFormPercent();
    }

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

    formCheckMultilateralTradingFacilities(selectedFacilities: any) {
        const control = this.form.get('otherMultilateralTradingFacilities');

        let otherSelected = false;

        if (Array.isArray(selectedFacilities)) {
            otherSelected = selectedFacilities.find((market) => {
                return market.id === 'other';
            });
        }

        if (otherSelected) {
            control.enable();
        } else {
            control.disable();
        }

        this.formPercent.refreshFormPercent();
    }

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

    formCheckRegulator(selectedRegulators: any) {
        const control = this.form.get('otherRegulator');

        let otherSelected = false;

        if (Array.isArray(selectedRegulators)) {
            otherSelected = selectedRegulators.find((regulator) => {
                return regulator.id === 'other';
            });
        }

        if (otherSelected) {
            control.enable();
        } else {
            control.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    isDisabled(path) {
        const control = this.form.get(path);

        return control.disabled;
    }

    getCurrentFormData() {
        const requests$ = this.requests$
        .pipe(
            rxFilter(requests => !isEmpty(requests)),
        );

        requests$.pipe(
            takeUntil(this.unsubscribe),
        ).subscribe((requests) => {
            const promises = [];
            const stakeholdersRelationTable = [];

            requests.forEach((request, index) => {

                const promise = this.identificationService.getCurrentFormCompanyBeneficiariesData(request.kycID).then((formData) => {
                    if (!isEmpty(formData)) {
                        const relation = {
                            kycID: request.kycID,
                            stakeholderIDs: formData.map(stakeholder => stakeholder.companyBeneficiariesID),
                        };

                        stakeholdersRelationTable.push(relation);

                        if (index === 0) {
                            const beneficiaries: FormArray = this.form.get('beneficiaries') as FormArray;

                            while (beneficiaries.length) {
                                beneficiaries.removeAt(0);
                            }

                            const promises = formData.map((controlValue) => {
                                const control = this.newRequestService.createBeneficiary();
                                const documentID = controlValue.documentID;

                                controlValue = buildBeneficiaryObject(controlValue);

                                if (documentID) {
                                    return this.documentsService.getDocument(documentID).then((document) => {
                                        if (document) {
                                            setValue(controlValue, ['common', 'document'], {
                                                name: document.name,
                                                hash: document.hash,
                                                kycDocumentID: document.kycDocumentID,
                                            });
                                        }
                                        control.patchValue(controlValue);
                                        beneficiaries.push(control);
                                    });
                                }

                                control.patchValue(controlValue);
                                beneficiaries.push(control);
                            });

                            Promise.all(promises).then(() => {
                                this.beneficiaryService.fillInStakeholderSelects(this.form.get('beneficiaries'));
                                this.beneficiaryService.updateStakeholdersValidity(this.form.get('beneficiaries') as FormArray);
                                this.formPercent.refreshFormPercent();
                            });
                        }
                    }
                });

                promises.push(promise);
            });

            Promise.all(promises).then(() => {
                this.ngRedux.dispatch(setMyKycStakeholderRelations(stakeholdersRelationTable));
            });
        });

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
            });
        });

        requests$.pipe(
            map(requests => requests[0]),
            rxFilter(request => !!request),
            takeUntil(this.unsubscribe),
        )
            .subscribe((request) => {
                this.identificationService.getCurrentFormGeneralData(request.kycID).then((formData) => {
                    if (formData) {
                        this.registeredCompanyName = formData.registeredCompanyName;
                    }
                });
            });
    }

    refresh() {
        this.formPercent.refreshFormPercent();
    }

    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/identification/companyinformation',
            this.form,
            this.newRequestService.context,
            {
                reset : false,
                returnPromise: true,
            },
        ).then(() => {
            this.ngRedux.dispatch(setMyKycRequestedPersist('identification/companyinformation'));
        });
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/identification/companyinformation',
            this.newRequestService.createIdentificationFormGroup(),
            this.newRequestService.context,
        );
    }

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
            .sendRequestGeneralInformation(this.form, requests)
            .then(() => {
                this.submitEvent.emit({
                    completed: true,
                });
                this.clearPersistForm();
            })
            .catch(() => {
                this.newRequestService.errorPop();
            })
            ;
        });
    }

    isStepValid() {
        return this.form.valid;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
