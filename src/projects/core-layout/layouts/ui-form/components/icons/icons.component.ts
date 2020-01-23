import {Component} from '@angular/core';

@Component({
    selector: 'app-ui-layouts-icons',
    templateUrl: './icons.component.html',
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
export class UiIconsComponent {

    public showInfoPanes: boolean = true;
    public smallIcons: boolean = false;
    public mediumIcons: boolean = false;
    public largeIcons: boolean = false;
    public mediumIconsForm: boolean = false;
    public smallIconsForm: boolean = false;

    constructor() {
    }

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

    showSmallIcons(): void {
        this.smallIcons = true;
    }

    showMediumIcons(): void {
        this.mediumIcons = true;
    }

    showLargeIcons(): void {
        this.largeIcons = true;
    }

    showSmallIconsForm(): void {
        this.smallIconsForm = true;
    }

    showMediumIconsForm(): void {
        this.mediumIconsForm = true;
    }

}
