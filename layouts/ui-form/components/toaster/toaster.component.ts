import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {ToasterService} from 'angular2-toaster';

@Component({
    selector: 'app-ui-layouts-toaster',
    templateUrl: './toaster.component.html',
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
export class UiToasterComponent {

    showInfoPanes: boolean = true;

    constructor(private toaster: ToasterService) {}

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

    // toaster
    showSuccessToaster(): void {
        this.toaster.pop('success', 'This is a success toaster!');
    }

    showWarningToaster(): void {
        this.toaster.pop('warning', 'This is a warning toaster!');
    }

    showErrorToaster(): void {
        this.toaster.pop('error', 'This is a error toaster!');
    }

}