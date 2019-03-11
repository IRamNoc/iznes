import { debounceTime, switchMap, filter, bufferTime } from 'rxjs/operators';
import { Observable, combineLatest as observableCombineLatest, Subscription, zip } from 'rxjs';
/* Core/Angular imports. */
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';

import {FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { MemberSocketService } from '@setl/websocket-service';
import { NgRedux, select } from '@angular-redux/store';
import {
    commonHelper,
    ConfirmationService,
    FileDownloader,
    immutableHelper,
    LogService,
    SagaHelper,
    MoneyValuePipe,
} from '@setl/utils';

import { get, isEmpty, isEqual, find, isUndefined } from 'lodash';
import * as moment from 'moment-timezone';
import { ToasterService } from 'angular2-toaster';
/* Services. */
import { ManageOrdersService } from './manage-orders.service';
import { OfiOrdersService } from '../../ofi-req-services/ofi-orders/service';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import { NumberConverterService } from '@setl/utils/services/number-converter/service';
/* Alerts and confirms. */
/* Ofi Store stuff. */
import { ofiManageOrderActions } from '../../ofi-store';
/* Clarity */
import { ClrDatagridStateInterface, Datagrid } from '@clr/angular';
/* helper */
import { getOrderFigures, getOrderTypeString } from '../../ofi-product/fund-share/helper/order-view-helper';
import { OfiFundInvestService } from '../../ofi-req-services/ofi-fund-invest/service';
import { MessageCancelOrderConfig, MessagesService } from '@setl/core-messages';
import { OfiCurrenciesService } from '../../ofi-req-services/ofi-currencies/service';
import { MultilingualService } from '@setl/multilingual';
import { AppObservableHandler } from '@setl/utils/decorators/app-observable-handler';
import { SearchFilters, ISearchFilters } from './search-filters';
import { labelForOrder } from '../order.model';
import { orderStatuses, orderTypes, dateTypes } from './lists';
import { DatagridParams } from './datagrid-params';
import { fundClassifications } from '../../ofi-product/productConfig';

/* Types. */
interface SelectedItem {
    id: any;
    text: number | string;
}

/* Decorator. */
@Component({
    selector: 'app-manage-orders',
    styleUrls: ['./manage-orders.component.scss'],
    templateUrl: './manage-orders.component.html',
    providers: [
        SearchFilters,
    ],
})
@AppObservableHandler

/* Class. */
export class ManageOrdersComponent implements OnInit, AfterViewInit, OnDestroy {
    searchForm: FormGroup;

    @Input() isImported: boolean;
    @Input() linkRoute: string;

    /* Datagrid server driven */
    total: number;
    readonly itemPerPage = 10;
    private datagridParams: DatagridParams;
    lastPage: number;
    loading = true;
    userType: number;

    public orderTypes: any = [];
    public orderStatuses: any = [];
    public dateTypes: any = [];

    fundClassifications: object;
    fundClassificationId: number;
    orderClassificationFee: number;
    transformedOrderClassificationFee: number;

    showPaymentMsgConfirmationModal: boolean;

    // Locale
    language = 'en';

    fromConfigDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
        isDayDisabledCallback: (thisDate) => {
            if (!!thisDate && this.tabsControl[0].searchForm.controls['toDate'].value !== '') {
                return (thisDate.diff(this.tabsControl[0].searchForm.controls['toDate'].value) > 0);
            }
            return false;
        },
    };
    toConfigDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
        isDayDisabledCallback: (thisDate) => {
            if (!!thisDate && this.tabsControl[0].searchForm.controls['fromDate'].value !== '') {
                return (thisDate.diff(this.tabsControl[0].searchForm.controls['fromDate'].value) < 0);
            }
            return false;
        },
    };

    /* Tabs Control array */
    tabsControl: any[] = [];

    /* expandable div */
    isOptionalFiltersVisible = false;
    clientInformation = true;
    clientDetailsInformation = true;
    generalInvestmentInformation = true;
    mifid = true;
    productInformation = true;
    datesInformation = true;
    orderInformation = true;

    currencyList = [];

    @ViewChild('ordersDataGrid') orderDatagrid: Datagrid;
    /* Public Properties */
    public connectedWalletName = '';
    ordersList: any[] = [];
    fundShare = {
        mifiidChargesOneOff: null,
        mifiidChargesOngoing: null,
        mifiidTransactionCosts: null,
        mifiidServicesCosts: null,
        mifiidIncidentalCosts: null,
        keyFactOptionalData: {
            srri: null,
            sri: null,
        },
        decimalization: null,
        shareClassCode: null,
    };
    fundShareID = 0;
    fundShareList = {};
    isAmConfirmModalDisplayed: boolean;
    amConfirmModal: any = {};
    cancelModalMessage: string;

    // a record of orders that payment checkbox is ticked.
    // array of orderID
    orderCheckedForPayment = [];

    menuSpec = {};

    private isinParam: string;

    /* Observables. */
    @select(['user', 'myDetail', 'userType']) readonly userType$: Observable<number>;
    @select(['user', 'siteSettings', 'language']) readonly requestedLanguage$;
    @select(['user', 'siteSettings', 'siteMenu', 'side']) readonly menuSpec$;
    @select(['wallet', 'myWallets', 'walletList']) readonly myWallets$: any;
    @select(['wallet', 'walletDirectory', 'walletList']) readonly walletDirectory$: any;
    @select(['user', 'myDetail']) readonly myDetail$: any;
    @select(['user', 'connected', 'connectedWallet']) readonly connectedWallet$: any;
    @select(['ofi', 'ofiOrders', 'manageOrders', 'orderList']) orderList$;
    @select(['ofi', 'ofiOrders', 'manageOrders', 'listOrder']) readonly listOrder$: Observable<number[]>;
    @select(['ofi', 'ofiOrders', 'manageOrders', 'totalResults']) readonly totalResults$: Observable<number>;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'requested']) readonly requestedOfiInvestorFundList$;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) readonly fundShareAccessList$;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'requestedIznesShare']) readonly requestedShareList$;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) readonly shareList$;
    @select(['ofi', 'ofiCurrencies', 'currencies']) readonly currencies$;

    private myDetails: any = {};
    private walletDirectory: any = [];
    private connectedWalletId: any = 0;

    constructor(private ofiOrdersService: OfiOrdersService,
                private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private route: ActivatedRoute,
                private router: Router,
                private memberSocketService: MemberSocketService,
                private fundShareService: OfiFundShareService,
                private confirmationService: ConfirmationService,
                private fundInvestService: OfiFundInvestService,
                private logService: LogService,
                private fileDownloader: FileDownloader,
                public moneyValuePipe: MoneyValuePipe,
                public numberConverter: NumberConverterService,
                private messagesService: MessagesService,
                private toasterService: ToasterService,
                public translate: MultilingualService,
                private ofiCurrenciesService: OfiCurrenciesService,
                private manageOrdersService: ManageOrdersService,
                private location: Location,
                private searchFilters: SearchFilters,
    ) {
        this.isAmConfirmModalDisplayed = false;
        this.cancelModalMessage = '';
        this.ofiCurrenciesService.getCurrencyList();
        this.fundClassifications = fundClassifications;
    }

    get isInvestorUser() {
        return Boolean(this.myDetails && this.myDetails.userType && this.myDetails.userType === 46);
    }

    get isIznesAdmin() {
        let iznesAdmin = false;
        if (!!this.menuSpec && Object.keys(this.menuSpec).length > 0) {
            this.menuSpec[Object.keys(this.menuSpec)[0]].forEach((row) => {
                if (String(row['element_id']) === 'order-activity') iznesAdmin = true;
            });
        }
        return iznesAdmin;
    }

    get isAssetManger() {
        return !this.isInvestorUser && !this.isIznesAdmin;
    }

    get fundClassificationsText(): string {
        try {
            return fundClassifications[this.fundClassificationId].text
        } catch(e) {
            return '';
        }
    }

    get showSendPaymentMsgBtn(): boolean {
        // number of order marked for payment messages.
       const nPMsg = this.ordersList.filter((o) => o.markedForPayment.value).length;
       return this.isAssetManger && nPMsg > 0;
    }

    appSubscribe<T>(
        obs: Observable<T>,
        next?: (value: T) => void,
        error?: (error: any) => void,
        complete?: () => void,
    ) {
    }

    ngOnInit() {
        this.translateSelectMenus();

        this.route.queryParams.subscribe((params) => {
            this.isinParam = params.isin ? params.isin : undefined;
        });

        this.searchFilters.filtersApplied.subscribe(() => {
            this.datagridParams.setSearchFilters(this.searchFilters);
            this.detectChanges();
        });
        this.datagridParams = new DatagridParams(this.itemPerPage);
        this.appSubscribe(observableCombineLatest(this.datagridParams.changed, this.menuSpec$, this.myDetail$), ([change, menuSpec, myDetails]) => {

            this.menuSpec = menuSpec;
            this.myDetails = myDetails;

            console.log('Datagrid filters changed - re-load data');
            this.loading = true;
            this.getOrdersList();
            this.detectChanges();
        });
        this.datagridParams.setSearchFilters(this.searchFilters);
        this.searchFilters.optionalFilters
        .subscribe(show => this.isOptionalFiltersVisible = show);

        this.searchForm = this.searchFilters.getForm();
        if (this.isinParam) {
            this.searchForm.patchValue({ isin: this.isinParam }, { emitEvent: true });
            this.manageOrdersService.setFilters(this.searchFilters.get());
        }

        this.setInitialTabs();

        this.appSubscribe(
            this.requestedLanguage$,
            (requested) => {
                this.getLanguage(requested);
                this.translateSelectMenus();
            },
        );
        this.appSubscribe(this.userType$, type => this.userType = type);
        this.appSubscribe(this.walletDirectory$, walletDirectory => this.walletDirectory = walletDirectory);
        this.appSubscribe(observableCombineLatest(this.myWallets$, this.connectedWallet$.pipe(filter(id => id !== 0)), this.menuSpec$), ([myWallets, walletId, menuSpec]) => {
            this.connectedWalletId = walletId;
            this.connectedWalletName = get(
                Object.keys(myWallets)
                .map(k => myWallets[k])
                .find(w => +w.walletId === +walletId),
                'walletName',
                '',
            );

            this.menuSpec = menuSpec;

            if (this.isInvestorUser) {
                this.appSubscribe(this.requestedOfiInvestorFundList$, requested => this.requestMyFundAccess(requested));
                this.appSubscribe(this.fundShareAccessList$, list => this.fundShareList = list);
            } else if (this.isIznesAdmin) {
                this.appSubscribe(this.requestedShareList$, requested => this.requestAllShareList(requested));
                this.appSubscribe(this.shareList$, shares => this.fundShareList = shares);
            } else {
                this.appSubscribe(this.requestedShareList$, requested => this.requestShareList(requested));
                this.appSubscribe(this.shareList$, shares => this.fundShareList = shares);
            }

            this.changeDetectorRef.markForCheck();
        });
        const bufferedOrders$ = this.orderList$.pipe(bufferTime(2000, 2000, 50));
        const bufferedAndZippedOrders$ = zip(this.orderList$, this.listOrder$).pipe(bufferTime(2000, 2000, 50));
        this.appSubscribe(
            bufferedAndZippedOrders$,
            (orders) => {
                orders.forEach(([list, listOrder]) => {
                    this.getAmOrdersListFromRedux(list, listOrder);
                });
            });
        this.appSubscribe(this.totalResults$, (total) => {
            this.total = total;
            this.lastPage = Math.ceil(this.total / this.itemPerPage);
            this.detectChanges(true);
        });
        this.appSubscribe(
            bufferedOrders$
            .pipe(
                filter(orders => !isEmpty(orders)),
                switchMap(() => this.route.params),
            ),
            params => this.routeUpdate(params));
        this.appSubscribe(this.route.queryParams, (queryParams) => {
            if (queryParams.orderID) {
                this.manageOrdersService.setFilters({ orderID: queryParams.orderID });
                const newUrl = this.router.createUrlTree([], {
                    queryParams: { orderID: null },
                    queryParamsHandling: 'merge',
                });
                this.location.replaceState(this.router.serializeUrl(newUrl));
            }
        });
        this.appSubscribe(
            this.searchForm.valueChanges
            .pipe(debounceTime(500)),
            _ => this.manageOrdersService.setFilters(this.searchFilters.get()),
        );
        this.appSubscribe(this.currencies$, c => this.getCurrencyList(c));

        this.detectChanges();
    }

    ngAfterViewInit() {
        this.resizeDataGrid();
        this.isIznesAdmin;
    }

    routeUpdate(params) {
        const order = this.getOrder(params);
        if (!order) {
            this.setTabActive(0);
            return;
        }
        this.fundShareID = order.fundShareID;
        let tabTitle = '';
        if (order.orderType === 3) tabTitle += this.getOrderTypeString(order) + ': ';
        if (order.orderType === 4) tabTitle += this.getOrderTypeString(order) + ': ';
        tabTitle += ' ' + this.getOrderRef(order.orderID);

        const tabAlreadyHere = this.tabsControl.find(o => o.orderId === order.orderID);
        if (tabAlreadyHere === undefined) {
            this.tabsControl.push(
                {
                    title: {
                        icon: 'fa-shopping-basket',
                        text: tabTitle,
                    },
                    orderId: order.orderID,
                    active: true,
                    orderData: order,
                },
            );
        }

        // Update the classification fee
        this.orderClassificationFee = order.classificationFee;

        this.setTabActive(order.orderID);
        this.updateCurrentFundShare();
    }

    getOrder(params) {
        const orderID = +get(params, 'tabid', 0);
        if (orderID === 0) {
            return;
        }
        const order = this.ordersList.find(o => +o.orderID === orderID);
        if (!order) {
            return;
        }
        return order;
    }

    resizeDataGrid() {
        if (this.orderDatagrid) {
            this.orderDatagrid.resize();
        }
    }

    detectChanges(detect = false) {
        this.changeDetectorRef.markForCheck();
        if (detect) {
            this.changeDetectorRef.detectChanges();
        }
        this.resizeDataGrid();
    }

    translateSelectMenus() {
        this.orderTypes = this.translate.translate(orderTypes);
        this.orderStatuses = this.translate.translate(orderStatuses);
        this.dateTypes = this.translate.translate(dateTypes);
    }

    getLanguage(language): void {
        if (language) {
            this.language = language;
            this.detectChanges(true);

            this.toConfigDate = {
                ...this.toConfigDate,
                locale: this.language.substr(0, 2),
            };

            this.fromConfigDate = {
                ...this.fromConfigDate,
                locale: this.language.substr(0, 2),
            };
        }
    }

    getCurrencyList(data) {
        if (data) {
            this.currencyList = data.toJS();
        }
    }

    requestShareList(requested): void {
        if (!requested) {
            OfiFundShareService.defaultRequestIznesShareList(this.fundShareService, this.ngRedux);
        }
    }

    requestAllShareList(requested): void {
        if (!requested) {
            OfiFundShareService.requestIznesAllShareList(this.fundShareService, this.ngRedux);
        }
    }

    /**
     * Request my fund access base of the requested state.
     * @param requested
     * @return void
     */
    requestMyFundAccess(requested): void {
        if (!requested) {
            OfiFundInvestService.defaultRequestFunAccessMy(
                this.fundInvestService,
                this.ngRedux,
                this.connectedWalletId,
            );
        }
    }

    orderUnpaid(order: { settlementDate: string, orderStatus: number }): boolean {
        return moment(order.settlementDate).format('Y-M-d') === moment().format('Y-M-d') && +order.orderStatus === 4;
    }

    getAmOrdersListFromRedux(list, listOrder: number[]) {
        this.ordersList = this.ordersObjectToList(list, listOrder);
        const totalResults = get(this.ordersList, '0.totalResult', false);
        if (totalResults) {
            this.manageOrdersService.setTotalResults(totalResults);
        } else {
            this.manageOrdersService.incrementTotalResults();
        }

        this.loading = false;
        this.detectChanges(true);
    }

    subEstimated(order, field: string, estimatedField: string): number {
        let val = get(order, field, 0);
        val = (val > 0) ? val : get(order, estimatedField, 0);
        return this.numberConverter.toFrontEnd(val);
    }

    ordersObjectToList(list, listOrder) {
        return listOrder.map((orderId) => {
            const order = list[orderId];
            const price = this.subEstimated(order, 'price', 'latestNav');
            const amount = this.subEstimated(order, 'amount', 'estimatedAmount');
            const amountWithCost = this.subEstimated(order, 'amountWithCost', 'estimatedAmountWithCost');
            const quantity = this.subEstimated(order, 'quantity', 'estimatedQuantity');
            const fee = amountWithCost - amount;
            const feePercentage = this.numberConverter.toFrontEnd(order.feePercentage) * 100;
            const readyForPayment = (order.price > 0 && order.paymentMsgStatus === 'pending' );
            const markedForPayment = new FormControl(this.orderCheckedForPayment.includes(orderId));
            const orderRef = this.getOrderRef(orderId);
            const orderTypeStr = this.getOrderTypeString(order);

            return {
                ...list[orderId],
                price,
                amount,
                amountWithCost,
                quantity,
                feePercentage,
                fee,
                orderRef,
                orderTypeStr,
                knownNav: order.price > 0,
                markedForPayment,
                readyForPayment,
                orderUnpaid: this.orderUnpaid(list[orderId]),
            };
        });
    }

    updateCurrentFundShare() {
        this.logService.log('there', this.fundShareList);

        this.fundClassificationId = this.fundShareList[this.fundShareID].classification;
        // classification number decimal point.
        const classificationDp = get(fundClassifications, [this.fundClassificationId, 'dp'], 2);
        this.transformedOrderClassificationFee = this.moneyValuePipe.transform(
            this.numberConverter.toFrontEnd(this.orderClassificationFee),
            classificationDp,
        );

        const currentFundShare = this.fundShareList[this.fundShareID];
        if (typeof currentFundShare.keyFactOptionalData === 'string') {
            this.fundShare.keyFactOptionalData = JSON.parse(currentFundShare.keyFactOptionalData);
        } else {
            this.fundShare.keyFactOptionalData = currentFundShare.keyFactOptionalData;
        }

        if (!!this.fundShare.keyFactOptionalData.sri) {
            this.fundShare.keyFactOptionalData.sri = this.fundShare.keyFactOptionalData.sri[0].text;
        }
        if (!!this.fundShare.keyFactOptionalData.srri) {
            this.fundShare.keyFactOptionalData.srri = this.fundShare.keyFactOptionalData.srri[0].text;
        }

        this.fundShare.decimalization = currentFundShare.maximumNumDecimal;
        this.fundShare.mifiidChargesOneOff = this.numberConverter.toFrontEnd(currentFundShare.mifiidChargesOneOff);
        this.fundShare.mifiidChargesOngoing = this.numberConverter.toFrontEnd(currentFundShare.mifiidChargesOngoing);
        this.fundShare.mifiidTransactionCosts = this.numberConverter.toFrontEnd(currentFundShare.mifiidTransactionCosts);
        this.fundShare.mifiidServicesCosts = this.numberConverter.toFrontEnd(currentFundShare.mifiidServicesCosts);
        this.fundShare.mifiidIncidentalCosts = this.numberConverter.toFrontEnd(currentFundShare.mifiidIncidentalCosts);
        this.fundShare.shareClassCode = currentFundShare.shareClassCode;
        this.detectChanges();
    }

    setInitialTabs() {
        // Get opened tabs from redux store.
        const openedTabs = immutableHelper.get(
            this.ngRedux.getState(),
            ['ofi', 'ofiOrders', 'manageOrders', 'openedTabs'],
        );

        /* Default tabs. */
        this.tabsControl = [
            {
                title: {
                    icon: 'fa fa-th-list',
                    text: this.translate.translate('List'),
                },
                orderId: -1,
                searchForm: this.searchForm,
                active: true,
            },
        ];

        if (openedTabs.length !== 0) {
            openedTabs.forEach((tab, index) => {
                if (tab.orderId > -1) {
                    openedTabs[index].active = false;
                }
            });
            this.tabsControl = this.tabsControl.concat(openedTabs.slice(1));
        }
    }

    cancelOrder(index) {
        const orderId = this.getOrderRef(this.ordersList[index].orderID);
        const message = (this.ordersList[index].orderType === 3) ? `${this.translate.translate('Subscription')} ${orderId}` : `${this.translate.translate('Redemption')} ${orderId}`;

        if (this.isInvestorUser) {
            this.showConfirmationAlert(message, index);
        } else {
            this.isAmConfirmModalDisplayed = true;
            this.amConfirmModal = {
                targetedOrder: this.ordersList[index],
                title: `${this.translate.translate('Cancel')} - ${message}`,
                body: `${this.translate.translate('Are you sure you want to cancel the @message@?', { 'message': message })}`,placeholder: `${this.translate.translate('Please add a message to justify this cancellation. An internal IZNES message will be sent to the investor to notify them.')}`,
            };
        }
    }

    settleOrder(index) {
        let confMessage = '';
        if (this.ordersList[index].orderType === 3) {
            confMessage += `${this.translate.translate('Subscription')} `;
        }
        if (this.ordersList[index].orderType === 4) {
            confMessage += `${this.translate.translate('Redemption')} `;
        }
        confMessage += this.getOrderRef(this.ordersList[index].orderID);
        this.showConfirmationSettleAlert(confMessage, index);

    }

    getOrderRef(orderId): string {
        return commonHelper.pad(orderId, 11, '0');
    }

    showConfirmationSettleAlert(confMessage, index): void {
        this.confirmationService.create(
            `<span>${this.translate.translate('Are you sure?')}</span>`,
            `<span>${this.translate.translate(
                'Are you sure you want to settle the @confMessage@?',
                { 'confMessage': confMessage })}</span>`,
            {
                confirmText: this.translate.translate('Confirm'),
                declineText: this.translate.translate('Back'),
                btnClass: 'info',
            },
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.sendSettleOrderRequest(index);
            }
        });
    }

    sendSettleOrderRequest(index) {
        if (!this.isInvestorUser) {
            const orderId = this.ordersList[index].orderID;
            this.ofiOrdersService.markOrderSettle({ orderId }).then((data) => {
                // const orderId = _.get(data, ['1', 'Data', '0', 'orderID'], 0);
                const orderRef = commonHelper.pad(orderId, 11, '0');
                this.toasterService.pop('success', this.translate.translate('Order @orderRef@ has been successfully settled.', { 'orderRef': orderRef }));
                // this.handleClose();
                // this._router.navigateByUrl('/order-book/my-orders/list');
                this.logService.log(data);
            }).catch((data) => {
                const errorMessage = get(data, ['1', 'Data', '0', 'Message'], '');
                // this._toaster.pop('warning', errorMessage);
                this.logService.log(data);
            });
        }
    }

    showConfirmationAlert(confMessage, index): void {
        this.confirmationService.create(
            `<span>${this.translate.translate('Are you sure?')}</span>`,
            `<span>${this.translate.translate('Are you sure you want cancel the @confMessage@?', { 'confMessage': confMessage })}</span>`,
            {
                confirmText: this.translate.translate('Confirm'),
                declineText: this.translate.translate('Back'),
                btnClass: 'error',
            },
        ).subscribe((ans) => {
            if (ans.resolved) {
                const asyncTaskPipe = this.ofiOrdersService.requestCancelOrderByInvestor({
                    orderID: this.ordersList[index].orderID,
                });

                this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                    asyncTaskPipe,
                    (data) => {
                        this.logService.log('cancel order success', data); // success
                        this.loading = true;
                        this.getOrdersList();
                    },
                    (data) => {
                        this.logService.log('Error: ', data);
                    }),
                );
            }
        });
    }

    getMethodName(): string {
        if (this.isIznesAdmin) {
            return 'exportActivitiesOrders';
        }
        if (this.myDetails && this.myDetails.userType && this.myDetails.userType === 36) {  // AM side
            return 'exportAssetManagerOrders';
        }
        if (this.myDetails && this.myDetails.userType && this.myDetails.userType === 46) {  // INV side
            return 'exportInvestorOrders';
        }
        return '';
    }

    exportOrders(): void {
        const method = this.getMethodName();

        if (!method) {
            return;
        }

        const timezone: string = moment.tz.guess();
        this.fileDownloader.downLoaderFile({
            method,
            token: this.memberSocketService.token,
            userId: this.myDetails.userId,
            ...this.datagridParams.get(),
            timezone,
        });
    }

    refresh(state: ClrDatagridStateInterface) {
        this.manageOrdersService.setOrderListPage(state.page.from / state.page.size + 1);
        this.datagridParams.applyState(state);
    }

    getOrdersList() {
        let asyncTaskPipe;
        if (this.isInvestorUser) {
            asyncTaskPipe = this.ofiOrdersService.requestInvestorOrdersList(this.datagridParams.get());
        } else if (this.isIznesAdmin) {
            asyncTaskPipe = this.ofiOrdersService.requestIznesAdminOrdersList(this.datagridParams.get());
        } else {
            asyncTaskPipe = this.ofiOrdersService.requestManageOrdersList(this.datagridParams.get());
        }

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [ofiManageOrderActions.OFI_SET_MANAGE_ORDER_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    showTypes(order) {
        return labelForOrder(order);
    }

    showInvestor(order) {
        if (this.walletDirectory[order.investorWalletID] && this.walletDirectory[order.investorWalletID].walletName) {
            return this.walletDirectory[order.investorWalletID].walletName;
        }
        return this.translate.translate('Not found!');
    }

    showCurrency(order) {
        const obj = this.currencyList.find(o => o.id === order.currency);
        if (obj !== undefined) {
            return obj.text;
        }
        return this.translate.translate('Not found!');
    }

    buildLink(order, event, orderIdKey = 'orderID') {
        if (
            !event.target.classList.contains('datagrid-expandable-caret') &&
            !event.target.classList.contains('datagrid-expandable-caret-button') &&
            !event.target.classList.contains('datagrid-expandable-caret-icon')
        ) {
            let dest = '';
            if (this.isInvestorUser) {
                dest = 'order-book/my-orders/' + order[orderIdKey];

                if (orderIdKey === 'sellBuyLinkOrderID') {
                    this.location.replaceState('order-book/my-orders/list');
                }
            } else {
                dest = 'manage-orders/' + order[orderIdKey];
                if (orderIdKey === 'sellBuyLinkOrderID') {
                    this.location.replaceState('manage-orders');
                }
            }

            this.router.navigateByUrl(dest);
        }
    }

    /**
     * Get Order Date
     *
     * @param  {string} dateString - the order's date string.
     * @return {string}            - the formatted date or empty string.
     */
    getOnlyDate(dateString): string {
        return moment.utc(dateString, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD');
    }

    getDateTime(dateString): string {
        return moment.utc(dateString, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm');
    }

    /**
     * Close Tab
     * ---------
     * Removes a tab from the tabs control array, in effect, closing it.
     *
     * @param {index} number - the tab inded to close.
     *
     * @return {void}
     */
    public closeTab(index) {
        /* Validate that we have index. */
        if (!index && index !== 0) {
            return;
        }

        /* Remove the object from the tabsControl. */
        this.tabsControl = [
            ...this.tabsControl.slice(0, index),
            ...this.tabsControl.slice(index + 1, this.tabsControl.length),
        ];

        /* Reset tabs. */
        // this.location.back();

        this.tabsControl[0].active = true;

        this.router.navigateByUrl('manage-orders');

        /* Return */
        return;
    }

    /**
     * =============
     * Tab Functions
     * =============
     */

    /**
     * Set Tab Active
     * --------------
     * Sets all tabs to inactive other than the given index, this means the
     * view is switched to the wanted tab.
     *
     * @param {index} number - the tab inded to close.
     *
     * @return {void}
     */
    public setTabActive(orderID) {
        for (const i in this.tabsControl) {
            this.tabsControl[i].active = (Number(this.tabsControl[i].orderId) === Number(orderID));
        }
        this.detectChanges();
    }

    handleAmModalBackButtonClick() {
        this.resetAmConfirmModalValue();
    }

    /**
     * Cancel an investor's order by an asset manager
     *
     * @param targetedOrder
     */
    handleAmModalConfirmButtonClick(targetedOrder) {
        const asyncTaskPipe = this.ofiOrdersService.requestCancelOrderByAM({
            orderID: targetedOrder.orderID,
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                this.logService.log('cancel order success', data); // success
                this.loading = true;
                this.getOrdersList();
                this.sendMessageToInvestor(targetedOrder);
                this.resetAmConfirmModalValue();
            },
            (data) => {
                this.logService.log('Error: ', data);
                this.resetAmConfirmModalValue();
            }),
        );
    }

    sendMessageToInvestor(targetedOrder) {
        const orderRef = this.getOrderRef(targetedOrder.orderID);
        const amCompanyName = targetedOrder.amCompanyName;
        let orderType = '';
        let subject = '';
        let dateFormat = '';

        const toasterMessages = {
            success:
                this.translate.translate('The message has been successfully sent to @targetedOrder.firstName@ @targetedOrder.lastName@.', { 'targetedOrder.firstName': targetedOrder.firstName, 'targetedOrder.lastName': targetedOrder.lastName }),
            fail:
                this.translate.translate('The message has failed to be sent to @targetedOrder.firstName@ @targetedOrder.lastName@.', { 'targetedOrder.firstName': targetedOrder.firstName, 'targetedOrder.lastName': targetedOrder.lastName }),
        };

        orderType = (targetedOrder.orderType === 3) ?
            this.translate.translate('subscription') : this.translate.translate('redemption');
        subject = `${orderType} ${orderRef} - ${this.translate.translate('Cancelled')}`;
        dateFormat = 'YYYY-MM-DD HH:mm:ss';

        const actionConfig = new MessageCancelOrderConfig();
        actionConfig.lang = this.language;
        actionConfig.orderType = orderType;
        actionConfig.orderRef = orderRef;
        actionConfig.orderDate = moment(targetedOrder.orderDate).format(dateFormat);
        actionConfig.amCompanyName = amCompanyName;
        actionConfig.cancelMessage = this.cancelModalMessage;

        this.messagesService.sendMessage(
            [targetedOrder.investorWalletID],
            subject,
            '',
            actionConfig,
        ).then((result) => {
            this.logService.log('on message success: ', result);
            this.toasterService.pop('success', toasterMessages.success);
        }).catch((error) => {
            this.logService.log('on message fail: ', error);
            this.toasterService.pop('error', toasterMessages.fail);
        });
    }

    getDisplay() {
        return (this.isImported) ? 'none' : 'block';
    }

    getLinkRoute() {
        return (!!this.linkRoute) ? this.linkRoute : 'order-book/my-orders';
    }

    /**
     * Reset values of asset manager confirm modal
     */
    resetAmConfirmModalValue() {
        this.isAmConfirmModalDisplayed = false;
        this.cancelModalMessage = '';
        this.amConfirmModal = {};
    }

    /**
     * Get order type string with consideration of translation
     *
     * @param {{orderId: number | string; sellBuyLinkOrderID: number | string}} orderData
     * @return {string | boolean}
     */
    getOrderTypeString(orderData: { orderType: number | string; sellBuyLinkOrderID: number | string; }): string | boolean {
        const orderString = getOrderTypeString(orderData);
        return this.translate.getTranslationByString(orderString);
    }

    /**
     * Check if order is a sell buy order
     *
     * @param {{sellBuyLinkOrderID}} orderData
     * @return {boolean}
     */
    isSellBuyOrder(orderData: { sellBuyLinkOrderID }): boolean {
        return orderData.sellBuyLinkOrderID;
    }

    /**
     * Return different css class depend if order price is validated price of not.
     * if order.price (validated price) is not 0, order have the validated price, otherwise, it is not validated price.
     * @param {{knownNav: boolean}} order
     * @return {"text-warning" | "text-success"}
     */
    getPriceStatusCss(order: { knownNav: boolean }): 'text-warning' | 'text-success' {
        return order.knownNav ? 'text-success' : 'text-warning';
    }

    /**
     * Send request to mark payment message for ready to be sent.
     * @param $event
     */
    sendPaymentMsg($event) {
        this.ofiOrdersService.requestMarkOrderReadyForPayment({orderIds: $event}).then((r) => {
            const detailResps = get(r, '[1].Data[0].responses', []);
            const failedResps = detailResps.filter(dr => (get(dr, '[0].Status', 'Fail') !== 'OK'));
            if (failedResps.length > 0) {
                throw new Error(this.translate.translate('fail send payment messages'));
            }
        }).then(() => {
           this.toasterService.pop('success', this.translate.translate('Successfully sent payment messages'));
        }).catch((e) => {
           this.toasterService.pop('error', e.message);
        }).then(() => {
           this.showPaymentMsgConfirmationModal = false;
           this.changeDetectorRef.markForCheck();
        });
    }

    /**
     * Add/remove to/from the checked for payment array: orderCheckedForPayment
     * @param orderId
     * @param $event
     */
    updatePaymentCheckBoxState(orderId: number, $event: boolean): void {
       if ($event) {
           this.orderCheckedForPayment.push(orderId);
       } else {
           this.orderCheckedForPayment.filter(v => v !== orderId);
       }
    }

    ngOnDestroy(): void {
        this.searchFilters.clear();
        this.ngRedux.dispatch(ofiManageOrderActions.setAllTabs(this.tabsControl));

        this.manageOrdersService.resetOrderList();
    }
}
