import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'app-ui-layouts-tabs',
    templateUrl: './tabs.component.html',
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
export class UiTabsComponent {

    showInfoPanes: boolean = true;

    constructor() {}

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

}