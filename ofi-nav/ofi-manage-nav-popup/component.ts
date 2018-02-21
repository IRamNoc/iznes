import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
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

    navDateConfig: any = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null // TODO
    };

    navPublishDateConfig: any = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null // TODO
    };

    navForm: FormGroup;
    statusItems: any[];

    constructor(private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private ofiNavService: OfiNavService,
        private popupService: OfiManageNavPopupService) {

        this.initStatusData();
    }

    ngOnInit() {
        this.popupService.onOpen.subscribe((res: {share: model.NavInfoModel, mode: model.NavPopupMode}) => {
            this.initNavForm(res.share, res.mode);
        });

        this.popupService.onClose.subscribe(() => {
            this.navForm = undefined;
        });
    }

    get share(): model.NavInfoModel {
        return this.popupService.share();
    }

    get isOpen(): boolean {
        return this.popupService.isOpen();
    }
    set isOpen(bool: boolean) {
        if(!bool) this.popupService.close();
    }

    close(): void {
        this.popupService.close();
    }

    isAddMode(): boolean {
        return this.popupService.mode() === model.NavPopupMode.ADD;
    }

    isEditMode(): boolean {
        return this.popupService.mode() === model.NavPopupMode.EDIT;
    }

    navFormValid(): boolean {
        return (this.navForm) && this.navForm.valid && this.share != undefined;
    }

    private initNavForm(share: model.NavInfoModel, mode: model.NavPopupMode): void {
        this.navForm = new FormGroup({
            price: new FormControl('', Validators.required),
            navDate: new FormControl(moment(share.navDate).format('YYYY-MM-DD'), Validators.required),
            navPubDate: new FormControl(moment(share.navDate).format('YYYY-MM-DD'), Validators.required),
            status: new FormControl([this.statusItems[0]], Validators.required)
        });

        if(mode === model.NavPopupMode.EDIT) {
            this.navForm.controls.navDate.disable();
            this.navForm.controls.navPubDate.disable();
            this.navForm.controls.status.disable();
        }

        this.changeDetectorRef.markForCheck();
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