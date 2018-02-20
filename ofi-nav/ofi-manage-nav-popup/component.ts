import {Component, OnInit, Input} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {select, NgRedux} from '@angular-redux/store';
import * as moment from 'moment';

import * as model from '../OfiNav';
import {OfiManageNavPopupService} from './service';
import {OfiNavService} from '../../ofi-req-services/ofi-product/nav/service';

@Component({
    selector: 'app-nav-add',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiManageNavPopup implements OnInit {

    private mode: model.NavPopupMode;
    private _isOpen: boolean;

    dateConfig = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null // TODO
    };

    navForm: FormGroup;
    statusItems: any[];

    constructor(private redux: NgRedux<any>,
        private ofiNavService: OfiNavService,
        private popupService: OfiManageNavPopupService) {

        this.initStatusData();
        this.initNavForm();
    }

    ngOnInit() {}

    get share(): model.NavInfoModel {
        return this.popupService.share();
    }

    get isOpen(): boolean {
        return this.popupService.isOpen();
    }
    set isOpen(bool: boolean) {
        if(!bool) this.popupService.close();
    }

    isAddMode(): boolean {
        return this.popupService.mode() === model.NavPopupMode.ADD;
    }

    isEditMode(): boolean {
        return this.popupService.mode() === model.NavPopupMode.EDIT;
    }

    navFormValid(): boolean {
        return this.navForm.valid && this.share != undefined;
    }

    private initNavForm(): void {
        this.navForm = new FormGroup({
            price: new FormControl(this.share ? this.share.nav : 0, Validators.required),
            navDate: new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
            navPubDate: new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
            status: new FormControl([this.statusItems[0]], Validators.required)
        });
    }

    private initStatusData(): void {
        this.statusItems = [{
            id: 2,
            text: 'Technical'
        }, {
            id: 1,
            text: 'Estimated'
        }, {
            id: -1,
            text: 'Validated'
        }]
    }

    /**
     * add new nav
     * @param requested boolean
     * @return void
     */
    private updateNav(): void {
        if(!this.share) return;

        const requestData = {
            fundName: this.share.fundShareName,
            fundDate: `${this.navForm.value.navDate} 00:00:00`,
            price: this.navForm.value.price,
            priceStatus: this.navForm.value.status[0].id
        }

        OfiNavService.defaultUpdateNav(this.ofiNavService,
            this.redux,
            requestData,
            (res) => this.updateNavSuccessCallback(res),
            (res) => this.updateNavErrorCallback(res));
    }

    private updateNavSuccessCallback(res): void {

    }

    private updateNavErrorCallback(res): void {
        
    }

}