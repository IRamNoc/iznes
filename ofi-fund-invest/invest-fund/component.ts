// Vendor
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';
import {NgRedux, select} from '@angular-redux/store';
import * as moment from 'moment-business-days';
import * as math from 'mathjs';
// Internal
import {
    commonHelper,
    ConfirmationService,
    immutableHelper,
    mDateHelper,
    MoneyValuePipe,
    NumberConverterService
} from '@setl/utils';
import {InitialisationService, MyWalletsService, WalletNodeRequestService} from '@setl/core-req-services';
import {setRequestedWalletAddresses} from '@setl/core-store';
import {OfiOrdersService} from '../../ofi-req-services/ofi-orders/service';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import * as FundShareValue from '../../ofi-product/fund-share/fundShareValue';
import {CalendarHelper} from '../../ofi-product/fund-share/helper/calendar-helper';
import {OrderHelper, OrderRequest} from '../../ofi-product/fund-share/helper/order-helper';
import {OrderByType} from '../../ofi-orders/order.model';
import {ToasterService} from 'angular2-toaster';
import {Router} from '@angular/router';
import {LogService} from '@setl/utils';

@Component({
    selector: 'app-invest-fund',
    templateUrl: 'component.html',
    styleUrls: ['./component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})

export class InvestFundComponent implements OnInit, OnDestroy {
    static DateTimeFormat = 'YYYY-MM-DD HH:mm';
    static DateFormat = 'YYYY-MM-DD';

    @Input() shareId: number;
    @Input() type: string;
    @Input() doValidate: boolean;
    @Input() initialFormData: { [p: string]: any };
    @Input() walletBalance: any;
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
        format: InvestFundComponent.DateTimeFormat,
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

    orderHelper: OrderHelper;
    calenderHelper: CalendarHelper;

    get feePercentage(): number {
        return this._numberConverterService.toFrontEnd(this.type === 'subscribe' ? this.shareData['entryFee'] : this.shareData['exitFee']);
    }

    get cutoffTime(): string {
        return this.type === 'subscribe' ? this.shareData.subscriptionCutOffTime : this.shareData.redemptionCutOffTime;
    }

    get currency(): string {
        return FundShareValue.CurrencyValue[this.shareData['shareClassCurrency']];
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
        if (typeof this.shareData !== 'undefined') {
            this.orderHelper = new OrderHelper(this.shareData, this.buildFakeOrderRequestToBackend());
        }
    }

    get actionBy() {
        return this._actionBy;
    }

    get actionByNumber() {
        return {
            a: OrderByType.Amount,
            q: OrderByType.Quantity
        }[this.actionBy];
    }

    set dateBy(value) {
        this._dateBy = value;
        if (typeof this.shareData !== 'undefined') {
            this.orderHelper = new OrderHelper(this.shareData, this.buildFakeOrderRequestToBackend());
        }
    }

    get dateBy() {
        return this._dateBy;
    }

    get dateValue() {
        return {
            cutoff: this.cutoffDate.value,
            valuation: this.valuationDate.value + ' 00:00',
            settlement: this.settlementDate.value + ' 00:00'
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

    get navStr() {
        return this._moneyValuePipe.transform(this.nav, 4);
    }

    get allowCheckDisclaimer(): string | null {
        return (this.form.valid && this.isValidOrderValue() && !this.isRedeemTooMuch) ? null : '';
    }

    get allowToPlaceOrder(): string | null {
        return (this.form.valid && this.isValidOrderValue() && this.disclaimer.value && !this.isRedeemTooMuch) ? null : '';
    }

    get valuationOffset() {
        return this.calenderHelper.valuationOffSet;
    }

    get settlementOffset() {
        return this.calenderHelper.settlementOffSet;
    }

    get allowAmount(): any {
        if (typeof this.orderHelper === 'undefined') {
            return '';
        } else {
            return this.orderHelper.checkOrderByIsAllow('a').orderValid ? null : '';
        }
    }

    get allowQuantity(): any {
        if (typeof this.orderHelper === 'undefined') {
            return '';
        } else {
            return this.orderHelper.checkOrderByIsAllow('q').orderValid ? null : '';
        }
    }

    get shareAsset(): string {
        return this.shareData.isin + '|' + this.shareData.fundShareName;
    }

    get subPortfolioBalance(): number {
        const shareBalanceBreakDown = _.get(this.walletBalance, [this.shareAsset]);
        return this.findPortFolioBalance(shareBalanceBreakDown);
    }

    get isRedeemTooMuch(): boolean {
        if (this.orderType === 's') {
            return false;
        }
        const toNumber = this._moneyValuePipe.parse(this.quantity.value, 4);
        const redeeming = this._numberConverterService.toBlockchain(toNumber);
        const balance = this.subPortfolioBalance;
        return Boolean(redeeming >= balance);
    }

    constructor(private _changeDetectorRef: ChangeDetectorRef,
                public _moneyValuePipe: MoneyValuePipe,
                private _myWalletService: MyWalletsService,
                private _walletNodeRequestService: WalletNodeRequestService,
                private _numberConverterService: NumberConverterService,
                private _ofiOrdersService: OfiOrdersService,
                private _alertsService: AlertsService,
                private _confirmationService: ConfirmationService,
                private _toaster: ToasterService,
                private _router: Router,
                private logService: LogService,
                private _ngRedux: NgRedux<any>) {
    }

    ngOnDestroy() {

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }

        // const formValue = Object.assign({}, this.form.value, {'actionBy': this.actionBy});
        // this.formDataChange.emit(formValue);
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

        // this.setInitialFormValue();

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

        this.actionBy = 'q';

        // List of observable subscription.
        this.subscriptionsArray.push(this.shareDataOb.subscribe((shareData) => {
            this.shareData = immutableHelper.get(shareData, String(this.shareId), {});
            this.calenderHelper = new CalendarHelper(this.shareData);

            this.orderHelper = new OrderHelper(this.shareData, this.buildFakeOrderRequestToBackend());

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
        this.logService.log('requested wallet address', this.requestedWalletAddress);

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

    buildOrderRequest() {

        return {
            shareIsin: this.shareData.isin,
            portfolioId: this.connectedWalletId,
            subportfolio: _.get(this.address, ['value', '0', 'id'], ''),
            dateBy: this.dateBy,
            dateValue: this.dateValue,
            orderType: this.orderType,
            orderBy: this.actionBy,
            orderValue: this.orderValue,
            comment: this.form.controls.comment.value
        };
    }

    buildFakeOrderRequestToBackend(): OrderRequest {
        return {
            token: '',
            shareisin: '',
            portfolioid: '1',
            subportfolio: '',
            dateby: this.dateBy, // (cutoff, valuation, settlement)
            datevalue: this.dateValue, // (date value relate to dateby)
            ordertype: this.orderType, // ('s', 'r')
            orderby: this.actionBy, // ('q', 'a' )
            ordervalue: this.orderValue, // (order value relate to orderby)
            comment: ''
        };
    }

    handleSubmit() {
        const request = this.buildOrderRequest();

        this.logService.log('place an order', request);

        if (this.isRedeemTooMuch) {
            return false;
        }

        this._ofiOrdersService.addNewOrder(request).then((data) => {
            const orderId = _.get(data, ['1', 'Data', '0', 'orderID'], 0);
            const orderRef = commonHelper.pad(orderId, 8, '0');
            this._toaster.pop('success', `Your order ${orderRef} has been successfully placed and is now initiated.`);
            this.handleClose();
            this._router.navigateByUrl('/order-book/my-orders/list');
        }).catch((data) => {
            const errorMessage = _.get(data, ['1', 'Data', '0', 'Message'], '');
            this._toaster.pop('warning', errorMessage);
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
                beTriggered.setValue(this._moneyValuePipe.transform(amount.toString(), 4));

                // calculate fee
                const fee = calFee(amount, this.feePercentage);
                const feeStr = this._moneyValuePipe.transform(fee.toString(), 4).toString();
                this.feeAmount.setValue(feeStr);

                // net amount
                const netAmount = calNetAmount(amount, fee, this.orderType);
                const netAmountStr = this._moneyValuePipe.transform(netAmount.toString(), 4).toString();
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
                const feeStr = this._moneyValuePipe.transform(fee.toString(), 4).toString();
                this.feeAmount.setValue(feeStr);

                // net amount
                const netAmount = calNetAmount(newValue, fee, this.orderType);
                const netAmountStr = this._moneyValuePipe.transform(netAmount.toString(), 4).toString();
                this.netAmount.setValue(netAmountStr);

                this.actionBy = 'a';
            }
        }[type];

        this.inputSubscription = triggering.valueChanges.distinctUntilChanged().subscribe(callBack);
    }

    isValidOrderValue() {
        const minValue = OrderHelper.getSubsequentMinFig(this.shareData, this.orderTypeNumber, this.actionByNumber);

        return Boolean(minValue <= this.orderValue);
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
        const cutoffHour = moment(this.cutoffTime, 'HH:mm').format('HH:mm');

        if (type === 'cutoff') {

            const cutoffDateStr = momentDateValue.format('YYYY-MM-DD') + ' ' + cutoffHour;

            const mValuationDate = this.calenderHelper.getValuationDateFromCutoff(momentDateValue, this.orderTypeNumber);
            const valuationDateStr = mValuationDate.clone().format('YYYY-MM-DD');

            const mSettlementDate = this.calenderHelper.getSettlementDateFromCutoff(momentDateValue, this.orderTypeNumber);
            const settlementDateStr = mSettlementDate.format('YYYY-MM-DD');


            triggering.setValue(cutoffDateStr, {
                onlySelf: true,
                emitEvent: false,
                emitModelToViewChange: true,
                emitViewToModelChange: false
            });
            beTriggered[0].setValue(valuationDateStr, {
                onlySelf: true,
                emitEvent: false,
                emitModelToViewChange: true,
                emitViewToModelChange: false
            });
            beTriggered[1].setValue(settlementDateStr, {
                onlySelf: true,
                emitEvent: false,
                emitModelToViewChange: true,
                emitViewToModelChange: false
            });

            this.dateBy = 'cutoff';
        } else if (type === 'valuation') {

            const mCutoffDate = this.calenderHelper.getCutoffDateFromValuation(momentDateValue, this.orderTypeNumber);
            const cutoffDateStr = mCutoffDate.format('YYYY-MM-DD') + ' ' + cutoffHour;

            const mSettlementDate = this.calenderHelper.getSettlementDateFromCutoff(mCutoffDate, this.orderTypeNumber);
            const settlementDateStr = mSettlementDate.format('YYYY-MM-DD');

            beTriggered[0].setValue(cutoffDateStr, {
                onlySelf: true,
                emitEvent: false,
                emitModelToViewChange: true,
                emitViewToModelChange: false
            });
            beTriggered[1].setValue(settlementDateStr, {
                onlySelf: true,
                emitEvent: false,
                emitModelToViewChange: true,
                emitViewToModelChange: false
            });

            this.dateBy = 'valuation';
        } else if (type === 'settlement') {
            const mCutoffDate = this.calenderHelper.getCutoffDateFromSettlement(momentDateValue, this.orderTypeNumber);
            const cutoffDateStr = mCutoffDate.format('YYYY-MM-DD') + ' ' + cutoffHour;

            const mValuationDate = this.calenderHelper.getValuationDateFromCutoff(mCutoffDate, this.orderTypeNumber);
            const valuationStr = mValuationDate.format('YYYY-MM-DD');

            beTriggered[0].setValue(cutoffDateStr, {
                onlySelf: true,
                emitEvent: false,
                emitModelToViewChange: true,
                emitViewToModelChange: false
            });
            beTriggered[1].setValue(valuationStr, {
                onlySelf: true,
                emitEvent: false,
                emitModelToViewChange: true,
                emitViewToModelChange: false
            });

            this.dateBy = 'settlement';
        }

        return false;

    }

    handleOrderConfirmation() {

        const subPortfolioName = this.address.value[0]['text'];
        const amount = this._moneyValuePipe.parse(this.amount.value);
        const quantity = this._moneyValuePipe.parse(this.quantity.value);
        const amountStr = this._moneyValuePipe.transform(amount, 4);
        const quantityStr = this._moneyValuePipe.transform(quantity, Number(this.shareData.maximumNumDecimal));

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
                        <td>${quantityStr}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Amount:</b></td>
                        <td>${amountStr}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Settlement Date:</b></td>
                        <td>${this.settlementDate.value}</td>
                    </tr>
                </tbody>
            </table>
            `,
            {confirmText: 'Confirm', declineText: 'Cancel', btnClass: 'primary'}
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.handleSubmit();
            }
        });
    }

    getKiidFileHash(): string {
        return this.shareData.kiid;
    }

    unSubscribeForChange(): void {
        if (this.inputSubscription) {
            this.inputSubscription.unsubscribe();
        }
    }


    findPortFolioBalance(balances) {
        const breakDown = _.get(balances, ['breakdown'], []);

        for (const balance of breakDown) {
            const addressValue = _.get(this.address.value, ['0', 'id'], '');
            if (balance.addr === addressValue) {
                return balance.free;
            }
        }
        return 0;
    }

    getDate(dateString: string): string {
        return moment.utc(dateString, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
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
