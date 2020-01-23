import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {MultilingualService} from '@setl/multilingual';

@Component({
    selector: 'app-ui-layouts-dropdowns',
    templateUrl: './dropdowns.component.html',
    styles: [`
        .padding {
            padding: 0 20px 20px;
        }
        .toggle-info-panes {
            display: block;
            padding-bottom: 10px;
            text-decoration: none;

            &:before, &:after { text-decoration: none; }
        }`
    ]
})
export class UiDropdownsComponent {

    showInfoPanes: boolean = true;

    // mock data
    mockSelectItems: any[];

    // forms
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
    private initForms(): void {
        this.dropdownForm = new FormGroup({
            basic: new FormControl(''),
            address: new FormControl('')
        });
    }

}