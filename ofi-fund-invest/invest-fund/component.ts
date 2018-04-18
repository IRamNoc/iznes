// Vendor
import {
    Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, EventEmitter,
    Output, OnDestroy, ViewChild, ElementRef
} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {fromJS} from 'immutable';
import * as _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';
import {select} from '@angular-redux/store';
import {NgRedux} from '@angular-redux/store';
import * as moment from 'moment-business-days';
import * as math from 'mathjs';

// Internal
import {immutableHelper, MoneyValuePipe, mDateHelper, NumberConverterService, ConfirmationService} from '@setl/utils';
import {
    InitialisationService,
    MyWalletsService,
    WalletNodeRequestService
} from '@setl/core-req-services';
import {setRequestedWalletAddresses} from '@setl/core-store';
import {OfiOrdersService} from '../../ofi-req-services/ofi-orders/service';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import * as FundShareValue from '../../ofi-product/fund-share/fundShareValue';
import {CalendarHelper} from '../../ofi-product/fund-share/helper/calendar-helper';
import {OrderType} from "../../ofi-orders/order.model";

@Component({
    selector: 'app-invest-fund',
    templateUrl: 'component.html',
    styleUrls: ['./component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})

export class InvestFundComponent implements OnInit, OnDestroy {
    static DateFormat = 'DD/MM/YYYY';
    // static valuationOffset = 2;
    // static settlementOffset = 3;

    @Input() shareId: number;
    @Input() type: string;
    @Input() doValidate: boolean;
    @Input() initialFormData: { [p: string]: any };
    //
    @Output() close: EventEmitter<any> = new EventEmitter();
    @Output() formDataChange: EventEmitter<any> = new EventEmitter();

    // List of redux observable.
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) shareDataOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;

    // List of observable subscription.
    subscriptionsArray: Array<Subscription> = [];

    connectedWalletId: number;
    requestedWalletAddress: boolean;

    platformFee = 1;

    // s: subscription, r: redemption
    _actionBy: string;

    // cutoff, valuation, settlement
    _dateBy: string;

    // form config
    metadata: any;

    // Date picker configuration
    configDateCutoff = {
        firstDayOfWeek: 'mo',
        format: InvestFundComponent.DateFormat,
        closeOnSelect: true,
        opens: 'right',
        locale: 'en',
        isDayDisabledCallback: (thisDate) => {
            return false;
        }
    };

    configDateValuation = {
        firstDayOfWeek: 'mo',
        format: InvestFundComponent.DateFormat,
        closeOnSelect: true,
        opens: 'right',
        locale: 'en',
        isDayDisabledCallback: (thisDate) => {
            return false;
        }
    };

    configDateSettlement = {
        firstDayOfWeek: 'mo',
        format: InvestFundComponent.DateFormat,
        closeOnSelect: true,
        opens: 'right',
        locale: 'en',
        isDayDisabledCallback: (thisDate) => {
            return false;
        }
    };

    // Dates
    cutoffDate: FormControl;
    valuationDate: FormControl;
    settlementDate: FormControl;


    //  sadata.
    shareData: any;

    // Form
    form: FormGroup;
    quantity: FormControl;
    amount: FormControl;
    feeAmount: FormControl;
    netAmount: FormControl;
    address: FormControl;
    disclaimer: FormControl;

    addressSelected: any;

    // store subscription of quantity and grossAmount.
    // they should never subscribe at the same time, so it is ok to just use one variable.
    inputSubscription: Subscription;

    addressList: Array<any>;

    subPortfolio;
    addressListObj;

    panels = {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true
    };

    get feePercentage(): number {
        return this._numberConverterService.toFrontEnd(this.type === 'subscribe' ? this.shareData['entryFee'] : this.shareData['exitFee']);
    }

    get cutoffTime(): string {
        return this.type === 'subscribe' ? this.shareData.subscriptionCutOffTime : this.shareData.redemptionCutOffTime;
    }

    get currency(): number {
        return {
            subscribe: FundShareValue.CurrencyValue[this.shareData['subscriptionCurrency']],
            redeem: FundShareValue.CurrencyValue[this.shareData['redemptionCurrency']]
        }[this.type];
    }

    get today(): string {
        return mDateHelper.getCurrentUnixTimestampStr(InvestFundComponent.DateFormat);
    }

    get orderType(): string {
        return {
            subscribe: 's',
            redeem: 'r'
        }[this.type];
    }

    get orderTypeNumber(): number {
        return {
            subscribe: 3,
            redeem: 4
        }[this.type];
    }

    get orderTypeLabel(): string {
        return {
            subscribe: 'Subscription',
            redeem: 'Redemption'
        }[this.type];
    }

    set actionBy(value) {
        this._actionBy = value;
    }

    get actionBy() {
        return this._actionBy;
    }

    set dateBy(value) {
        this._dateBy = value;
    }

    get dateBy() {
        return this._dateBy;
    }

    get dateValue() {
        return {
            cutoff: this.cutoffDate.value,
            valuation: this.valuationDate.value,
            settlement: this.settlementDate.value
        }[this.dateBy];
    }

    get orderValue() {
        return {
            q: this._numberConverterService.toBlockchain(
                this._moneyValuePipe.parse(this.form.controls.quantity.value)
            ),
            a: this._numberConverterService.toBlockchain(
                this._moneyValuePipe.parse(this.form.controls.amount.value)
            )
        }[this.actionBy];
    }

    get nav() {
        return this._numberConverterService.toFrontEnd(this.shareData.price);
    }

    get allowCheckDisclaimer(): string | null {
        return this.form.valid ? null : '';
    }

    get allowToPlaceOrder(): string | null {
        return (this.form.valid) && this.disclaimer.value ? null : '';
    }

    get assetClass(): string {
        return FundShareValue.ClassCodeValue[this.shareData.shareClassCode];
    }

    get valuationOffset() {
        return (new CalendarHelper(this.shareData)).valuationOffSet;
    }

    get settlementOffset() {
        return (new CalendarHelper(this.shareData)).settlementOffSet;
    }

    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _moneyValuePipe: MoneyValuePipe,
                private _myWalletService: MyWalletsService,
                private _walletNodeRequestService: WalletNodeRequestService,
                private _numberConverterService: NumberConverterService,
                private _ofiOrdersService: OfiOrdersService,
                private _alertsService: AlertsService,
                private _confirmationService: ConfirmationService,
                private _ngRedux: NgRedux<any>) {
    }

    ngOnDestroy() {

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }

        const formValue = Object.assign({}, this.form.value, {'actionBy': this.actionBy});
        this.formDataChange.emit(formValue);
    }

    ngOnInit() {
        this.cutoffDate = new FormControl('', [Validators.required]);
        this.valuationDate = new FormControl('', [Validators.required]);
        this.settlementDate = new FormControl('', [Validators.required]);

        this.quantity = new FormControl(0, [Validators.required, numberValidator]);
        this.amount = new FormControl(0, [Validators.required, numberValidator]);
        this.feeAmount = new FormControl(0);
        this.netAmount = new FormControl(0, [Validators.required, numberValidator]);
        this.address = new FormControl('', [Validators.required, emptyArrayValidator]);
        this.disclaimer = new FormControl('');

        // Subscription form
        this.form = new FormGroup({
            quantity: this.quantity,
            amount: this.amount,
            feeAmount: this.feeAmount,
            netAmount: this.netAmount,
            comment: new FormControl('', Validators.maxLength(100)),
            address: this.address,
            cutoffDate: this.cutoffDate,
            valuationDate: this.valuationDate,
            settlementDate: this.settlementDate,
            disclaimer: this.disclaimer
        });

        this.setInitialFormValue();

        this.metadata = {
            subscribe: {
                actionLabel: 'subscribe',
                feeLabel: 'Entry',

            },
            redeem: {
                actionLabel: 'redeem',
                feeLabel: 'Exit',
            }
        }[this.type];

        // List of observable subscription.
        this.subscriptionsArray.push(this.shareDataOb.subscribe((shareData) => {
            this.shareData = immutableHelper.get(shareData, String(this.shareId), {});

            this.updateDateInputs();

        }));

        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
        }));

        this.subscriptionsArray.push(this.addressListOb.subscribe((addressList) => this.updateAddressList(addressList)));

        this.subscriptionsArray.push(this.requestedAddressListOb.subscribe(requested => {
            this.requestAddressList(requested);
        }));
        this.subscriptionsArray.push(this.requestedLabelListOb.subscribe(requested => this.requestWalletLabel(requested)));
    }

    setInitialFormValue() {
        if (!_.isEmpty(this.initialFormData)) {
            this.form.patchValue(this.initialFormData);
            this.addressSelected = this.initialFormData.address[0];
            this.actionBy = this.initialFormData.actionBy;
        }
    }

    updateDateInputs() {

        this.configDateCutoff.isDayDisabledCallback = (thisDate) => {
            // if day in the past.
            // if day if not the cutoff day for the fund.
            return !this.isCutoffDay(thisDate);
        };

        this.configDateValuation.isDayDisabledCallback = (thisDate) => {
            return !this.isValuationDay(thisDate);
        };

        this.configDateSettlement.isDayDisabledCallback = (thisDate) => {
            return !this.isSettlementDay(thisDate);
        };

        this._changeDetectorRef.detectChanges();

    }

    isCutoffDay(thisDate: moment): boolean {
        const isValidCutOff = (new CalendarHelper(this.shareData)).isValidCutoffDateTime(thisDate, this.orderTypeNumber);
        return isValidCutOff || !this.doValidate;
    }

    isValuationDay(thisDate: moment): boolean {
        const isValidValuation = (new CalendarHelper(this.shareData)).isValidValuationDateTime(thisDate, this.orderTypeNumber);
        return isValidValuation || !this.doValidate;
    }

    isSettlementDay(thisDate: moment): boolean {
        const isValidSettlement = (new CalendarHelper(this.shareData)).isValidSettlementDateTime(thisDate, this.orderTypeNumber);
        return isValidSettlement || !this.doValidate;
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
            return thisItem.get('id') === (this.addressSelected && this.addressSelected.id);
        });


        if (this.addressList.length > 0) {
            if (this.addressSelected) {
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

        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {

            MyWalletsService.defaultRequestWalletLabel(this._ngRedux, this._myWalletService, this.connectedWalletId);
        }
    }

    handleSelectedAddress(value) {
        this.addressSelected = value;
    }

    handleClose() {
        this.close.emit();
    }

    handleSubmit() {

        const request = {
            shareIsin: this.shareData.isin,
            portfolioId: this.connectedWalletId,
            subportfolio: this.address.value[0].id,
            dateBy: this.dateBy,
            dateValue: this.dateValue,
            orderType: this.orderType,
            orderBy: this.actionBy,
            orderValue: this.orderValue,
            comment: this.form.controls.comment.value
        };

        console.log('place an order', request);

        this._ofiOrdersService.addNewOrder(request).then((data) => {
            console.log('order created successfully', data);
        }).catch((e) => {
            console.log('order created successfully', e);
        });

    }

    subscribeForChange(type: string): void {
        // define which one trigger which, depend on type.
        const triggering: FormControl = {
            'quantity': this.quantity,
            'amount': this.amount,
        }[type];

        const beTriggered: FormControl = {
            'quantity': this.amount,
            'amount': this.quantity
        }[type];

        const callBack = {
            'quantity': (value) => {
                const newValue = this._moneyValuePipe.parse(value, this.shareData.maximumNumDecimal);
                /**
                 * amount = unit * nav
                 */
                const amount = math.format(math.chain(newValue).multiply(this.nav).done(), 14);
                beTriggered.setValue(this._moneyValuePipe.transform(amount));

                // calculate fee
                const fee = calFee(amount, this.feePercentage);
                const feeStr = this._moneyValuePipe.transform(fee.toString(), 2).toString();
                this.feeAmount.setValue(feeStr);

                // net amount
                const netAmount = calNetAmount(amount, fee, this.orderType);
                const netAmountStr = this._moneyValuePipe.transform(netAmount.toString(), 2).toString();
                this.netAmount.setValue(netAmountStr);

                this.actionBy = 'q';
            },
            'amount': (value) => {
                const newValue = this._moneyValuePipe.parse(value);
                /**
                 * quantity = amount / nav
                 */

                const quantity = math.format(math.chain(newValue).divide(this.nav).done(), 14);
                beTriggered.setValue(this._moneyValuePipe.transform(quantity, this.shareData.maximumNumDecimal));

                // calculate fee
                const fee = calFee(newValue, this.feePercentage);
                const feeStr = this._moneyValuePipe.transform(fee.toString(), 2).toString();
                this.feeAmount.setValue(feeStr);

                // net amount
                const netAmount = calNetAmount(newValue, fee, this.orderType);
                const netAmountStr = this._moneyValuePipe.transform(netAmount.toString(), 2).toString();
                this.netAmount.setValue(netAmountStr);

                this.actionBy = 'a';
            }
        }[type];

        this.inputSubscription = triggering.valueChanges.distinctUntilChanged().subscribe(callBack);
    }

    subscribeForChangeDate(type: string, $event: any): boolean {
        if (!this.doValidate) {
            this.dateBy = 'cutoff';
            return true;
        }

        // define which one trigger which, depend on type.
        const triggering: FormControl = {
            'cutoff': this.cutoffDate,
            'valuation': this.valuationDate,
            'settlement': this.settlementDate
        }[type];

        const beTriggered: FormControl = {
            'cutoff': [this.valuationDate, this.settlementDate],
            'valuation': [this.cutoffDate, this.settlementDate],
            'settlement': [this.cutoffDate, this.valuationDate]
        }[type];

        const momentDateValue = $event[0];
        const cutoffHour = moment(this.cutoffTime, 'hh:mm:ss').format('hh:mm');

        if (type === 'cutoff') {

            const cutoffDateStr = momentDateValue.format('DD/MM/YYYY') + ' ' + cutoffHour;

            const mValuationDate = momentDateValue.clone().add(this.valuationOffset, 'days');
            const valuationDateStr = mValuationDate.clone().format('DD/MM/YYYY');

            const mSettlementDate = momentDateValue.clone().add(this.settlementOffset, 'days');
            const settlementDateStr = mSettlementDate.format('DD/MM/YYYY');


            triggering.setValue(cutoffDateStr);
            beTriggered[0].setValue(valuationDateStr);
            beTriggered[1].setValue(settlementDateStr);

            this.dateBy = 'cutoff';
        } else if (type === 'valuation') {
            const mCutoffDate = momentDateValue.clone().subtract(this.valuationOffset, 'days');
            const cutoffDateStr = mCutoffDate.format('DD/MM/YYYY') + ' ' + cutoffHour;

            const mSettlementDate = mCutoffDate.clone().add(this.settlementOffset, 'days');
            const settlementDateStr = mSettlementDate.format('DD/MM/YYYY');

            beTriggered[0].setValue(cutoffDateStr);
            beTriggered[1].setValue(settlementDateStr);

            this.dateBy = 'valuation';
        } else if (type === 'settlement') {
            const mCutoffDate = momentDateValue.clone().subtract(this.settlementOffset, 'days');
            const cutoffDateStr = mCutoffDate.format('DD/MM/YYYY') + ' ' + cutoffHour;

            const mValuationDate = mCutoffDate.clone().add(this.valuationOffset, 'days');
            const valuationStr = mValuationDate.format('DD/MM/YYYY');

            beTriggered[0].setValue(cutoffDateStr);
            beTriggered[1].setValue(valuationStr);

            this.dateBy = 'settlement';
        }

        return false;

    }

    handleOrderConfirmation() {

        const subPortfolioName = this.address.value[0]['text'];

        this._confirmationService.create(
            '<span>Order confirmation</span>',
            `
            <p class="mb-1"><span class="text-warning">Please check information about your order before confirm it:</span></p>
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="left"><b>Investment SubPortfolio:</b></td>
                        <td>${subPortfolioName}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Share Name:</b></td>
                        <td>${this.shareData.fundShareName}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>ISIN:</b></td>
                        <td>${this.shareData.isin}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Currency:</b></td>
                        <td>${this.currency}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Quantity:</b></td>
                        <td>${this.quantity.value}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Amount:</b></td>
                        <td>${this.amount.value}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Settlement Date:</b></td>
                        <td>${this.settlementDate.value}</td>
                    </tr>
                </tbody>
            </table>
            `,
            {confirmText: 'Confirmation', declineText: 'Cancel', btnClass: 'primary'}
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.handleSubmit();
            }
        });
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
    const numberParsed = Number.parseInt(testString.replace(/[.,\s]/, ''));

    if (!/^\d+$|^\d+[\d,. ]+\d$/.test(testString) || numberParsed === 0) {
        return {invalidNumber: true};
    }
}

/**
 * Check form control value is not empty array
 * @param {FormControl} control
 * @return {{[p: string]: boolean}}
 */
function emptyArrayValidator(control: FormControl): { [s: string]: boolean } {


    const formValue = control.value;
    if (formValue instanceof Array && control.value.length === 0) {
        return {required: true};
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
    return moment().format('DD/MM/YYYY');
}

/**
 * Calculate order fee.
 *
 * @param amount
 * @param feePercent
 * @return {number}
 */
function calFee(amount: number | string, feePercent: number | string): number {
    amount = Number(amount);
    feePercent = Number(feePercent);
    return Number(math.format(math.chain(amount).multiply(feePercent).done(), 14));
}

/**
 * Calculate order net amount.
 *
 * @param {number | string} amount
 * @param {number | string} fee
 * @param {string} orderType
 * @return {number}
 */
function calNetAmount(amount: number | string, fee: number | string, orderType: string): number {
    amount = Number(amount);
    fee = Number(fee);
    return {
        s: Number(math.format(math.chain(amount).add(fee).done(), 14)),
        r: Number(math.format(math.chain(amount).subtract(fee).done(), 14))
    }[orderType];
}
