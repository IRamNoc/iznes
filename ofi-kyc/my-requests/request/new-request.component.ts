import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
    templateUrl: './new-request.component.html'
})
export class NewKycRequestComponent implements OnInit {

    stepsConfig: any;
    forms: any = {};

    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.initForm();
        this.initFormSteps();
    }

    initForm() {
        let selectionForm = this.formBuilder.group({
            managementCompanies: [[], Validators.required]
        });

        this.forms.selection = selectionForm;
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
            }
        ];

    }


}