// Vendor
import {
    Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, EventEmitter,
    Output, OnDestroy, ViewChild, ElementRef
} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {fromJS} from 'immutable';
import _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';
import {select} from '@angular-redux/store';

// Internal
import {immutableHelper} from '@setl/utils';
import {CommonService} from '../common-service/service';
import {MoneyValuePipe} from '@setl/utils';


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

    // Form
    form: FormGroup;
    quantity: FormControl;
    grossAmount: FormControl;

    // store subscription of quantity and grossAmount.
    // they should never subscribe at the same time, so it is ok to just use one variable.
    inputSubscription: Subscription;

    set subscribeBy(value) {
        this._subscribeBy = value;
    }

    get subscribeBy() {
        return this._subscribeBy;
    }

    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _moneyValuePipe: MoneyValuePipe) {
        this._subscribeBy = 0;
    }

    ngOnDestroy() {

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.quantity = new FormControl(0, Validators.required);
        this.grossAmount = new FormControl(0, Validators.required);

        // Subscription form
        this.form = new FormGroup({
            quantity: this.quantity,
            grossAmount: this.grossAmount,
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

        const entryFee = immutableHelper.get(shareCharacteristic, 'entryFee', 0);
        const acquiredFee = immutableHelper.get(shareCharacteristic, 'sAcquiredFee', 0);
        const feePercent = entryFee + acquiredFee;

        this.metaData = {
            registrar: immutableHelper.get(thisShareData, 'managementCompany', ''),
            shareName: immutableHelper.get(thisShareData, 'shareName', ''),
            isin: immutableHelper.get(thisShareData, ['metaData', 'isin'], ''),
            currency: immutableHelper.get(thisShareData, ['metaData', 'portfolio_currency_select'], ''),
            cutoff: immutableHelper.get(shareCharacteristic, ['sCutoffDate'], 0),
            valuation: immutableHelper.get(shareCharacteristic, ['sValuationDate'], 0),
            settlement: immutableHelper.get(shareCharacteristic, ['sSettlementDate'], 0),
            sAllowType: immutableHelper.get(shareCharacteristic, ['sAllowType'], 0),
            knownNav: immutableHelper.get(shareCharacteristic, ['knownNav'], false),
            nav: immutableHelper.get(shareCharacteristic, 'nav', 0),
            entryFee,
            acquiredFee,
            feePercent,
            platformFee: immutableHelper.get(shareCharacteristic, 'platformFee', 0)
        };
    }

    handleClose() {
        this.close.emit();
    }

    handleSubmit() {
        console.log(this.form.value);
    }

    subscribeForChange(type: string): void {
        // define which one trigger which, depend on type.
        const triggering: FormControl = {
            'quantity': this.quantity,
            'grossAmount': this.grossAmount,
        }[type];

        const beTriggered: FormControl = {
            'quantity': this.grossAmount,
            'grossAmount': this.quantity
        }[type];

        const callBack = {
            'quantity': (value) => {
                value = this._moneyValuePipe.parse(value);
                beTriggered.setValue(this._moneyValuePipe.transform(value * this.metaData.nav));
            },
            'grossAmount': (value) => {
                value = this._moneyValuePipe.parse(value);
                beTriggered.setValue(this._moneyValuePipe.transform(value / this.metaData.nav));
            }
        }[type];

        this.inputSubscription = triggering.valueChanges.distinctUntilChanged().subscribe(callBack);
    }

    unSubscribeForChange(): void {
        if (this.inputSubscription) {
            this.inputSubscription.unsubscribe();
        }
    }
}
