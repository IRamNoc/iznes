// Vendor
import {
    Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, EventEmitter,
    Output, OnDestroy
} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {fromJS} from 'immutable';
import _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';
import {select} from '@angular-redux/store';

// Internal
import {immutableHelper} from '@setl/utils';
import {CommonService} from '../common-service/service';


@Component({
    selector: 'app-subscribe-fund',
    templateUrl: 'component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SubscribeFundComponent implements OnInit, OnDestroy {
    @Input() shareId;

    @Output() close: EventEmitter<any> = new EventEmitter();

    // List of observable subscription.
    subscriptionsArray: Array<Subscription> = [];

    // List of redux observable.
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) shareDataOb;

    // 0: quantity, 1: amount
    _subscribeBy: number;

    // Date picker configuration
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'DD-MM-YYYY',
        closeOnSelect: true,
        opens: 'right',
        locale: 'en',

    };

    // subscription form meta data.
    metaData: any;

    form: FormGroup;

    set subscribeBy(value) {
        this._subscribeBy = value;
    }

    get subscribeBy() {
        return this._subscribeBy;
    }


    constructor(private _changeDetectorRef: ChangeDetectorRef) {
        this._subscribeBy = 0;
    }

    ngOnDestroy() {

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    ngOnInit() {
        // Subscription form
        this.form = new FormGroup({
            quantity: new FormControl(0, Validators.required),
            grossAmount: new FormControl(0, Validators.required),
            comment: new FormControl('')
        });


        // List of observable subscription.
        this.subscriptionsArray.push(this.shareDataOb.subscribe((shareData) => {
            this.updateShareMetaData(shareData);
        }));
    }

    updateShareMetaData(shareData) {
        const filteredShareData = immutableHelper.filter(shareData, (data, id) => {
            return id === String(this.shareId);
        });

        const thisShareData = immutableHelper.get(filteredShareData, String(this.shareId), {});

        const shareCharacteristic = CommonService.getFundCharacteristic(thisShareData);
        console.log(shareCharacteristic);

        this.metaData = {
            registrar: immutableHelper.get(thisShareData, 'managementCompany', ''),
            shareName: immutableHelper.get(thisShareData, 'shareName', ''),
            isin: immutableHelper.get(thisShareData, ['metaData', 'isin'], ''),
            currency: immutableHelper.get(thisShareData, ['metaData', 'portfolio_currency_select'], ''),
            cutoff: immutableHelper.get(shareCharacteristic, ['sCutoffDate'], 0),
            valuation: immutableHelper.get(shareCharacteristic, ['sValuationDate'], 0),
            settlement: immutableHelper.get(shareCharacteristic, ['sSettlementDate'], 0),
        };
    }

    handleClose() {
        this.close.emit();
    }

    handleSubmit() {
        console.log(this.form.value);
    }


}
