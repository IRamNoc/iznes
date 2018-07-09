import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {get as getValue} from 'lodash';
import {NewRequestService} from './new-request.service';

@Component({
    templateUrl: './new-request.component.html'
})
export class NewKycRequestComponent implements OnInit {

    stepsConfig: any;
    forms: any = {};

    constructor(
        private formBuilder: FormBuilder,
        private route : ActivatedRoute,
        private newRequestService : NewRequestService
    ) {
    }

    get isListedCompany(){
        let legalStatus = getValue(this.forms.get('identification.generalInformation.legalStatus').value, [0, 'id']);
        return legalStatus === 'listedCompany';
    }

    ngOnInit() {
        this.initForm();
        this.getParams();
    }

    getParams(){
        this.route.queryParamMap.subscribe(params => {
            this.initFormSteps(params.get('step'));
        });
    }

    initForm() {
        this.forms = this.newRequestService.createRequestForm();
    }

    initFormSteps(completedStep) {
        this.stepsConfig = [
            {
                title: 'Selection',
                form: this.forms.get('selection'),
                id: 'step-selection'
            },
            {
                title: 'Introduction'
            },
            {
                title : 'Identification',
                id : 'step-identification',
                form : this.forms.get('identification')
            },
            {
                title : 'Risk profile',
                id : 'step-risk-profile',
                form : this.forms.get('riskProfile'),
                startHere : completedStep === 'identification'
            },
            {
                title: 'Documents',
                id : 'step-documents',
                form : this.forms.get('documents'),
                startHere : completedStep === 'riskProfile'
            },
            {
                title: 'Validation',
                id : 'step-validation',
                form : this.forms.get('validation'),
                startHere : completedStep === 'documents'
            }
        ];
    }

}