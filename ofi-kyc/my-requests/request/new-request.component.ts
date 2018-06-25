import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import {NewRequestService} from './new-request.service';

@Component({
    templateUrl: './new-request.component.html'
})
export class NewKycRequestComponent implements OnInit {

    stepsConfig: any;
    forms: any = {};

    constructor(
        private formBuilder: FormBuilder,
        private newRequestService : NewRequestService
    ) {
    }

    ngOnInit() {
        this.initForm();
        this.initFormSteps();
    }

    initForm() {
        this.forms = this.newRequestService.createRequestForm();
    }

    initFormSteps() {
        this.stepsConfig = [
            {
                title: 'Selection',
                form: this.forms.selection,
                id: 'step-selection'
            },
            {
                title: 'Introduction'
            },
            {
                title : 'Identification',
                id : 'step-identification',
                form : this.forms.get('identification'),
                startHere : true
            }
        ];

    }


}