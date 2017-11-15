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
import {NgRedux} from '@angular-redux/store';
import * as moment from 'moment-business-days';

// Internal
import {immutableHelper, MoneyValuePipe, mDateHelper} from '@setl/utils';
import {CommonService} from '../common-service/service';
import {InvestFundFormService} from './service';
import {
    InitialisationService,
    MyWalletsService,
    WalletNodeRequestService
} from '@setl/core-req-services';
import {setRequestedWalletAddresses} from '@setl/core-store';

@Component({
    selector: 'app-invest-fund',
    templateUrl: 'component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        InvestFundFormService
    ]
})

export class InvestFundComponent implements OnInit, OnDestroy {
    @Input() shareId: number;
    @Input() type: string;

    @Output() close: EventEmitter<any> = new EventEmitter();

    // List of observable subscription.
    subscriptionsArray: Array<Subscription> = [];

    connectedWalletId: number;
    requestedWalletAddress: boolean;
    walletList: any;
    userId: number;

    allInstruments: any;

    // List of redux observable.
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) shareDataOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['asset', 'allInstruments', 'requested']) requestedAllInstrumentOb;
    @select(['asset', 'allInstruments', 'instrumentList']) allInstrumentOb;
    @select(['wallet', 'myWallets', 'walletList']) walletListOb;
    @select(['user', 'myDetail', 'userId']) userIdOb;

    // 0: quantity, 1: amount
    _actionBy: number;

    // form config
    formConfig: any;

    // Date picker configuration
    configDateCutoff = {
        firstDayOfWeek: 'mo',
        format: 'DD-MM-YYYY',
        closeOnSelect: true,
        opens: 'right',
        locale: 'en'

    };

    configDateValuation = {
        firstDayOfWeek: 'mo',
        format: 'DD-MM-YYYY',
        closeOnSelect: true,
        opens: 'right',
        locale: 'en'
    };

    // Dates
    cutoffDate: FormControl;
    valuationDate: FormControl;
    settlementDate: FormControl;


    // subscription form meta data.
    metaData: any;

    // Form
    form: FormGroup;
    quantity: FormControl;
    grossAmount: FormControl;
    address: FormControl;

    addressSelected: any;

    // store subscription of quantity and grossAmount.
    // they should never subscribe at the same time, so it is ok to just use one variable.
    inputSubscription: Subscription;

    addressList: Array<any>;

    subPortfolio;
    addressListObj;

    set actionBy(value) {
        this._actionBy = value;
    }

    get actionBy() {
        return this._actionBy;
    }

    get fee() {
        return (Number(this._moneyValuePipe.parse(String(Number(this.quantity.value) * Number(this.metaData.nav))))
            * this.metaData.feePercent / 100) + this.metaData.platformFee;
    }

    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _commonService: CommonService,
                private _moneyValuePipe: MoneyValuePipe,
                private _investFundFormService: InvestFundFormService,
                private _myWalletService: MyWalletsService,
                private _walletNodeRequestService: WalletNodeRequestService,
                private _ngRedux: NgRedux<any>) {
        this._actionBy = 0;

    }

    ngOnDestroy() {

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    ngOnInit() {
        const currentDate = mDateHelper.getCurrentUnixTimestampStr('DD/MM/YYYY');
        this.cutoffDate = new FormControl(currentDate);
        this.valuationDate = new FormControl(currentDate);
        this.settlementDate = new FormControl(currentDate);

        this.quantity = new FormControl(0, [Validators.required, numberValidator]);
        this.grossAmount = new FormControl(0, [Validators.required, numberValidator]);
        this.address = new FormControl('', [Validators.required]);

        // Subscription form
        this.form = new FormGroup({
            quantity: this.quantity,
            grossAmount: this.grossAmount,
            comment: new FormControl('', Validators.maxLength(100)),
            address: this.address,
            cutoffDate: this.cutoffDate,
            valuationDate: this.valuationDate,
            settlementDate: this.settlementDate
        });

        this.formConfig = {
            subscribe: {
                nonAcquiredFeeKey: 'entryFee',
                acquiredFeeKey: 'sAcquiredFee',
                cutoffOffSet: 'sCutOffOffset',
                cutoffTimeKey: 'sCutoffTime',
                cutoffDateTimeStrKey: 'sCutoffDateTimeStr',
                cutoffDateTimeNumberKey: 'sCutoffDateTimeNumber',
                valuationDateKey: 'sValuationDate',
                valuationTimeKey: 'sValuationTime',
                valuationDateTimeStrKey: 'sValuationDateTimeStr',
                valuationDateTimeNumberKey: 'sValuationDateTimeNumber',
                settlementDateKey: 'sSettlementDate',
                settlementTimeKey: 'sSettlementTime',
                settlementDateTimeStrKey: 'sSettlementDateTimeStr',
                settlementDateTimeNumberKey: 'sSettlementDateTimeNumber',
                allowTypeKey: 'sAllowType',
                actionLabel: 'subscribe',
                feeLabel: 'Entry',
            },
            redeem: {
                nonAcquiredFeeKey: 'exitFee',
                acquiredFeeKey: 'rAcquiredFee',
                cutoffOffSet: 'rCutOffOffset',
                cutoffTimeKey: 'rCutoffTime',
                cutoffDateTimeStrKey: 'rCutoffDateTimeStr',
                cutoffDateTimeNumberKey: 'rCutoffDateTimeNumber',
                valuationDateKey: 'rValuationDate',
                valuationTimeKey: 'rValuationTime',
                valuationDateTimeStrKey: 'rValuationDateTimeStr',
                valuationDateTimeNumberKey: 'rValuationDateTimeNumber',
                settlementDateKey: 'rSettlementDate',
                settlementTimeKey: 'rSettlementTime',
                settlementDateTimeStrKey: 'rSettlementDateTimeStr',
                settlementDateTimeNumberKey: 'rSettlementDateTimeNumber',
                allowTypeKey: 'rAllowType',
                actionLabel: 'redeem',
                feeLabel: 'Exit',

            }
        }[this.type];

        // List of observable subscription.
        this.subscriptionsArray.push(this.shareDataOb.subscribe((shareData) => {
            this.updateShareMetaData(shareData);

            this.updateDateInputs();

            this.pickDefaultDate(Date);
        }));
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
        }));
        this.subscriptionsArray.push(this.addressListOb.subscribe((addressList) => this.updateAddressList(addressList)));
        this.subscriptionsArray.push(this.requestedAddressListOb.subscribe(requested => {
            this.requestAddressList(requested);
        }));
        this.subscriptionsArray.push(this.requestedLabelListOb.subscribe(requested => this.requestWalletLabel(requested)));
        this.subscriptionsArray.push(this.requestedAllInstrumentOb.subscribe(requested => {
            this.requestAllInstruments(requested);
        }));
        this.subscriptionsArray.push(this.allInstrumentOb.subscribe(allInstruments => this.updateAllInstruments(allInstruments)));
        this.subscriptionsArray.push(this.walletListOb.subscribe(walletList => this.walletList = walletList));
        this.subscriptionsArray.push(this.userIdOb.subscribe(userId => this.userId = userId));

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

        const issuer = immutableHelper.get(thisShareData, 'issuer', '');
        const shareName = immutableHelper.get(thisShareData, 'shareName', '');

        const decimalisation = immutableHelper.get(shareCharacteristic, 'decimalisation', 2);
        const decimalisationNumber = Math.pow(10, -decimalisation);


        this.metaData = {
            registrar: immutableHelper.get(thisShareData, 'managementCompany', ''),
            issuer,
            shareName,
            fullAssetName: issuer + '|' + shareName,
            isin: immutableHelper.get(thisShareData, ['metaData', 'isin'], ''),
            currency: immutableHelper.get(thisShareData, ['metaData', 'portfolioCurrency', '0', 'text'], ''),
            cutoffOffset: immutableHelper.get(shareCharacteristic, [this.formConfig.cutoffOffSet], 0),
            cutoffTime: immutableHelper.get(shareCharacteristic, [this.formConfig.cutoffTimeKey], 0),
            cutoffDateTimeStr: immutableHelper.get(shareCharacteristic, [this.formConfig.cutoffDateTimeStrKey], 0),
            cutoffDateTimeNumber: immutableHelper.get(shareCharacteristic, [this.formConfig.cutoffDateTimeNumberKey], 0),
            valuationTime: immutableHelper.get(shareCharacteristic, [this.formConfig.valuationTimeKey], 0),
            valuationDateTimeStr: immutableHelper.get(shareCharacteristic, [this.formConfig.valuationDateTimeStrKey], 0),
            valuationDateTimeNumber: immutableHelper.get(shareCharacteristic, [this.formConfig.valuationDateTimeNumberKey], 0),
            settlementDateOffset: immutableHelper.get(shareCharacteristic, 'settlementDateOffset'),
            settlementTime: immutableHelper.get(shareCharacteristic, [this.formConfig.settlementTimeKey], 0),
            settlementDateTimeStr: immutableHelper.get(shareCharacteristic, [this.formConfig.settlementDateTimeStrKey], 0),
            settlementDateTimeNumber: immutableHelper.get(shareCharacteristic, [this.formConfig.settlementDateTimeNumberKey], 0),
            allowType: immutableHelper.get(shareCharacteristic, [this.formConfig.allowTypeKey], 0),
            knownNav: immutableHelper.get(shareCharacteristic, ['knownNav'], false),
            nav: immutableHelper.get(shareCharacteristic, 'nav', 0),
            nonAcquiredFee,
            acquiredFee,
            feePercent,
            platformFee: immutableHelper.get(shareCharacteristic, 'platformFee', 0),
            decimalisation,
            decimalisationNumber
        };

    }

    updateDateInputs() {

        this.configDateCutoff.isDayDisabledCallback = (thisDate) => {
            // if day in the past.
            // if day if not the cutoff day for the fund.
            const cutoffDay = this.metaData.cutoffOffset;
            return (cutoffDay !== thisDate.day()) || (thisDate.diff(moment(), 'days') < 0);
        };

        this.configDateValuation.isDayDisabledCallback = (thisDate) => {
            // if day in the past.
            // if day if not the valuation day for the fund.
            // todo
            // hardcode on Friday today.
            const valuationDay = 5;
            return (valuationDay !== thisDate.day()) || (thisDate.diff(moment(), 'days') < 0);
        };

        this._changeDetectorRef.detectChanges();

    }

    pickDefaultDate() {
        const cutoffOffset = this.metaData.cutoffOffset;
        const defaultCutoffDateStr = closestDay(cutoffOffset);
        this.cutoffDate.patchValue(defaultCutoffDateStr, {
            onlySelf: false,
            emitEvent: true,
            emitModelToViewChange: true,
            emitViewToModelChange: true
        });

        this.subscribeForChangeDate('cutoff', [moment(defaultCutoffDateStr, 'DD/MM/YYYY')]);
    }

    updateAddressList(addressList) {

        this.addressListObj = addressList;
        this.addressList = immutableHelper.reduce(addressList, (result, item) => {

            const addr = item.get('addr', false);
            const label = item.get('label', false);

            if (addr && label) {
                const addressItem = {
                    id: item.get('addr', ''),
                    text: item.get('label', '')
                };

                result.push(addressItem);
            }

            return result;
        }, []);

        // Set default or selected address.
        const hasSelectedAddressInList = immutableHelper.filter(this.addressList, (thisItem) => {
            return thisItem.get('id') === this.addressSelected && this.addressSelected.id;
        });


        if (this.addressList.length > 0) {
            if (!this.addressSelected || hasSelectedAddressInList.length === 0) {
                console.log('selecting', this.addressList[0]);
                this.address.setValue([this.addressList[0]], {
                    onlySelf: true,
                    emitEvent: true,
                    emitModelToViewChange: true,
                    emitViewToModelChange: true
                });
            } else {
                this.address.setValue([this.addressSelected], {
                    onlySelf: true,
                    emitEvent: true,
                    emitModelToViewChange: true,
                    emitViewToModelChange: true
                });
            }
        }

        this._changeDetectorRef.markForCheck();

    }

    requestAddressList(requestedState) {
        this.requestedWalletAddress = requestedState;
        console.log('requested wallet address', this.requestedWalletAddress);

        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this._ngRedux.dispatch(setRequestedWalletAddresses());

            // Request the list.
            InitialisationService.requestWalletAddresses(this._ngRedux, this._walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletLabel(requestedState) {

        console.log('checking requested', this.requestedWalletAddress);
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {

            MyWalletsService.defaultRequestWalletLabel(this._ngRedux, this._myWalletService, this.connectedWalletId);
        }
    }

    requestAllInstruments(requested) {
        if (!requested) {
            // request all instruments

            InitialisationService.requestAllInstruments(this._ngRedux, this._walletNodeRequestService);
        }
    }

    updateAllInstruments(allInstrumentData) {
        this.allInstruments = allInstrumentData;
    }

    handleSelectedAddress(value) {
        this.addressSelected = value;
    }

    handleClose() {
        this.close.emit();
    }

    handleSubmit() {
        console.log(this.form);

        const quantity = this.form.value.quantity;
        const quantityParsed = this._moneyValuePipe.parse(quantity, this.metaData.decimalisation);
        if (quantityParsed === 0) {
            this._investFundFormService.showInvalidForm('Quantity must be ' + (1 / Math.pow(10, this.metaData.decimalisation)) + ' or greater.');
            return false;
        }

        if (this.form.valid) {
            console.log(this.form.value);

            const fullAssetName = this.metaData.fullAssetName;
            const shareIssuerAddress = immutableHelper.get(this.allInstruments, [fullAssetName, 'issuerAddress'], '');

            const address = this.form.value.address[0]['id'];
            this.subPortfolio = this.addressListObj[address].label;
            const iban = _.get(this.addressListObj, [address, 'iban'], '');

            // Add actionBy
            const formValue = Object.assign({}, this.form.value, {
                byType: this.actionBy,
                shareIssuerAddress,
                address,
                userId: this.userId,
                walletId: this.connectedWalletId,
                walletName: _.get(this.walletList, [this.connectedWalletId, 'walletName'], ''),
                walletCommuPub: _.get(this.walletList, [this.connectedWalletId, 'commuPub'], ''),
                subPortfolio: this.subPortfolio,
                iban
            });
            this._investFundFormService.handleForm(formValue, this.metaData, this.type);
        }
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
                /**
                 * grossAmount = ((unit * nav) * (1 + feePercent)) + platformfee
                 */
                const grossAmoutBeforeFee = newValue * this.metaData.nav;
                const grossAmountAfterFee = (grossAmoutBeforeFee * (this.metaData.feePercent / 100 + 1)) + this.metaData.platformFee;
                beTriggered.setValue(this._moneyValuePipe.transform(grossAmountAfterFee));
            },
            'grossAmount': (value) => {
                const newValue = this._moneyValuePipe.parse(value);
                /**
                 * because:
                 * investment = unit * nav
                 * investment * (feePercent + 1) + platformFee = grossAmount
                 *
                 * so:
                 * unit = ((grossAmount - platformFee) / (1 + feePercent)) / nav
                 */

                const investment = ((newValue - this.metaData.platformFee) / (1 + (this.metaData.feePercent / 100))).toFixed(2);
                const resultUnit = Number(investment) / this.metaData.nav;
                beTriggered.setValue(this._moneyValuePipe.transform(resultUnit, this.metaData.decimalisation));
            }
        }[type];

        this.inputSubscription = triggering.valueChanges.distinctUntilChanged().subscribe(callBack);
    }

    subscribeForChangeDate(type: string, $event: any): boolean {

        // define which one trigger which, depend on type.
        const triggering: FormControl = {
            'cutoff': this.cutoffDate,
            'valuation': this.valuationDate,
        }[type];

        const beTriggered: FormControl = {
            'cutoff': this.valuationDate,
            'valuation': this.cutoffDate
        }[type];

        const momentDateValue = $event[0];

        if (type === 'cutoff') {
            // if valuation day - cutoff day is positive.
            // e.g. valuation day: Friday, cutoff day: Monday.
            // 5 - 1 = 4
            // offset is 4.

            // if valuation day - cutoff day is negative.
            // e.g. valuation day: Monday, cutoff day: Friday.
            // 1 - 5 = -4
            // offset is 7 + (-4) = 3

            const cutoffOffset = this.metaData.cutoffOffset;
            // todo
            // hardcoded to Friday atm
            const valuationOffset = 5;
            const diff = valuationOffset - cutoffOffset;
            let offset = 0;
            if (diff >= 0) {
                offset = diff;
            } else {
                offset = 7 + diff;
            }

            const mValuationDate = momentDateValue.add(offset, 'days');
            const valuationDateStr = mValuationDate.format('DD/MM/YYYY');
            const valuationDateNum = mValuationDate.valueOf();

            const settlementOffset = this.metaData.settlementDateOffset;
            // business moment js object;
            const bMValuationDate = moment(valuationDateNum);
            const mSettlementDate = bMValuationDate.businessAdd(settlementOffset);
            const settlementDateStr = mSettlementDate.format('DD/MM/YYYY');


            beTriggered.setValue(valuationDateStr);
            this.settlementDate.setValue(settlementDateStr);
        } else if (type === 'valuation') {
            // if valuation day - cutoff day is positive.
            // e.g. valuation day: Friday, cutoff day: Monday.
            // 5 - 1 = 4
            // offset is -4.

            // if valuation day - cutoff day is negative.
            // e.g. valuation day: Monday, cutoff day: Friday.
            // 1 - 5 = -4
            // offset is 7 + (-4) = 3 : -3


            const cutoffOffset = this.metaData.cutoffOffset;
            // todo
            // hardcoded to Friday atm
            const valuationOffset = 5;
            const diff = valuationOffset - cutoffOffset;
            let offset = 0;
            if (diff >= 0) {
                offset = diff;
            } else {
                offset = 7 + diff;
            }

            const mCutoffDate = momentDateValue.subtract(offset, 'days');
            const cutoffDateStr = mCutoffDate.format('DD/MM/YYYY');

            const valuationDateNum = momentDateValue.valueOf();

            const settlementOffset = this.metaData.settlementDateOffset;
            // business moment js object;
            const bMValuationDate = moment(valuationDateNum);
            const mSettlementDate = bMValuationDate.businessAdd(settlementOffset);
            const settlementDateStr = mSettlementDate.format('DD/MM/YYYY');


            beTriggered.setValue(cutoffDateStr);
            this.settlementDate.setValue(settlementDateStr);
        }

        return false;

    }

    unSubscribeForChange(): void {
        if (this.inputSubscription) {
            this.inputSubscription.unsubscribe();
        }
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
    if (!/^\d+$|^\d+[\d,. ]+\d$/.test(testString)) {
        return {invalidNumber: true};
    }
}

/**
 *
 * @param {number} dayToFind
 * @return {string}
 */
function closestDay(dayToFind: number): string {
    const maxLoop = 7;
    let i = 0;
    for (i; i <= maxLoop; i++) {
        const newDate = moment().add(i, 'days');
        const newDay = newDate.day();
        if (newDay === dayToFind) {
            return newDate.format('DD/MM/YYYY');
        }
    }
    return today.format('DD/MM/YYYY');
}
