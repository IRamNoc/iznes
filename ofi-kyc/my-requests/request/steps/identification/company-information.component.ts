import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormArray} from '@angular/forms';
import {get as getValue, filter} from 'lodash';

import {NewRequestService, configDate} from '../../new-request.service';
import {countries} from "../../../requests.config";

@Component({
    selector: 'company-information',
    templateUrl: './company-information.component.html',
    styleUrls : ['./company-information.component.scss']
})
export class CompanyInformationComponent implements OnInit {
    @Input() form: FormGroup;

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
        private newRequestService: NewRequestService
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

        this.configDate = configDate;
    }

    initFormCheck() {
        this.form.get('activities').valueChanges.subscribe(data => {
            let activitiesValue = getValue(data, [0, 'id']);

            this.formCheckActivity(activitiesValue);
        });

        this.form.get('geographicalAreaOfActivity').valueChanges.subscribe(data => {
            let activityGeographicalAreaValue = getValue(data, [0, 'id']);

            this.formCheckActivityGeographicalArea(activityGeographicalAreaValue);
        });

        this.form.get('activityRegulated').valueChanges.subscribe(isActivityRegulatedValue => {
            this.formCheckActivityRegulated(isActivityRegulatedValue);
        });

        this.form.get('companyListed').valueChanges.subscribe(isCompanyListedValue => {
            this.formCheckCompanyListed(isCompanyListedValue);
        });

        this.form.get('capitalNature.others').valueChanges.subscribe(data => {
            this.formCheckNatureAndOrigin(data);
        });

        this.form.get('geographicalOrigin1').valueChanges.subscribe(data => {
            let geographicalOriginTypeValue = getValue(data, [0, 'id']);

            this.formCheckGeographicalOrigin(geographicalOriginTypeValue);
        });
    }

    get beneficiaries() {
        return (this.form.get('beneficiaries') as FormArray).controls;
    }

    get geographicalOrigin(){
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
    }

    formCheckNatureAndOrigin(value){
        let natureAndOriginOfTheCapitalOthersControl = this.form.get('capitalNature.othersText');

        if(value){
            natureAndOriginOfTheCapitalOthersControl.enable();
        } else{
            natureAndOriginOfTheCapitalOthersControl.disable();
        }
    }

    formCheckGeographicalOrigin(value){
        let geographicalOriginControl = this.form.get('geographicalOrigin2');

        if(!value){
            geographicalOriginControl.disable();
        } else{
            geographicalOriginControl.enable();
        }
    }

    formCheckActivityGeographicalArea(value) {
        let activityGeographicalAreaTextControl = this.form.get('geographicalAreaOfActivitySpecification');

        if (value === 'oecd' || value === 'outsideOecd') {
            activityGeographicalAreaTextControl.enable();
        } else {
            activityGeographicalAreaTextControl.disable();
        }
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
    }

    hasError(control, error = []){
        return this.newRequestService.hasError(this.form, control, error);
    }


    uploadFile(event, beneficiary) {
        let formControl = this.form.get(['beneficiaries', beneficiary, 'document']);

        // @todo Change the random hash when file drop implemented
        formControl.patchValue('13514e618f32132b030c3103b3030a302');

        this.newRequestService.uploadFile(event);
    }

    addBeneficiary() {
        let control = this.form.get('beneficiaries') as FormArray;
        control.push(this.newRequestService.createBeneficiary());
    }
    removeBeneficiary(i){
        let control = this.form.get('beneficiaries') as FormArray;
        control.removeAt(i);
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }
}