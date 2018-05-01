/* Core/Angular imports. */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {MemberSocketService} from '@setl/websocket-service';

import {NgRedux, select} from '@angular-redux/store';
import {Unsubscribe} from 'redux';
import {fromJS} from 'immutable';
import {ConfirmationService, immutableHelper, SagaHelper, commonHelper} from '@setl/utils';
import 'rxjs/add/operator/debounceTime';
import * as _ from 'lodash';
import * as moment from 'moment';

/* Services. */
import {WalletNodeRequestService} from '@setl/core-req-services';
import {OfiOrdersService} from '../../ofi-req-services/ofi-orders/service';
import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';
import {OfiManagementCompanyService} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import {OfiFundShareService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import {getOfiFundShareCurrentRequest} from '@ofi/ofi-main/ofi-store/ofi-product/fund-share';
import {NumberConverterService} from '@setl/utils/services/number-converter/service';


/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';

/* Ofi Store stuff. */
import {ofiManageOrderActions, ofiMyOrderActions} from '../../ofi-store';

/* Clarity */
import {ClrDatagridStateInterface} from '@clr/angular';

/* helper */
import {getOrderFigures} from '../../ofi-product/fund-share/helper/order-view-helper';

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
        format: 'DD/MM/YYYY',
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
    private managementCompanyList: any = [];
    fundShare = {
        mifiidChargesOneOff: null,
        mifiidChargesOngoing: null,
        mifiidTransactionCosts: null,
        mifiidServicesCosts: null,
        mifiidIncidentalCosts: null,
        keyFactOptionalData: {
            assetClass: null,
            srri: null,
            sri: null,
        },
        decimalization: null,
    };

    fundShareID = 0;

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
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'requested']) requestedOfiManagementCompanyOb;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) OfiManagementCompanyListOb;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) requestFundShareOb;

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
                public _numberConverterService: NumberConverterService,) {
        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));

        /* Subscribe for this user's details. */
        this.subscriptions.push(this.myDetailOb.subscribe((myDetails) => {
            /* Assign list to a property. */
            this.myDetails = myDetails;
        }));

        this.createForm();
        this.setInitialTabs();

        this.subscriptions.push(this.requestedOfiManagementCompanyOb.subscribe((requested) => this.getManagementCompanyRequested(requested)));
        this.subscriptions.push(this.OfiManagementCompanyListOb.subscribe((list) => this.getManagementCompanyListFromRedux(list)));
        this.subscriptions.push(this.walletDirectoryOb.subscribe((walletDirectory) => {
            this.walletDirectory = walletDirectory;
        }));

        if (!this.isInvestorUser) {  // AM side
            this.subscriptions.push(this.requestedOfiAmOrdersOb.subscribe((requested) => this.getAmOrdersNewOrder(requested)));
            this.subscriptions.push(this.OfiAmOrdersListOb.subscribe((list) => this.getAmOrdersListFromRedux(list)));
        } else if (this.isInvestorUser) {  // INV side
            this.subscriptions.push(this.requestedOfiInvOrdersOb.subscribe((requested) => this.getInvOrdersNewOrder(requested)));
            this.subscriptions.push(this.OfiInvOrdersListOb.subscribe((list) => this.getInvOrdersListFromRedux(list)));
        }
        this.subscriptions.push(this.OfiAmOrdersFiltersOb.subscribe((filters) => this.getAmOrdersFiltersFromRedux(filters)));
    }

    ngOnInit() {
        this.subscriptions.push(this.searchForm.valueChanges.debounceTime(500).subscribe((form) => this.requestSearch()));
        this.changeDetectorRef.markForCheck();
    }

    ngAfterViewInit() {
        /* Do observable subscriptions here. */
        const state = this.ngRedux.getState();

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

    getAmOrdersListFromRedux(list) {
        this.ordersList = this.ordersObjectToList(list);

        this.updateTabs();
        this.changeDetectorRef.markForCheck();
    }

    getAmOrdersFiltersFromRedux(filters) {
        this.filtersFromRedux = filters;
        // this.applyFilters();
        this.changeDetectorRef.markForCheck();
    }

    // applyFilters() {
    //     if (!this.filtersApplied && this.tabsControl[0] && this.tabsControl[0].searchForm) {
    //         if (this.filtersFromRedux.isin || this.filtersFromRedux.shareName || this.filtersFromRedux.status || this.filtersFromRedux.orderType || this.filtersFromRedux.dateType || this.filtersFromRedux.fromDate || this.filtersFromRedux.toDate) {
    //             if (this.filtersFromRedux.isin && this.filtersFromRedux.isin !== '') {
    //                 this.tabsControl[0].searchForm.get('isin').patchValue(this.filtersFromRedux.isin, {emitEvent: false});
    //                 this.tabsControl[0].searchForm.get('isin').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
    //             }
    //             if (this.filtersFromRedux.shareName && this.filtersFromRedux.shareName !== '') {
    //                 this.tabsControl[0].searchForm.get('sharename').patchValue(this.filtersFromRedux.shareName, {emitEvent: false});
    //                 this.tabsControl[0].searchForm.get('sharename').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
    //             }
    //             if (this.filtersFromRedux.status && this.filtersFromRedux.status !== '') {
    //                 const statusFound = this.orderStatuses.find(o => o.id.toString() === this.filtersFromRedux.status.toString());
    //                 if (statusFound !== undefined) {
    //                     this.tabsControl[0].searchForm.get('status').patchValue([{
    //                         id: statusFound.id,
    //                         text: statusFound.text
    //                     }], {emitEvent: false});
    //                     this.tabsControl[0].searchForm.get('status').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
    //                 }
    //             }
    //             if (this.filtersFromRedux.dateType && this.filtersFromRedux.dateType !== '') {
    //                 const dateTypeFound = this.dateTypes.find(o => o.id.toString() === this.filtersFromRedux.dateType.toString());
    //                 if (dateTypeFound !== undefined) {
    //                     this.tabsControl[0].searchForm.get('dateType').patchValue([{
    //                         id: dateTypeFound.id,
    //                         text: dateTypeFound.text
    //                     }], {emitEvent: false});
    //                     this.tabsControl[0].searchForm.get('dateType').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
    //                 }
    //             }
    //             if (this.filtersFromRedux.fromDate && this.filtersFromRedux.fromDate !== '') {
    //                 this.tabsControl[0].searchForm.get('fromDate').patchValue(this.filtersFromRedux.fromDate, {emitEvent: false});
    //                 this.tabsControl[0].searchForm.get('fromDate').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
    //             }
    //             if (this.filtersFromRedux.toDate && this.filtersFromRedux.toDate !== '') {
    //                 this.tabsControl[0].searchForm.get('toDate').patchValue(this.filtersFromRedux.toDate, {emitEvent: false});
    //                 this.tabsControl[0].searchForm.get('toDate').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
    //             }
    //
    //             // remove filters from redux
    //             this.ngRedux.dispatch({type: ofiManageOrderActions.OFI_SET_ORDERS_FILTERS, filters: {filters: {}}});
    //             this.filtersApplied = true;
    //             this.requestSearch(this.tabsControl[0].searchForm);
    //         }
    //     }
    // }

    getInvOrdersListFromRedux(list) {
        this.ordersList = this.ordersObjectToList(list);

        this.updateTabs();
        this.changeDetectorRef.markForCheck();
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
            this.changeDetectorRef.markForCheck();
        }
    }

    getInvOrdersNewOrder(requested): void {
        if (!requested) {
            // set flag to true, so we don't request the order again.
            this.ngRedux.dispatch(ofiMyOrderActions.ofiSetRequestedMyOrder());

            this.loading = true;
            this.getOrdersList();
            this.changeDetectorRef.markForCheck();
        }
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

    getFundShareFromRedux(fundShare) {
        if (typeof fundShare !== 'undefined' && Object.keys(fundShare).length > 0) {
            const keyFactOptionalData = JSON.parse(fundShare.keyFactOptionalData);
            this.fundShare.keyFactOptionalData = keyFactOptionalData;
            this.fundShare.decimalization = fundShare.maximumNumDecimal;
            this.fundShare.mifiidChargesOneOff = fundShare.mifiidChargesOneOff;
            this.fundShare.mifiidChargesOngoing = fundShare.mifiidChargesOngoing;
            this.fundShare.mifiidTransactionCosts = fundShare.mifiidTransactionCosts;
            this.fundShare.mifiidServicesCosts = fundShare.mifiidServicesCosts;
            this.fundShare.mifiidIncidentalCosts = fundShare.mifiidIncidentalCosts;
            this.changeDetectorRef.markForCheck();
        }

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
        } else {
            this.tabsControl = openedTabs;
        }
    }

    updateTabs() {
        this.loading = false;
        if (this.ordersList.length > 0) {
            this.total = this.ordersList[0].totalResult;
            this.lastPage = Math.ceil(this.total / this.itemPerPage);

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

                        this.subscriptions.push(this.requestFundShareOb.subscribe((fundShare) => this.getFundShareFromRedux(fundShare)));
                        const requestData = getOfiFundShareCurrentRequest(this.ngRedux.getState());
                        requestData.fundShareID = this.fundShareID;
                        OfiFundShareService.defaultRequestFundShare(this._ofiFundShareService, this.ngRedux, requestData);
                    }
                }
            }));
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
                console.log(data);
            }).catch((data) => {
                const errorMessage = _.get(data, ['1', 'Data', '0', 'Message'], '');
                // this._toaster.pop('warning', errorMessage);
                console.log(data);
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
                        console.log('cancel order success', data); // success
                        this.loading = true;
                        this.getOrdersList();
                    },
                    (data) => {
                        console.log('Error: ', data);
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
        const url = this.generateExportURL(paramUrl, false);
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
        const fromDate = moment(_.get(searchValues, ['fromDate'], null), 'DD/MM/YYYY');
        const toDate = moment(_.get(searchValues, ['toDate'], null), 'DD/MM/YYYY').add(1, 'days').subtract(1, 'minutes');

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

        this.changeDetectorRef.markForCheck();
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

    showManagementCompany(order) {
        const obj = this.managementCompanyList.find(o => o.companyID === order.amCompanyID);
        if (obj !== undefined) {
            return obj.companyName;
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
        const dest = 'manage-orders/' + order.orderID;
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
        this.changeDetectorRef.detectChanges();

        /* Return. */
        return;
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
    getOnlyDate(dateString): string {
        return moment.utc(dateString, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD');
    }

    /**
     * Get Order Time
     *
     * @param  {string} dateString - the order's date string.
     * @return {string}            - the formatted time or empty string.
     */
    getOnlyTime(dateString): string {
        return moment.utc(dateString, 'YYYY-MM-DD HH:mm').local().format('HH:mm');
    }

    getDateTime(dateString): string {
        return moment.utc(dateString, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm');
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
