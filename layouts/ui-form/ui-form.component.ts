import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'app-blank',
    templateUrl: './ui-form.component.html',
    styleUrls: ['./ui-form.component.scss'],
})
export class UiFormComponent implements OnInit {

    showInfoPanes: boolean = true;

    // mock data
    mockSelectItems: any[];
    mockDataGridItems: any[];

    // forms
    basicForm: FormGroup;
    longForm: FormGroup;
    dropdownForm: FormGroup;

    constructor() {
        this.initMocks();
        this.initForms();
    }

    ngOnInit() { }

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

    scrollTo(event: Event, id: string): void {
        event.preventDefault();

        document.getElementById(id).scrollIntoView();
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

        this.mockDataGridItems = [{
            value1: 'Row 1 - Value 1',
            value2: 'Row 1 - Value 2'
        }, {
            value1: 'Row 2 - Value 1',
            value2: 'Row 2 - Value 2'
        }, {
            value1: 'Row 3 - Value 1',
            value2: 'Row 3 - Value 2'
        }, {
            value1: 'Row 4 - Value 1',
            value2: 'Row 4 - Value 2'
        }, {
            value1: 'Row 5 - Value 1',
            value2: 'Row 5 - Value 2'
        }, {
            value1: 'Row 6 - Value 1',
            value2: 'Row 6 - Value 2'
        }, {
            value1: 'Row 7 - Value 1',
            value2: 'Row 7 - Value 2'
        }, {
            value1: 'Row 8 - Value 1',
            value2: 'Row 8 - Value 2'
        }, {
            value1: 'Row 9 - Value 1',
            value2: 'Row 9 - Value 2'
        }, {
            value1: 'Row 10 - Value 1',
            value2: 'Row 10 - Value 2'
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


    // datagrid
    dataGridEdit(): void {
        console.log('Edit data grid item function here');
    }
    
    dataGridEDelete(): void {
        console.log('Delete data grid item function here');        
    }
}
