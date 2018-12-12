import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { get as getValue, set as setValue, filter, isEmpty, castArray, find } from 'lodash';
import { select, NgRedux } from '@angular-redux/store';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { filter as rxFilter, map, take, takeUntil } from 'rxjs/operators';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { IdentificationService, buildBeneficiaryObject } from '../identification.service';
import { DocumentsService } from '../documents.service';
import { NewRequestService } from '../../new-request.service';
import { BeneficiaryService } from './beneficiary.service';
import { countries } from '../../../requests.config';
import { setMyKycStakeholderRelations } from '@ofi/ofi-main/ofi-store/ofi-kyc/kyc-request';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'company-information',
    templateUrl: './company-information.component.html',
    styleUrls: ['./company-information.component.scss'],
})
export class CompanyInformationComponent implements OnInit, OnDestroy {
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form: FormGroup;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'formPersist']) persistedForms$;
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    countries = countries;
    regulatoryStatusList;
    regulatoryStatusInsurerTypeList;
    sectorActivityList;
    companyActivitiesList;
    ownAccountInvestorList;
    investorOnBehalfList;
    geographicalOriginTypeList;
    financialAssetsInvestedList;
    geographicalAreaList;
    custodianHolderAccountList;
    listingMarketsList;

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
        private documentsService: DocumentsService,
        private beneficiaryService: BeneficiaryService,
        private ngRedux: NgRedux<any>,
        public translate: MultilingualService,
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

            this.formCheckSectorActivity(sectorActivityValue);
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

        this.form.get('capitalNature.others').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
            this.formCheckNatureAndOrigin(data);
        });

        this.form.get('geographicalOrigin1').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
            const control = this.form.get('geographicalOrigin2');

            if(!control) return;

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
    }

    initLists() {
        this.regulatoryStatusInsurerTypeList = this.translate.translate(
            this.newRequestService.regulatoryStatusInsurerTypeList);
        this.regulatoryStatusList = this.translate.translate(this.newRequestService.regulatoryStatusList);
        this.sectorActivityList = this.translate.translate(this.newRequestService.sectorActivityList);
        this.companyActivitiesList = this.translate.translate(this.newRequestService.companyActivitiesList);
        this.ownAccountInvestorList = this.translate.translate(this.newRequestService.ownAccountInvestorList);
        this.investorOnBehalfList = this.translate.translate(this.newRequestService.investorOnBehalfList);
        this.geographicalOriginTypeList = this.translate.translate(this.newRequestService.geographicalOriginTypeList);
        this.financialAssetsInvestedList = this.translate.translate(this.newRequestService.financialAssetsInvestedList);
        this.geographicalAreaList = this.translate.translate(this.newRequestService.geographicalAreaList);
        this.custodianHolderAccountList = this.translate.translate(this.newRequestService.custodianHolderAccountList);
        this.listingMarketsList = this.translate.translate(this.newRequestService.listingMarketsList);
    }

    get beneficiaries() {
        return (this.form.get('beneficiaries') as FormArray).controls;
    }

    get geographicalOrigin() {
        return getValue(this.form.get('geographicalOrigin1').value, [0, 'id']);
    }

    formCheckSectorActivity(value) {
        const form = this.form;
        const sectorActivityTextControl = form.get('sectorActivityText');

        if (value === 'other') {
            sectorActivityTextControl.enable();
        } else {
            sectorActivityTextControl.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    formCheckActivity(value) {
        const form = this.form;
        const ownAccountControl = form.get('ownAccountinvestor');
        const investorOnBehalfControl = form.get('investorOnBehalfThirdParties');

        ownAccountControl.disable();
        investorOnBehalfControl.disable();

        switch (value) {
            case 'ownAccount':
                ownAccountControl.enable();
                break;
            case 'onBehalfOfThirdParties':
                investorOnBehalfControl.enable();
                break;
        }

        this.formPercent.refreshFormPercent();
    }

    formCheckNatureAndOrigin(value) {
        const natureAndOriginOfTheCapitalOthersControl = this.form.get('capitalNature.othersText');

        if (value) {
            natureAndOriginOfTheCapitalOthersControl.enable();
        } else {
            natureAndOriginOfTheCapitalOthersControl.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    formCheckGeographicalOrigin(value) {
        const geographicalOriginControl = this.form.get('geographicalOrigin2');

        if (!value) {
            geographicalOriginControl.disable();
        } else {
            geographicalOriginControl.enable();
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
        const companyListingMarketsControl = this.form.get('listingMarkets');
        const bloombergCodesControl = this.form.get('bloombergCode');
        const listedShareISINControl = this.form.get('isinCode');
        const floatableSharesControl = this.form.get('floatableShares');

        if (value) {
            companyListingMarketsControl.enable();
            listedShareISINControl.enable();
            bloombergCodesControl.enable();
            floatableSharesControl.enable();
        } else {
            companyListingMarketsControl.disable();
            listedShareISINControl.disable();
            bloombergCodesControl.disable();
            floatableSharesControl.disable();
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
            ;
        });
    }

    refresh() {
        this.formPercent.refreshFormPercent();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
