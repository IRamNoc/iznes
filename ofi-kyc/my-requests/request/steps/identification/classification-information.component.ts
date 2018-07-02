import {Component, Input, OnInit} from '@angular/core';
import {get as getValue} from 'lodash';

import {NewRequestService} from '../../new-request.service';
import {countries} from "../../../requests.config";


@Component({
    selector : 'classification-information',
    templateUrl : './classification-information.component.html'
})
export class ClassificationInformationComponent implements OnInit{
    @Input() form;
    @Input() investorType;

    open: boolean = false;
    countries = countries;
    financialInstrumentsList;
    geographicalAreaList;
    natureOfTransactionsList;
    volumeOfTransactionsList;

    constructor(
        private newRequestService : NewRequestService
    ){}

    ngOnChanges(changes){
        let investorType = changes.investorType.currentValue;

        if(investorType !== changes.investorType.previousValue){
            let changeProfessionalStatus = this.form.get('pro.changeProfessionalStatus').value;

            if(!changeProfessionalStatus){
                this.toggleForm(investorType);
            }
        }
    }

    get isPro(){
        return this.investorType === 'proByNature' || this.investorType === 'proBySize';
    }

    ngOnInit(){
        this.financialInstrumentsList = this.newRequestService.financialInstrumentsList;
        this.geographicalAreaList = this.newRequestService.geographicalAreaList;
        this.natureOfTransactionsList = this.newRequestService.natureOfTransactionsList;
        this.volumeOfTransactionsList = this.newRequestService.volumeOfTransactionsList;

        this.initCheckForm();
    }

    toggleForm(investorType){
        if(investorType === 'nonPro'){
            this.form.get('pro').disable();
            this.form.get('nonPro').enable();
            this.form.get('nonPro.activitiesBenefitFromExperienceSpecification').disable();
            this.form.get('nonPro.financialInstrumentsSpecification').disable();
        } else{
            this.form.get('pro').enable();
            this.form.get('nonPro').disable();
        }
    }

    initCheckForm(){
        this.form.get('nonPro.financialInstruments').valueChanges.subscribe(data => {
            let financialInstrumentsValue = getValue(data, [0, 'id']);

            this.formCheckFinancialInstruments(financialInstrumentsValue);
        });
        this.form.get('nonPro.activitiesBenefitFromExperience').valueChanges.subscribe(experienceFinancialFieldValue => {
            this.formCheckExperienceFinancialField(experienceFinancialFieldValue);
        });

        this.form.get('pro.changeProfessionalStatus').valueChanges.subscribe(changeProfessionalStatus => {
            this.formCheckProToNonProChoice(changeProfessionalStatus);
        });
    }

    formCheckProToNonProChoice(value){
        let nonProGroup = this.form.get('nonPro');

        if(value){
            nonProGroup.enable();
        } else{
            nonProGroup.disable();
        }
    }

    formCheckExperienceFinancialField(value){
        let experienceFinancialFieldTextControl = this.form.get('nonPro.activitiesBenefitFromExperienceSpecification');

        if(value){
            experienceFinancialFieldTextControl.enable();
        } else{
            experienceFinancialFieldTextControl.disable();
        }
    }

    formCheckFinancialInstruments(value){
        let financialInstrumentsTextControl = this.form.get('nonPro.financialInstrumentsSpecification');

        if(value === 'other'){
            financialInstrumentsTextControl.enable();
        } else{
            financialInstrumentsTextControl.disable();
        }
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }

    hasError(control, error = []){
        return this.newRequestService.hasError(this.form, control, error);
    }
}