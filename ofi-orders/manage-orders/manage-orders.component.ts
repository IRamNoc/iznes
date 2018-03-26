/* Core/Angular imports. */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

import {NgRedux, select} from '@angular-redux/store';
import {Unsubscribe} from 'redux';
import {fromJS} from 'immutable';

/* Services. */
import {WalletNodeRequestService} from '@setl/core-req-services';
import {immutableHelper, SagaHelper, commonHelper} from '@setl/utils';

/* Ofi Orders request service. */
import {OfiOrdersService} from '../../ofi-req-services/ofi-orders/service';

/* Ofi Corp Actions request service. */
import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';

/* Ofi Management Company request service. */
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';

/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';

/* Ofi Store stuff. */
import {ofiManageOrderActions} from '@ofi/ofi-main/ofi-store';
import * as math from 'mathjs';
import {ActivatedRoute, Params, Router} from '@angular/router';

/* Clarity */
import {ClrDatagridStateInterface} from '@clr/angular';

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

    searchForm: FormGroup;

    /* Datagrid server driven */
    total: number;
    itemPerPage = 10;
    dataGridParams = {
        shareName: null,
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
    lastPage: number;
    loading = true;

    // Locale
    language = 'fr';

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

    /* expandable div */
    isOptionalFilters = false;

    /* Ui Lists. */
    orderStatuses: Array<SelectedItem> = [
        {id: -3, text: 'All'},
        {id: 1, text: 'Initiated'},
        {id: 2, text: 'Waiting NAV'},
        {id: 3, text: 'Waiting Settlement'},
        {id: -1, text: 'Settled'},
        // {id: 4, text: 'Precentralised'},
        // {id: 5, text: 'Centralised'},
        {id: 6, text: 'Unpaid'},
        {id: 0, text: 'Cancelled'},
    ];
    orderTypes: Array<SelectedItem> = [
        {id: 0, text: 'All'},
        {id: 3, text: 'Subscription'},
        {id: 4, text: 'Redemption'},
    ];
    dateTypes: Array<SelectedItem> = [
        {id: 'orderDate', text: 'orderDate'},
        {id: 'cutOffDate', text: 'cutOffDate'},
        {id: 'navDate', text: 'navDate'},
        {id: 'settlementDate', text: 'settlementDate'},
        {id: 'valuationDate', text: 'valuationDate'},
    ];

    currencyList = [
        {id : 0, code: 'EUR', label: 'Euro'},
        {id : 1, code: 'USD', label: 'US Dollar'},
        {id : 2, code: 'GBP', label: 'Pound Sterling'},
        {id : 3, code: 'CHF', label: 'Swiss Franc'},
        {id : 4, code: 'JPY', label: 'Yen'},
        {id : 5, code: 'AUD', label: 'Australian Dollar'},
        {id : 6, code: 'NOK', label: 'Norwegian Krone'},
        {id : 7, code: 'SEK', label: 'Swedish Krona'},
        {id : 8, code: 'ZAR', label: 'Rand'},
        {id : 9, code: 'RUB', label: 'Russian Ruble'},
        {id : 10, code: 'SGD', label: 'Singapore Dollar'},
        {id : 11, code: 'AED', label: 'United Arab Emirates Dirham'},
        {id : 12, code: 'CNY', label: 'Yuan Renminbi'},
        {id : 13, code: 'PLN', label: 'Zloty'},
    ];

    /* Public Properties */
    public connectedWalletName: string = '';

    /* Private Properties. */
    private subscriptions: Array<any> = [];
    private reduxUnsubscribe: Unsubscribe;
    ordersList: Array<any> = [];
    private myDetails: any = {};
    private myWallets: any = [];
    private walletDirectory: any = [];
    private connectedWalletId: any = 0;
    private managementCompanyList: any = [];

    userAssetList: Array<any> = [];
    private requestedSearch: any;
    private sort: { name: string, direction: string } = {name: 'dateEntered', direction: 'ASC'}; // default search.

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['ofi', 'ofiOrders', 'manageOrders', 'requested']) requestedOfiAmOrdersObj;
    @select(['ofi', 'ofiOrders', 'manageOrders', 'newOrder']) newOrderOfiAmOrdersObj;
    @select(['ofi', 'ofiOrders', 'manageOrders', 'orderList']) OfiAmOrdersListObj;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'requested']) requestedOfiManagementCompanyObj;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) OfiManagementCompanyListObj;
    // @select(['ofi', 'ofiOrders', 'homeOrders', 'orderBuffer']) orderBufferOb: any;
    // @select(['ofi', 'ofiOrders', 'homeOrders', 'orderFilter']) orderFilterOb: any;
    @select(['wallet', 'myWallets', 'walletList']) myWalletsOb: any;
    @select(['wallet', 'walletDirectory', 'walletList']) walletDirectoryOb: any;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb: any;
    // @select(['ofi', 'ofiCorpActions', 'ofiUserAssets', 'ofiUserAssetList']) userAssetListOb: any;

    constructor(private ofiOrdersService: OfiOrdersService,
                private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private route: ActivatedRoute,
                private router: Router,
                private _fb: FormBuilder,
                private mcService: OfiManagementCompanyService,
                private ofiCorpActionService: OfiCorpActionService,
                private walletNodeRequestService: WalletNodeRequestService,
                // private _confirmationService: ConfirmationService,
                // private _blockchainContractService: BlockchainContractService,
                // public _numberConverterService: NumberConverterService,
    ) {
        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));

        this.subscriptions.push(this.requestedOfiManagementCompanyObj.subscribe((requested) => this.getManagementCompanyRequested(requested)));
        this.subscriptions.push(this.OfiManagementCompanyListObj.subscribe((list) => this.getManagementCompanyListFromRedux(list)));
        this.subscriptions['walletDirectory'] = this.walletDirectoryOb.subscribe((walletDirectory) => { this.walletDirectory = walletDirectory; });

        this.subscriptions.push(this.requestedOfiAmOrdersObj.subscribe((requested) => this.getAmOrdersRequested(requested)));
        this.subscriptions.push(this.OfiAmOrdersListObj.subscribe((list) => this.getAmOrdersListFromRedux(list)));
        this.subscriptions.push(this.newOrderOfiAmOrdersObj.subscribe((newOrder) => this.getAmOrdersNewOrder(newOrder)));

        this.createForm();

        this.setInitialTabs();
    }

    ngOnInit() {
        this.subscriptions.push(this.searchForm.valueChanges.subscribe((form) => this.requestSearch(form)));
        this.changeDetectorRef.markForCheck();

        /* State. */
        // const state = this.ngRedux.getState();

        // /* Ok, let's check that we have the orders list, if not... */
        // if (!getOfiManageOrderList(state).length) {
        //     /* ...request using the defaults in the form. */
        //     this.getOrdersBySearch();
        // }

        // /* Subscribe for the order filter. */
        // this.subscriptions['order-filter'] = this.orderFilterOb.subscribe((filter) => {
        //     /* Check if we have a filter set. */
        //     console.log(' | preset filter: ', filter);
        //     this.handlePresetFilter(filter);
        //
        //     /* Detect changes. */
        //     this.changeDetectorRef.detectChanges();
        // });
        //
        // this.subscriptions['routeParam'] = this.route.params.subscribe((params: Params) => {
        //     const tabId = _.get(params, 'tabid', 0);
        //     this.setTabActive(tabId);
        // });
    }

    ngAfterViewInit() {
        /* Do observable subscriptions here. */
        const state = this.ngRedux.getState();

        // /* Orders list. */
        // this.subscriptions['orders-list'] = this.ordersListOb.subscribe((orderList) => {
        //     /* Subscribe and set the orders list. */
        //
        //     const orderListNew = immutableHelper.copy(orderList);
        //
        //     this.ordersList = orderListNew.map((order) => {
        //         /* Pointer. */
        //         let fixed = order;
        //
        //         /* Fix dates. */
        //         fixed.cutoffDateStr = this.formatDate('YYYY-MM-DD', new Date(fixed.cutoffDate));
        //         fixed.cutoffTimeStr = this.formatDate('hh:mm', new Date(fixed.cutoffDate));
        //         fixed.deliveryDateStr = this.formatDate('YYYY-MM-DD', new Date(fixed.deliveryDate));
        //
        //         fixed.price = this._numberConverterService.toFrontEnd(fixed.price);
        //
        //         let metaData = immutableHelper.copy(order.metaData);
        //
        //         metaData.price = this._numberConverterService.toFrontEnd(metaData.price);
        //         metaData.units = this._numberConverterService.toFrontEnd(metaData.units);
        //
        //         metaData.total = math.round(metaData.units * fixed.price, 2);
        //
        //         fixed.metaData = metaData;
        //
        //         /* Return. */
        //         return fixed;
        //     });
        //
        //     /* Detect Changes. */
        //     this.changeDetectorRef.detectChanges();
        // });
        //
        // this.subscriptions['order-list-requested'] = this.requestedOb.subscribe((requested) => {
        //     this.getOrdersBySearch(requested);
        // });

        /* Subscribe for this user's details. */
        this.subscriptions['my-details'] = this.myDetailOb.subscribe((myDetails) => {
            /* Assign list to a property. */
            this.myDetails = myDetails;
        });

        /* Subscribe for this user's wallets. */
        this.subscriptions['my-wallets'] = this.myWalletsOb.subscribe((walletsList) => {
            /* Assign list to a property. */
            this.myWallets = walletsList;

            /* Update wallet name. */
            this.updateWalletConnection();
        });

        /* Subscribe for this user's connected info. */
        this.subscriptions['my-connected'] = this.connectedWalletOb.subscribe((connectedWalletId) => {
            /* Assign list to a property. */
            this.connectedWalletId = connectedWalletId;

            /* Update wallet name. */
            this.updateWalletConnection();
        });

        // /* Subscribe for the user issued asset list. */
        // this.subscriptions['user-issued-assets'] = this.userAssetListOb.subscribe((list) => {
        //     /* Assign list to a property. */
        //     this.userAssetList = list;
        // });
        //
        // /* Subscribe for the order buffer. */
        // this.subscriptions['order-buffer'] = this.orderBufferOb.subscribe((orderId) => {
        //     /* Check if we have an Id. */
        //     setTimeout(() => {
        //         if (orderId !== -1 && this.ordersList.length) {
        //             /* If we do, then hande the viewing of it. */
        //             this.handleViewOrder(orderId);
        //
        //             this.ofiOrdersService.resetOrderBuffer();
        //         }
        //     }, 100);
        // });

        // /* Check if we need to request the user issued assets. */
        // let userIssuedAssetsList = getOfiUserIssuedAssets(state);
        // if (!userIssuedAssetsList.length) {
        //     /* If the list is empty, request it. */
        //     this.ofiCorpActionService.getUserIssuedAssets().then(() => {
        //         /* Redux subscription handles setting the property. */
        //         this.changeDetectorRef.detectChanges();
        //     }).catch((error) => {
        //         /* Handle error. */
        //         console.warn('Failed to get your issued assets: ', error);
        //     });
        // }
    }

    createForm() {
        this.searchForm = this._fb.group({
            sharename: [
                '',
            ],
            status: [
                '',
            ],
            type: [
                '',
            ],
            dateType: [
                '',
            ],
            fromDate: [
                '',
            ],
            toDate: [
                '',
            ],
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

    getAmOrdersRequested(requested): void {
        if (!requested) {
            OfiOrdersService.setNewOrder(false, this.ngRedux);
            OfiOrdersService.defaultRequestManageOrdersList(this.ofiOrdersService, this.ngRedux);
        }
    }

    getAmOrdersNewOrder(newOrder): void {
        if (newOrder) {
            this.loading = true;
            this.getAmOrdersList();
            this.changeDetectorRef.markForCheck();
        }
    }

    getAmOrdersListFromRedux(list) {
        const listImu = fromJS(list);

        this.ordersList = listImu.reduce((result, item) => {

            result.push({
                amAddress: item.get('amAddress'),
                amCompanyID: item.get('amCompanyID'),
                amWalletID: item.get('amWalletID'),
                amountWithCost: item.get('amountWithCost'),
                byAmountOrQuantity: item.get('byAmountOrQuantity'),
                canceledBy: item.get('canceledBy'),
                contractAddr: item.get('contractAddr'),
                contractExpiryTs: item.get('contractAddr'),
                contractStartTs: item.get('contractStartTs'),
                currency: item.get('currency'),
                cutoffDate: item.get('cutoffDate'),
                estimatedAmountWithCost: item.get('estimatedAmountWithCost'),
                estimatedPrice: item.get('estimatedPrice'),
                estimatedQuantity: item.get('estimatedQuantity'),
                feePercentage: item.get('feePercentage'),
                fundShareID: item.get('fundShareID'),
                fundShareName: item.get('fundShareName'),
                iban: item.get('iban'),
                investorAddress: item.get('investorAddress'),
                investorWalletID: item.get('investorWalletID'),
                isin: item.get('isin'),
                label: item.get('label'),
                navEntered: item.get('navEntered'),
                orderID: item.get('orderID'),
                orderNote: item.get('orderNote'),
                orderStatus: item.get('orderStatus'),
                orderType: item.get('orderType'),
                investorIban: item.get('investorIban'),
                orderFundShareID: item.get('orderFundShareID'),
                platFormFee: item.get('platFormFee'),
                price: item.get('price'),
                quantity: item.get('quantity'),
                settlementDate: item.get('settlementDate'),
                totalResult: item.get('totalResult'),
                valuationDate: item.get('valuationDate'),
            });

            return result;
        }, []);

        if (this.ordersList.length > 0) {
            this.total = this.ordersList[0].totalResult;
            this.lastPage = Math.ceil(this.total / this.itemPerPage);
            this.loading = false;
        } else {
            this.total = 0;
            this.lastPage = 0;
            this.loading = false;
        }

        this.changeDetectorRef.markForCheck();
    }

    getManagementCompanyRequested(requested): void {
        // console.log('requested', requested);
        if (!requested) {
            OfiManagementCompanyService.defaultRequestManagementCompanyList(this.mcService, this.ngRedux);
        }
    }

    getManagementCompanyListFromRedux(managementCompanyList) {
        const managementCompanyListImu = fromJS(managementCompanyList);

        this.managementCompanyList = managementCompanyListImu.reduce((result, item) => {

            result.push({
                companyID: item.get('companyID', 0),
                companyName: item.get('companyName', ''),
                country: item.get('country', ''),
                addressPrefix: item.get('addressPrefix', ''),
                postalAddressLine1: item.get('postalAddressLine1', ''),
                postalAddressLine2: item.get('postalAddressLine2', ''),
                city: item.get('city', ''),
                stateArea: item.get('stateArea', ''),
                postalCode: item.get('postalCode', ''),
                taxResidence: item.get('taxResidence', ''),
                registrationNum: item.get('registrationNum', ''),
                supervisoryAuthority: item.get('supervisoryAuthority', ''),
                numSiretOrSiren: item.get('numSiretOrSiren', ''),
                creationDate: item.get('creationDate', ''),
                shareCapital: item.get('shareCapital', 0),
                commercialContact: item.get('commercialContact', ''),
                operationalContact: item.get('operationalContact', ''),
                directorContact: item.get('directorContact', ''),
                lei: item.get('lei', ''),
                bic: item.get('bic', ''),
                giinCode: item.get('giinCode', ''),
                logoName: item.get('logoName', ''),
                logoURL: item.get('logoURL', '')
            });

            return result;
        }, []);

        this.changeDetectorRef.markForCheck();
    }

    placeFakeOrder() {
        const asyncTaskPipe = this.ofiOrdersService.placeFakeOrder();

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                console.log('save success fake order', data); // success
            },
            (data) => {
                console.log('Error: ', data);
            })
        );
    }

    setInitialTabs() {

        // Get opened tabs from redux store.
        const openedTabs = immutableHelper.get(this.ngRedux.getState(), ['ofi', 'ofiOrders', 'manageOrders', 'openedTabs']);

        if (openedTabs.length === 0) {
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
            return true;
        }

        this.tabsControl = openedTabs;
    }

    exportOrders() {

        console.log('EXPORT ORDERS TO CSV');

        // const asyncTaskPipe = this.ofiOrdersService.requestExportOrders({
        //     data: this.ordersList
        // });
        //
        // this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
        //     asyncTaskPipe,
        //     (data) => {
        //         console.log('export data success', data); // success
        //     },
        //     (data) => {
        //         console.log('Error: ', data);
        //     })
        // );

        // call procedure iznexportorders

        // data : ordersList

        // orderRef: 'Order Ref',
        // orderType: 'Order Type',
        // isin: 'ISIN',
        // shareName: 'Share Name',
        // amCompanyName: 'Asset Management Company',
        // currency: 'Share Currency',
        // quantity: 'Quantity',
        // latestNav: 'Latest NAV',
        // grossAmount: 'Gross Amount',
        // feesAmount: 'Fees Amount',
        // orderDate: 'Order Date',
        // cutOffDate: 'Cut-off Date',
        // navDate: 'NAV Date',
        // settlementDate: 'Settlement Date',
        // status: 'Status'
    }

    requestSearch(form) {

        const tmpDataGridParams = {
            shareName: this.dataGridParams.shareName,
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

        this.dataGridParams.shareName = (this.tabsControl[0].searchForm.get('sharename').value !== '' && this.tabsControl[0].searchForm.get('sharename').value.length > 2) ? this.tabsControl[0].searchForm.get('sharename').value : null;
        this.dataGridParams.status = (this.tabsControl[0].searchForm.get('status').value && this.tabsControl[0].searchForm.get('status').value[0] && this.tabsControl[0].searchForm.get('status').value[0].id) ? this.tabsControl[0].searchForm.get('status').value[0].id : null;
        this.dataGridParams.orderType = (this.tabsControl[0].searchForm.get('type').value && this.tabsControl[0].searchForm.get('type').value[0] && this.tabsControl[0].searchForm.get('type').value[0].id) ? this.tabsControl[0].searchForm.get('type').value[0].id : null;
        // date filters
        if ((this.tabsControl[0].searchForm.get('dateType').value && this.tabsControl[0].searchForm.get('dateType').value[0] && this.tabsControl[0].searchForm.get('dateType').value[0].id)) {
            const tmpDateSearchField = (this.tabsControl[0].searchForm.get('dateType').value && this.tabsControl[0].searchForm.get('dateType').value[0] && this.tabsControl[0].searchForm.get('dateType').value[0].id) ? this.tabsControl[0].searchForm.get('dateType').value[0].id : null;
            const tmpFromDate = (this.tabsControl[0].searchForm.get('fromDate').value !== '' && !isNaN(Date.parse(this.tabsControl[0].searchForm.get('fromDate').value))) ? this.tabsControl[0].searchForm.get('fromDate').value : null;
            const tmpToDate = (this.tabsControl[0].searchForm.get('toDate').value !== '' && !isNaN(Date.parse(this.tabsControl[0].searchForm.get('toDate').value))) ? this.tabsControl[0].searchForm.get('toDate').value : null;
            if (tmpDateSearchField !== null && tmpFromDate !== null && tmpToDate !== null) {
                this.dataGridParams.dateSearchField = tmpDateSearchField;
                this.dataGridParams.fromDate = tmpFromDate;
                this.dataGridParams.toDate = tmpToDate;
            }
        } else {
            this.dataGridParams.dateSearchField = null;
            this.dataGridParams.fromDate = null;
            this.dataGridParams.toDate = null;
        }

        if (JSON.stringify(tmpDataGridParams) !== JSON.stringify(this.dataGridParams)) {
            this.getAmOrdersList();
        }
    }

    refresh(state: ClrDatagridStateInterface) {
        let filters: {[prop: string]: any[]} = {};
        if (state.filters) {
            for (const filter of state.filters) {
                const {property, value} = <{property: string, value: string}>filter;
                filters[property] = [value];
            }
        }

        // console.log('state page', state.page);
        // console.log('page asked', state.page.from);
        // console.log('sort', state.sort);
        // console.log('raw filters', state.filters);
        // console.log('map filters', filters);

        const tmpDataGridParams = {
            shareName: this.dataGridParams.shareName,
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
                // orderId, orderType, isin, shareName, currency, quantity, amountWithCost, orderDate, cutoffDate, settlementDate, orderStatus
                case 'orderRef':
                    this.dataGridParams.sortByField = 'orderId';
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

        this.dataGridParams.pageSize =  this.itemPerPage;
        this.dataGridParams.rowOffSet = (state.page.from / this.itemPerPage);
        // this.loading = false; // temp debug

        // send request only if changes
        if (JSON.stringify(tmpDataGridParams) !== JSON.stringify(this.dataGridParams)) {
            this.loading = true;
            this.getAmOrdersList();
        }

        this.changeDetectorRef.markForCheck();
    }

    getAmOrdersList() {
        console.log('dataGridParams', this.dataGridParams);

        const asyncTaskPipe = this.ofiOrdersService.requestManageOrdersList(this.dataGridParams);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [ofiManageOrderActions.OFI_SET_MANAGE_ORDER_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    showOrderType(index) {
        const obj = this.orderTypes.find(o => o.id === this.ordersList[index].orderType);
        if (obj !== undefined) {
            return obj.text;
        } else {
            return 'Error!';
        }
    }

    showInvestor(index) {
        if (this.walletDirectory[this.ordersList[index].investorWalletID] && this.walletDirectory[this.ordersList[index].investorWalletID].walletName) {
            return this.walletDirectory[this.ordersList[index].investorWalletID].walletName;
        } else {
            return 'Error!';
        }
    }

    showManagementCompany(index) {
        const obj = this.managementCompanyList.find(o => o.companyID === this.ordersList[index].amCompanyID);
        if (obj !== undefined) {
            return obj.companyName;
        } else {
            return 'Error!';
        }
    }

    showCurrency(index) {
        const obj = this.currencyList.find(o => o.id === this.ordersList[index].currency);
        if (obj !== undefined) {
            return obj.label;
        } else {
            return 'Error!';
        }
    }

    showStatus(index) {
        if (this.orderStatuses[this.ordersList[index].orderStatus] && this.orderStatuses[this.ordersList[index].orderStatus].text) {
            return this.orderStatuses[this.ordersList[index].orderStatus].text;
        } else {
            return 'Error!';
        }
    }

    /**
     * Handle Preset Filter
     * @param filter
     */
    // private handlePresetFilter(filter: string): void {
    //     if (filter !== '') {
    //         /* If we do, then let's patch the form value... */
    //         console.log(' | preset filter: ', filter);
    //         this.tabsControl[0].searchForm.controls['status'].patchValue(
    //             this.getStatusByName(filter) // resolve the status
    //         );
    //
    //         /* Detect changes. */
    //         this.changeDetectorRef.detectChanges();
    //
    //         /* ...also, reset the filter... */
    //         this.ofiOrdersService.resetOrderFilter();
    //
    //         /* ...and update the view. */
    //         this.getOrdersBySearch();
    //     }
    //
    //     /* Detect changes. */
    //     this.changeDetectorRef.detectChanges();
    //
    //     /* Return. */
    //     return;
    // }

    /**
     * getStatusByName
     * @param requestedName
     */
    // public getStatusByName(requestedName: string): Array<SelectedItem> {
    //     /* Variables. */
    //     let finds = [];
    //
    //     /* Let's see if we can find the status. */
    //     let status: any;
    //     for (status of this.orderStatuses) {
    //         if (status.text.toLowerCase() == requestedName) {
    //             finds.push(status);
    //             break;
    //         }
    //     }
    //
    //     /* Return. */
    //     console.log(finds);
    //     return finds;
    // }

    /**
     * Handle View Order
     * -----------------
     * Handles viewing a order.
     *
     * @return {void}
     */
    // public handleViewOrder(orderId: number): void {
    //     /* Find the order. */
    //     let
    //         foundActive = false,
    //         order = this.getOrderById(orderId);
    //     if (!order) return;
    //
    //     /* Check if the tab is already open. */
    //     this.tabsControl.map((tab, i) => {
    //         if (tab.orderId == orderId) {
    //             /* Set flag... */
    //             foundActive = true;
    //
    //             /* ...set tab active... */
    //             this.router.navigateByUrl(`/manage-orders/${i}`);
    //
    //             /* ...and gotta call this again. */
    //             this.changeDetectorRef.detectChanges();
    //         }
    //
    //     });
    //
    //     /* If we found an active tab, no need to do anymore... */
    //     if (foundActive) {
    //         return;
    //     }
    //
    //     /* Push a new tab into the tabs control... */
    //     this.tabsControl.push(
    //         {
    //             'title': {
    //                 'icon': 'fa-pencil',
    //                 'text': this.padNumberLeft(order.arrangementID, 5)
    //             },
    //             'orderId': orderId,
    //             'active': false,
    //             'orderData': order
    //         }
    //     );
    //
    //     /* ...then set it active. */
    //     this.router.navigateByUrl(`/manage-orders/${this.tabsControl.length - 1}`);
    //
    //     /* Return. */
    //     return;
    // }

    /**
     * Handle Cancel Order
     * -----------------
     * Handles canceling an order.
     *
     * @return {void}
     */
    // public handleCancelOrder(orderId: number): void {
    //     /* Let's first find the order... */
    //     let
    //         request = {},
    //         order = this.getOrderById(orderId);
    //
    //     /* ...or return if we couldn't find it. */
    //     if (!order) return;
    //
    //     /* Now let's build the request that we'll send... */
    //     request['arrangementId'] = order.arrangementID;
    //     request['walletId'] = this.connectedWalletId;
    //     request['status'] = 0;
    //     request['price'] = order.price;
    //
    //     /* Let's ask the user if they're sure... */
    //     this._confirmationService.create(
    //         '<span>Cancelling an Order</span>',
    //         '<span>Are you sure you want to cancel this order?</span>'
    //     ).subscribe((ans) => {
    //         /* ...if they are... */
    //         if (ans.resolved) {
    //             /* Send the request. */
    //             this.ofiOrdersService.updateOrder(request).then((response) => {
    //                 /* Handle success. */
    //                 this.showSuccess('Successfully cancelled this order.');
    //             }).catch((error) => {
    //                 /* Handle error. */
    //                 this.showError('Failed to cancel this order.');
    //                 console.warn(error);
    //             });
    //         }
    //     });
    //
    //     /* Return. */
    //     return;
    // }

    /**
     * Update Order State
     * -----------------
     * Handles updating an order.
     *
     * @return {void}
     */
    // public updateOrderStatus(orderId: number, status: number): void {
    //     /* Let's first find the order... */
    //     let
    //         request = {},
    //         order = this.getOrderById(orderId);
    //
    //     /* ...or return if we couldn't find it. */
    //     if (!order) return;
    //
    //     /* Now let's build the request that we'll send... */
    //     request['arrangementId'] = order.arrangementID;
    //     request['walletId'] = this.connectedWalletId;
    //     request['status'] = status;
    //     request['price'] = order.price;
    //
    //     /* Send the request. */
    //     this.ofiOrdersService.updateOrder(request).then((response) => {
    //         /* Handle success. */
    //         let i;
    //         for (i in this.tabsControl) {
    //             if (this.tabsControl[i].orderId == orderId) {
    //                 this.tabsControl[i].orderData.status = status;
    //                 break;
    //             }
    //         }
    //     }).catch((error) => {
    //         /* Handle error. */
    //         console.warn(error);
    //     });
    //
    //     /* Return. */
    //     return;
    // }

    /**
     * Handle Approve Order
     * -----------------
     * Handles approving/authorising an order.
     *
     * @return {void}
     */
    // public handleApproveOrder(orderId: number): void {
    //     /* Let's first find the order... */
    //     let
    //         request = {},
    //         order = this.getOrderById(orderId);
    //
    //     /* ...or return if we couldn't find it. */
    //     if (!order) return;
    //
    //     console.log(' |---- Approving contract.')
    //     console.log(' | order:', order);
    //
    //     request['arrangementId'] = order.arrangementID;
    //     request['walletId'] = this.connectedWalletId;
    //
    //     console.log(' | request:', request);
    //
    //     /* Get contract information for this order. */
    //     this.ofiOrdersService.getContractsByOrder(request).then((response) => {
    //         /* Handle success. */
    //         console.log(' | < response:', response);
    //
    //         /* Make call to wallet node. */
    //         var contractAddress = response[1].Data[0].contractAddr;
    //         this.getContractData(contractAddress, order);
    //
    //         console.log(' | < contractAddr:', contractAddress);
    //
    //     }).catch((error) => {
    //         /* Handle error. */
    //         this.showError('Failed to fetch the contract information for this order.');
    //         console.warn(' | < error:', error);
    //     });
    //
    //     /* Return. */
    //     return;
    // }

    /**
     * Get Contract Data
     * -----------------
     * Get's contract data and then sends the WN request.
     *
     * @param  {string} contractAddress [description]
     * @return {any}                    [description]
     */
    // public getContractData(contractAddress: string, order: any): any {
    //     /* Let's get the wallet id for this asset. */
    //     let i, walletId = 0;
    //     for (i in this.userAssetList) {
    //         if (this.userAssetList[i].asset == order.asset) {
    //             walletId = this.userAssetList[i].walletId;
    //             break;
    //         }
    //     }
    //
    //     /* If no wallet id, return. */
    //     if (!walletId) return;
    //
    //     /* Reqest the contract by address. */
    //     this.ofiOrdersService.buildRequest({
    //         'taskPipe': this.walletNodeRequestService.requestContractByAddress({
    //             'address': contractAddress,
    //             'walletId': walletId
    //         })
    //     }).then((response) => {
    //         /* Handle success. */
    //         let contractData = response[1].data;
    //
    //         /* Get the wallet commit data. */
    //         let commitData = this._blockchainContractService.handleWalletCommitContract(
    //             contractData,
    //             contractAddress,
    //             contractData['authorisations'][0][0],
    //             0,
    //             'authorisationCommit'
    //         );
    //
    //         /* Set some other meta data. */
    //         commitData['walletid'] = walletId;
    //         commitData['address'] = contractData['authorisations'][0][0];
    //
    //         /* Send the authorisation request. */
    //         this.ofiOrdersService.buildRequest({
    //             'taskPipe': this.walletNodeRequestService.walletCommitToContract(commitData),
    //         }).then((response) => {
    //             /* Update this order to waiting for payement, but not with a button for approval. */
    //             // Daemon does this.
    //             // this.updateOrderStatus(order.arrangementID, -1);
    //
    //             /* Detect changes. */
    //             // this.changeDetectorRef.detectChanges();
    //             this.showSuccess('Successfully approved this order.');
    //         }).catch((error) => {
    //             console.warn('authorisation error: ', error);
    //         });
    //     }).catch((error) => {
    //         /* Handle error. */
    //         console.log('request contract by address:', error);
    //     });
    // }

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
                if (wallet === this.connectedWalletId) {
                    this.connectedWalletName = this.myWallets[wallet].walletName;
                    break;
                }
            }
        }

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();

        /* Return. */
        return;
    }

    /**
     * Get Order By ID
     * ---------------
     * Get an order by it's ID.
     *
     * @param  {number} orderId - an order id.
     * @return {any|boolean} - the order, if found or just false.
     */
    // private getOrderById(orderId: number): any | boolean {
    //     /* Ok, let's loop over the orders list... */
    //     let order;
    //     for (order of this.ordersList) {
    //         /* ..if this is the order, break, to return it... */
    //         if (order.arrangementID === orderId) break;
    //
    //         /* ...else set order to false, incase this is last loop. */
    //         order = false;
    //     }
    //
    //     /* Return. */
    //     return order;
    // }

    /**
     * Request Search
     * --------------
     * This is a buffer function that stops button mashing!
     * A request comes in, and after 500ms it's actually processed.
     * If another comes in, in that time, the timeout is reset.
     *
     * @return {void}
     */
    // private requestSearch(): void {
    //     /* Let's check if we've got a request already... */
    //     if (this.requestedSearch) {
    //         /* ...if we do, cancel it. */
    //         clearTimeout(this.requestedSearch);
    //     }
    //
    //     /* Now let's set a new timeout. */
    //     let timeToWait = 500; // milliseconds
    //     this.requestedSearch = setTimeout(() => {
    //         this.getOrdersBySearch();
    //     }, timeToWait);
    //
    //     /* Return. */
    //     return;
    // }

    /**
     * Get Orders By Search
     * --------------------------
     * Simply reads the search form, and requests data based on what has been entered,
     * or by defualts. Also, refreshes the order list.
     *
     * @param {boolean} requested
     * @return {void}
     */
    // private getOrdersBySearch(requested: boolean = false, event = {}): void {
    //     if (requested) {
    //         return;
    //     }
    //
    //     console.log(" |--- Filtering");
    //
    //     this.ngRedux.dispatch(ofiSetRequestedManageOrder());
    //
    //     /* Ok, let's get the search form information... */
    //     let
    //         searchForm = this.tabsControl[0].searchForm.value,
    //         request = {};
    //
    //     /* Check if we have an event to override with. */
    //     if (event.hasOwnProperty('id')) {
    //         searchForm.status = [event];
    //     }
    //
    //     /* Check if we have search parameters. */
    //     if (!searchForm.status[0] || !searchForm.type[0]) {
    //         return;
    //     }
    //
    //     console.log(" | Search form: ", searchForm);
    //
    //     /* Build the rest of it. */
    //     request['status'] = searchForm.status[0].id;
    //     request['sortOrder'] = this.sort.direction;
    //     request['sortBy'] = this.sort.name;
    //     request['partyType'] = 2;
    //     request['pageSize'] = 123456789; // we're just getting all.
    //     request['pageNum'] = 0; // no need for this.
    //     request['asset'] = searchForm.name;
    //     request['arrangementType'] = searchForm.type[0].id;
    //
    //     console.log(" | Filter: ", searchForm.status[0].text);
    //
    //     /* ...then request the new list. */
    //     this.ofiOrdersService.getManageOrdersList(request)
    //         .then(response => true) // no need to do anything here.
    //         .catch((error) => {
    //             console.warn('failed to fetch orders list: ', error);
    //             this.showError('Failed to fetch the latest orders.');
    //         });
    // }

    /**
     * Switch Sort
     * -----------
     * Switches a sort and registers which we're using.
     *
     * @param {any} event - the click event.
     * @param {string} name - the sort name.
     */
    // switchSort(event: any, name: string): void {
    //     /* Find the header's caret. */
    //     let elms = event.target.getElementsByTagName('i'), caret;
    //     if (elms.length && elms[0].classList) {
    //         caret = elms[0];
    //     }
    //
    //     /* If we've clicked the one we're sorting by, reverse sort. */
    //     if (name === this.sort.name && caret) {
    //         /* Reverse. */
    //         if (this.sort.direction === "ASC") {
    //             this.sort.direction = "DESC";
    //             caret.classList.remove('fa-caret-up');
    //             caret.classList.add('fa-caret-down');
    //         } else {
    //             this.sort.direction = "ASC";
    //             caret.classList.remove('fa-caret-down');
    //             caret.classList.add('fa-caret-up');
    //         }
    //     }
    //
    //     /* If not, then set this as the one we're sorting by. */
    //     else if (name !== this.sort.name) {
    //         this.sort.name = name;
    //         this.sort.direction = "ASC";
    //     }
    //
    //     /* Send for a search. */
    //     this.getOrdersBySearch();
    //
    //     /* Return. */
    //     return;
    // }

    /**
     * Format Date
     * -----------
     * Formats a date to a string.
     * YYYY - 4 character year
     * YY - 2 character year
     * MM - 2 character month
     * DD - 2 character date
     * hh - 2 character hour (24 hour)
     * hH - 2 character hour (12 hour)
     * mm - 2 character minute
     * ss - 2 character seconds
     *
     * @param  {string} formatString [description]
     * @param  {Date}   dateObj      [description]
     * @return {string}              [description]
     */
    private formatDate(formatString: string, dateObj: Date): string {
        /* Return if we're missing a param. */
        if (!formatString || !dateObj) return '';

        /* Return the formatted string. */
        return formatString
            .replace('YYYY', dateObj.getFullYear().toString())
            .replace('YY', dateObj.getFullYear().toString().slice(2, 3))
            .replace('MM', this.numPad((dateObj.getMonth() + 1).toString()))
            .replace('DD', this.numPad(dateObj.getDate().toString()))
            .replace('hh', this.numPad(dateObj.getHours()))
            .replace('hH', this.numPad(dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours()))
            .replace('mm', this.numPad(dateObj.getMinutes()))
            .replace('ss', this.numPad(dateObj.getSeconds()))
    }

    private numPad(num) {
        return num < 10 ? "0" + num : num;
    }

    /**
     * Calc Entry Fee
     * --------------
     * Calculates the entry fee from the grossAmount.
     *
     * @param  {number} grossAmount - the grossAmount.
     * @return {number}             - the entry fee.
     */
    private calcEntryFee(grossAmount: number): number {
        return 0; // for OFI test this is 0
        // TODO: Real example
        // return Math.round(grossAmount * .0375);
    }

    /**
     * Get Order Date
     *
     * @param  {string} dateString - the order's date string.
     * @return {string}            - the formatted date or empty string.
     */
    private getOrderDate(dateString): string {
        return this.formatDate('YYYY-MM-DD', new Date(dateString)) || '';
    }

    /**
     * Get Order Time
     *
     * @param  {string} dateString - the order's date string.
     * @return {string}            - the formatted time or empty string.
     */
    private getOrderTime(dateString): string {
        return this.formatDate('hh:mm:ss', new Date(dateString));
    }

    /**
     * Pad Number Left
     * -------------
     * Pads a number left
     *
     * @param  {number} num - the orderId.
     * @return {string}
     */
    private padNumberLeft(num: number | string, zeros?: number): string {
        /* Validation. */
        if (!num && num !== 0) return '';
        zeros = zeros || 2;

        /* Variables. */
        num = num.toString();
        let // 11 is the total required string length.
            requiredZeros = zeros - num.length,
            returnString = '';

        /* Now add the zeros. */
        while (requiredZeros--) {
            returnString += '0';
        }

        return returnString + num;
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
        this.router.navigateByUrl('/manage-orders/0');

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
    public setTabActive(index: number = 0) {
        this.tabsControl = immutableHelper.map(this.tabsControl, (item, thisIndex) => {
            return item.set('active', thisIndex === Number(index));
        });
        this.changeDetectorRef.markForCheck();
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
        this.changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (let key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }

        this.ngRedux.dispatch(ofiManageOrderActions.setAllTabs(this.tabsControl));
    }

}
