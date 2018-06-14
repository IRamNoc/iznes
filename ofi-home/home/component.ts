/* Core/Angular imports. */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
/* Redux */
import {NgRedux, select} from '@angular-redux/store';
import {MultilingualService} from '@setl/multilingual';
import {APP_CONFIG, AppConfig, immutableHelper, MoneyValuePipe, NumberConverterService} from '@setl/utils';
/* Ofi orders request service. */
import {OfiOrdersService} from '@ofi/ofi-main/ofi-req-services/ofi-orders/service';
import {ofiSetRequestedHomeOrder} from '@ofi/ofi-main/ofi-store';
import * as math from 'mathjs';
import {LogService} from "@setl/utils";

// product
import {OfiUmbrellaFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import {OfiFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import {OfiFundShareService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';

// recordkeeping
import {MemberSocketService} from '@setl/websocket-service';
import {OfiReportsService} from '../../ofi-req-services/ofi-reports/service';

import * as _ from 'lodash';
import {fromJS} from 'immutable';

// Internal
import {
    MyWalletsService,
    MemberService,
    WalletnodeTxService,
    WalletNodeRequestService,
    InitialisationService
} from '@setl/core-req-services';
import {
    setRequestedWalletAddresses,
} from '@setl/core-store';

@Component({
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiHomeComponent implements AfterViewInit, OnInit, OnDestroy {

    // products
    fundList = [];
    shareList = [];
    umbrellaFundList = [];
    filteredShareList = [];
    managementCompanyAccessList = [];

    // recordkeeping
    dataListForSearch: Array<any> = [];
    holdersList: Array<any> = [];
    holderDetailData: any;
    nbTotalHolders = 0;
    holdingsList: Array<any> = [];

    appConfig: AppConfig;

    addressObject: any;
    addressList: Array<any>;
    addressListFix = [];
    requestedWalletAddress: boolean;

    /* Public properties. */
    public myDetails: any = {};
    public connectedWalletName = '';
    public ordersList: Array<any> = [];

    /* Private properties. */
    private subscriptions: Array<any> = [];
    private myWallets: any = [];
    private connectedWalletId: any = 0;
    userType: number;

    nbUnreadMessages = 0;

    /* Observables. */
    @select(['wallet', 'myWallets', 'walletList']) myWalletsOb: any;

    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;

    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb: any;
    @select(['ofi', 'ofiOrders', 'homeOrders', 'orderList']) homeOrdersListOb: any;
    @select(['ofi', 'ofiOrders', 'homeOrders', 'requested']) homeOrdersRequestedOb: any;
    @select(['message', 'myMessages', 'counts',  'inboxUnread']) nbMessagesObj: any;

    // products
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'requestedIznesFund']) requestedFundListObs;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'requestedIznesShare']) requestedShareListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) shareListObs;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'requested']) requestedOfiUmbrellaFundListOb;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaFundAccessListOb;

    // rekordkeeping
    @select(['ofi', 'ofiReports', 'amHolders', 'requested']) requestedOfiAmHoldersObj;
    @select(['ofi', 'ofiReports', 'amHolders', 'amHoldersList']) OfiAmHoldersListObj;
    // @select(['ofi', 'ofiReports', 'amHolders', 'holderDetailRequested']) requestedHolderDetailObs;
    // @select(['ofi', 'ofiReports', 'amHolders', 'shareHolderDetail']) shareHolderDetailObs;

    // inv my holdings
    @select(['ofi', 'ofiReports', 'amHolders', 'invRequested']) requestedOfiInvHoldingsObj;
    @select(['ofi', 'ofiReports', 'amHolders', 'invHoldingsList']) ofiInvHoldingsListObj;

    /* Constructor. */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _numberConverterService: NumberConverterService,
        private _ngRedux: NgRedux<any>,
        private _moneyValuePipe: MoneyValuePipe,
        private _fb: FormBuilder,
        private _router: Router,
        public _translate: MultilingualService,
        private logService: LogService,
        private _myWalletService: MyWalletsService,
        private _memberService: MemberService,
        private memberSocketService: MemberSocketService,
        private _walletnodeTxService: WalletnodeTxService,
        private _walletNodeRequestService: WalletNodeRequestService,
        private _ofiFundService: OfiFundService,
        private _ofiFundShareService: OfiFundShareService,
        private _ofiUmbrellaFundService: OfiUmbrellaFundService,
        private ofiOrdersService: OfiOrdersService,
        private ofiReportsService: OfiReportsService,
        @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;

    }

    ngOnInit() {
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

        /* Subscribe for this user's connected info. */
        this.subscriptions['my-details'] = this.myDetailOb.subscribe((details) => {
            /* Assign list to a property. */

            this.userType = details.userType;
            this._changeDetectorRef.detectChanges();
        });

        this.subscriptions.push(this.addressListOb.subscribe(addressList => this.updateAddressList(addressList)));
        this.subscriptions.push(this.requestedAddressListOb.subscribe(requested => this.requestAddressList(requested)));
        this.subscriptions.push(this.requestedLabelListOb.subscribe(requested => this.requestWalletLabel(requested)));

        // prodcuts
        this.subscriptions.push(this.requestedFundListObs.subscribe(requested => this.requestFundList(requested)));
        this.subscriptions.push(this.fundListObs.subscribe(funds => this.getFundList(funds)));
        this.subscriptions.push(this.requestedShareListObs.subscribe(requested => this.requestShareList(requested)));
        this.subscriptions.push(this.shareListObs.subscribe(shares => this.getShareList(shares)));
        this.subscriptions.push(this.requestedOfiUmbrellaFundListOb.subscribe((requested) => this.getUmbrellaFundRequested(requested)));
        this.subscriptions.push(this.umbrellaFundAccessListOb.subscribe((list) => this.getUmbrellaFundList(list)));

        if (this.userType === 36) {
            // recordkeeping
            this.subscriptions.push(this.requestedOfiAmHoldersObj.subscribe((requested) => this.getAmHoldersRequested(requested)));
            this.subscriptions.push(this.OfiAmHoldersListObj.subscribe((list) => this.getAmHoldersListFromRedux(list)));
        } else if (this.userType === 36) {
            // inv - my holdings
            this.subscriptions.push(this.requestedOfiInvHoldingsObj.subscribe(requested => this.getInvHoldingsRequested(requested)));
            this.subscriptions.push(this.ofiInvHoldingsListObj.subscribe(list => this.getInvHoldingsListFromRedux(list)));
        }

        /* Do observable subscriptions here. */
        this.subscriptions['message'] = this.nbMessagesObj.subscribe((nb) => {
            /* Assign list to a property. */

            this.nbUnreadMessages = (nb) ? nb : 0;
            this._changeDetectorRef.detectChanges();
        });
    }

    ngAfterViewInit() {

        /* Orders list. */
        this.subscriptions['home-orders-list'] = this.homeOrdersListOb.subscribe((orderList) => {
            /* Fail safely... */
            if (!orderList.length) {
                return;
            }

            /* Subscribe and set the orders list. */
            const ordersList_new = immutableHelper.copy(orderList);
            this.ordersList = ordersList_new.map((order) => {
                /* Pointer. */
                const fixed = order;

                /* Fix dates. */
                fixed.cutoffDateStr = this.formatDate('YYYY-MM-DD', new Date(fixed.cutoffDate));
                fixed.cutoffTimeStr = this.formatDate('hh:mm', new Date(fixed.cutoffDate));
                fixed.deliveryDateStr = this.formatDate('YYYY-MM-DD', new Date(fixed.deliveryDate));

                const metaData = immutableHelper.copy(order.metaData);

                metaData.price = this._numberConverterService.toFrontEnd(metaData.price);
                metaData.units = this._numberConverterService.toFrontEnd(metaData.units);

                metaData.total = math.round(metaData.units * metaData.price, 2);

                fixed.metaData = metaData;

                /* Return. */
                return fixed;
            });

            /* Detect Changes. */
            this._changeDetectorRef.detectChanges();
        });

        this.subscriptions['home-order-requested'] = this.homeOrdersRequestedOb.subscribe((requested) => {
            this.requestHomeOrderList(requested);
        });

    }

    getInvHoldingsRequested(requested): void {
        // this.logService.log('requested', requested);
        if (!requested) {
            OfiReportsService.defaultRequestInvHoldingsList(this.ofiReportsService, this._ngRedux, {amCompanyID: 0});
        }
    }

    getInvHoldingsListFromRedux(list) {

        const listImu = fromJS(list);

        this.holdingsList = listImu.reduce((result, item) => {

            result.push({
                amManagementCompanyID: item.get('amManagementCompanyID', 0),
                companyName: item.get('companyName', ''),
                shareID: item.get('shareID', 0),
                fundShareName: item.get('fundShareName', ''),
                isin: item.get('isin', ''),
                shareClassCurrency: item.get('shareClassCurrency', ''),
                latestNav: item.get('latestNav', 0),
                portfolioAddr: item.get('portfolioAddr', ''),
                portfolioLabel: item.get('portfolioLabel', ''),
                quantity: item.get('quantity', 0),
                amount: item.get('amount', 0),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    /**
     * Run the process for requesting the list of holders
     *
     * @param requested
     */
    getAmHoldersRequested(requested): void {
        if (!requested) {
            OfiReportsService.defaultRequestAmHoldersList(this.ofiReportsService, this._ngRedux);
        }
    }

    /**
     * Get the actual list of holders from redux
     *
     * @param holderList
     */
    getAmHoldersListFromRedux(holderList) {
        if (holderList) {
            this.holdersList = holderList.toJS() || [];

            this.dataListForSearch = this.holdersList.filter(it => !it.isFund).map((holder) => {
                return {
                    id: holder.shareId,
                    text: holder.fundName + ' - ' + holder.shareName + ' (' + holder.shareIsin + ')',
                };
            });

            this.nbTotalHolders = 0;    // reset
            for (let data of this.holdersList) {
                if (data.isFund) {
                    this.nbTotalHolders += data.fundHolderNumber;
                }
            }


            this._changeDetectorRef.markForCheck();
        }
    }

    requestFundList(requested): void {
        if (!requested) {
            OfiFundService.defaultRequestIznesFundList(this._ofiFundService, this._ngRedux);
        }
    }

    getFundList(funds: any): void {
        const fundList = [];
        if (_.values(funds).length > 0) {
            _.values(funds).map((fund) => {
                fundList.push({
                    fundID: fund.fundID,
                });
            });

        }

        this.fundList = _.orderBy(fundList, ['fundID'], ['desc']);
        this._changeDetectorRef.markForCheck();
    }

    requestShareList(requested): void {
        if (!requested) {
            OfiFundShareService.defaultRequestIznesShareList(this._ofiFundShareService, this._ngRedux);
        }
    }

    getShareList(shares): void {
        const shareList = [];

        if ((shares !== undefined) && Object.keys(shares).length > 0) {
            Object.keys(shares).map((key) => {
                const share = shares[key];
                shareList.push({
                    fundShareID: share.fundShareID,
                });
            });
        }

        this.filteredShareList = _.orderBy(shareList.filter((share) => {
            return share.status !== 5;
        }), ['fundShareID'], ['desc']);

        this._changeDetectorRef.markForCheck();
    }

    getUmbrellaFundRequested(requested): void {
        if (!requested) {
            OfiUmbrellaFundService.defaultRequestUmbrellaFundList(this._ofiUmbrellaFundService, this._ngRedux);
        }
    }

    getUmbrellaFundList(umbrellaFunds) {
        const data = fromJS(umbrellaFunds).toArray();
        const umbrellaFundList = [];

        if (data.length > 0) {
            data.map((item) => {

                umbrellaFundList.push({
                    umbrellaFundID: item.get('umbrellaFundID', 0),
                });
            });
        }
        this.umbrellaFundList = _.orderBy(umbrellaFundList, ['umbrellaFundID'], ['desc']);
        this._changeDetectorRef.markForCheck();
    }

    updateAddressList(addressList) {
        this.logService.log('addressList: ', addressList);
        this.addressObject = addressList;
        // const

        this.addressList = immutableHelper.reduce(addressList, (result, item) => {

            const addressItem = {
                address: item.get('addr', ''),
                label: item.get('label', ''),
                iban: item.get('iban', ''),
                editing: false
            };

            if (addressItem.iban !== '' && addressItem.address !== '') {
                result.push(addressItem);
            }


            return result;
        }, []);

        this.addressListFix = this.addressList;

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

        this.logService.log('checking requested', this.requestedWalletAddress);
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {

            MyWalletsService.defaultRequestWalletLabel(this._ngRedux, this._myWalletService, this.connectedWalletId);
        }
    }

    requestHomeOrderList(requested: boolean): void {
        if (requested) {
            return;
        }

        this._ngRedux.dispatch(ofiSetRequestedHomeOrder());

        /* Now, let's fetch the precentralised orders list. */
        let request;
        if (this.myDetails.userType !== 46) {
            /* Is am. */
            request = {
                partyType: 2,
                pageNum: 0,
                pageSize: 123456789,
                asset: '',
                sortBy: 'deliveryDate',
                arrangementType: 0,
                status: 1,
                sortOrder: 'DESC'
            };
        } else {
            /* Is holder. */
            request = {
                partyType: 1,
                pageNum: 0,
                pageSize: 123456789,
                asset: '',
                sortBy: 'dateEntered',
                arrangementType: 0,
                status: 4,
                sortOrder: 'DESC'
            };
        }

        this.ofiOrdersService.getHomeOrdersList(request)
            .then(() => true)
            .catch((error) => {
                /* Handle error. */
                console.warn('Failed to fetch precentralised orders:', error);
            });
    }

    /**
     * handleViewOrder
     * @param orderId
     */
    public handleViewOrder(orderId: number): void {
        /* Set the buffer. */
        this.ofiOrdersService.setOrderBuffer(orderId);

        /* Send the user to their order page. */
        if ([46].indexOf(this.myDetails.userType) !== -1) {
            /* Is holder. */
            this._router.navigateByUrl('/order-book/my-orders');
        } else {
            /* Is other. */
            this._router.navigateByUrl('/manage-orders');
        }
    }

    /**
     * beginOrderJourney
     * @param journey
     */
    public beginOrderJourney(journey: string): void {
        /* Dispatch the action to register the journey. */
        this.ofiOrdersService.setOrderFilter(journey);

        /* Send the user to their order page. */
        if ([46].indexOf(this.myDetails.userType) !== -1) {
            /* Is holder. */
            this._router.navigateByUrl('/order-book/my-orders');
        } else {
            /* Is other. */
            this._router.navigateByUrl('/manage-orders');
        }

        /* Return. */
        return;
    }

    /**
     * beginListOfFundsJourney
     * @return {void}
     */
    public beginListOfFundsJourney(): void {
        /* Send the user to their order page. */
        if ([46].indexOf(this.myDetails.userType) !== -1) {
            /* Is holder. */
            this._router.navigateByUrl('/list-of-funds');
        } else {
            /* Is other. */
            this._router.navigateByUrl('/product-module/fund');
        }

        /* Return. */
        return;
    }

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
                if (wallet == this.connectedWalletId) {
                    this.connectedWalletName = this.myWallets[wallet].walletName;
                    break;
                }
            }
        }

        /* Detect changes. */
        this._changeDetectorRef.detectChanges();

        /* Return. */
        return;
    }

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (let key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }
}
