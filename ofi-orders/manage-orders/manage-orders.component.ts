/* Core/Angular imports. */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

import {MemberSocketService} from '@setl/websocket-service';

import {NgRedux, select} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Unsubscribe} from 'redux';
import {fromJS} from 'immutable';
import {ConfirmationService, immutableHelper, SagaHelper, commonHelper} from '@setl/utils';

/* Services. */
import {WalletNodeRequestService} from '@setl/core-req-services';
import {OfiOrdersService} from '../../ofi-req-services/ofi-orders/service';
import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';
import {OfiManagementCompanyService} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import {OfiFundShareService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';

import {getOfiFundShareCurrentRequest} from '@ofi/ofi-main/ofi-store/ofi-product/fund-share';
import * as FundShareModels from '@ofi/ofi-main/ofi-product/fund-share/models';
import {getOfiFundShareSelectedFund} from '@ofi/ofi-main/ofi-store/ofi-product/fund-share-sf';

/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';

/* Ofi Store stuff. */
import {ofiManageOrderActions, ofiMyOrderActions} from '@ofi/ofi-main/ofi-store';

import * as math from 'mathjs';
import {ActivatedRoute, Params, Router} from '@angular/router';

/* Clarity */
import {ClrDatagridStateInterface} from '@clr/angular';

import * as _ from 'lodash';

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

    /* Ui Lists. */
    orderStatuses: Array<SelectedItem> = [
        {id: -3, text: 'All'},
        {id: 1, text: 'Initiated'}, // estimatedPrice
        {id: 2, text: 'Waiting NAV'},   // estimatedPrice
        {id: 3, text: 'Waiting Settlement'},    // price
        {id: -1, text: 'Settled'},  // price
        // {id: 4, text: 'Precentralised'},
        // {id: 5, text: 'Centralised'},
        {id: 6, text: 'Unpaid'}, // price
        {id: 0, text: 'Cancelled'}, // estimatedPrice
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
        {id : 0, text: 'EUR'},
        {id : 1, text: 'USD'},
        {id : 2, text: 'GBP'},
        {id : 3, text: 'CHF'},
        {id : 4, text: 'JPY'},
        {id : 5, text: 'AUD'},
        {id : 6, text: 'NOK'},
        {id : 7, text: 'SEK'},
        {id : 8, text: 'ZAR'},
        {id : 9, text: 'RUB'},
        {id : 10, text: 'SGD'},
        {id : 11, text: 'AED'},
        {id : 12, text: 'CNY'},
        {id : 13, text: 'PLN'},
    ];

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
    @select(['ofi', 'ofiOrders', 'manageOrders', 'newOrder']) newOrderOfiAmOrdersOb;
    @select(['ofi', 'ofiOrders', 'myOrders', 'requested']) requestedOfiInvOrdersOb: any;
    @select(['ofi', 'ofiOrders', 'myOrders', 'orderList']) OfiInvOrdersListOb: any;
    @select(['ofi', 'ofiOrders', 'myOrders', 'newOrder']) newOrderOfiInvOrdersOb;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'requested']) requestedOfiManagementCompanyOb;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) OfiManagementCompanyListOb;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) requestFundShareOb;
    // @select(['ofi', 'ofiOrders', 'homeOrders', 'orderBuffer']) orderBufferOb: any;
    // @select(['ofi', 'ofiOrders', 'homeOrders', 'orderFilter']) orderFilterOb: any;
    // @select(['ofi', 'ofiCorpActions', 'ofiUserAssets', 'ofiUserAssetList']) userAssetListOb: any;

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
                private _confirmationService: ConfirmationService
                // private _blockchainContractService: BlockchainContractService,
                // public _numberConverterService: NumberConverterService,
    ) {
        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));

        /* Subscribe for this user's details. */
        this.subscriptions['my-details'] = this.myDetailOb.subscribe((myDetails) => {
            /* Assign list to a property. */
            this.myDetails = myDetails;
        });

        this.createForm();
        this.setInitialTabs();

        this.subscriptions.push(this.requestedOfiManagementCompanyOb.subscribe((requested) => this.getManagementCompanyRequested(requested)));
        this.subscriptions.push(this.OfiManagementCompanyListOb.subscribe((list) => this.getManagementCompanyListFromRedux(list)));
        this.subscriptions['walletDirectory'] = this.walletDirectoryOb.subscribe((walletDirectory) => { this.walletDirectory = walletDirectory; });

        if (this.myDetails && this.myDetails.userType && this.myDetails.userType === 36) {  // AM side
            this.subscriptions.push(this.requestedOfiAmOrdersOb.subscribe((requested) => this.getAmOrdersRequested(requested)));
            this.subscriptions.push(this.OfiAmOrdersListOb.subscribe((list) => this.getAmOrdersListFromRedux(list)));
            // if new Orders coming (broadcast)
            this.subscriptions.push(this.newOrderOfiAmOrdersOb.subscribe((newAmOrder) => this.getAmOrdersNewOrder(newAmOrder)));
        } else if (this.myDetails && this.myDetails.userType && this.myDetails.userType === 46) {  // INV side
            this.subscriptions.push(this.requestedOfiInvOrdersOb.subscribe((requested) => this.getInvOrdersRequested(requested)));
            this.subscriptions.push(this.OfiInvOrdersListOb.subscribe((list) => this.getInvOrdersListFromRedux(list)));
            // if new Orders coming (broadcast)
            this.subscriptions.push(this.newOrderOfiInvOrdersOb.subscribe((newInvOrder) => this.getInvOrdersNewOrder(newInvOrder)));
        }
        this.subscriptions.push(this.OfiAmOrdersFiltersOb.subscribe((filters) => this.getAmOrdersFiltersFromRedux(filters)));
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

    getAmOrdersRequested(requested): void {
        if (!requested) {
            OfiOrdersService.setAmNewOrder(false, this.ngRedux);
            OfiOrdersService.defaultRequestManageOrdersList(this.ofiOrdersService, this.ngRedux);
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
                orderDate: item.get('orderDate'),
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

        this.updateTabs();
        this.changeDetectorRef.markForCheck();
    }

    getAmOrdersFiltersFromRedux(filters) {
        this.filtersFromRedux = filters;
        this.applyFilters();
        this.changeDetectorRef.markForCheck();
    }

    applyFilters() {
        if (!this.filtersApplied && this.tabsControl[0] && this.tabsControl[0].searchForm) {
            if (this.filtersFromRedux.isin || this.filtersFromRedux.shareName || this.filtersFromRedux.status || this.filtersFromRedux.orderType) {
                if (this.filtersFromRedux.isin && this.filtersFromRedux.isin !== '') {
                    this.tabsControl[0].searchForm.get('isin').patchValue(this.filtersFromRedux.isin, {emitEvent: false});
                    this.tabsControl[0].searchForm.get('isin').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
                }
                if (this.filtersFromRedux.shareName && this.filtersFromRedux.shareName !== '') {
                    this.tabsControl[0].searchForm.get('sharename').patchValue(this.filtersFromRedux.shareName, {emitEvent: false});
                    this.tabsControl[0].searchForm.get('sharename').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
                }
                if (this.filtersFromRedux.status && this.filtersFromRedux.status !== '') {
                    const statusFound = this.orderStatuses.find(o => o.id === this.filtersFromRedux.status);
                    if (statusFound !== undefined) {
                        this.tabsControl[0].searchForm.get('status').patchValue([{id: statusFound.id, text: statusFound.text}], {emitEvent: false});
                        this.tabsControl[0].searchForm.get('status').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
                    }
                }
                // if (this.filtersFromRedux.orderType && this.filtersFromRedux.orderType !== '') {
                //     this.tabsControl[0].searchForm.get('type').patchValue(this.filtersFromRedux.orderType, {emitEvent: false});
                //     this.tabsControl[0].searchForm.get('type').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
                // }

                // remove filters from redux
                this.ngRedux.dispatch({type: ofiManageOrderActions.OFI_SET_ORDERS_FILTERS, filters: {filters: {}}});
                this.filtersApplied = true;
                this.requestSearch(this.tabsControl[0].searchForm);
            }
        }
    }

    getInvOrdersRequested(requested): void {
        if (!requested) {
            OfiOrdersService.setInvNewOrder(false, this.ngRedux);
            OfiOrdersService.defaultRequestInvestorOrdersList(this.ofiOrdersService, this.ngRedux);
        }
    }

    getInvOrdersListFromRedux(list) {
        const listImu = fromJS(list);

        this.ordersList = listImu.reduce((result, item) => {

            result.push({
                amAddress: item.get('amAddress'),
                amCompanyID: item.get('amCompanyID'),
                amCompanyName: item.get('amCompanyName'),
                amWalletID: item.get('amWalletID'),
                amount: item.get('amount'),
                amountWithCost: item.get('amountWithCost'),
                byAmountOrQuantity: item.get('byAmountOrQuantity'),
                canceledBy: item.get('canceledBy'),
                contractAddr: item.get('contractAddr'),
                contractExpiryTs: item.get('contractAddr'),
                contractStartTs: item.get('contractStartTs'),
                currency: item.get('currency'),
                cutoffDate: item.get('cutoffDate'),
                estimatedAmount: item.get('estimatedAmountWithCost'),
                estimatedAmountWithCost: item.get('estimatedAmountWithCost'),
                estimatedPrice: item.get('estimatedPrice'),
                estimatedQuantity: item.get('estimatedQuantity'),
                feePercentage: item.get('feePercentage'),
                firstName: item.get('firstName'),
                fundShareID: item.get('fundShareID'),
                fundShareName: item.get('fundShareName'),
                iban: item.get('iban'),
                investorAddress: item.get('investorAddress'),
                investorWalletID: item.get('investorWalletID'),
                isin: item.get('isin'),
                label: item.get('label'),
                lastName: item.get('lastName'),
                navEntered: item.get('navEntered'),
                orderID: item.get('orderID'),
                orderDate: item.get('orderDate'),
                orderNote: item.get('orderNote'),
                orderStatus: item.get('orderStatus'),
                orderType: item.get('orderType'),
                platFormFee: item.get('platFormFee'),
                price: item.get('price'),
                quantity: item.get('quantity'),
                settlementDate: item.get('settlementDate'),
                totalResult: item.get('totalResult'),
                valuationDate: item.get('valuationDate'),
            });

            return result;
        }, []);

        this.updateTabs();
        this.changeDetectorRef.markForCheck();
    }

    getAmOrdersNewOrder(newAmOrder): void {
        if (newAmOrder) {
            this.loading = true;
            this.getOrdersList();
            this.changeDetectorRef.markForCheck();
        }
    }

    getInvOrdersNewOrder(newInvOrder): void {
        if (newInvOrder) {
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

        // {
            // "fundShareID": 1,
            // "fundShareName": "Test Fund Share - 1522766737",
            // "fundID": 1,
            // "isin": "1522766737",
            // "shareClassCode": 0,
            // "shareClassInvestmentStatus": 0,
            // "subscriptionStartDate": "2018-04-01",
            // "launchDate": "2018-04-01",
            // "shareClassCurrency": 0,
            // "valuationFrequency": 0,
            // "historicOrForwardPricing": 0,
            // "hasCoupon": 1,
            // "couponType": 0,
            // "freqOfDistributionDeclaration": 0,
            // "status": "0",
            // "maximumNumDecimal": 1,  // decimalization
            // "subscriptionCategory": 2,
            // "subscriptionCurrency": 0,
            // "minInitialSubscriptionInShare": 1,
            // "minInitialSubscriptionInAmount": 1,
            // "minSubsequentSubscriptionInShare": 1,
            // "minSubsequentSubscriptionInAmount": 1,
            // "redemptionCategory": 2,
            // "redemptionCurrency": 0,
            // "minInitialRedemptionInShare": 1,
            // "minInitialRedemptionInAmount": 1,
            // "minSubsequentRedemptionInShare": 1,
            // "minSubsequentRedemptionInAmount": 1,
            // "portfolioCurrencyHedge": null,
            // "tradeDay": 0,
            // "subscriptionCutOffTime": "12:00:00",
            // "subscriptionCutOffTimeZone": 11,
            // "subscriptionSettlementPeriod": 0,
            // "redemptionCutOffTime": "12:00:00",
            // "redemptionCutOffTimeZone": 11,
            // "redemptionSettlementPeriod": 1,
            // "subscriptionRedemptionCalendar": "1",
            // "maxManagementFee": 1,
            // "maxSubscriptionFee": 1,
            // "maxRedemptionFee": 1,
            // "investorProfile": 0,
            // "mifiidChargesOngoing": 1,
            // "mifiidChargesOneOff": 1,
            // "mifiidTransactionCosts": 1, // Costs related to transactions initiated
            // "mifiidServicesCosts": 1,    // Charges related to ancillary services
            // "mifiidIncidentalCosts": 1,
            // "keyFactOptionalData": "{
                // "cusip":"",
                // "valor":null,
                // "wkn":"",
                // "bloombergCode":"",
                // "sedol":"",
                // "dormantStartDate":"",
                // "dormantEndDate":"",
                // "liquidationStartDate":"",
                // "terminationDate":"",
                // "terminationDateExplanation":"",
                // "assetClass":null,
                // "geographicalArea":null,
                // "srri":null,
                // "sri":null,
                // "navHedge":null,
                // "distributionPolicy":null,
                // "lifecycle":null,
                // "isClassUCITSEligible":false,
                // "isRDRCompliant":false,
                // "isRestrictedToSeparateFeeArrangement":false,
                // "hasForcedRedemption":false,
                // "isETF":false,
                // "indexName":"",
                // "indexCurrency":null,
                // "indexType":null,
                // "bloombergUnderlyingIndexCode":"",
                // "reutersUnderlyingIndexCode":"",
                // "denominationBase":null,
                // "isETC":false,
                // "isShort":false,
                // "replicationMethodologyFirstLevel":null,
                // "replicationMethodologySecondLevel":null,
                // "hasPRIIPDataDelivery":false,
                // "hasUCITSDataDelivery":false,
                // "ucitsKiidUrl":""
            // }",
            // "characteristicOptionalData": "{
                // "portfolioCurrencyHedge":null
            // }",
            // "calendarOptionalData": "{
                // "holidayManagement":""
            // }",
            // "profileOptionalData": "{
                // "portfolioCurrencyHedge":null
            // }",
            // "priipOptionalData": "{
                // "hasCreditRisk":false,
                // "creditRiskMeasure":null,
                // "marketRiskMeasure":null,
                // "liquidityRisk":null,
                // "summaryRiskIndicator":null,
                // "possibleMaximumLoss":null,
                // "recommendedHoldingPeriod":null,
                // "maturityDate":"",
                // "referenceDate":"",
                // "category":null,
                // "numberOfObservedReturns":null,
                // "meanReturn":null,
                // "volatilityOfStressedScenario":null,
                // "sigma":null,
                // "skewness":null,
                // "excessKurtosis":null,
                // "vev":null,
                // "isPRIIPFlexible":false,
                // "vev1":null,
                // "vev2":null,
                // "vev3":null,
                // "lumpSumOrRegularPremiumIndicator":null,
                // "investmentAmount":null,
                // "return1YStressScenario":"",
                // "return1YUnfavourable":false,
                // "return1YModerate":false,
                // "return1YFavourable":false,
                // "halfRHPStressScenario":"",
                // "halfRHPUnfavourable":false,
                // "halfRHPModerate":false,
                // "halfRHPFavourable":false,
                // "rhpStressScenario":"",
                // "rhpUnfavourable":false,
                // "rhpModerate":false,
                // "rhpFavourable":false,
                // "bondWeight":null,
                // "annualizedVolatility":null,
                // "macaulayDuration":null,
                // "targetMarketRetailInvestorType":null,
                // "otherRiskNarrative":null,
                // "hasCapitalGuarantee":false,
                // "characteristics":"",
                // "level":"",
                // "limitations":"",
                // "earlyExitConditions":""
            // }",
            // "listingOptionalData": "{
                // "bloombergCodeOfListing":"",
                // "currency":"",
                // "date":"",
                // "exchangePlace":"",
                // "iNAVBloombergCode":"",
                // "iNAVReutersCode":"",
                // "inceptionPrice":null,
                // "isPrimaryListing":false,
                // "marketIdentifierCode":"",
                // "reutersCode":"",
                // "status":null
            // }",
            // "taxationOptionalData": "{
                // "tisTidReporting":null,
                // "hasDailyDeliveryOfInterimProfit":false,
                // "hasReducedLuxembourgTax":false,
                // "luxembourgTax":null,
                // "hasSwissTaxReporting":false,
                // "swissTaxStatusRuling":false,
                // "isEligibleForTaxDeferredFundSwitchInSpain":false,
                // "hasUKReportingStatus":false,
                // "ukReportingStatusValidFrom":"",
                // "ukReportingStatusValidUntil":"",
                // "hasUKConfirmationOfExcessAmount":false,
                // "isUSTaxFormsW8W9Needed":false,
                // "isFlowThroughEntityByUSTaxLaw":false,
                // "fatcaStatusV2":null,
                // "isSubjectToFATCAWithholdingTaxation":false
            // }",
            // "solvencyIIOptionalData": "{
                // "mifidSecuritiesClassification":null,
                // "efamaMainEFCCategory":null,
                // "efamaActiveEFCClassification":"",
                // "hasTripartiteReport":false,
                // "lastTripartiteReportDate":"",
                // "interestRateUp":null,
                // "interestRateDown":null,
                // "equityTypeI":"",
                // "equityTypeII":"",
                // "property":"",
                // "spreadBonds":"",
                // "spreadStructured":"",
                // "spreadDerivativesUp":null,
                // "spreadDerivativesDown":null,
                // "fxUp":null,"fxDown":null
            // }",
            // "representationOptionalData": "{
                // "hasCountryRepresentative":false,
                // "representativeName":"",
                // "hasCountryPayingAgent":false,
                // "payingAgentName":"",
                // "homeCountryRestrictions":null,
                // "countryName":"",
                // "registrationDate":"",
                // "deregistrationDate":"",
                // "distributionStartDate":"",
                // "distributionEndDate":"",
                // "legalRegistration":false,
                // "marketingDistribution":false,
                // "specificRestrictions":""
            // }"
        // }
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
                        tabTitle += ' ' + this.padNumberLeft(this.orderID, 5);

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
        confMessage += this.padNumberLeft(this.ordersList[index].orderID, 5);
        this.showConfirmationAlert(confMessage, index);
    }

    showConfirmationAlert(confMessage, index): void {
        this._confirmationService.create(
            '<span>Are you sure?</span>',
            '<span>Are you sure you want cancel the ' + confMessage + '?</span>',
            {confirmText: 'Confirm', declineText: 'Back', btnClass: 'error'}
        ).subscribe((ans) => {
            if (ans.resolved) {
                const asyncTaskPipe = this.ofiOrdersService.requestCancelOrderByAM({
                    orderID: this.ordersList[index].orderID,
                });

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

    requestSearch(form) {

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

        this.dataGridParams.shareName = (this.tabsControl[0].searchForm.get('sharename').value !== '' && this.tabsControl[0].searchForm.get('sharename').value.length > 2) ? this.tabsControl[0].searchForm.get('sharename').value : null;
        this.dataGridParams.isin = (this.tabsControl[0].searchForm.get('isin').value !== '' && this.tabsControl[0].searchForm.get('isin').value.length > 2) ? this.tabsControl[0].searchForm.get('isin').value : null;
        this.dataGridParams.status = (this.tabsControl[0].searchForm.get('status').value && this.tabsControl[0].searchForm.get('status').value[0] && this.tabsControl[0].searchForm.get('status').value[0].id) ? this.tabsControl[0].searchForm.get('status').value[0].id : null;
        this.dataGridParams.orderType = (this.tabsControl[0].searchForm.get('type').value && this.tabsControl[0].searchForm.get('type').value[0] && this.tabsControl[0].searchForm.get('type').value[0].id) ? this.tabsControl[0].searchForm.get('type').value[0].id : null;
        // date filters
        if ((this.tabsControl[0].searchForm.get('dateType').value && this.tabsControl[0].searchForm.get('dateType').value[0] && this.tabsControl[0].searchForm.get('dateType').value[0].id)) {
            const tmpDateSearchField = (this.tabsControl[0].searchForm.get('dateType').value && this.tabsControl[0].searchForm.get('dateType').value[0] && this.tabsControl[0].searchForm.get('dateType').value[0].id) ? this.tabsControl[0].searchForm.get('dateType').value[0].id : null;
            const tmpFromDate = (this.tabsControl[0].searchForm.get('fromDate').value !== '' && !isNaN(Date.parse(this.tabsControl[0].searchForm.get('fromDate').value))) ? this.tabsControl[0].searchForm.get('fromDate').value : null;
            let tmpToDate = (this.tabsControl[0].searchForm.get('toDate').value !== '' && !isNaN(Date.parse(this.tabsControl[0].searchForm.get('toDate').value))) ? this.tabsControl[0].searchForm.get('toDate').value : null;
            if (tmpFromDate !== null && tmpToDate !== null) {
                let toDate = new Date(this.tabsControl[0].searchForm.get('toDate').value);
                toDate.setDate(toDate.getDate() + 1);
                tmpToDate = toDate.toISOString().substring(0, 10);
            }
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
            this.getOrdersList();
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
                // orderId, orderType, isin, shareName, currency, quantity, amountWithCost, orderDate, cutoffDate, settlementDate, orderStatus
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

        this.dataGridParams.pageSize =  this.itemPerPage;
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
    private getOnlyDate(dateString): string {
        return this.formatDate('YYYY-MM-DD', new Date(dateString)) || '';
    }

    /**
     * Get Order Time
     *
     * @param  {string} dateString - the order's date string.
     * @return {string}            - the formatted time or empty string.
     */
    private getOnlyTime(dateString): string {
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
