import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-nav-add',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiManageNavPopup implements OnInit {

    editing = true;
    navDate: string = moment().format('DD-MM-YY');
    navPubDate: string = moment().format('DD-MM-YY');

    // mock data
    mockStatusItems: any[];

    constructor() {
        this.initMockData();
    }

    ngOnInit() {}

    private initMockData(): void {
        this.mockStatusItems = [{
            id: 'technical',
            text: 'Technical'
        }, {
            id: 'estimated',
            text: 'Estimated'
        }, {
            id: 'validated',
            text: 'Validated'
        }]
    }

}