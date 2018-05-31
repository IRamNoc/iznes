import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import * as _ from 'lodash';
import * as moment from 'moment';

import * as model from '../OfiNav';
import {OfiManageNavPopupService} from './service';
import {OfiNavService} from '../../ofi-req-services/ofi-product/nav/service';
import {
    clearRequestedNavFundView,
    clearRequestedNavFundsList,
    clearRequestedNavFundHistory,
    ofiSetCurrentNavLatestRequest,
    clearRequestedNavLatest
} from '../../ofi-store/ofi-product/nav';
import {CurrencyValue} from '../../ofi-product/fund-share/fundShareValue';
import {CurrencyEnum} from '../../ofi-product/fund-share/FundShareEnum';
import {NumberConverterService, MoneyValuePipe} from '@setl/utils';
import {MultilingualService} from '@setl/multilingual';

@Component({
    selector: 'app-nav-add',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiManageNavPopup implements OnInit {

    private mode: model.NavPopupMode;
    private _isOpen: boolean;
    private popupModel: { share: model.NavInfoModel, mode: model.NavPopupMode };

    navLatest: number;

    navDateConfig: any = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null
    };

    navPublishDateConfig: any = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null
    };

    navForm: FormGroup;
    statusItems: any[];
    navExceedsThreshold = false;

    private subscriptionsArray: Subscription[] = [];

    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavLatest', 'requested']) navLatestRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavLatest', 'navLatest']) navLatestOb: Observable<any>;

    constructor(private redux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private ofiNavService: OfiNavService,
                private numberConverterService: NumberConverterService,
                private popupService: OfiManageNavPopupService,
                public _translate: MultilingualService,
                private moneyValuePipe: MoneyValuePipe
                ) {

        this.initStatusData();
        this.initSubscriptions();
    }

    ngOnInit() {
        this.popupService.onOpen.subscribe((res: { share: model.NavInfoModel, mode: model.NavPopupMode }) => {
            this.redux.dispatch(clearRequestedNavLatest());
            this.navExceedsThreshold = false;
            this.popupModel = res;
        });

        this.popupService.onClose.subscribe(() => {
            this.navForm = undefined;
        });
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.navLatestRequestedOb.subscribe(requested => {
            this.requestNavLatest(requested);
        }));
        this.subscriptionsArray.push(this.navLatestOb.subscribe(navList => {
            this.updateNavLatest(navList);

            if(this.popupModel) this.initNavForm(this.popupModel.share, this.popupModel.mode);
        }));
    }

    get share(): model.NavInfoModel {
        return this.popupService.share();
    }

    get isOpen(): boolean {
        return this.popupService.isOpen();
    }

    set isOpen(bool: boolean) {
        if (!bool) this.popupService.close();
    }

    close(): void {
        this.popupService.close();
    }

    isAddMode(): boolean {
        return this.popupService.mode() === model.NavPopupMode.ADD ||
            this.popupService.mode() === model.NavPopupMode.ADD_EXISTING;
    }

    isEditMode(): boolean {
        return this.popupService.mode() === model.NavPopupMode.EDIT;
    }

    isDeleteMode(): boolean {
        return this.popupService.mode() === model.NavPopupMode.DELETE;
    }

    navFormValid(): boolean {
        return (this.navForm) && this.navForm.valid && this.share != undefined;
    }

    showStatusWarning(): boolean {
        return !this.isDeleteMode() && this.navForm.controls['status'].value[0].id === -1;
    }

    private initNavForm(share: model.NavInfoModel, mode: model.NavPopupMode): void {
        const statusObj = (share.status) ?
            [_.find(this.statusItems, {'id': share.status})] :
            [this.statusItems[0]];

        this.navForm = new FormGroup({
            nav: new FormControl((this.isDeleteMode() ? this.numberConverterService.toFrontEnd(share.nav) : this.navLatest)),
            price: new FormControl(this.navLatest || 0, Validators.compose([
                Validators.required,
                numberValidator,
            ])),
            navDate: new FormControl(moment(share.navDate).format('YYYY-MM-DD'), Validators.required),
            navPubDate: new FormControl(moment(share.navDate).format('YYYY-MM-DD'), Validators.required),
            status: new FormControl(statusObj, Validators.required)
        });

        if(mode === model.NavPopupMode.ADD) {
            this.navForm.controls.status.enable();
        } else if(mode === model.NavPopupMode.ADD_EXISTING) {
            this.navForm.controls.status.enable();
            this.navForm.controls.navDate.disable();
            this.navForm.controls.navPubDate.disable();
        } else if(mode === model.NavPopupMode.EDIT) {
            this.navForm.controls.status.disable();
            this.navForm.controls.navDate.disable();
            this.navForm.controls.navPubDate.disable();
        } else if(mode == model.NavPopupMode.DELETE) {
            this.navForm.controls.nav.disable();
            this.navForm.controls.status.disable();
            this.navForm.controls.navDate.disable();
            this.navForm.controls.navPubDate.disable();
        }

        this.navForm.controls.price.valueChanges.subscribe((nav: number) => {
            this.checkIfNavExceedsThreshold(nav);
        });

        this.changeDetectorRef.markForCheck();
    }

    private checkIfNavExceedsThreshold(nav: number): void {
        const diff = (nav - this.navLatest) / this.navLatest * 100;

        this.navExceedsThreshold = diff > 10;
    }

    private initStatusData(): void {
        this.statusItems = [{
            id: 1,
            text: 'Estimated'
        }, {
            id: 2,
            text: 'Technical'
        }, {
            id: -1,
            text: 'Validated'
        }]
    }

    /**
     * add/edit new nav
     * @param requested boolean
     * @return void
     */
    private updateNav(): void {
        if (!this.share) return;

        const requestData = {
            fundShareIsin: this.share.isin,
            fundDate: `${this.navForm.controls.navDate.value} 00:00:00`,
            navPublicationDate: `${this.navForm.controls.navPubDate.value} 00:00:00`,
            price: this.numberConverterService.toBlockchain(this.navForm.value.price),
            priceStatus: this.navForm.controls.status.value[0].id
        }

        OfiNavService.defaultUpdateNav(this.ofiNavService,
            this.redux,
            requestData,
            (res) => this.updateNavSuccessCallback(res),
            (res) => this.updateNavErrorCallback(res));
    }

    private updateNavSuccessCallback(res: any): void {
        this.redux.dispatch(clearRequestedNavFundView());

        this.popupService.close();

        this.showUpdateResponseModal(res[1].Data[0]);
    }

    private updateNavErrorCallback(res: any): void {
        this.showErrorModal(res);
    }


    /**
     * delete nav
     * @param requested boolean
     * @return void
     */
    private deleteNav(): void {
        if (!this.share) return;

        const requestData = {
            shareId: this.share.shareId,
            navDate: `${this.navForm.controls.navDate.value} 00:00:00`,
            navStatus: this.navForm.controls.status.value[0].id
        }

        OfiNavService.defaultDeleteNav(this.ofiNavService,
            this.redux,
            requestData,
            (res) => this.deleteNavSuccessCallback(res),
            (res) => this.deleteNavErrorCallback(res));
    }

    private deleteNavSuccessCallback(res: any): void {
        this.popupService.close();

        this.showDeleteResponseModal(res[1]);
    }

    private deleteNavErrorCallback(res: any): void {
        this.showErrorModal(res);
    }

    getCurrencyString(currency: number): string {
        return CurrencyValue[currency];
    }


    /**
     * request the nav latest
     * @param requested boolean
     * @return void
     */
    private requestNavLatest(requested: boolean): void {
        if (requested) return;

        const requestData = {
            fundShareId: this.share.shareId,
            navDate: `${this.share.navDate}`
        }

        OfiNavService.defaultRequestNavLatest(this.ofiNavService,
            this.redux,
            requestData,
            () => {
            },
            () => {
            }
        );

        this.redux.dispatch(ofiSetCurrentNavLatestRequest(requestData));
    }

    /**
     * update the nav latest
     * @param navList NavList
     * @return void
     */
    private updateNavLatest(navLatest: model.NavLatestModel[]): void {
        this.navLatest = (navLatest[0]) ? this.numberConverterService.toFrontEnd(navLatest[0].nav) : null;
        this.changeDetectorRef.markForCheck();
    }

    private showUpdateResponseModal(response: any) {
        this.alertsService.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-success">Successfully Updated NAV</td>
                    </tr>
                </tbody>
            </table>
        `);

        this.responseModalCallback();
    }

    private showDeleteResponseModal(response: any) {
        this.alertsService.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-success">Successfully Deleted NAV</td>
                    </tr>
                </tbody>
            </table>
        `);

        this.responseModalCallback();
    }

    private responseModalCallback(): void {
        this.redux.dispatch(clearRequestedNavFundsList());
        this.redux.dispatch(clearRequestedNavFundHistory());
    }

    private showErrorModal(data): void {
        this.alertsService.create('error',
            `${data[1].Data[0].Message}`);

        this.redux.dispatch(clearRequestedNavFundsList());
        this.redux.dispatch(clearRequestedNavFundHistory());
    }

}

/**
 * Number validator:
 *
 * - Takes a `Control` as it's input and
 * - Returns a `StringMap<string, boolean>` where the key is "error code" and
 *   the value is `true` if it fails
 */
function numberValidator(control: FormControl): { [s: string]: boolean } {
    // todo
    // check if number is none zero as well

    const testString = control.value.toString();
    const numberParsed = Number.parseInt(testString.replace(/[.,\s]/, ''));

    if (!/^\d+$|^\d+[\d,. ]+\d$/.test(testString) || numberParsed === 0) {
        return {invalidNumber: true};
    }
}
