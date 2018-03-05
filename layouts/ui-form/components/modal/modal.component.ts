import {Component} from '@angular/core';

@Component({
    selector: 'app-ui-layouts-modal',
    templateUrl: './modal.component.html',
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
export class UiModalComponent {

    public showInfoPanes: boolean = true;
    public smallModal: boolean = false;
    public mediumModal: boolean = false;
    public largeModal: boolean = false;
    public mediumModalForm: boolean = false;
    public smallModalForm: boolean = false;

    constructor() {
    }

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

    showSmallModal(): void {
        this.smallModal = true;
    }

    showMediumModal(): void {
        this.mediumModal = true;
    }

    showLargeModal(): void {
        this.largeModal = true;
    }

    showSmallModalForm(): void {
        this.smallModalForm = true;
    }

    showMediumModalForm(): void {
        this.mediumModalForm = true;
    }

}
