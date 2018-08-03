import {Component, Input, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormGroup, FormArray} from '@angular/forms';
import {get as getValue, filter, isEmpty, castArray} from 'lodash';
import {select} from '@angular-redux/store';
import {Subject} from 'rxjs';
import {filter as rxFilter, map, take, takeUntil} from 'rxjs/operators';

import {FormPercentDirective} from '@setl/utils/directives/form-percent/formpercent';
import {RequestsService} from '../../../requests.service';
import {IdentificationService} from '../identification.service';
import {DocumentsService} from '../documents.service';

import {NewRequestService, configDate} from '../../new-request.service';
import {countries} from "../../../requests.config";

@Component({
    selector: 'company-information',
    templateUrl: './company-information.component.html',
    styleUrls: ['./company-information.component.scss']
})
export class CompanyInformationComponent implements OnInit, OnDestroy {

    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form: FormGroup;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    countries = countries;
    companyActivitiesList;
    ownAccountInvestorList;
    investorOnBehalfList;
    geographicalOriginTypeList;
    financialAssetsInvestedList;
    geographicalAreaList;
    custodianHolderAccountList;
    configDate;

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
        private documentsService: DocumentsService
    ) {
    }

    ngOnInit() {
        this.companyActivitiesList = this.newRequestService.companyActivitiesList;
        this.ownAccountInvestorList = this.newRequestService.ownAccountInvestorList;
        this.investorOnBehalfList = this.newRequestService.investorOnBehalfList;
        this.geographicalOriginTypeList = this.newRequestService.geographicalOriginTypeList;
        this.financialAssetsInvestedList = this.newRequestService.financialAssetsInvestedList;
        this.geographicalAreaList = this.newRequestService.geographicalAreaList;
        this.custodianHolderAccountList = this.newRequestService.custodianHolderAccountList;

        this.initFormCheck();
        this.getCurrentFormData();

        this.configDate = configDate;
    }

    initFormCheck() {
        this.form.get('activities').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(data => {
                let activitiesValue = getValue(data, [0, 'id']);

                this.formCheckActivity(activitiesValue);
            })
        ;

        this.form.get('geographicalAreaOfActivity').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(data => {
                let activityGeographicalAreaValue = getValue(data, [0, 'id']);

                this.formCheckActivityGeographicalArea(activityGeographicalAreaValue);
            })
        ;

        this.form.get('activityRegulated').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(isActivityRegulatedValue => {
                this.formCheckActivityRegulated(isActivityRegulatedValue);
            })
        ;

        this.form.get('companyListed').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(isCompanyListedValue => {
                this.formCheckCompanyListed(isCompanyListedValue);
            })
        ;

        this.form.get('capitalNature.others').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(data => {
                this.formCheckNatureAndOrigin(data);
            })
        ;

        this.form.get('geographicalOrigin1').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(data => {
                let geographicalOriginTypeValue = getValue(data, [0, 'id']);

                this.formCheckGeographicalOrigin(geographicalOriginTypeValue);
            })
        ;
    }

    get beneficiaries() {
        return (this.form.get('beneficiaries') as FormArray).controls;
    }

    get geographicalOrigin() {
        return getValue(this.form.get('geographicalOrigin1').value, [0, 'id']);
    }

    formCheckActivity(value) {
        let form = this.form;
        let ownAccountControl = form.get('ownAccountinvestor');
        let investorOnBehalfControl = form.get('investorOnBehalfThirdParties');

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
        let natureAndOriginOfTheCapitalOthersControl = this.form.get('capitalNature.othersText');

        if (value) {
            natureAndOriginOfTheCapitalOthersControl.enable();
        } else {
            natureAndOriginOfTheCapitalOthersControl.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    formCheckGeographicalOrigin(value) {
        let geographicalOriginControl = this.form.get('geographicalOrigin2');

        if (!value) {
            geographicalOriginControl.disable();
        } else {
            geographicalOriginControl.enable();
        }

        this.formPercent.refreshFormPercent();
    }

    formCheckActivityGeographicalArea(value) {
        let activityGeographicalAreaTextControl = this.form.get('geographicalAreaOfActivitySpecification');

        if (value === 'oecd' || value === 'outsideOecd') {
            activityGeographicalAreaTextControl.enable();
        } else {
            activityGeographicalAreaTextControl.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    formCheckActivityRegulated(value) {
        let activityAuthorityControl = this.form.get('regulator');
        let activityApprovalNumberControl = this.form.get('approvalNumber');

        if (value) {
            activityAuthorityControl.enable();
            activityApprovalNumberControl.enable();
        } else {
            activityAuthorityControl.disable();
            activityApprovalNumberControl.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    formCheckCompanyListed(value) {
        let companyListingMarketsControl = this.form.get('listingMarkets');
        let bloombergCodesControl = this.form.get('bloombergCode');
        let listedShareISINControl = this.form.get('isinCode');

        if (value) {
            companyListingMarketsControl.enable();
            listedShareISINControl.enable();
            bloombergCodesControl.enable();
        } else {
            companyListingMarketsControl.disable();
            listedShareISINControl.disable();
            bloombergCodesControl.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }


    uploadFile($event, beneficiary) {
        let formControl = this.form.get(['beneficiaries', beneficiary, 'document']);

        this.requestsService.uploadFile($event).then((file: any) => {
            formControl.get('hash').patchValue(file.fileHash);
            formControl.get('name').patchValue(file.fileTitle);
            formControl.get('kycDocumentID').patchValue('');
        });
    }

    addBeneficiary() {
        let control = this.form.get('beneficiaries') as FormArray;
        control.push(this.newRequestService.createBeneficiary());

        this.formPercent.refreshFormPercent();
    }

    removeBeneficiary(i) {
        let control = this.form.get('beneficiaries') as FormArray;
        control.removeAt(i);

        this.formPercent.refreshFormPercent();
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }

    getCurrentFormData() {
        this.requests$
            .pipe(
                rxFilter(requests => !isEmpty(requests)),
                map(requests => castArray(requests[0])),
                takeUntil(this.unsubscribe)
            )
            .subscribe(requests => {
                requests.forEach(request => {
                    this.identificationService.getCurrentFormCompanyData(request.kycID).then(formData => {
                        if (formData) {
                            this.form.patchValue(formData);
                            this.formPercent.refreshFormPercent();
                        }
                    });
                    this.identificationService.getCurrentFormCompanyBeneficiariesData(request.kycID).then(formData => {
                        if(!isEmpty(formData)){
                            let beneficiaries = (this.form.get('beneficiaries') as FormArray).controls;
                            beneficiaries.splice(0);

                            let promises = formData.map((controlValue) => {
                                let control = this.newRequestService.createBeneficiary();
                                return this.documentsService.getDocument(controlValue.documentID).then(document => {
                                    controlValue.document = {
                                        name : document.name,
                                        hash : document.hash,
                                        kycDocumentID : document.kycDocumentID
                                    };
                                    control.patchValue(controlValue);
                                    beneficiaries.push(control);
                                });
                            });

                            Promise.all(promises).then(() => {
                                this.formPercent.refreshFormPercent();
                            });
                        }
                    })
                });
            })
        ;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}