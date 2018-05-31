import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {MultilingualService} from '@setl/multilingual';

@Component({
    selector: 'app-ui-layouts-forms',
    templateUrl: './forms.component.html',
    styles: [`
        .padding {
            padding: 0 20px 20px;
        }
        .toggle-info-panes {
            display: block;
            padding-bottom: 10px;
            text-decoration: none;

            &:before, &:after { text-decoration: none; }
        }
        
        [enhancedForm] .control-label,
        [enhancedForm] app-ui-info-pane{
            margin-top : 200px;
        }`
    ]
})
export class UiFormsComponent {

    showInfoPanes: boolean = true;

    // mock data
    mockSelectItems: any[];

    // forms
    basicForm: FormGroup;
    longForm: FormGroup;
    dropdownForm: FormGroup;

    constructor(
        public _translate: MultilingualService,
    ) {
        this.initMocks();
        this.initForms();
    }

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

    // mock data
    private initMocks(): void {
        this.mockSelectItems = [{
            id: '0',
            text: 'Select Item 1'
        }, { 
            id: '1',
            text: 'Select Item 2'
        }, { 
            id: '2',
            text: 'Select Item 3'
        }];
    }


    // forms
    submitForm(): void {
        alert('Submit form function here');
    }

    private initForms(): void {
        this.basicForm = new FormGroup({
            input: new FormControl(''),
            inputRequired: new FormControl('', Validators.required),
            inputIcon: new FormControl(''),
            select: new FormControl(0)
        });
    
        this.longForm = new FormGroup({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            passwordConfirm: new FormControl('', Validators.required),
            input: new FormControl(''),
            inputRequired: new FormControl('', Validators.required),
            inputIcon: new FormControl(''),
            select: new FormControl(0)
        });

        this.dropdownForm = new FormGroup({
            basic: new FormControl(''),
            address: new FormControl('')
        });
    }

}