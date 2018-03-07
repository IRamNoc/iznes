import {Component} from '@angular/core';

@Component({
    selector: 'app-ui-layouts-button',
    templateUrl: './button.component.html',
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
export class UiButtonComponent {

    public showInfoPanes: boolean = true;
    public smallButton: boolean = false;
    public mediumButton: boolean = false;
    public largeButton: boolean = false;
    public mediumButtonForm: boolean = false;
    public smallButtonForm: boolean = false;

    constructor() {
    }

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

    showSmallButton(): void {
        this.smallButton = true;
    }

    showMediumButton(): void {
        this.mediumButton = true;
    }

    showLargeButton(): void {
        this.largeButton = true;
    }

    showSmallButtonForm(): void {
        this.smallButtonForm = true;
    }

    showMediumButtonForm(): void {
        this.mediumButtonForm = true;
    }

}
