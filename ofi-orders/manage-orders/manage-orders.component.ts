/* Core/Angular imports. */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {MemberSocketService} from '@setl/websocket-service';

import {NgRedux, select} from '@angular-redux/store';
import {Unsubscribe} from 'redux';
import {
    APP_CONFIG,
    AppConfig,
    commonHelper,
    ConfirmationService,
    immutableHelper,
    SagaHelper,
    LogService
} from '@setl/utils';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import * as moment from 'moment';
/* Services. */
import {WalletNodeRequestService} from '@setl/core-req-services';
import {OfiOrdersService} from '../../ofi-req-services/ofi-orders/service';
import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';
import {OfiManagementCompanyService} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import {OfiFundShareService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import {NumberConverterService} from '@setl/utils/services/number-converter/service';
/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
/* Ofi Store stuff. */
import {ofiManageOrderActions, ofiMyOrderActions, ofiClearRequestedMyOrder} from '../../ofi-store';
/* Clarity */
import {ClrDatagridStateInterface, Datagrid} from '@clr/angular';
/* helper */
import {getOrderFigures} from '../../ofi-product/fund-share/helper/order-view-helper';
import {OfiFundInvestService} from '../../ofi-req-services/ofi-fund-invest/service';
import {ofiClearRequestedManageOrder} from '../../ofi-store/ofi-orders/manage-orders';

/* Types. */
interface SelectedItem {
    id: any;
    text: number | string;
}

/* Decorator. */
@Component({
    styleUrls: ['./manage-orders.component.css'],
    templateUrl: './manage-orders.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

/* Class. */
export class ManageOrdersComponent implements OnInit, AfterViewInit, OnDestroy {

    unknownValue = '???';

    searchForm: FormGroup;

    /* Datagrid server driven */
    total: number;
    itemPerPage = 10;
    dataGridParams = {
        shareName: null,
        isin: null,
        status: null,
        orderType: null,
        pageSize: this.itemPerPage,
        rowOffSet: 0,
        sortByField: 'orderId', // orderId, orderType, isin, shareName, currency, quantity, amountWithCost, orderDate, cutoffDate, settlementDate, orderStatus
        sortOrder: 'desc', // asc / desc
        dateSearchField: null,
        fromDate: null,
        toDate: null,
    };
    filtersFromRedux: any;
    filtersApplied = false;
    lastPage: number;
    loading = true;

    // Locale
    language = 'en';

    // Datepicker config
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language
    };

    /* Tabs Control array */
    tabsControl: Array<any> = [];
    orderID = 0;

    /* expandable div */
    isOptionalFilters = false;
    clientInformation = true;
    clientDetailsInformation = true;
    generalInvestmentInformation = true;
    mifid = true;
    productInformation = true;
    datesInformation = true;
    orderInformation = true;

    orderStatuses: Array<SelectedItem> = [
        {id: -3, text: 'All'},
        {id: -1, text: 'Settled'},
        {id: 0, text: 'Cancelled'}, // estimatedPrice
        {id: 1, text: 'Initiated'},
        {id: 2, text: 'Waiting NAV'},
        {id: 3, text: 'Waiting Settlement'},
        {id: 4, text: 'Unpaid'},
    ];

    orderTypes: Array<SelectedItem> = [
        {id: 0, text: 'All'},
        {id: 3, text: 'Subscription'},
        {id: 4, text: 'Redemption'},
    ];

    dateTypes: Array<SelectedItem> = [
        {id: 'orderDate', text: 'Order Date'},
        {id: 'cutOffDate', text: 'Cut-off Date'},
        {id: 'navDate', text: 'NAV Date'},
        {id: 'settlementDate', text: 'Settlement Date'},
    ];

    currencyList = [
        {id: 0, text: 'EUR'},
        {id: 1, text: 'USD'},
        {id: 2, text: 'GBP'},
        {id: 3, text: 'CHF'},
        {id: 4, text: 'JPY'},
        {id: 5, text: 'AUD'},
        {id: 6, text: 'NOK'},
        {id: 7, text: 'SEK'},
        {id: 8, text: 'ZAR'},
        {id: 9, text: 'RUB'},
        {id: 10, text: 'SGD'},
        {id: 11, text: 'AED'},
        {id: 12, text: 'CNY'},
        {id: 13, text: 'PLN'},
    ];

    appConfig: AppConfig;

    @ViewChild('ordersDataGrid') orderDatagrid: Datagrid;

    get isInvestorUser() {
        return Boolean(this.myDetails && this.myDetails.userType && this.myDetails.userType === 46);
    }

    /* Public Properties */
    public connectedWalletName = '';

    /* Private Properties. */
    private subscriptions: Array<any> = [];
    private reduxUnsubscribe: Unsubscribe;
    ordersList: Array<any> = [];
    private myDetails: any = {};
    private myWallets: any = [];
    private walletDirectory: any = [];
    private connectedWalletId: any = 0;
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
        shareClassCode: null
    };

    fundShareID = 0;
    fundShareListObj = {};

    userAssetList: Array<any> = [];
    private requestedSearch: any;
    private sort: { name: string, direction: string } = {name: 'dateEntered', direction: 'ASC'}; // default search.

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['wallet', 'myWallets', 'walletList']) myWalletsOb: any;
    @select(['wallet', 'walletDirectory', 'walletList']) walletDirectoryOb: any;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb: any;
    @select(['ofi', 'ofiOrders', 'manageOrders', 'requested']) requestedOfiAmOrdersOb;
    @select(['ofi', 'ofiOrders', 'manageOrders', 'orderList']) OfiAmOrdersListOb;
    @select(['ofi', 'ofiOrders', 'manageOrders', 'filters']) OfiAmOrdersFiltersOb;
    @select(['ofi', 'ofiOrders', 'myOrders', 'requested']) requestedOfiInvOrdersOb: any;
    @select(['ofi', 'ofiOrders', 'myOrders', 'orderList']) OfiInvOrdersListOb: any;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'requested']) requestedOfiInvestorFundListOb;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) fundShareAccessListOb;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'requestedIznesShare']) requestedShareListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) shareListObs;

    constructor(private ofiOrdersService: OfiOrdersService,
                private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private route: ActivatedRoute,
                private router: Router,
                private _fb: FormBuilder,
                private memberSocketService: MemberSocketService,
                private mcService: OfiManagementCompanyService,
                private _ofiFundShareService: OfiFundShareService,
                private ofiCorpActionService: OfiCorpActionService,
                private walletNodeRequestService: WalletNodeRequestService,
                private alerts: AlertsService,
                private _confirmationService: ConfirmationService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
                private _ofiFundInvestService: OfiFundInvestService,
                private logService: LogService,
                public _numberConverterService: NumberConverterService) {

        this.appConfig = appConfig;

    }

    ngOnInit() {
        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));

        /* Subscribe for this user's details. */
        this.subscriptions.push(this.myDetailOb.subscribe((myDetails) => {
            /* Assign list to a property. */
            this.myDetails = myDetails;
        }));

        this.subscriptions.push(this.walletDirectoryOb.subscribe((walletDirectory) => {
            this.walletDirectory = walletDirectory;
        }));

        /* Subscribe for this user's wallets. */
        this.subscriptions.push(this.myWalletsOb.subscribe((walletsList) => {
            /* Assign list to a property. */
            this.myWallets = walletsList;

            /* Update wallet name. */
            this.updateWalletConnection();
        }));

        /* Subscribe for this user's connected info. */
        this.subscriptions.push(this.connectedWalletOb.subscribe((connectedWalletId) => {
            /* Assign list to a property. */
            this.connectedWalletId = connectedWalletId;

            /* Update wallet name. */
            this.updateWalletConnection();
        }));

        let orderStream$;
        if (!this.isInvestorUser) {  // AM side
            orderStream$ = this.requestedOfiAmOrdersOb;
            this.subscriptions.push(this.OfiAmOrdersListOb.subscribe((list) => this.getAmOrdersListFromRedux(list)));
            this.subscriptions.push(this.requestedShareListObs.subscribe(requested => this.requestShareList(requested)));
            this.subscriptions.push(this.shareListObs.subscribe(shares => this.fundShareListObj = shares));
        } else if (this.isInvestorUser) {  // INV side
            orderStream$ = this.requestedOfiInvOrdersOb;
            this.subscriptions.push(this.OfiInvOrdersListOb.subscribe((list) => this.getInvOrdersListFromRedux(list)));
            this.subscriptions.push(this.requestedOfiInvestorFundListOb.subscribe(
                (requested) => this.requestMyFundAccess(requested)));
            this.subscriptions.push(this.fundShareAccessListOb.subscribe(fundShareAccessList => this.fundShareListObj = fundShareAccessList));
        }

        this.subscriptions.push(this.route.params.subscribe(params => {
            this.orderID = params['tabid'];
            if (typeof this.orderID !== 'undefined' && this.orderID > 0) {
                const order = this.ordersList.find(elmt => {
                    if (elmt.orderID.toString() === this.orderID.toString()) {
                        return elmt;
                    }
                });
                if (order && typeof order !== 'undefined' && order !== undefined && order !== null) {
                    this.fundShareID = order.fundShareID;
                    let tabTitle = '';
                    if (order.orderType === 3) tabTitle += 'Subscription: ';
                    if (order.orderType === 4) tabTitle += 'Redemption: ';
                    tabTitle += ' ' + this.getOrderRef(this.orderID);

                    const tabAlreadyHere = this.tabsControl.find(o => o.orderId === this.orderID);
                    if (tabAlreadyHere === undefined) {
                        this.tabsControl.push(
                            {
                                'title': {
                                    'icon': 'fa-shopping-basket',
                                    'text': tabTitle,
                                },
                                'orderId': this.orderID,
                                'active': true,
                                orderData: order,
                            }
                        );
                    }
                    this.setTabActive(this.orderID);

                    this.updateCurrentFundShare();

                }
            }
        }));

        this.createForm();
        this.setInitialTabs();

        let filterStream$ = this.OfiAmOrdersFiltersOb.take(1);
        let combined$ = orderStream$.combineLatest(filterStream$);

        let combinedSubscription = combined$.subscribe(([requested, filters]) => {
            if(_.isEmpty(filters)){
                if(!this.isInvestorUser){
                    this.getAmOrdersNewOrder(requested);
                } else{
                    this.getInvOrdersNewOrder(requested);
                }
            } else{
                this.getAmOrdersFiltersFromRedux(filters);
            }
        });

        this.subscriptions.push(combinedSubscription);
        this.subscriptions.push(this.searchForm.valueChanges.debounceTime(500).subscribe((form) => this.requestSearch()));

        this.ngRedux.dispatch(ofiClearRequestedMyOrder());
        // this.ngRedux.dispatch(ofiClearRequestedManageOrder());

        this.detectChanges();
    }

    ngAfterViewInit() {
        this.resizeDataGrid();
    }

    resizeDataGrid(){
        if (this.orderDatagrid) {
            this.orderDatagrid.resize();
        }
    }

    detectChanges(detect?){
        this.changeDetectorRef.markForCheck();
        if(detect){
            this.changeDetectorRef.detectChanges();
        }
        this.resizeDataGrid();
    }

    createForm() {
        this.searchForm = this._fb.group({
            sharename: [
                '',
            ],
            isin: [
                '',
            ],
            status: [
                [this.orderStatuses[0]],
            ],
            type: [
                [this.orderTypes[0]],
            ],
            dateType: [
                [this.dateTypes[2]],
            ],
            fromDate: [
                '',
            ],
            toDate: [
                '',
            ],
        });
    }

    clearForm(){
        this.searchForm.patchValue({
            sharename: '',
            isin: '',
            status: [this.orderStatuses[0]],
            type: [this.orderTypes[0]],
            dateType: [this.dateTypes[2]],
            fromDate: '',
            toDate: '',
        });
    }

    getLanguage(requested): void {
        if (requested) {
            switch (requested) {
                case 'fra':
                    this.language = 'fr';
                    break;
                case 'eng':
                    this.language = 'en';
                    break;
                default:
                    this.language = 'en';
                    break;
            }
        }
    }

    requestShareList(requested): void {
        if (!requested) {
            OfiFundShareService.defaultRequestIznesShareList(this._ofiFundShareService, this.ngRedux);
        }
    }

    /**
     * Request my fund access base of the requested state.
     * @param requested
     * @return void
     */
    requestMyFundAccess(requested): void {
        if (!requested) {
            OfiFundInvestService.defaultRequestFunAccessMy(this._ofiFundInvestService, this.ngRedux, this.connectedWalletId);
        }
    }

    getAmOrdersListFromRedux(list) {
        this.ordersList = this.ordersObjectToList(list);

        for (let i in this.ordersList) {
            this.ordersList[i]['orderUnpaid'] = false;
            if (moment(this.ordersList[i]['settlementDate']).format('Y-M-d') === moment().format('Y-M-d') && this.ordersList[i]['orderStatus'] == 4) this.ordersList[i]['orderUnpaid'] = true;
        }

        this.updateTabs();
        this.detectChanges(true);
    }

    getAmOrdersFiltersFromRedux(filters) {
        this.filtersFromRedux = filters;

        this.logService.log(this.filtersFromRedux);
        this.applyFilters();
        this.detectChanges();
    }

    applyFilters() {
        if (!this.filtersApplied && this.tabsControl[0] && this.tabsControl[0].searchForm) {
            if (typeof this.filtersFromRedux.isin !== 'undefined' || typeof this.filtersFromRedux.sharename !== 'undefined' ||
                typeof this.filtersFromRedux.status !== 'undefined' || typeof this.filtersFromRedux.orderType !== 'undefined' ||
                typeof this.filtersFromRedux.dateType !== 'undefined' || typeof this.filtersFromRedux.fromDate !== 'undefined' ||
                typeof  this.filtersFromRedux.toDate !== 'undefined') {

                if (typeof this.filtersFromRedux.isin !== 'undefined' && this.filtersFromRedux.isin !== '') {
                    this.tabsControl[0].searchForm.get('isin').patchValue(this.filtersFromRedux.isin); // , {emitEvent: false}
                    //this.tabsControl[0].searchForm.get('isin').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
                }
                if (typeof this.filtersFromRedux.sharename !== 'undefined' && this.filtersFromRedux.sharename !== '') {
                    this.tabsControl[0].searchForm.get('sharename').patchValue(this.filtersFromRedux.sharename); // emitEvent = true cause infinite loop (make a valueChange)
                }
                if (typeof this.filtersFromRedux.status !== 'undefined' && this.filtersFromRedux.status !== '') {
                    const statusId = _.get(this.filtersFromRedux, ['status', '0', 'id']) ;
                    const statusFound = _.find(this.orderStatuses, ['id', statusId]);
                    if (statusFound !== undefined) {
                        this.tabsControl[0].searchForm.get('status').patchValue([{
                            id: statusFound.id,
                            text: statusFound.text
                        }]);// emitEvent = true cause infinite loop (make a valueChange)
                    }
                } else {
                    this.tabsControl[0].searchForm.get('status').patchValue([]);
                }

                // Order types
                if (typeof this.filtersFromRedux.type !== 'undefined' && this.filtersFromRedux.type !== '') {
                    const orderTypeId = _.get(this.filtersFromRedux, ['type', '0', 'id']) ;
                    const orderTypeFound = _.find(this.orderTypes, ['id', orderTypeId]);
                    if (orderTypeFound !== undefined) {
                        this.tabsControl[0].searchForm.get('type').patchValue([{
                            id: orderTypeFound.id,
                            text: orderTypeFound.text
                        }]);// emitEvent = true cause infinite loop (make a valueChange)
                    }
                } else {
                    this.tabsControl[0].searchForm.get('type').patchValue([]);
                }
                if (typeof this.filtersFromRedux.dateType !== 'undefined' && this.filtersFromRedux.dateType !== '') {
                    const dateTypeId = _.get(this.filtersFromRedux, ['dateType', '0', 'id']) ;
                    const dateTypeFound = _.find(this.dateTypes, ['id', dateTypeId]);
                    if (dateTypeFound !== undefined) {
                        this.tabsControl[0].searchForm.get('dateType').patchValue([{
                            id: dateTypeFound.id,
                            text: dateTypeFound.text
                        }]); // emitEvent = true cause infinite loop (make a valueChange)
                    }
                } else {
                    this.tabsControl[0].searchForm.get('dateType').patchValue([]);
                }
                if (typeof this.filtersFromRedux.fromDate !== 'undefined' && this.filtersFromRedux.fromDate !== '') {
                    this.tabsControl[0].searchForm.get('fromDate').patchValue(this.filtersFromRedux.fromDate);// emitEvent = true cause infinite loop (make a valueChange)
                    this.isOptionalFilters = true;
                }
                if (typeof this.filtersFromRedux.toDate !== 'undefined' && this.filtersFromRedux.toDate !== '') {
                    this.tabsControl[0].searchForm.get('toDate').patchValue(this.filtersFromRedux.toDate); // emitEvent = true cause infinite loop (make a valueChange)
                    this.isOptionalFilters = true;
                }

                // remove filters from redux
                this.ngRedux.dispatch({type: ofiManageOrderActions.OFI_SET_ORDERS_FILTERS, filters: {filters: {}}});
                this.requestSearch();
            }
        }
    }

    setOrdersFilters(){
        let searchForm = this.tabsControl[0].searchForm;
        let filters = {filters : searchForm.value};
        this.ngRedux.dispatch({type: ofiManageOrderActions.OFI_SET_ORDERS_FILTERS, 'filters' : filters});
    }

    getInvOrdersListFromRedux(list) {
        this.ordersList = this.ordersObjectToList(list);

        for (let i in this.ordersList) {
            this.ordersList[i]['orderUnpaid'] = false;
            if (moment(this.ordersList[i]['settlementDate']).format('Y-M-d') === moment().format('Y-M-d') && this.ordersList[i]['orderStatus'] == 4) this.ordersList[i]['orderUnpaid'] = true;
        }

        this.updateTabs();

        this.detectChanges();
    }

    ordersObjectToList(list) {
        return Object.keys(list).reduce((result, orderId) => {
            const order = list[orderId];
            const orderFigure = getOrderFigures(order);
            result.push(
                {
                    amAddress: _.get(order, 'amAddress', ''),
                    amCompanyID: _.get(order, 'amCompanyID', 0),
                    amCompanyName: _.get(order, 'amCompanyName', ''),
                    amWalletID: _.get(order, 'amWalletID', 0),
                    byAmountOrQuantity: _.get(order, 'byAmountOrQuantity', 1),
                    canceledBy: _.get(order, 'canceledBy', 0),
                    contractAddr: _.get(order, 'contractAddr', ''),
                    currency: _.get(order, 'currency', 0),
                    cutoffDate: _.get(order, 'cutoffDate', ''),
                    firstName: _.get(order, 'firstName', ''),
                    fundShareID: _.get(order, 'fundShareID', 0),
                    fundShareName: _.get(order, 'fundShareName', ''),
                    iban: _.get(order, 'iban', ''),
                    investorAddress: _.get(order, 'investorAddress', ''),
                    investorWalletID: _.get(order, 'investorWalletID', 0),
                    investorCompanyName: _.get(order, 'investorCompanyName', ''),
                    isin: _.get(order, 'isin', ''),
                    label: _.get(order, 'label', ''),
                    lastName: _.get(order, 'lastName', ''),
                    navEntered: _.get(order, 'navEntered', ''),
                    orderID: _.get(order, 'orderID', 0),
                    orderDate: _.get(order, 'orderDate', ''),
                    orderNote: _.get(order, 'orderNote', ''),
                    orderStatus: _.get(order, 'orderStatus', 1),
                    orderType: _.get(order, 'orderType', 0),
                    settlementDate: _.get(order, 'settlementDate', ''),
                    totalResult: _.get(order, 'totalResult', 0),
                    valuationDate: _.get(order, 'valuationDate'),

                    amount: orderFigure.amount,
                    amountWithCost: orderFigure.amountWithCost,
                    price: orderFigure.price,
                    quantity: orderFigure.quantity,
                    fee: orderFigure.fee,
                    feePercentage: orderFigure.feePercentage
                }
            );

            return result;
        }, []);
    }

    getAmOrdersNewOrder(requested): void {
        if (!requested) {
            // set flag to true, so we don't request the order again.
            this.ngRedux.dispatch(ofiManageOrderActions.ofiSetRequestedManageOrder());

            this.loading = true;
            this.getOrdersList();
            this.detectChanges();
        }
    }

    getInvOrdersNewOrder(requested): void {
        if (!requested) {
            // set flag to true, so we don't request the order again.
            this.ngRedux.dispatch(ofiMyOrderActions.ofiSetRequestedMyOrder());

            this.loading = true;
            this.getOrdersList();
            this.detectChanges();
        }
    }

    updateCurrentFundShare() {
        this.logService.log('there', this.fundShareListObj);

        const currentFundShare = this.fundShareListObj[this.fundShareID];
        if (typeof currentFundShare.keyFactOptionalData === 'string') {
            this.fundShare.keyFactOptionalData = JSON.parse(currentFundShare.keyFactOptionalData);
        } else {
            this.fundShare.keyFactOptionalData = currentFundShare.keyFactOptionalData;
        }

        this.fundShare.decimalization = currentFundShare.maximumNumDecimal;
        this.fundShare.mifiidChargesOneOff = currentFundShare.mifiidChargesOneOff;
        this.fundShare.mifiidChargesOngoing = currentFundShare.mifiidChargesOngoing;
        this.fundShare.mifiidTransactionCosts = currentFundShare.mifiidTransactionCosts;
        this.fundShare.mifiidServicesCosts = currentFundShare.mifiidServicesCosts;
        this.fundShare.mifiidIncidentalCosts = currentFundShare.mifiidIncidentalCosts;
        this.fundShare.shareClassCode = currentFundShare.shareClassCode;
        this.detectChanges();

    }

    setInitialTabs() {
        // Get opened tabs from redux store.
        const openedTabs = immutableHelper.get(this.ngRedux.getState(), ['ofi', 'ofiOrders', 'manageOrders', 'openedTabs']);

        /* Default tabs. */
        this.tabsControl = [
            {
                'title': {
                    'icon': 'fa fa-th-list',
                    'text': 'List'
                },
                'orderId': -1,
                'searchForm': this.searchForm,
                'active': true
            }
        ];

        if(openedTabs.length !== 0) {
            this.tabsControl[0].active = openedTabs[0].active;
            this.tabsControl = this.tabsControl.concat(openedTabs.slice(1));
        }
    }

    updateTabs() {
        this.loading = false;
        if (this.ordersList.length > 0) {
            this.total = this.ordersList[0].totalResult;
            this.lastPage = Math.ceil(this.total / this.itemPerPage);


        } else {
            this.total = 0;
            this.lastPage = 0;
        }
    }

    cancelOrder(index) {
        let confMessage = '';
        if (this.ordersList[index].orderType === 3) {
            confMessage += 'Subscription ';
        }
        if (this.ordersList[index].orderType === 4) {
            confMessage += 'Redemption ';
        }
        confMessage += this.getOrderRef(this.ordersList[index].orderID);
        this.showConfirmationAlert(confMessage, index);
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
        this._confirmationService.create(
            '<span>Are you sure?</span>',
            '<span>Are you sure you want settle the ' + confMessage + '?</span>',
            {confirmText: 'Confirm', declineText: 'Back', btnClass: 'info'}
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.sendSettleOrderRequest(index);
            }
        });
    }

    sendSettleOrderRequest(index) {

        if (!this.isInvestorUser) {
            const orderId = this.ordersList[index].orderID;
            this.ofiOrdersService.markOrderSettle({orderId}).then((data) => {
                // const orderId = _.get(data, ['1', 'Data', '0', 'orderID'], 0);
                // const orderRef = commonHelper.pad(orderId, 11, '0');
                // this._toaster.pop('success', `Your order ${orderRef} has been successfully placed and is now initiated.`);
                // this.handleClose();
                // this._router.navigateByUrl('/order-book/my-orders/list');
                this.logService.log(data);
            }).catch((data) => {
                const errorMessage = _.get(data, ['1', 'Data', '0', 'Message'], '');
                // this._toaster.pop('warning', errorMessage);
                this.logService.log(data);
            });
        }
    }


    showConfirmationAlert(confMessage, index): void {
        this._confirmationService.create(
            '<span>Are you sure?</span>',
            '<span>Are you sure you want cancel the ' + confMessage + '?</span>',
            {confirmText: 'Confirm', declineText: 'Back', btnClass: 'error'}
        ).subscribe((ans) => {
            if (ans.resolved) {
                let asyncTaskPipe;
                if (this.isInvestorUser) {
                    asyncTaskPipe = this.ofiOrdersService.requestCancelOrderByInvestor({
                        orderID: this.ordersList[index].orderID,
                    });
                } else {
                    asyncTaskPipe = this.ofiOrdersService.requestCancelOrderByAM({
                        orderID: this.ordersList[index].orderID,
                    });
                }

                this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                    asyncTaskPipe,
                    (data) => {
                        this.logService.log('cancel order success', data); // success
                        this.loading = true;
                        this.getOrdersList();
                    },
                    (data) => {
                        this.logService.log('Error: ', data);
                    })
                );
            }
        });
    }

    exportOrders(): void {
        let methodName = '';
        if (this.myDetails && this.myDetails.userType && this.myDetails.userType === 36) {  // AM side
            methodName = 'exportAssetManagerOrders';
        } else if (this.myDetails && this.myDetails.userType && this.myDetails.userType === 46) {  // INV side
            methodName = 'exportInvestorOrders';
        }

        let paramUrl = 'file?token=' + this.memberSocketService.token + '&method=' + methodName + '&userId=' + this.myDetails.userId;
        for (let filter in this.dataGridParams) {
            if (this.dataGridParams.hasOwnProperty(filter)) {
                paramUrl += '&' + filter + '=' + encodeURIComponent(this.dataGridParams[filter]);
            }
        }
        const url = this.generateExportURL(paramUrl, this.appConfig.production);
        window.open(url, '_blank');
    }

    generateExportURL(url: string, isProd: boolean = true): string {
        return isProd ? `https://${window.location.hostname}/mn/${url}` :
            `http://${window.location.hostname}:9788/${url}`;
    }

    requestSearch() {

        const tmpDataGridParams = {
            shareName: this.dataGridParams.shareName,
            isin: this.dataGridParams.isin,
            status: this.dataGridParams.status,
            orderType: this.dataGridParams.orderType,
            pageSize: this.dataGridParams.pageSize,
            rowOffSet: this.dataGridParams.rowOffSet,
            sortByField: this.dataGridParams.sortByField,
            sortOrder: this.dataGridParams.sortOrder,
            dateSearchField: this.dataGridParams.dateSearchField,
            fromDate: this.dataGridParams.fromDate,
            toDate: this.dataGridParams.toDate,
        };

        const searchValues = this.tabsControl[0].searchForm.value;

        this.dataGridParams.shareName = _.get(searchValues, 'sharename', null);
        this.dataGridParams.isin = _.get(searchValues, 'isin', null);
        this.dataGridParams.status = _.get(searchValues, ['status', '0', 'id'], null);
        const orderType = _.get(searchValues, ['type', '0', 'id'], null);
        this.dataGridParams.orderType = orderType === 0 ? null : orderType;
        // date filters
        this.dataGridParams.dateSearchField = _.get(searchValues, ['dateType', '0', 'id'], false);
        const fromDate = moment(_.get(searchValues, ['fromDate'], null), 'YYYY-MM-DD');
        const toDate = moment(_.get(searchValues, ['toDate'], null), 'YYYY-MM-DD').add(1, 'days').subtract(1, 'minutes');

        this.dataGridParams.fromDate = fromDate.format('YYYY-MM-DD HH:mm');
        this.dataGridParams.toDate = toDate.format('YYYY-MM-DD HH:mm');

        if (this.dataGridParams.toDate === 'Invalid date' || this.dataGridParams.fromDate === 'Invalid date') {
            this.dataGridParams.dateSearchField = null;
            this.dataGridParams.fromDate = null;
            this.dataGridParams.toDate = null;
        }

        if (JSON.stringify(tmpDataGridParams) !== JSON.stringify(this.dataGridParams)) {
            this.getOrdersList();
        }
    }

    refresh(state: ClrDatagridStateInterface) {
        let filters: { [prop: string]: any[] } = {};
        if (state.filters) {
            for (const filter of state.filters) {
                const {property, value} = <{ property: string, value: string }>filter;
                filters[property] = [value];
            }
        }

        const tmpDataGridParams = {
            shareName: this.dataGridParams.shareName,
            isin: this.dataGridParams.isin,
            status: this.dataGridParams.status,
            orderType: this.dataGridParams.orderType,
            pageSize: this.dataGridParams.pageSize,
            rowOffSet: this.dataGridParams.rowOffSet,
            sortByField: this.dataGridParams.sortByField,
            sortOrder: this.dataGridParams.sortOrder,
            dateSearchField: this.dataGridParams.dateSearchField,
            fromDate: this.dataGridParams.fromDate,
            toDate: this.dataGridParams.toDate,
        };

        if (state.sort) {
            switch (state.sort.by) {
                case 'orderRef':
                    this.dataGridParams.sortByField = 'orderId';
                    break;
                case 'investor':
                    this.dataGridParams.sortByField = 'investorWalletID';
                    break;
                case 'orderType':
                    this.dataGridParams.sortByField = 'orderType';
                    break;
                case 'isin':
                    this.dataGridParams.sortByField = 'isin';
                    break;
                case 'shareName':
                    this.dataGridParams.sortByField = 'shareName';
                    break;
                case 'shareCurrency':
                    this.dataGridParams.sortByField = 'currency';
                    break;
                case 'quantity':
                    this.dataGridParams.sortByField = 'quantity';
                    break;
                case 'grossAmount':
                    this.dataGridParams.sortByField = 'amountWithCost';
                    break;
                case 'orderDate':
                    this.dataGridParams.sortByField = 'orderDate';
                    break;
                case 'cutOffDate':
                    this.dataGridParams.sortByField = 'cutoffDate';
                    break;
                case 'settlementDate':
                    this.dataGridParams.sortByField = 'settlementDate';
                    break;
                case 'orderStatus':
                    this.dataGridParams.sortByField = 'orderStatus';
                    break;
            }
            this.dataGridParams.sortOrder = (!state.sort.reverse) ? 'asc' : 'desc';
        }

        this.dataGridParams.pageSize = this.itemPerPage;
        this.dataGridParams.rowOffSet = (state.page.from / this.itemPerPage);
        // this.loading = false; // temp debug

        // send request only if changes
        if (JSON.stringify(tmpDataGridParams) !== JSON.stringify(this.dataGridParams)) {
            this.loading = true;
            this.getOrdersList();
        }

        this.detectChanges();
    }

    getOrdersList() {
        if (this.myDetails && this.myDetails.userType && this.myDetails.userType === 36) {  // AM side
            const asyncTaskPipe = this.ofiOrdersService.requestManageOrdersList(this.dataGridParams);

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [ofiManageOrderActions.OFI_SET_MANAGE_ORDER_LIST],
                [],
                asyncTaskPipe,
                {},
            ));
        } else if (this.myDetails && this.myDetails.userType && this.myDetails.userType === 46) {  // INV side
            const asyncTaskPipe = this.ofiOrdersService.requestInvestorOrdersList(this.dataGridParams);

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [ofiMyOrderActions.OFI_SET_MY_ORDER_LIST],
                [],
                asyncTaskPipe,
                {},
            ));
        }
    }

    showTypes(order) {
        const obj = this.orderTypes.find(o => o.id === order.orderType);
        if (obj !== undefined) {
            return obj.text;
        } else {
            return 'Not found!';
        }
    }

    showInvestor(order) {
        if (this.walletDirectory[order.investorWalletID] && this.walletDirectory[order.investorWalletID].walletName) {
            return this.walletDirectory[order.investorWalletID].walletName;
        } else {
            return 'Not found!';
        }
    }

    showCurrency(order) {
        const obj = this.currencyList.find(o => o.id === order.currency);
        if (obj !== undefined) {
            return obj.text;
        } else {
            return 'Not found!';
        }
    }

    showStatus(order) {
        if (this.orderStatuses[order.orderStatus] && this.orderStatuses[order.orderStatus].text) {
            return this.orderStatuses[order.orderStatus].text;
        } else {
            return 'Not found!';
        }
    }

    buildLink(order, index) {
        let dest = '';
        if (this.isInvestorUser) {
            dest = 'order-book/my-orders/' + order.orderID;
        } else {
            dest = 'manage-orders/' + order.orderID;
        }
        this.router.navigateByUrl(dest);
    }


    /**
     * Update Wallet Connection
     * ------------------------
     * Updates the view depending on what wallet we're using.
     *
     * @return {void}
     */
    private updateWalletConnection(): void {
        /* Loop over my wallets, and find the one we're connected to. */
        let wallet;
        if (this.connectedWalletId && Object.keys(this.myWallets).length) {
            for (wallet in this.myWallets) {
                if (wallet.toString() === this.connectedWalletId.toString()) {
                    this.connectedWalletName = this.myWallets[wallet].walletName;
                    break;
                }
            }
        }

        /* Detect changes. */
        this.detectChanges();

        /* Return. */
        return;
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
     * =============
     * Tab Functions
     * =============
     */

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
            ...this.tabsControl.slice(index + 1, this.tabsControl.length)
        ];

        /* Reset tabs. */
        this.router.navigateByUrl('/manage-orders/list');

        this.tabsControl[0].active = true;

        /* Return */
        return;
    }

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

    /**
     * ===============
     * Alert Functions
     * ===============
     */

    /**
     * Show Error Message
     * ------------------
     * Shows an error popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    private showError(message) {
        /* Show the error. */
        this.alertsService.create('error', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-danger">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    /**
     * Show Warning Message
     * ------------------
     * Shows a warning popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    private showWarning(message) {
        /* Show the error. */
        this.alertsService.create('warning', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-warning">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    /**
     * Show Success Message
     * ------------------
     * Shows an success popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    showSuccess(message) {
        /* Show the message. */
        this.alertsService.create('success', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-success">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        // this.changeDetectorRef.detach();
        //
        /* Unsunscribe Observables. */
        this.subscriptions.forEach(subscription => subscription.unsubscribe());

        this.setOrdersFilters();
        this.ngRedux.dispatch(ofiManageOrderActions.setAllTabs(this.tabsControl));
    }

}
