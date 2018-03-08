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

    // mock data
    mockDataGridItems: any[];

    constructor() {
        this.initMocks();
    }

    // mock data
    private initMocks(): void {
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

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }
}
