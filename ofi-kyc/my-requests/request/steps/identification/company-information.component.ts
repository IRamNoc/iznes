import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { get as getValue, set as setValue, filter, isEmpty, castArray } from 'lodash';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { filter as rxFilter, map, take, takeUntil } from 'rxjs/operators';

import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { IdentificationService, buildBeneficiaryObject } from '../identification.service';
import { DocumentsService } from '../documents.service';

import { NewRequestService } from '../../new-request.service';
import { countries } from '../../../requests.config';

@Component({
    selector: 'company-information',
    templateUrl: './company-information.component.html',
    styleUrls: ['./company-information.component.scss'],
})
export class CompanyInformationComponent implements OnInit, OnDestroy {

    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form: FormGroup;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

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
    ) {
    }

    ngOnInit() {
        this.regulatoryStatusList = this.newRequestService.regulatoryStatusList;
        this.regulatoryStatusInsurerTypeList = this.newRequestService.regulatoryStatusInsurerTypeList;
        this.sectorActivityList = this.newRequestService.sectorActivityList;
        this.companyActivitiesList = this.newRequestService.companyActivitiesList;
        this.ownAccountInvestorList = this.newRequestService.ownAccountInvestorList;
        this.investorOnBehalfList = this.newRequestService.investorOnBehalfList;
        this.geographicalOriginTypeList = this.newRequestService.geographicalOriginTypeList;
        this.financialAssetsInvestedList = this.newRequestService.financialAssetsInvestedList;
        this.geographicalAreaList = this.newRequestService.geographicalAreaList;
        this.custodianHolderAccountList = this.newRequestService.custodianHolderAccountList;
        this.listingMarketsList = this.newRequestService.listingMarketsList;

        this.initFormCheck();
        this.getCurrentFormData();
    }

    initFormCheck() {

        this.form.get('sectorActivity').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
            const sectorActivityValue = getValue(data, [0, 'id']);

            this.formCheckSectorActivity(sectorActivityValue);
        })
        ;

        this.form.get('activities').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
            const activitiesValue = getValue(data, [0, 'id']);

            this.formCheckActivity(activitiesValue);
        })
        ;

        this.form.get('geographicalAreaOfActivity').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
            const activityGeographicalAreaValue = getValue(data, [0, 'id']);

            this.formCheckActivityGeographicalArea(activityGeographicalAreaValue);
        })
        ;

        this.form.get('activityRegulated').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((isActivityRegulatedValue) => {
            this.formCheckActivityRegulated(isActivityRegulatedValue);
        })
        ;

        this.form.get('companyListed').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((isCompanyListedValue) => {
            this.formCheckCompanyListed(isCompanyListedValue);
        })
        ;

        this.form.get('capitalNature.others').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
            this.formCheckNatureAndOrigin(data);
        })
        ;

        this.form.get('geographicalOrigin1').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
            const geographicalOriginTypeValue = getValue(data, [0, 'id']);

            this.formCheckGeographicalOrigin(geographicalOriginTypeValue);
        })
        ;

        this.form.get('regulatoryStatus').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
            const regulatoryStatusValue = getValue(data, [0, 'id']);

            this.formCheckRegulatoryStatus(regulatoryStatusValue);
        })
        ;
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

    addBeneficiary() {
        const control = this.form.get('beneficiaries') as FormArray;
        control.push(this.newRequestService.createBeneficiary());

        this.formPercent.refreshFormPercent();
    }

    removeBeneficiary(i) {
        const control = this.form.get('beneficiaries') as FormArray;

        if (control.at(i).value.companyBeneficiariesID !== '') {
            this.identificationService.deleteBeneficiary(
                control.at(i).value.kycID,
                control.at(i).value.companyBeneficiariesID,
            );
        }

        control.removeAt(i);

        this.formPercent.refreshFormPercent();
    }

    isDisabled(path) {
        const control = this.form.get(path);

        return control.disabled;
    }

    getCurrentFormData() {
        this.requests$
        .pipe(
            rxFilter(requests => !isEmpty(requests)),
            map(requests => castArray(requests[0])),
            takeUntil(this.unsubscribe),
        )
        .subscribe((requests) => {
            requests.forEach((request) => {
                this.identificationService.getCurrentFormCompanyData(request.kycID).then((formData) => {
                    if (formData) {
                        this.form.patchValue(formData);
                        this.formPercent.refreshFormPercent();
                    }
                });
                this.identificationService.getCurrentFormCompanyBeneficiariesData(request.kycID).then((formData) => {
                    if (!isEmpty(formData)) {
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
                                        setValue(controlValue, ['naturalPerson', 'document'], {
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
                            this.formPercent.refreshFormPercent();
                        });
                    }
                });
            });
        })
        ;
    }

    handleReady() {
        this.formPercent.refreshFormPercent();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
