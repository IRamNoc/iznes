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
    selector: 'app-invest-fund',
    templateUrl: 'component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvestFundComponent implements OnInit, OnDestroy {
    @Input() shareId: number;
    @Input() type: string;

    @Output() close: EventEmitter<any> = new EventEmitter();

    // List of observable subscription.
    subscriptionsArray: Array<Subscription> = [];

    // List of redux observable.
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) shareDataOb;

    // 0: quantity, 1: amount
    _subscribeBy: number;

    // form config
    formConfig: any;

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

    get fee() {
        return (this._moneyValuePipe.parse(this.grossAmount.value) * this.metaData.feePercent / 100) + 1;
    }

    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _commonService: CommonService,
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

        this.formConfig = {
            subscribe: {
                nonAcquiredFeeKey: 'entryFee',
                acquiredFeeKey: 'sAcquiredFee',
                cutoffDateKey: 'sCutoffDate',
                valuationDateKey: 'sValuationDate',
                settlementDateKey: 'sSettlementDate',
                allowTypeKey: 'sAllowType',
                actionLabel: 'subscribe',
                feeLabel: 'Entry',
            },
            redeem: {
                nonAcquiredFeeKey: 'exitFee',
                acquiredFeeKey: 'rAcquiredFee',
                cutoffDateKey: 'rCutoffDate',
                valuationDateKey: 'rValuationDate',
                settlementDateKey: 'rSettlementDate',
                allowTypeKey: 'rAllowType',
                actionLabel: 'redeem',
                feeLabel: 'Exit',

            }
        }[this.type];

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

        const shareCharacteristic = this._commonService.getFundCharacteristic(thisShareData);
        console.log(shareCharacteristic);

        const nonAcquiredFee = immutableHelper.get(shareCharacteristic, this.formConfig.nonAcquiredFeeKey, 0);
        const acquiredFee = immutableHelper.get(shareCharacteristic, this.formConfig.acquiredFeeKey, 0);
        const feePercent = nonAcquiredFee + acquiredFee;

        this.metaData = {
            registrar: immutableHelper.get(thisShareData, 'managementCompany', ''),
            shareName: immutableHelper.get(thisShareData, 'shareName', ''),
            isin: immutableHelper.get(thisShareData, ['metaData', 'isin'], ''),
            currency: immutableHelper.get(thisShareData, ['metaData', 'portfolio_currency_select'], ''),
            cutoff: immutableHelper.get(shareCharacteristic, [this.formConfig.cutoffDateKey], 0),
            valuation: immutableHelper.get(shareCharacteristic, [this.formConfig.valuationDateKey], 0),
            settlement: immutableHelper.get(shareCharacteristic, [this.formConfig.settlementDateKey], 0),
            allowType: immutableHelper.get(shareCharacteristic, [this.formConfig.allowTypeKey], 0),
            knownNav: immutableHelper.get(shareCharacteristic, ['knownNav'], false),
            nav: immutableHelper.get(shareCharacteristic, 'nav', 0),
            nonAcquiredFee,
            acquiredFee,
            feePercent,
            platformFee: immutableHelper.get(shareCharacteristic, 'platformFee', 0),
            decimalisation: immutableHelper.get(shareCharacteristic, 'decimalisation', 2)
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
                const newValue = this._moneyValuePipe.parse(value, this.metaData.decimalisation);
                beTriggered.setValue(this._moneyValuePipe.transform(newValue * this.metaData.nav));
            },
            'grossAmount': (value) => {
                const newValue = this._moneyValuePipe.parse(value);
                beTriggered.setValue(this._moneyValuePipe.transform(newValue / this.metaData.nav, this.metaData.decimalisation));
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

