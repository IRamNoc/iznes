import {Component, OnInit, Input} from '@angular/core';
import * as moment from 'moment';

import * as model from '../OfiManageNav';

@Component({
    selector: 'app-nav-add',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiManageNavPopup implements OnInit {

    _addingNav: boolean = false;
    _share: model.NavInfoModel;

    navDate: string = moment().format('DD-MM-YY');
    navPubDate: string = moment().format('DD-MM-YY');

    // mock data
    mockStatusItems: any[];

    @Input() mode: model.NavPopupMode = model.NavPopupMode.ADD;
    @Input() get share(): model.NavInfoModel {
        return this._share;   
    }
    set share(share: model.NavInfoModel) {
        this._share = share;
        this._addingNav = (share == null) ? false : true;
    }

    constructor() {
        this.initMockData();
    }

    ngOnInit() {}

    get addingNav(): boolean {
        return this._addingNav;
    }

    set addingNav(bool: boolean) {
        this._addingNav = bool;

        if(!bool) this.share = null;
    }

    isAddMode(): boolean {
        return this.mode === model.NavPopupMode.ADD;
    }

    isEditMode(): boolean {
        return this.mode === model.NavPopupMode.EDIT;
    }

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