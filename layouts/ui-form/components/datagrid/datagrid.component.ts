import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {LogService} from '@setl/utils';

@Component({
    selector: 'app-ui-layouts-datagrid',
    templateUrl: './datagrid.component.html',
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
export class UiDataGridComponent {

    showInfoPanes: boolean = true;

    // mock data
    mockDataGridItems: any[];

    constructor(private logService: LogService) {
        this.initMocks();
    }

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
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

    // datagrid-expand
    dataGridEdit(): void {
        this.logService.log('Edit data grid item function here');
    }

    dataGridDelete(): void {
        this.logService.log('Delete data grid item function here');
    }

}
