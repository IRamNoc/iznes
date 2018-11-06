import { debounceTime, take, switchMap, filter, takeUntil, bufferTime } from 'rxjs/operators';
import { Observable, combineLatest as observableCombineLatest, Subscription, zip } from 'rxjs';
/* Core/Angular imports. */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { MemberSocketService } from '@setl/websocket-service';

import { NgRedux, select } from '@angular-redux/store';
import { Unsubscribe } from 'redux';
import {
    commonHelper,
    ConfirmationService,
    FileDownloader,
    immutableHelper,
    LogService,
    SagaHelper,
} from '@setl/utils';

import { get, isEmpty, isEqual, find, isUndefined } from 'lodash';
import * as moment from 'moment';
import { ToasterService } from 'angular2-toaster';
/* Services. */
import { WalletNodeRequestService } from '@setl/core-req-services';
import { ManageOrdersService } from './manage-orders.service';
import { OfiOrdersService } from '../../ofi-req-services/ofi-orders/service';
import { OfiCorpActionService } from '../../ofi-req-services/ofi-corp-actions/service';
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import { NumberConverterService } from '@setl/utils/services/number-converter/service';
/* Alerts and confirms. */
import { AlertsService } from '@setl/jaspero-ng2-alerts';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    filtersFromRedux: any = {};
    lastPage: number;
    loading = true;
    userType: number;

    public orderTypes = orderTypes;
    public orderStatuses = orderStatuses;
    public dateTypes = dateTypes;

    // Locale
    language = 'en';

    fromConfigDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
        isDayDisabledCallback: (thisDate) => {
            if (!!thisDate && this.tabsControl[0].searchForm.controls['toDate'].value != '') {
                return (thisDate.diff(this.tabsControl[0].searchForm.controls['toDate'].value) > 0);
            } else {
                return false;
            }
        },
    };
    toConfigDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
        isDayDisabledCallback: (thisDate) => {
            if (!!thisDate && this.tabsControl[0].searchForm.controls['fromDate'].value != '') {
                return (thisDate.diff(this.tabsControl[0].searchForm.controls['fromDate'].value) < 0);
            } else {
                return false;
            }
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
    userAssetList: any[] = [];
    isAmConfirmModalDisplayed: boolean;
    amConfirmModal: any = {};
    cancelModalMessage: string;

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
    private myWallets: any = [];
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
                public numberConverter: NumberConverterService,
                private messagesService: MessagesService,
                private toasterService: ToasterService,
                public translation: MultilingualService,
                private ofiCurrenciesService: OfiCurrenciesService,
                private manageOrdersService: ManageOrdersService,
                private location: Location,
                private searchFilters: SearchFilters,
    ) {

        this.isAmConfirmModalDisplayed = false;
        this.cancelModalMessage = '';
        this.ofiCurrenciesService.getCurrencyList();
    }

    get isInvestorUser() {
        return Boolean(this.myDetails && this.myDetails.userType && this.myDetails.userType === 46);
    }

    get isIznesAdmin() {
        let iznesAdmin = false;
        if (!!this.menuSpec && Object.keys(this.menuSpec).length > 0) {
            this.menuSpec[Object.keys(this.menuSpec)[0]].forEach((row) => {
                if (row['element_id'] == 'order-activity') iznesAdmin = true;
            });
        }
        return iznesAdmin;
    }

    appSubscribe<T>(
        obs: Observable<T>,
        next?: (value: T) => void,
        error?: (error: any) => void,
        complete?: () => void,
    ) {
    }

    ngOnInit() {
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
        if(this.isinParam) {
            this.searchForm.patchValue({ isin: this.isinParam }, { emitEvent: true });
            this.manageOrdersService.setFilters(this.searchFilters.get());
        }

        this.setInitialTabs();

        this.appSubscribe(this.requestedLanguage$, requested => this.getLanguage(requested));
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

    ngAfterViewInit() {
        this.resizeDataGrid();

        this.isIznesAdmin;
    }

    ngOnDestroy(): void {
        this.searchFilters.clear();
        this.ngRedux.dispatch(ofiManageOrderActions.setAllTabs(this.tabsControl));

        this.manageOrdersService.resetOrderList();
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

    getLanguage(language): void {
        if (language) {
            this.language = language;

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
            return {
                ...list[orderId],
                price,
                amount,
                amountWithCost,
                quantity,
                feePercentage,
                fee,
                knownNav: order.price > 0,
                orderUnpaid: this.orderUnpaid(list[orderId]),
            };
        });
    }

    updateCurrentFundShare() {
        this.logService.log('there', this.fundShareList);

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
            ['ofi', 'ofiOrders', 'manageOrders', 'openedTabs']
        );

        /* Default tabs. */
        this.tabsControl = [
            {
                title: {
                    icon: 'fa fa-th-list',
                    text: 'List',
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
        const message = (this.ordersList[index].orderType === 3) ? `Subscription ${orderId}` : `Redemption ${orderId}`;

        if (this.isInvestorUser) {
            this.showConfirmationAlert(message, index);
        } else {
            this.isAmConfirmModalDisplayed = true;
            this.amConfirmModal = {
                targetedOrder: this.ordersList[index],
                title: `Cancel - ${message}`,
                body: `Are you sure you want to cancel the ${message}?`,
                placeholder: 'Please add a message to justify this cancellation. An internal IZNES message will be sent to the investor to notify them.',
            };

        }
    }

    settleOrder(index) {
        let confMessage = '';
        if (this.ordersList[index].orderType === 3) {
            confMessage += 'Subscription ';
        }
        if (this.ordersList[index].orderType === 4) {
            confMessage += 'Redemption ';
        }
        confMessage += this.getOrderRef(this.ordersList[index].orderID);
        this.showConfirmationSettleAlert(confMessage, index);

    }

    getOrderRef(orderId): string {
        return commonHelper.pad(orderId, 11, '0');
    }

    showConfirmationSettleAlert(confMessage, index): void {
        this.confirmationService.create(
            '<span>Are you sure?</span>',
            '<span>Are you sure you want to settle the ' + confMessage + '?</span>',
            { confirmText: 'Confirm', declineText: 'Back', btnClass: 'info' },
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
                this.toasterService.pop('success', 'Order ' + orderRef + ' has been successfully settled.');
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
            '<span>Are you sure?</span>',
            '<span>Are you sure you want cancel the ' + confMessage + '?</span>',
            { confirmText: 'Confirm', declineText: 'Back', btnClass: 'error' },
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

    exportOrders(): void {
        let methodName = '';
        if (this.isIznesAdmin) {
            methodName = 'exportActivitiesOrders';
        } else if (this.myDetails && this.myDetails.userType && this.myDetails.userType === 36) {  // AM side
            methodName = 'exportAssetManagerOrders';
        } else if (this.myDetails && this.myDetails.userType && this.myDetails.userType === 46) {  // INV side
            methodName = 'exportInvestorOrders';
        }

        this.fileDownloader.downLoaderFile({
            method: methodName,
            token: this.memberSocketService.token,
            userId: this.myDetails.userId,
            ...this.datagridParams.get(),
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
        return 'Not found!';
    }

    showCurrency(order) {
        const obj = this.currencyList.find(o => o.id === order.currency);
        if (obj !== undefined) {
            return obj.text;
        }
        return 'Not found!';
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
            success: {
                'fr-Latn': `Le message a été envoyé avec succès à ${targetedOrder.firstName} ${targetedOrder.lastName}`,
                'en-Latn': `The message has been successfully sent to ${targetedOrder.firstName} ${targetedOrder.lastName}`,
            },
            fail: {
                'fr-Latn': `L'envoi du message à ${targetedOrder.firstName} ${targetedOrder.lastName} a échoué`,
                'en-Latn': `The message has failed to be sent to ${targetedOrder.firstName} ${targetedOrder.lastName}`,
            },
        };

        switch (this.language) {
        case 'fr-Latn':
            orderType = (targetedOrder.orderType === 3) ? 'souscription' : 'rachat';
            subject = `Annulation d'un ordre: votre ordre de ${orderType} avec la référence ${orderRef} a été annulé par ${amCompanyName}`;
            dateFormat = 'DD/MM/YYYY HH:mm:ss';
            break;

        default:
            orderType = (targetedOrder.orderType === 3) ? 'subscription' : 'redemption';
            subject = `Order cancelled: your ${orderType} order ${orderRef} has been cancelled by ${amCompanyName}`;
            dateFormat = 'YYYY-MM-DD HH:mm:ss';
            break;
        }

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
            this.toasterService.pop('success', toasterMessages.success[this.language]);
        }).catch((error) => {
            this.logService.log('on message fail: ', error);
            this.toasterService.pop('error', toasterMessages.fail[this.language]);
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
     * Get order type string with consideration of transation
     *
     * @param {{orderId: number | string; sellBuyLinkOrderID: number | string}} orderData
     * @return {string | boolean}
     */
    getOrderTypeString(orderData: { orderType: number | string; sellBuyLinkOrderID: number | string; }): string | boolean {
        const orderString = getOrderTypeString(orderData);
        return this.translation.getTranslationByString(orderString);
    }

    /**
     * check if order is a sell buy order
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
}
