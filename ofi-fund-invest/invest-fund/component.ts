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
    ElementRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Subscription, Subject, combineLatest } from 'rxjs';
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
    NumberConverterService,
    LogService,
} from '@setl/utils';
import {
    InitialisationService,
    MyWalletsService,
    WalletNodeRequestService,
    FileService,
    RemoteLoggerService,
} from '@setl/core-req-services';
import { setRequestedWalletAddresses } from '@setl/core-store';
import { OfiOrdersService } from '../../ofi-req-services/ofi-orders/service';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import * as FundShareValue from '../../ofi-product/fund-share/fundShareValue';
import { CalendarHelper } from '../../ofi-product/fund-share/helper/calendar-helper';
import { OrderHelper } from '../../ofi-product/fund-share/helper/order-helper';
import { OrderRequest, fundClassifications } from '../../ofi-product/fund-share/helper/models';
import { OrderByType, OrderType } from '../../ofi-orders/order.model';
import { ToasterService, Toast } from 'angular2-toaster';
import { Router } from '@angular/router';
import { MultilingualService } from '@setl/multilingual';
import { MessagesService } from '@setl/core-messages';
import { SellBuyCalendar } from '../../ofi-product/fund-share/FundShareEnum';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import { DomSanitizer } from '@angular/platform-browser';
import { FileDownloader } from '@setl/utils/services/file-downloader/service';
import { OfiNavService } from '../../ofi-req-services/ofi-product/nav/service';
import { validateKiid } from '../../ofi-store/ofi-fund-invest/ofi-fund-access-my';

interface DateChangeEvent {
    type: string;
    event: any;
}

interface ValuationNav {
    price: number;
    status: number;
    date: string;
}

@Component({
    selector: 'app-invest-fund',
    templateUrl: 'component.html',
    styleUrls: ['./component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [],
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

    fundClassificationId: number;
    fundClassifications: object;

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
        },
    };

    configDateValuation = {
        firstDayOfWeek: 'mo',
        format: InvestFundComponent.DateFormat,
        closeOnSelect: true,
        opens: 'right',
        locale: 'en',
        isDayDisabledCallback: (thisDate) => {
            return false;
        },
    };

    configDateSettlement = {
        firstDayOfWeek: 'mo',
        format: InvestFundComponent.DateFormat,
        closeOnSelect: true,
        opens: 'right',
        locale: 'en',
        isDayDisabledCallback: (thisDate) => {
            return false;
        },
    };

    // Dates
    cutoffDate: FormControl;
    valuationDate: FormControl;
    settlementDate: FormControl;

    // sadata
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
    comment: FormControl;
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
    subPortfolioRedemptionEncumberBalance: number;

    panels = {
        1: true,
        2: true,
        3: false,
        4: false,
        5: false,
        6: true,
    };

    orderHelper: OrderHelper;
    calenderHelper: CalendarHelper;

    redeemedAll: Boolean;

    kiidModal = {
        isOpen: false,
        url: null,
        filename: null,
    };

    orderDatesChange$ = new Subject<DateChangeEvent>();

    valuationNav: ValuationNav;

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
        return this.numberConverterService.toFrontEnd(this.orderHelper.feePercentage);
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
            subscribe: this.translate.getTranslationByString('Subscription'),
            redeem: this.translate.getTranslationByString('Redemption'),
            sellbuy: this.translate.getTranslationByString('Sell / Buy'),
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
            q: OrderByType.Quantity,
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
            settlement: this.settlementDate.value + ' 00:00',
        }[this.dateBy];
    }

    get orderValue() {
        return {
            q: this.numberConverterService.toBlockchain(
                this.moneyValuePipe.parse(this.form.controls.quantity.value, 5),
            ),
            a: this.numberConverterService.toBlockchain(
                this.moneyValuePipe.parse(this.trueAmount || this.form.controls.amount.value, 2),
            ),
        }[this.actionBy];
    }

    get nav() {
        if (this.valuationNav) {
            return this.numberConverterService.toFrontEnd(this.valuationNav.price);
        } else {
            return this.numberConverterService.toFrontEnd(this.shareData.price);
        }
    }

    get navData() {
        if (this.valuationNav) {
            return this.valuationNav;
        } else {
            return {
                price: this.shareData.price,
                date: this.shareData.priceDate,
                status: this.shareData.priceStatus,
            };
        }
    }

    get navStr() {
        return this.moneyValuePipe.transform(this.nav, 4);
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
        }

        let isValid = this.orderHelper.checkOrderByIsAllow('a').orderValid;
        if (this.allowAmountAndQuantity) {
            isValid = isValid && (this.actionBy === 'a');
        }

        return isValid ? null : '';
    }

    get allowQuantity(): any {
        if (typeof this.orderHelper === 'undefined') {
            return '';
        }

        let isValid = this.orderHelper.checkOrderByIsAllow('q').orderValid;

        if (this.allowAmountAndQuantity) {
            isValid = isValid && (this.actionBy === 'q');
        }
        return isValid ? null : '';
    }

    get allowAmountAndQuantity(): any {
        if (typeof this.orderHelper === 'undefined') {
            return false;
        }

        const isAllowedAmount = this.orderHelper.checkOrderByIsAllow('a').orderValid;
        const isAllowedQuantity = this.orderHelper.checkOrderByIsAllow('q').orderValid;
        return isAllowedAmount && isAllowedQuantity;
    }

    get shareAsset(): string {
        return this.shareData.isin + '|' + this.shareData.fundShareName;
    }

    /**
     * Get free balance
     *
     * @return {number}
     */
    get subPortfolioBalance(): number {
        const shareBalanceBreakDown = _.get(this.walletBalance, [this.shareAsset]);
        return this.findPortFolioBalance(shareBalanceBreakDown);
    }

    /**
     * Get encumber balance
     *
     * @return {number}
     */
    get subPortfolioEncumberedBalance(): number {
        const shareBalanceBreakDown = _.get(this.walletBalance, [this.shareAsset]);
        return this.findPortFolioBalance(shareBalanceBreakDown, 'encumbrance');
    }

    /**
     * Get total balance
     *
     * @return {number}
     */
    get subPortfolioTotalBalance(): number {
        const shareBalanceBreakDown = _.get(this.walletBalance, [this.shareAsset]);
        return this.findPortFolioBalance(shareBalanceBreakDown, 'balance');
    }

    /**
     * Get total redemption encumbered balance
     *
     * @return {number}
     */
    get subPortfolioRedemptionEncumBalance(): number {
        return this.subPortfolioRedemptionEncumberBalance;
    }

    get isRedeemTooMuch(): boolean {
        if (this.orderType === 's') {
            return false;
        }

        const toNumber = this.moneyValuePipe.parse(this.quantity.value, 4);
        const redeeming = this.numberConverterService.toBlockchain(toNumber);
        const balance = this.subPortfolioBalance;
        return Boolean(redeeming > balance);
    }

    get amountTooBig() {
        const value = this.amount.value;
        let quantity = this.moneyValuePipe.parse(value, 4);

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
        classificationFee: number;
    } {
        const mifiidChargesOneOff = this.numberConverterService.toFrontEnd(this.shareData.mifiidChargesOneOff);
        const mifiidChargesOngoing = this.numberConverterService.toFrontEnd(this.shareData.mifiidChargesOngoing);
        const mifiidTransactionCosts = this.numberConverterService.toFrontEnd(this.shareData.mifiidTransactionCosts);
        const mifiidServicesCosts = this.numberConverterService.toFrontEnd(this.shareData.mifiidServicesCosts);
        const mifiidIncidentalCosts = this.numberConverterService.toFrontEnd(this.shareData.mifiidIncidentalCosts);
        const classificationFee = this.fundClassifications[this.fundClassificationId].fee;

        return {
            mifiidChargesOneOff,
            mifiidChargesOngoing,
            mifiidTransactionCosts,
            mifiidServicesCosts,
            mifiidIncidentalCosts,
            classificationFee,
        };
    }

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        public moneyValuePipe: MoneyValuePipe,
        private myWalletService: MyWalletsService,
        private walletNodeRequestService: WalletNodeRequestService,
        private numberConverterService: NumberConverterService,
        private ofiOrdersService: OfiOrdersService,
        private alertsService: AlertsService,
        private confirmationService: ConfirmationService,
        private toaster: ToasterService,
        private router: Router,
        private logService: LogService,
        public translate: MultilingualService,
        private ngRedux: NgRedux<any>,
        private messagesService: MessagesService,
        public sanitizer: DomSanitizer,
        private fileDownloader: FileDownloader,
        private fileService: FileService,
        private shareService: OfiFundShareService,
        private ofiNavService: OfiNavService,
        private remoteLoggerService: RemoteLoggerService,
    ) {
        this.fundClassifications = fundClassifications;
    }

    ngOnDestroy() {
        if (this.toastTimer) {
            clearInterval(this.toastTimer);
        }
        this.kiidModal.isOpen = false;

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
        this.comment = new FormControl('', Validators.maxLength(100));
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
            comment: this.comment,
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
                feeLabel: this.translate.getTranslationByString('Entry Fee'),
            },
            redeem: {
                actionLabel: 'redeem',
                feeLabel: this.translate.getTranslationByString('Exit Fee'),
            },
            sellbuy: {
                actionLabel: 'sellbuy',
                feeLabel: this.translate.getTranslationByString('Entry / Exit Fee'),
            },
        }[this.type];

        // List of observable subscription.
        this.shareDataOb
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((shareData) => {
                if (_.isEmpty(shareData[this.shareId])) {
                    this.changeDetectorRef.detach();
                    this.toaster.pop('error', this.translate.translate('Wallet has no permisson on this share'));
                    this.handleClose();
                    return;
                }

                this.shareData = immutableHelper.get(shareData, String(this.shareId), {});

                // Fallback to `Other` classification when Fund classification is not set
                this.fundClassificationId = this.shareData.classification || 6;

                this.calenderHelper = new CalendarHelper(this.shareData);

                this.orderHelper = new OrderHelper(this.shareData, this.buildFakeOrderRequestToBackend());

                this.actionBy = _.isNull(this.allowAmount) ? 'a' : 'q';

                if (!!this.shareData.keyFactOptionalData.sri) this.shareData.keyFactOptionalData.sri = this.shareData.keyFactOptionalData.sri[0].text;
                if (!!this.shareData.keyFactOptionalData.srri) this.shareData.keyFactOptionalData.srri = this.shareData.keyFactOptionalData.srri[0].text;

                this.updateDateInputs();
            });

        this.connectedWalletOb
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((connected) => {
                this.connectedWalletId = connected;
            });

        combineLatest(
            this.shareDataOb,
            this.connectedWalletOb,
        )
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.unSubscribe),
            )
            .subscribe(([shareData, connectedWallet]) => {
                if (!shareData || !connectedWallet) {
                    return;
                }
                if (!this.shareData.hasValidatedKiid) {
                    this.validateKiid();
                }
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
                    this.toaster.clear(this.timerToast.toastId);
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

        this.orderDatesChange$.pipe(
            takeUntil(this.unSubscribe),
            distinctUntilChanged(),
            throttleTime(1000),
        ).subscribe(this.subscribeForChangeDate.bind(this));

    }

    getEncumbrance(): Promise<null> {
        const subportfolio = _.get(this.address, ['value', '0', 'id'], '');
        return new Promise((resolve, reject) => {
            this.walletNodeRequestService.fetchEncumbranceDetails(
                this.shareData.isin,
                this.shareData.fundShareName,
                this.connectedWalletId,
                subportfolio,
            )
                .then((res) => {

                    this.subPortfolioRedemptionEncumberBalance = OrderHelper.getInvestorRedemptionTotalEcumbrance(
                        res,
                        subportfolio,
                        this.shareData.isin,
                        this.shareData.fundShareName,
                    );
                    resolve();
                });
        });
    }

    updateToastTimer(unixtime: number) {
        if (this.timerToast) {
            this.toaster.clear(this.timerToast.toastId);
            this.timerToast = null;
        }
        this.timerToast = this.toaster.pop(
            'warning',
            this.translate.translate(
                'Time left before the next cut-off: @time@',
                { 'time': this.getFormattedUnixTime(unixtime) },
            ),
        );
    }

    setToastTimer() {
        return setInterval(
            () => {
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
                        this.toaster.clear(this.timerToast.toastId);
                        this.timerToast = null;
                    }
                    this.showAlertCutOffError();
                    clearInterval(this.toastTimer);
                }
            },
            1000,
        );
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

        const quantity = this.numberConverterService.toFrontEnd(this.subPortfolioBalance);

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

        this.changeDetectorRef.detectChanges();
    }

    isCutoffDay(thisDate: moment.Moment): boolean {
        const isValidCutOff = (new CalendarHelper(this.shareData)).isValidCutoffDateTime(thisDate, this.getCalendarHelperOrderNumber());
        return isValidCutOff || !this.doValidate;
    }

    isValuationDay(thisDate: moment.Moment): boolean {
        const isValidValuation = (new CalendarHelper(this.shareData)).isValidValuationDateTime(thisDate, this.getCalendarHelperOrderNumber());
        return isValidValuation || !this.doValidate;
    }

    isSettlementDay(thisDate: moment.Moment): boolean {
        const isValidSettlement = (new CalendarHelper(this.shareData)).isValidSettlementDateTime(thisDate, this.getCalendarHelperOrderNumber());
        return isValidSettlement || !this.doValidate;
    }

    updateAddressList(addressList) {
        this.addressListObj = addressList;
        this.addressList = immutableHelper.reduce(
            addressList,
            (result, item) => {
                const addr = item.get('addr', false);
                const label = item.get('label', false);

                if (addr && label) {
                    const addressItem = {
                        id: item.get('addr', ''),
                        text: item.get('label', ''),
                    };

                    result.push(addressItem);
                }

                return result;
            },
            [],
        );

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
                    emitViewToModelChange: true,
                });
            }
        }

        this.changeDetectorRef.markForCheck();
    }

    requestAddressList(requestedState) {
        this.requestedWalletAddress = requestedState;
        this.logService.log('requested wallet address', this.requestedWalletAddress);

        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            // Request the list.
            InitialisationService.requestWalletAddresses(this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletLabel(requestedState) {
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {

            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
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
            comment: this.form.controls.comment.value,
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
            comment: '',
        };
    }

    /**
     * Handle if we redeem over 80%, it handle the two scenarios: has existing redemption and has no existing redemption.
     * if everything is of we return true, other return false.
     */
    handleIsRedeemOver80Percent(): boolean {
        // check if this is a redemption order or if it is a sell buy order
        if ((this.type === 'sellbuy' || this.type === 'redeem') && (this.actionBy === 'a')) {
            const checkResponse = OrderHelper.isRedeemOver80Percent(
                this.orderValue,
                this.subPortfolioTotalBalance,
                this.subPortfolioEncumberedBalance,
                this.subPortfolioRedemptionEncumBalance,
                this.numberConverterService.toBlockchain(this.nav),
            );

            if (!OrderHelper.isResponseGood(checkResponse)) {
                // redeem over 80%

                // we check if this is the first order or not
                if (OrderHelper.isOnlyActiveRedeem(this.subPortfolioRedemptionEncumBalance)) {
                    // show have no active redemption error
                    this.show80PercentNoActiveOrderError();

                } else {
                    // show have active redemption error.
                    this.show80PercentHasActiveOrderError();
                }

                return false;
            }

            return true;
        }

        return true;
    }

    handleSubmit() {
        const request = this.buildOrderRequest();

        this.logService.log('place an order', request);

        if (this.isRedeemTooMuch) {
            return false;
        }

        this.getEncumbrance()
            .then(() => {

                if (!this.handleIsRedeemOver80Percent()) {
                    return false;
                }

                // show waiting pop up until create order response come back.
                this.alertsService.create(
                    'info', `
                        <table class="table grid">
                            <tbody>
                                <tr>
                                    <td class="text-center text-info">${this.translate.translate('Creating order')}.<br />${this.translate.translate('This may take a few moments.')}</td>
                                </tr>
                            </tbody>
                        </table>
                    `,
                    { showCloseButton: false, overlayClickToClose: false },
                );

                this.ofiOrdersService.addNewOrder(request).then((data) => {
                    // log to remote server about order is placed
                    this.logService.log('info', 'an order has been placed');

                    let orderSuccessMsg = '';

                    if (this.type === 'sellbuy') {
                        const orderSubId = _.get(data, ['1', 'Data', '0', 'linkedSubscriptionOrderId'], 0);
                        const orderSubRef = commonHelper.pad(orderSubId, 8, '0');

                        const orderRedeemId = _.get(data, ['1', 'Data', '0', 'linkedRedemptionOrderId'], 0);
                        const orderRedemRef = commonHelper.pad(orderRedeemId, 8, '0');

                        orderSuccessMsg = this.translate.translate(
                            'Your order @orderRedemRef@ & @orderSubRef@ have been successfully placed and are now initiated.',
                            { 'orderRedemRef': orderRedemRef, 'orderSubRef': orderSubRef },
                        );

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

                        orderSuccessMsg = this.translate.translate(
                            'Your order @orderRef@ has been successfully placed and is now initiated.',
                            { 'orderRef': orderRef },
                        );

                        if (this.amountTooBig) {
                            this.sendMessageToAM({
                                walletID: this.shareData.amDefaultWalletId,
                                orderTypeLabel: this.orderTypeLabel,
                                orderID: orderId,
                                orderRef,
                            });
                        }
                    }

                    this.toaster.pop('success', orderSuccessMsg);
                    this.handleClose();

                    this.router.navigateByUrl('/order-book/my-orders/list');
                }).catch((data) => {
                    let errorMessage = _.get(data, ['1', 'Data', '0', 'Message'], 'Could not place order');
                    errorMessage = this.translate.translate(errorMessage);

                    this.toaster.pop('warning', errorMessage);

                    this.alertsService.close();
                });
            });
    }

    sendMessageToAM(params) {
        const amWalletID = params.walletID;

        const subjectStr = this.translate.translate(
            'Warning - Soft Limit amount exceeded on @orderTypeLabel@ order @orderRef@',
            { orderTypeLabel: params.orderTypeLabel, orderRef: params.orderRef },
        );

        const bodyStr = `
            <p>
            ${this.translate.translate('Hello')}
            <br /><br />
            ${this.translate.translate(
            'Please be aware that the @orderTypeLabel@ order @orderRef@ has exceeded the limit of 15 million.',
            { orderTypeLabel: params.orderTypeLabel, orderRef: params.orderRef },
        )}
            <br />%@link@%<br /><br />
            ${this.translate.translate('The IZNES Team')}
            </p>
        `;

        const action = {
            type: 'messageWithLink',
            data: {
                links: [
                    {
                        link: `/#/manage-orders/${params.orderID}`,
                        anchorCss: 'btn btn-secondary',
                        anchorText: this.translate.translate('View Order'),
                        permissionName: 'manageOrder',
                        permissionType: 'canRead',
                    },
                ],
            },
        };

        this.messagesService.sendMessage([amWalletID], subjectStr, bodyStr, action as any);
    }

    subscribeForChange(type: string): void {
        // define which one trigger which, depend on type.
        const triggering: FormControl = {
            quantity: this.quantity,
            amount: this.amount,
        }[type];

        const beTriggered: FormControl = {
            quantity: this.amount,
            amount: this.quantity,
        }[type];

        const callBack = {
            quantity: (value) => {
                /**
                 * amount = unit * nav
                 * Warning: Before changing this logic check with team lead
                 */
                const val = Number(value.toString().replace(/\s+/g, ''));

                const amount = math.format(math.chain(val).multiply(this.nav).done(), 14);
                const amountStr = this.moneyValuePipe.transform(amount, 2);
                beTriggered.patchValue(amountStr, { onlySelf: true, emitEvent: false });

                this.calcFeeNetAmount();
            },
            amount: (value) => {

                /**
                 * quantity = amount / nav
                 * Warning: Before changing this logic check with team lead
                 */
                const newValue = this.moneyValuePipe.parse(value, 2);

                this.trueAmount = newValue;

                const quantity = math.format(math.chain(newValue).divide(this.nav).done(), 14); // {notation: 'fixed', precision: this.shareData.maximumNumDecimal}
                const newQuantity = this.round(quantity, this.shareData.maximumNumDecimal).toString();
                const newQuantityStr = this.moneyValuePipe.transform(newQuantity, this.shareData.maximumNumDecimal);
                beTriggered.patchValue(newQuantityStr, { onlySelf: true, emitEvent: false });

                this.calcFeeNetAmount();
            },
        }[type];

        this.inputSubscription = triggering.valueChanges.pipe(distinctUntilChanged()).subscribe(callBack);
    }

    /**
     * Calculations the Fee Amount and Net Amount
     * Based on Quantity
     */
    calcFeeNetAmount() {
        // get amount
        const quantityParsed = this.moneyValuePipe.parse(this.quantity.value, 5);

        // we have two scenario to handle in there.
        // 1. if we working on known nav, as we always round the the amount according to the quantity.
        // we use the quantity to work out the amount.
        // 2. if we working on unknown nav, as the nav is not known, we want to keep the amount as it is.
        let amount = 0;

        if (this.isKnownNav()) {
            amount = math.format(math.chain(quantityParsed).multiply(this.nav).done(), 14);
        } else {
            amount = this.moneyValuePipe.parse(this.amount.value, 2);
        }

        // calculate fee
        const fee = calFee(amount, this.feePercentage);
        const feeStr = this.moneyValuePipe.transform(fee.toString(), 2).toString();
        this.feeAmount.setValue(feeStr);

        // net amount for subscription order
        const netAmountSub = calNetAmount(amount, fee, 's');
        const netAmountSubStr = this.moneyValuePipe.transform(netAmountSub.toString(), 2).toString();
        this.netAmountSub.setValue(netAmountSubStr);

        // net amount for redemption order
        const netAmountRedeem = calNetAmount(amount, fee, 'r');
        const netAmountRedeemStr = this.moneyValuePipe.transform(netAmountRedeem.toString(), 2).toString();
        this.netAmountRedeem.setValue(netAmountRedeemStr);
    }

    /**
     * Round Amount on Blur of Amount Field
     * Updating it to be Round Down eg 0.15151 becomes 0.151
     */
    roundAmount() {
        if (this.isKnownNav()) {
            const quantityParsed = this.moneyValuePipe.parse(this.quantity.value, 5);
            const amount = math.format(math.chain(quantityParsed).multiply(this.nav).done(), 14);
            const amountStr = this.moneyValuePipe.transform(amount.toString(), 2).toString();
            this.amount.patchValue(amountStr, { onlySelf: true, emitEvent: false });

            this.unSubscribeForChange();

            this.calcFeeNetAmount();
        }
    }

    /**
     * Round Numbers
     * eg 0.15151 becomes 0.152
     * eg 0.15250 becomes 0.153
     *
     * @param num
     * @param decimal
     * @returns {number}
     */
    round(num: number, decimal: number = 0) {
        return math.format(math.round(num, decimal), 14);
    }

    isValidOrderValue() {
        // if the order type is sell buy we dont care the minimum order value.
        if (this.type === 'sellbuy') {
            return true;
        }

        const minValue = OrderHelper.getSubsequentMinFig(this.shareData, this.orderTypeNumber, this.actionByNumber);

        return Boolean(minValue <= this.orderValue);
    }

    subscribeForChangeDate(e: DateChangeEvent): boolean {
        if (!this.doValidate) {
            this.dateBy = 'cutoff';
            return true;
        }

        // define which one trigger which, depend on type.
        const triggering: FormControl = {
            cutoff: this.cutoffDate,
            valuation: this.valuationDate,
            settlement: this.settlementDate,
        }[e.type];

        const beTriggered: FormControl = {
            cutoff: [this.valuationDate, this.settlementDate],
            valuation: [this.cutoffDate, this.settlementDate],
            settlement: [this.cutoffDate, this.valuationDate],
        }[e.type];

        const momentDateValue = e.event[0];

        // if select the same date again. That mean, no changes in $event. momentDateValue is undefined.
        if (typeof momentDateValue === 'undefined') {
            return true;
        }

        if (e.type === 'cutoff') {
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
        } else if (e.type === 'valuation') {
            const mCutoffDate = this.getCutoffDateFromValuation(momentDateValue);
            const cutoffDateStr = this.getCutoffTimeForSpecificDate(mCutoffDate)
                .format('YYYY-MM-DD HH:mm');

            const mSettlementDate = this.getSettlementDateFromCutoff(mCutoffDate);
            const settlementDateStr = mSettlementDate.format('YYYY-MM-DD');

            beTriggered[0].setValue(cutoffDateStr);
            beTriggered[1].setValue(settlementDateStr);

            this.dateBy = 'valuation';
        } else if (e.type === 'settlement') {
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

        this.updateNavForNavDate();

        return false;
    }

    handleOrderConfirmation() {
        if (this.doValidate && this.handleCutOffDateError()) {
            return;
        }

        const subPortfolioName = this.address.value[0]['text'];
        const amount = this.moneyValuePipe.parse(this.amount.value, 4);
        const quantity = this.moneyValuePipe.parse(this.quantity.value, this.shareData.maximumNumDecimal);
        const amountStr = this.moneyValuePipe.transform(amount, 2);
        const quantityStr = this.moneyValuePipe.transform(quantity, Number(this.shareData.maximumNumDecimal));
        const amountMessage = this.amountTooBig ? `<p class="mb-1"><span class="text-danger blink_me">${this.translate.translate('Order amount above 15 million')}</span></p>` : '';

        let conditionalMessage;
        if (this.type === 'redeem') {
            const quantityBlockchain = this.numberConverterService.toBlockchain(quantity);
            conditionalMessage = (quantityBlockchain === this.subPortfolioBalance)
            ? `<p class="mb-1"><span class="text-danger blink_me">${this.translate.translate('All your position for this portfolio will be redeemed')}</span></p>`
            : '';
        }

        let orderValueHtml = '';

        if (this.type === 'sellbuy') {
            orderValueHtml = `
                    <tr>
                        <td class="left"><b>${this.translate.translate('Redemption Quantity')}:</b></td>
                        <td>${quantityStr}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Subscription Quantity')}:</b></td>
                        <td>${quantityStr}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Redemption Amount')}:</b></td>
                        <td>${amountStr}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Subscription Amount')}:</b></td>
                        <td>${amountStr}</td>
                    </tr>
           `;
        } else {
            orderValueHtml = `
                    <tr>
                        <td class="left"><b>${this.translate.translate('Quantity')}:</b></td>
                        <td>${quantityStr}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Amount')}:</b></td>
                        <td>${amountStr}</td>
                    </tr>
           `;
        }

        const message = `
            <p class="mb-1"><span class="text-warning">${this.translate.translate('Please check information about your order before confirm it')}:</span></p>
            ${conditionalMessage ? conditionalMessage : ''}
            ${amountMessage}
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Order Type')}:</b></td>
                        <td>${this.orderTypeLabel}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Investment Sub-portfolio')}:</b></td>
                        <td>${subPortfolioName}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Share Name')}:</b></td>
                        <td>${this.shareData.fundShareName}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('ISIN')}:</b></td>
                        <td>${this.shareData.isin}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Currency')}:</b></td>
                        <td>${this.currency}</td>
                    </tr>
                    ${orderValueHtml}
                    <tr>
                        <td class="left"><b>${this.translate.translate('NAV Date')}:</b></td>
                        <td>${this.valuationDate.value}</td>
                    </tr>
                    <tr>
                        <td class="left"><b>${this.translate.translate('Settlement Date')}:</b></td>
                        <td>${this.settlementDate.value}</td>
                    </tr>
                </tbody>
            </table>
            `;

        this.confirmationService.create(
            `<span>${this.translate.translate('Order Confirmation')}</span>`,
            message,
            {
                confirmText: this.translate.translate('Confirm'),
                declineText: this.translate.translate('Cancel'),
                btnClass: 'primary',
            },
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

    findPortFolioBalance(balances, type: 'free' | 'balance' | 'encumbrance' = 'free') {
        const breakDown = _.get(balances, ['breakdown'], []);

        for (const balance of breakDown) {
            const addressValue = _.get(this.address.value, ['0', 'id'], '');
            if (balance.addr === addressValue) {
                return balance[type];
            }
        }
        return 0;
    }

    showAlertCutOffError() {
        if (this.doValidate) {
            this.alertsService
                .create('error', `
                    <table class="table grid">
                        <tbody>
                            <tr>
                                <td class="text-center text-danger">${this.translate.translate('The Cut-off has been reached')}</td>
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
        return this.getDate(this.navData.date);
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
        const latestNavStatus = this.navData.status;

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
     * @param isNoun {boolean}
     * @return {string}
     */
    getOrderTypeTitle(isNoun: boolean = true): string {
        if (isNoun) {
            return {
                subscribe: this.translate.getTranslationByString('Subscription'),
                redeem: this.translate.getTranslationByString('Redemption'),
                sellbuy: this.translate.getTranslationByString('Sell / Buy'),
            }[this.type];
        }

        return {
            subscribe: this.translate.getTranslationByString('Subscribe'),
            redeem: this.translate.getTranslationByString('Redeem'),
            sellbuy: this.translate.getTranslationByString('Sell / Buy'),
        }[this.type];

    }

    /**
     * Get order page subtitle
     * @return {string}
     */
    getOrderTypeSubTitle(): string {
        return {
            subscribe: this.translate.getTranslationByString('Please fill in the following information to subscribe to this share'),
            redeem: this.translate.getTranslationByString('Please fill in the following information to redeem this share'),
            sellbuy: this.translate.getTranslationByString('Please fill in the following information to **simultaneously** redeem and subscribe to this share:'),
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
            } else {
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
     * @return {moment.Moment}
     */
    getCutoffTimeForSpecificDate(momentDateValue): moment.Moment {
        const orderNumberType = this.getCalendarHelperOrderNumber();

        return this.calenderHelper.getCutoffTimeForSpecificDate(momentDateValue, orderNumberType);
    }

    /**
     * Get valuation date time for a cutoff date, depend or the order type.
     *
     * @param momentDateValue
     * @return {moment.Moment}
     */
    getValuationDateFromCutoff(momentDateValue): moment.Moment {
        const orderNumberType = this.getCalendarHelperOrderNumber();

        return this.calenderHelper.getValuationDateFromCutoff(momentDateValue, orderNumberType);
    }

    /**
     * Get settlement date time string for a cutoff date, depend or the order type.
     *
     * @param momentDateValue
     * @return {moment.Moment}
     */
    getSettlementDateFromCutoff(momentDateValue): moment.Moment {
        const orderNumberType = this.getCalendarHelperOrderNumber();

        return this.calenderHelper.getSettlementDateFromCutoff(momentDateValue, orderNumberType);
    }

    /**
     * Get cutoff date time string for a valuation date, depend or the order type.
     *
     * @param momentDateValue
     * @return {moment.Moment}
     */
    getCutoffDateFromValuation(momentDateValue): moment.Moment | false {
        const orderNumberType = this.getCalendarHelperOrderNumber();

        return this.calenderHelper.getCutoffDateFromValuation(momentDateValue, orderNumberType);
    }

    /**
     * Get cutoff date time string for a settlement date, depend or the order type.
     *
     * @param momentDateValue
     * @return {moment.Moment}
     */
    getCutoffDateFromSettlement(momentDateValue): moment.Moment {
        const orderNumberType = this.getCalendarHelperOrderNumber();

        return this.calenderHelper.getCutoffDateFromSettlement(momentDateValue, orderNumberType);
    }

    /**
     * Show alert error that redemption order over 80%, and no active order
     */
    show80PercentNoActiveOrderError() {
        this.alertsService
            .create(
                'error',
                `<table class="table grid">
                    <tbody>
                        <tr>
                            <td class="text-center text-danger">
                                ${this.translate.getTranslationByString('You may not place a redemption order for more than 80% of your positions.')}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-center text-danger">
                                ${this.translate.getTranslationByString('If you wish to redeem all your positions, you can redeem in quantity by clicking on the button "Redeem All".')}
                            </td>
                        </tr>
                    </tbody>
                </table>
                `,
                {},
                this.translate.getTranslationByString('Order above 80% of your position'),
            );
    }

    /**
     * Show alert error that redemption order over 80%, and there are active order(s)
     */
    show80PercentHasActiveOrderError() {
        this.alertsService
            .create(
                'error',
                `<table class="table grid">
                    <tbody>
                        <tr>
                            <td class="text-center text-danger">
                                ${this.translate.getTranslationByString(
                                    'You may not place this redemption order because on the basis of your already made redemption orders you will sell more than 80% of your positions.',
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-center text-danger">
                                ${this.translate.getTranslationByString(
                                    'If you wish to redeem more than 80% of your position, you can cancel previous redeem orders and place an order in quantity.',
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
                `,
                {},
                this.translate.getTranslationByString('Order above 80% of your position'),
            );
    }

    validateKiid() {
        this.fileService.validateFile(this.shareData.kiid).then((result) => {
            const data = result[1].Data;
            if (data.error) {
                this.alertsService.create('error', `
                    <table class="table grid">
                        <tbody>
                            <tr>
                                <td class="text-center text-error">${this.translate.translate('Unable to view file')}</td>
                            </tr>
                        </tbody>
                    </table>
                `);
                return;
            }

            this.fileDownloader.getDownLoaderUrl({
                method: 'retrieve',
                walletId: this.connectedWalletId,
                downloadId: data.downloadId,
            }).subscribe((res) => {

                const url = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);

                this.kiidModal = {
                    isOpen: true,
                    url,
                    filename: data.filename,
                };

                this.changeDetectorRef.markForCheck();
            });
        });
    }

    onValidateKiid() {
        this.shareService.validateKiid(this.connectedWalletId, this.shareData.fundShareID)
            .then(() => {
                this.kiidModal.isOpen = false;
                this.changeDetectorRef.markForCheck();
                this.ngRedux.dispatch(validateKiid(this.shareData.fundShareID));
            });
    }

    newOrderChangeUpdateEvent(type: string, event: any) {
        this.orderDatesChange$.next({
            type,
            event,
        });
    }

    updateNavForNavDate() {
        if (this.valuationDate.value === '') {
            this.valuationNav = undefined;
        }
        this.ofiNavService.requestLatestNav({
            isin: this.shareData.isin,
            navdate: this.valuationDate.value,
        }).then((response) => {
            this.valuationNav = response;
        }).catch(e => console.error(e));
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
    const numberParsed = Number.parseInt(testString.replace(/[.,\s]/, ''), 10);

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
    const amountVal = Number(amount);
    const feePercentVal = Number(feePercent);
    return Number(math.format(math.chain(amountVal).multiply((feePercentVal)).done(), 14));
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
    const amountVal = Number(amount);
    const feeVal = Number(fee);
    return {
        s: Number(math.format(math.chain(amountVal).add(feeVal).done(), 14)),
        r: Number(math.format(math.chain(amountVal).subtract(feeVal).done(), 14)),
    }[orderType];
}
