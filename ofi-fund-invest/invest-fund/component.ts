// Vendor
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ElementRef
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Subscription, Subject } from 'rxjs';
import { distinctUntilChanged, take, takeUntil, throttleTime } from 'rxjs/operators';
import { NgRedux, select } from '@angular-redux/store';
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
import { InitialisationService, MyWalletsService, WalletNodeRequestService } from '@setl/core-req-services';
import { setRequestedWalletAddresses } from '@setl/core-store';
import { OfiOrdersService } from '../../ofi-req-services/ofi-orders/service';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import * as FundShareValue from '../../ofi-product/fund-share/fundShareValue';
import { CalendarHelper } from '../../ofi-product/fund-share/helper/calendar-helper';
import { OrderHelper, OrderRequest } from '../../ofi-product/fund-share/helper/order-helper';
import { OrderByType, OrderType } from '../../ofi-orders/order.model';
import { ToasterService, Toast } from 'angular2-toaster';
import { Router } from '@angular/router';
import { LogService } from '@setl/utils';
import { MultilingualService } from '@setl/multilingual';
import { MessagesService } from '@setl/core-messages';
import { SellBuyCalendar } from "../../ofi-product/fund-share/FundShareEnum";
import { Moment } from "moment";

@Component({
    selector: 'app-invest-fund',
    templateUrl: 'component.html',
    styleUrls: ['./component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})

export class InvestFundComponent implements OnInit, OnDestroy {
    @ViewChild('quantityInput') quantityInput: ElementRef;
    @ViewChild('subportfolio') subportfolio: ElementRef;

    static DateTimeFormat = 'YYYY-MM-DD HH:mm';
    static DateFormat = 'YYYY-MM-DD';

    @Input() shareId: number;
    // order type string: subscribe, redeem, sellbuy
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

    toastTimer;
    timerToast: Toast;
    unSubscribe: Subject<any> = new Subject();

    connectedWalletId: number;
    requestedWalletAddress: boolean;

    platformFee = 1;

    // s: subscription, r: redemption
    _actionBy: string;

    // cutoff, valuation, settlement
    _dateBy: string;

    // form config
    metadata: any;

    trueAmount: number;

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
    // net amount form control for subscription order.
    netAmountSub: FormControl;
    // new amount form control for redemption order.
    netAmountRedeem: FormControl;
    address: FormControl;
    disclaimer: FormControl;
    feeControl: FormControl;

    addressSelected: any;

    // store subscription of quantity and grossAmount.
    // they should never subscribe at the same time, so it is ok to just use one variable.
    inputSubscription: Subscription;

    addressList: Array<any>;

    subPortfolio;
    addressListObj;

    amountLimit: number = 15000000;

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

    redeemedAll: Boolean;

    /**
     * This function pads floats as string with zeros
     * @param value {float} the value to pad with zeros
     * @param size {int} the wanted decimal size
     */

    static padWithZeros(value: string, size: number): string {
        const isInt = value.split('.').length === 1;
        const len = !isInt && value.split('.')[1].length;
        if (len === size) {
            return value;
        }
        if (len < size) {
            let newValue = isInt ? value + '.' : value;

            while (newValue.split('.')[1].length < size) {
                newValue += '0';
            }
            return newValue;
        }

        const newValue = value.split('.');
        return `${newValue[0]}.${newValue[1].slice(0, size)}`;

    }

    get feePercentage(): number {
        return this._numberConverterService.toFrontEnd(this.orderHelper.feePercentage);
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
            redeem: 'r',
            sellbuy: 'sb',
        }[this.type];
    }

    get orderTypeNumber(): number {
         return {
             subscribe: 3,
             redeem: 4,
         }[this.type];
    }

    get orderTypeLabel(): string {
        return {
            subscribe: this._translate.getTranslationByString('Subscription'),
            redeem: this._translate.getTranslationByString('Redemption'),
            sellbuy: this._translate.getTranslationByString('Sell / Buy'),
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
                this._moneyValuePipe.parse(this.form.controls.quantity.value, 5)
            ),
            a: this._numberConverterService.toBlockchain(
                this._moneyValuePipe.parse(this.trueAmount, 2)
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
        return Boolean(redeeming > balance);
    }

    get amountTooBig() {
        let value = this.amount.value;
        let quantity = this._moneyValuePipe.parse(value, 4);

        if (isNaN(quantity)) {
            quantity = 0;
        }

        return quantity > this.amountLimit;
    }

    get feeFrontend(): {
        mifiidChargesOneOff: number;
        mifiidChargesOngoing: number;
        mifiidTransactionCosts: number;
        mifiidServicesCosts: number;
        mifiidIncidentalCosts: number;
    } {
        const mifiidChargesOneOff = this._numberConverterService.toFrontEnd(this.shareData.mifiidChargesOneOff);
        const mifiidChargesOngoing = this._numberConverterService.toFrontEnd(this.shareData.mifiidChargesOngoing);
        const mifiidTransactionCosts = this._numberConverterService.toFrontEnd(this.shareData.mifiidTransactionCosts);
        const mifiidServicesCosts = this._numberConverterService.toFrontEnd(this.shareData.mifiidServicesCosts);
        const mifiidIncidentalCosts = this._numberConverterService.toFrontEnd(this.shareData.mifiidIncidentalCosts);

        return {
            mifiidChargesOneOff,
            mifiidChargesOngoing,
            mifiidTransactionCosts,
            mifiidServicesCosts,
            mifiidIncidentalCosts,
        };
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
                public _translate: MultilingualService,
                private _ngRedux: NgRedux<any>,
                private _messagesService: MessagesService) {
    }

    ngOnDestroy() {
        if (this.toastTimer) {
            clearInterval(this.toastTimer);
        }

        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

    ngOnInit() {
        this.cutoffDate = new FormControl('', [Validators.required]);
        this.valuationDate = new FormControl('', [Validators.required]);
        this.settlementDate = new FormControl('', [Validators.required]);

        this.quantity = new FormControl(0, [Validators.required, numberValidator]);
        this.amount = new FormControl(0, [Validators.required, numberValidator]);
        this.feeAmount = new FormControl(0);
        this.netAmountSub = new FormControl(0, [Validators.required, numberValidator]);
        this.netAmountRedeem = new FormControl(0, [Validators.required, numberValidator]);
        this.address = new FormControl('', [Validators.required, emptyArrayValidator]);
        this.disclaimer = new FormControl('');

        this.feeControl = new FormControl('');

        // Subscription form
        this.form = new FormGroup({
            quantity: this.quantity,
            amount: this.amount,
            feeAmount: this.feeAmount,
            netAmountSub: this.netAmountSub,
            netAmountRedeem: this.netAmountRedeem,
            comment: new FormControl('', Validators.maxLength(100)),
            address: this.address,
            cutoffDate: this.cutoffDate,
            valuationDate: this.valuationDate,
            settlementDate: this.settlementDate,
            disclaimer: this.disclaimer,
            feeControl: this.feeControl,
        });

        // this.setInitialFormValue();

        this.metadata = {
            subscribe: {
                actionLabel: 'subscribe',
                feeLabel: this._translate.getTranslationByString('Entry fee'),

            },
            redeem: {
                actionLabel: 'redeem',
                feeLabel: this._translate.getTranslationByString('Exit fee'),
            },
            sellbuy: {
                actionLabel: 'sellbuy',
                feeLabel: this._translate.getTranslationByString('Entry / Exit fee'),
            },
        }[this.type];

        this.actionBy = 'q';

        // List of observable subscription.
        this.shareDataOb
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((shareData) => {
            this.shareData = immutableHelper.get(shareData, String(this.shareId), {});
            this.calenderHelper = new CalendarHelper(this.shareData);

            this.orderHelper = new OrderHelper(this.shareData, this.buildFakeOrderRequestToBackend());

            this.updateDateInputs();

            if (!!this.shareData.keyFactOptionalData.sri) this.shareData.keyFactOptionalData.sri = this.shareData.keyFactOptionalData.sri[0].text;
            if (!!this.shareData.keyFactOptionalData.srri) this.shareData.keyFactOptionalData.srri = this.shareData.keyFactOptionalData.srri[0].text;
        });

        this.connectedWalletOb
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe(connected => {
            this.connectedWalletId = connected;
        });

        this.addressListOb
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe(addressList => this.updateAddressList(addressList));

        this.requestedAddressListOb
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe(requested => this.requestAddressList(requested));

        this.requestedLabelListOb
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe(requested => this.requestWalletLabel(requested));

        this.cutoffDate.valueChanges
        .pipe(
            takeUntil(this.unSubscribe),
            distinctUntilChanged(),
            throttleTime(1000),
        )
        .subscribe((v) => {
            if (this.toastTimer) {
                clearInterval(this.toastTimer);
            }
            if (this.timerToast) {
                this._toaster.clear(this.timerToast.toastId);
                this.timerToast = null;
            }
            if (!v) {
                return;
            }

            const cutOffValue = new Date(
                this.calenderHelper
                    .getCutoffTimeForSpecificDate(moment(v), this.getCalendarHelperOrderNumber())
                    .format('YYYY-MM-DD HH:mm'),
            );

            const now = new Date();

            const remainingTime = cutOffValue.getTime() - now.getTime();
            this.updateToastTimer(remainingTime);
            this.toastTimer = this.setToastTimer();
        });
    }

    updateToastTimer(unixtime: number) {
        if (this.timerToast) {
            this._toaster.clear(this.timerToast.toastId);
            this.timerToast = null;
        }
        this.timerToast = this._toaster.pop(
            'warning',
            `Time left before the next cut-off: ${this.getFormattedUnixTime(unixtime)}`,
        );
    }

    setToastTimer() {
        return setInterval(() => {
            const cutOffValue = new Date(
                this.calenderHelper
                    .getCutoffTimeForSpecificDate(moment(this.cutoffDate.value), this.getCalendarHelperOrderNumber())
                    .format('YYYY-MM-DD HH:mm'),
            );

            const now = new Date();

            const remainingTime = cutOffValue.getTime() - now.getTime();
            if (remainingTime > 0) {
                this.updateToastTimer(remainingTime);
            } else {
                if (this.timerToast) {
                    this._toaster.clear(this.timerToast.toastId);
                    this.timerToast = null;
                }
                this.showAlertCutOffError();
                clearInterval(this.toastTimer);
            }
        }, 1000);
    }

    getFormattedUnixTime(value: number): string {
        const days = Math.trunc(value / (24 * 60 * 60 * 1000));
        const hours = Math.trunc((value - (days * 24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.trunc(
            (value - (((days * 24) + hours) * 60 * 60 * 1000)) / (1000 * 60),
        );
        const seconds = Math.trunc(
            (value - (((((days * 24) + hours) * 60) + minutes) * 60 * 1000)) / 1000,
        );
        return `${this.padInt(hours)}:${this.padInt(minutes)}:${this.padInt(seconds)}`;
    }

    padInt(value: number, length: number = 2): string {
        let s = value.toString();
        if (value < 0 || length < s.length) {
            return value.toString();
        }
        while (s.length < length) {
            s = '0' + s;
        }
        return s;
    }

    setInitialFormValue() {
        if (!_.isEmpty(this.initialFormData)) {
            this.form.patchValue(this.initialFormData);
            this.addressSelected = this.initialFormData.address[0];
            this.actionBy = this.initialFormData.actionBy;
        }
    }

    redeemAll($event) {
        $event.preventDefault();

        if (!this.addressSelected) {
            this.redeemedAll = true;
            this.subportfolio.nativeElement.scrollIntoView();
            this.form.get('address').markAsDirty();
            this.form.get('address').markAsTouched();
            return false;
        }

        let quantity = this._numberConverterService.toFrontEnd(this.subPortfolioBalance);

        this.quantityInput.nativeElement.focus();
        this.form.get('quantity').setValue(quantity);
        this.quantityInput.nativeElement.blur();
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
        const isValidCutOff = (new CalendarHelper(this.shareData)).isValidCutoffDateTime(thisDate, this.getCalendarHelperOrderNumber());
        return isValidCutOff || !this.doValidate;
    }

    isValuationDay(thisDate: moment): boolean {
        const isValidValuation = (new CalendarHelper(this.shareData)).isValidValuationDateTime(thisDate, this.getCalendarHelperOrderNumber());
        return isValidValuation || !this.doValidate;
    }

    isSettlementDay(thisDate: moment): boolean {
        const isValidSettlement = (new CalendarHelper(this.shareData)).isValidSettlementDateTime(thisDate, this.getCalendarHelperOrderNumber());
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
            ordertype: this.orderType, // ('s', 'r', 'sb')
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

        // show waiting pop up until create order response come back.
        this._alertsService.create('info', `
                <table class="table grid">
                    <tbody>
                        <tr>
                            <td class="text-center text-info">Creating order.<br />This may take a few moments.</td>
                        </tr>
                    </tbody>
                </table>
        `, { showCloseButton: false, overlayClickToClose: false });

        this._ofiOrdersService.addNewOrder(request).then((data) => {

            let orderSuccessMsg = '';

            if (this.type === 'sellbuy') {
               const orderSubId = _.get(data, ['1', 'Data', '0', 'linkedSubscriptionOrderId'], 0);
               const orderSubRef = commonHelper.pad(orderSubId, 8, '0');

               const orderRedeemId = _.get(data, ['1', 'Data', '0', 'linkedRedemptionOrderId'], 0);
               const orderRedemRef = commonHelper.pad(orderRedeemId, 8, '0');

               orderSuccessMsg = `Your order ${orderRedemRef} & ${orderSubRef} has been successfully placed and is now initiated.`;

               if (this.amountTooBig) {
                   this.sendMessageToAM({
                       walletID: this.shareData.amDefaultWalletId,
                       orderTypeLabel: this.orderTypeLabel,
                       orderID: orderSubId,
                       orderRef: orderSubRef,
                   });

                   this.sendMessageToAM({
                       walletID: this.shareData.amDefaultWalletId,
                       orderTypeLabel: this.orderTypeLabel,
                       orderID: orderRedeemId,
                       orderRef: orderRedemRef,
                   });
               }
            } else {
               const orderId = _.get(data, ['1', 'Data', '0', 'orderID'], 0);
               const orderRef = commonHelper.pad(orderId, 8, '0');

               orderSuccessMsg = `Your order ${orderRef} has been successfully placed and is now initiated.`;

               if (this.amountTooBig) {
                   this.sendMessageToAM({
                       walletID: this.shareData.amDefaultWalletId,
                       orderTypeLabel: this.orderTypeLabel,
                       orderID: orderId,
                       orderRef,
                   });
               }
            }

            this._toaster.pop('success', orderSuccessMsg);
            this.handleClose();

            this._router.navigateByUrl('/order-book/my-orders/list');
        }).catch((data) => {
            const errorMessage = _.get(data, ['1', 'Data', '0', 'Message'], '');
            this._toaster.pop('warning', errorMessage);

            this._alertsService.close();
        });

    }

    //this.shareData.walletId

    sendMessageToAM(params) {
        const amWalletID = params.walletID;
        const subject = `Warning - Soft Limit amount exceeded on ${params.orderTypeLabel} order ${params.orderRef}`;
        const body = `<p>Hello,<br /><br />
Please be aware that the ${params.orderTypeLabel} order ${params.orderRef} has exceeded the limit of 15 million.<br />
<a href="/#/manage-orders/list?orderID=${params.orderID}" class="btn btn-secondary">Go to this order</a><br /><br />
The IZNES Team.</p>`;

        this._messagesService.sendMessage([amWalletID], subject, body, null);
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

                /**
                 * amount = unit * nav
                 * Warning: Before changing this logic check with team lead
                 */
                const val = Number(value.toString().replace(/\s+/g, ''));

                const amount = math.format(math.chain(val).multiply(this.nav).done(), 14);
                const amountStr = this._moneyValuePipe.transform(amount, 2);
                beTriggered.patchValue(amountStr, { onlySelf: true, emitEvent: false });

                this.calcFeeNetAmount();

                this.actionBy = 'q';
            },
            'amount': (value) => {

                /**
                 * quantity = amount / nav
                 * Warning: Before changing this logic check with team lead
                 */
                const newValue = this._moneyValuePipe.parse(value, 2);

                this.trueAmount = newValue;

                const quantity = math.format(math.chain(newValue).divide(this.nav).done(), 14) // {notation: 'fixed', precision: this.shareData.maximumNumDecimal}
                const newQuantity = this.roundDown(quantity, this.shareData.maximumNumDecimal).toString();
                const newQuantityStr = this._moneyValuePipe.transform(newQuantity, this.shareData.maximumNumDecimal);
                beTriggered.patchValue(newQuantityStr, { onlySelf: true, emitEvent: false });

                this.calcFeeNetAmount();

                this.actionBy = 'a';
            }
        }[type];

        this.inputSubscription = triggering.valueChanges.pipe(distinctUntilChanged()).subscribe(callBack);
    }

    /**
     * Calculations the Fee Amount and Net Amount
     * Based on Quantity
     */
    calcFeeNetAmount() {

        // get amount
        const quantityParsed = this._moneyValuePipe.parse(this.quantity.value, 5);

        // we have two scenario to handle in there.
        // 1. if we working on known nav, as we always round the the amount down according to the quantity.
        // we use the quantity to work out the amount.
        // 2. if we working on unknown nav, as the nav is not known, we want to keep the amount as it is.
        let amount = 0;

        if (this.isKnownNav()) {
            amount = math.format(math.chain(quantityParsed).multiply(this.nav).done(), 14);
        } else {
            amount = this._moneyValuePipe.parse(this.amount.value, 2);
        }

        // calculate fee
        const fee = calFee(amount, this.feePercentage);
        const feeStr = this._moneyValuePipe.transform(fee.toString(), 2).toString();
        this.feeAmount.setValue(feeStr);

        // net amount for subscription order
        const netAmountSub = calNetAmount(amount, fee, 's');
        const netAmountSubStr = this._moneyValuePipe.transform(netAmountSub.toString(), 2).toString();
        this.netAmountSub.setValue(netAmountSubStr);

        // net amount for redemption order
        const netAmountRedeem = calNetAmount(amount, fee, 'r');
        const netAmountRedeemStr = this._moneyValuePipe.transform(netAmountRedeem.toString(), 2).toString();
        this.netAmountRedeem.setValue(netAmountRedeemStr);

    }

    /**
     * Round Amount on Blur of Amount Field
     * Updating it to be Round Down eg 0.15151 becomes 0.151
     */
    roundAmount() {
        if (this.isKnownNav()) {
            const quantityParsed = this._moneyValuePipe.parse(this.quantity.value, 5);
            const amount = math.format(math.chain(quantityParsed).multiply(this.nav).done(), 14);
            const amountStr = this._moneyValuePipe.transform(amount.toString(), 2).toString();
            this.amount.patchValue(amountStr, { onlySelf: true, emitEvent: false });

            this.unSubscribeForChange();

            this.calcFeeNetAmount();
        }
    }

    /**
     * Round Down Numbers
     * eg 0.15151 becomes 0.151
     * eg 0.15250 becomes 0.152
     *
     * @param number
     * @param decimals
     * @returns {number}
     */
    roundDown(number: any, decimals: any) {
        decimals = decimals || 0;
        return math.format((Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals)), 14);
    }


    isValidOrderValue() {
        // if the order type is sell buy we dont care the minimum order value.
        if (this.type === 'sellbuy') {
            return true;
        }

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

        // if select the same date again. That mean, no changes in $event. momentDateValue is undefined.
        if (typeof momentDateValue === 'undefined') {
            return true;
        }

        const cutoffHour = moment(this.cutoffTime, 'HH:mm').format('HH:mm');

        if (type === 'cutoff') {

            const cutoffDateStr = this.getCutoffTimeForSpecificDate(momentDateValue)
            .format('YYYY-MM-DD HH:mm');

            const mValuationDate = this.getValuationDateFromCutoff(momentDateValue);
            const valuationDateStr = mValuationDate.clone().format('YYYY-MM-DD');

            const mSettlementDate = this.getSettlementDateFromCutoff(momentDateValue);
            const settlementDateStr = mSettlementDate.format('YYYY-MM-DD');


            triggering.setValue(cutoffDateStr);
            beTriggered[0].setValue(valuationDateStr);
            beTriggered[1].setValue(settlementDateStr);

            this.dateBy = 'cutoff';
        } else if (type === 'valuation') {

            const mCutoffDate = this.getCutoffDateFromValuation(momentDateValue);
            const cutoffDateStr = this.getCutoffTimeForSpecificDate(mCutoffDate)
            .format('YYYY-MM-DD HH:mm');


            const mSettlementDate = this.getSettlementDateFromCutoff(mCutoffDate);
            const settlementDateStr = mSettlementDate.format('YYYY-MM-DD');

            beTriggered[0].setValue(cutoffDateStr);
            beTriggered[1].setValue(settlementDateStr);

            this.dateBy = 'valuation';
        } else if (type === 'settlement') {
            const mCutoffDate = this.getCutoffDateFromSettlement(momentDateValue);
            const cutoffDateStr = this.getCutoffTimeForSpecificDate(mCutoffDate)
            .format('YYYY-MM-DD HH:mm');

            const mValuationDate = this.getValuationDateFromCutoff(mCutoffDate);
            const valuationStr = mValuationDate.format('YYYY-MM-DD');

            beTriggered[0].setValue(cutoffDateStr);
            beTriggered[1].setValue(valuationStr);

            this.dateBy = 'settlement';
        }

        // as when we subscribe by amount, the logic of working out the quantity by the amount is depended on whether the
        // nav is known nav. so when we change the date. we need to clear the input of quantity and amount, and get user to
        // enter it again.
        if (this.actionBy === 'a') {
            // clear amount
            this.amount.patchValue(0);
            this.amount.markAsUntouched();

            // clear quantity
            this.quantity.patchValue(0);
            this.quantity.markAsUntouched();
        }

        return false;

    }

    handleOrderConfirmation() {

        if (this.doValidate && this.handleCutOffDateError()) {
            return;
        }

        const subPortfolioName = this.address.value[0]['text'];
        const amount = this._moneyValuePipe.parse(this.amount.value, 4);
        const quantity = this._moneyValuePipe.parse(this.quantity.value, this.shareData.maximumNumDecimal);
        const amountStr = this._moneyValuePipe.transform(amount, 4);
        const quantityStr = this._moneyValuePipe.transform(quantity, Number(this.shareData.maximumNumDecimal));
        const amountMessage = this.amountTooBig ? '<p class="mb-1"><span class="text-danger blink_me">Order amount above 15 million</span></p>' : '';

        let conditionalMessage;
        if (this.type === 'redeem') {
            const quantityBlockchain = this._numberConverterService.toBlockchain(quantity);
            conditionalMessage = (quantityBlockchain === this.subPortfolioBalance) ? '<p class="mb-1"><span class="text-danger blink_me">All your position for this portfolio will be redeemed</span></p>' : '';
        }

        let orderValueHtml = '';

        if (this.type === 'sellbuy') {
           orderValueHtml = `
                    <tr>
                        <td class="left"><b>Redemption Quantity:</b></td>
                        <td>${quantityStr}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Subscription Quantity:</b></td>
                        <td>${quantityStr}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Redemption Amount:</b></td>
                        <td>${amountStr}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Subscription Amount:</b></td>
                        <td>${amountStr}</td>
                    </tr>

           `;
        } else {
            orderValueHtml = `
                    <tr>
                        <td class="left"><b>Quantity:</b></td>
                        <td>${quantityStr}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Amount:</b></td>
                        <td>${amountStr}</td>
                    </tr>

           `;
        }

        let message = `
            <p class="mb-1"><span class="text-warning">Please check information about your order before confirm it:</span></p>
            ${conditionalMessage ? conditionalMessage : ''}
            ${amountMessage}
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="left"><b>Order Type:</b></td>
                        <td>${this.orderTypeLabel}</td>
                    </tr>
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
                    ${orderValueHtml}
                    <tr>
                        <td class="left"><b>NAV Date:</b></td>
                        <td>${this.valuationDate.value}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Settlement Date:</b></td>
                        <td>${this.settlementDate.value}</td>
                    </tr>
                </tbody>
            </table>
            `;

        this._confirmationService.create(
            '<span>Order confirmation</span>',
            message,
            { confirmText: 'Confirm', declineText: 'Cancel', btnClass: 'primary' }
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

    resetForm(form) {
        const resetList = [
            { field: 'address', value: null },
            { field: 'cutoffDate', value: null },
            { field: 'valuationDate', value: null },
            { field: 'settlementDate', value: null },
            { field: 'quantity', value: 0 },
            { field: 'amount', value: 0 },
            { field: 'comment', value: null },
        ];
        Object.keys(form.controls).forEach((key) => {
            resetList.forEach((field) => {
                if (key === field.field) {
                    this.form.get(key).patchValue(field.value, { emitEvent: true });
                    this.form.get(key).markAsPristine();
                    this.form.get(key).markAsUntouched();
                }
            });
        });
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

    showAlertCutOffError() {
        if (this.doValidate) {
            this._alertsService
            .create('error', `
                    <table class="table grid">
                        <tbody>
                            <tr>
                                <td class="text-center text-danger">The Cut-off has been reached</td>
                            </tr>
                        </tbody>
                    </table>
                `)
            .pipe(
                take(1),
            )
            .subscribe(() => {
                this.disclaimer.setValue(false);
                this.cutoffDate.setErrors({ tooLate: true });
            });
        }
    }

    handleCutOffDateError(): Boolean {
        const cutOffValue = new Date(this.cutoffDate.value).getTime();
        const now = new Date().getTime();

        if (cutOffValue > now) {
            return false;
        }

        this.showAlertCutOffError();

        return true;
    }

    getDate(dateString: string): string {
        return moment.utc(dateString, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
    }

    /**
     * Get latest nav date with this format: YYYY-MM-DD
     * @return {string}
     */
    latestNavDateFormated(): string {
        return this.getDate(this.shareData.priceDate);
    }

    /**
     * Check the order we placing is known nav.
     * To be qualify as known nav:
     * - latest nav is same nav date of the order
     * - The nav is status is validated.
     */
    isKnownNav(): boolean {
        // get the current chosen nav date
        const orderNavDate = this.valuationDate.value;

        // get the latest nav's date
        const latestNavDate = this.latestNavDateFormated();

        // get the latest nav's status
        const latestNavStatus = this.shareData.priceStatus;

        // check if latest nav's status is  validated
        // check if latest nav's date is same as the order's
        if (Number(latestNavStatus) !== -1) {
            return false;
        }

        if (orderNavDate !== latestNavDate) {
            return false;
        }

        return true;
    }

    /**
     * Get Order type title rendered in the order form.
     * @return {string}
     */
    getOrderTypeTitle(): string {
       return {
           subscribe: this._translate.getTranslationByString('Subscription'),
           redeem: this._translate.getTranslationByString('Redemption'),
           sellbuy: this._translate.getTranslationByString('Sell / Buy'),
       }[this.type];
    }

    /**
     * Get order page subtitle
     * @return {string}
     */
    getOrderTypeSubTitle(): string {
        return {
            subscribe: this._translate.getTranslationByString('Please fill up the following information to subscribe to this share'),
            redeem: this._translate.getTranslationByString('Please fill up the following information to redeem this share'),
            sellbuy: this._translate.getTranslationByString('Please fill up the following information to **simultaneously** redeem and subscribe to this share:'),
        }[this.type];
    }

    /**
     * In order to get the specific date when using Calendar helper, we need to get the order type number, either
     * 3(Subscription) or 4 (Redemption). So for sell buy order, we need to work out order type base on the sell buy
     * calendar.
     * @return {OrderType}
     */
    getCalendarHelperOrderNumber(): OrderType {
        let orderNumberType;

        // If this is a sell buy order, we pick the calender of subscription / redemption depends on the characteristics.
        if (this.orderType === 'sb') {
            const sellBuyCalendar = Number(this.shareData.sellBuyCalendar);
            if (sellBuyCalendar === SellBuyCalendar.RedemptionCalendar) {
                orderNumberType = OrderType.Redemption;
            }else {
                orderNumberType = OrderType.Subscription;
            }
        } else {
            orderNumberType = this.orderTypeNumber;
        }

        return orderNumberType;
    }

    /**
     * Get cutoff date time string for a specific date, depend or the order type.
     *
     * @param momentDateValue
     * @return {Moment}
     */
    getCutoffTimeForSpecificDate(momentDateValue): Moment {
        const orderNumberType = this.getCalendarHelperOrderNumber();

        return this.calenderHelper.getCutoffTimeForSpecificDate(momentDateValue, orderNumberType);
    }

    /**
     * Get valuation date time for a cutoff date, depend or the order type.
     *
     * @param momentDateValue
     * @return {Moment}
     */
    getValuationDateFromCutoff(momentDateValue): Moment {
        const orderNumberType = this.getCalendarHelperOrderNumber();

        return this.calenderHelper.getValuationDateFromCutoff(momentDateValue, orderNumberType);
    }

    /**
     * Get settlement date time string for a cutoff date, depend or the order type.
     *
     * @param momentDateValue
     * @return {Moment}
     */
    getSettlementDateFromCutoff(momentDateValue): Moment {
        const orderNumberType = this.getCalendarHelperOrderNumber();

        return this.calenderHelper.getSettlementDateFromCutoff(momentDateValue, orderNumberType);
    }

    /**
     * Get cutoff date time string for a valuation date, depend or the order type.
     *
     * @param momentDateValue
     * @return {Moment}
     */
    getCutoffDateFromValuation(momentDateValue): Moment {
        const orderNumberType = this.getCalendarHelperOrderNumber();

        return this.calenderHelper.getCutoffDateFromValuation(momentDateValue, orderNumberType);
    }

    /**
     * Get cutoff date time string for a settlement date, depend or the order type.
     *
     * @param momentDateValue
     * @return {Moment}
     */
    getCutoffDateFromSettlement(momentDateValue): Moment {
        const orderNumberType = this.getCalendarHelperOrderNumber();

        return this.calenderHelper.getCutoffDateFromSettlement(momentDateValue, orderNumberType);
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
        return { invalidNumber: true };
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
        return { required: true };
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
    return Number(math.format(math.chain(amount).multiply((feePercent)).done(), 14));
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
