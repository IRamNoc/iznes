import {Component} from '@angular/core';

@Component({
    selector: 'app-ui-layouts-form-persist',
    templateUrl: './form-persist.component.html',
    styles: [`
        .padding {
            padding: 0 20px 20px;
        }

        .toggle-info-panes {
            display: block;
            padding-bottom: 10px;
            text-decoration: none;

        &
        :before,

        &
        :after {
            text-decoration: none;
        }

        }`
    ]
})
export class UiFormPersistComponent {

    public showInfoPanes: boolean = true;

    constructor() {
    }

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }
}
