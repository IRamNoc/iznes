import {
    Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgRedux, select } from '@angular-redux/store';
import { OfiClientTxService } from '../../ofi-req-services/ofi-client-tx/service';
import { setRequestedClientTxList } from '../../ofi-store/ofi-client-txs/ofi-client-tx-list/actions';
import { immutableHelper, NumberConverterService, mDateHelper, commonHelper, LogService } from '@setl/utils';
import { PnlHelper } from '../pnlHelper/class';
import * as _ from 'lodash';
import { OfiFundInvestService } from '../../ofi-req-services/ofi-fund-invest/service';
import {
    InitialisationService,
    MyWalletsService,
    WalletNodeRequestService
} from '@setl/core-req-services';
import {
    setRequestedWalletAddresses
} from '@setl/core-store';
import * as math from 'mathjs';
import { MultilingualService } from '@setl/multilingual';

interface ActiveBalanceListItem {
    fundName: string;
    activeQuantity: number;
    realisePnl: number;
    unRealisePnl: number;
    lastMovement: number;
}

@Component({
    selector: 'app-ofi-pnl-report',
    templateUrl: 'component.html',
    styleUrls: ['./component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiPnlReportComponent implements OnInit, OnDestroy {
    tabsControl: Array<any>;

    showRelatedTxModal: boolean;

    connectedWalletId: number;
    requestedWalletAddress: boolean;
    addressSelected: any;
    address: FormControl;

    addressList: Array<any>;

    // client txt data
    clientTxListObj: any;
    clientTxList: Array<any>;

    // Active balance list
    activeBalanceList: Array<any>;

    // Pnl instances
    // use to keep track of the pnl for each fund share
    pnlRegister: any;

    sharePriceList: object;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    // The related txs that we want to check of particular asset.
    relatedTxList: Array<any>;

    // List of redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['ofi', 'ofiClientTx', 'ofiClientTxList', 'allTxList']) clientTxListOb;
    @select(['ofi', 'ofiClientTx', 'ofiClientTxList', 'requested']) clientTxListRequestedOb;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'requested']) requestedOfiInvestorFundListOb;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) shareDataOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;

    constructor(private ngRedux: NgRedux<any>,
                private ofiClientTxService: OfiClientTxService,
                private numberConverterService: NumberConverterService,
                private ofiFundInvestService: OfiFundInvestService,
                private myWalletService: MyWalletsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private logService: LogService,
                public translate: MultilingualService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    ngOnInit() {
        /**
         * Default tabs.
         */
        this.tabsControl = [
            {
                title: {
                    icon: 'fa fa-th-list',
                    text: this.translate.translate('List'),
                    colorClass: ''
                },
                active: true
            }
        ];

        this.relatedTxList = [];
        this.activeBalanceList = [];
        this.sharePriceList = {};

        this.address = new FormControl('', [Validators.required]);

        // List of observable subscription.
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
        }));
        this.subscriptionsArray.push(this.requestedOfiInvestorFundListOb.subscribe(
            (requested) => this.requestMyFundAccess(requested)));
        this.subscriptionsArray.push(this.shareDataOb.subscribe((shareData) => {
            this.updateSharePrice(shareData);
        }));
        this.subscriptionsArray.push(this.clientTxListRequestedOb.subscribe(requested => this.requestClientTx(requested)));
        this.subscriptionsArray.push(this.clientTxListOb.subscribe(clientTxList => {
            this.updateActiveBalanceList(clientTxList);
        }));
        this.subscriptionsArray.push(this.addressListOb.subscribe((addressList) => this.updateAddressList(addressList)));
        this.subscriptionsArray.push(this.requestedAddressListOb.subscribe(requested => {
            this.requestAddressList(requested);
        }));
        this.subscriptionsArray.push(this.requestedLabelListOb.subscribe(requested => this.requestWalletLabel(requested)));

        this.showRelatedTxModal = false;
    }

    requestClientTx(requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedClientTxList());

            // Request the list.
            OfiClientTxService.defaultRequestWalletClientTxs(this.ofiClientTxService, this.ngRedux,
                this.connectedWalletId, '');
        }
    }

    updateActiveBalanceList(clientTxListData) {
        this.clientTxListObj = clientTxListData;

        clientTxListData = this.filterTxsWithAddress(clientTxListData, this.addressSelected);

        this.pnlRegister = this.processClientTxList(clientTxListData);

        this.activeBalanceList = immutableHelper.reduce(this.pnlRegister, (result, item, key) => {
            const lastMovement = mDateHelper.dateStrToUnixTimestamp(item.lastMovement, 'YYYY-MM-DD HH:mm:ss');

            const thisBalance: ActiveBalanceListItem = {
                fundName: key,
                activeQuantity: item.activeBalance,
                realisePnl: math.round(item.realisePnl, 2),
                unRealisePnl: math.round(item.unRealisePnl, 2),
                lastMovement
            };

            result.push(thisBalance);
            return result;
        }, []);

        this.changeDetectorRef.detectChanges();
    }

    filterTxsWithAddress(clientTxListData, addressObj): any {
        const address = _.get(addressObj, 'id', '');

        return immutableHelper.reduce(clientTxListData, (result, shareTxs, shareName) => {

            result[shareName] = shareTxs.reduce((txResult, tx) => {
                const thisTxAddr = tx.get('transactionAddress', '');

                if (thisTxAddr === address) {
                    const thisTxId = tx.get('transactionId', 0);
                    txResult[thisTxId] = tx.toJS();
                }

                return txResult;

            }, {});

            return result;

        }, {});
    }

    handleSelectedAddress(value) {
        this.addressSelected = value;
        this.updateActiveBalanceList(this.clientTxListObj);
    }

    /**
     * Process clientTxList
     *
     * @param clientTxList
     * @return {{}}
     */
    processClientTxList(clientTxList) {
        const newPnlRegister = {};

        for (const shareName of Object.keys(clientTxList)) {
            const price = this.sharePriceList[shareName];
            // create the pnl register for the fund share.
            newPnlRegister[shareName] = new PnlHelper(price, this.numberConverterService);

            // process all the tx for the fund share;
            const txList = clientTxList[shareName];
            for (const transactionId of Object.keys(txList)) {
                newPnlRegister[shareName].execute(txList[transactionId]);
            }
        }

        return newPnlRegister;
    }

    viewRelateTxs(shareName: string) {
        const clientTxListData = this.filterTxsWithAddress(this.clientTxListObj, this.addressSelected);
        const txsObj = clientTxListData[shareName];

        this.relatedTxList = immutableHelper.reduce(txsObj, (result, item) => {
            const txDateNumber = mDateHelper.dateStrToUnixTimestamp(item.get('transactionDate', ''), 'YYYY-MM-DD HH:mm:ss');

            result.push({
                transactionInstrumentName: item.get('transactionInstrumentName', ''),
                transactionType: item.get('transactionType', ''),
                transactionId: item.get('transactionId', ''),
                transactionRefId: item.get('transactionRefId', ''),
                transactionPrice: this.numberConverterService.toFrontEnd(item.get('transactionPrice', '')),
                transactionUnits: this.numberConverterService.toFrontEnd(item.get('transactionUnits', '')),
                transactionSettlement: math.round(
                    this.numberConverterService.toFrontEnd(item.get('transactionSettlement', '')), 2),
                transactionDate: txDateNumber,
            });
            return result;

        }, []);

        // show modal;
        this.showRelatedTxModal = true;
        this.changeDetectorRef.detectChanges();
    }

    updateSharePrice(priceData) {
        this.sharePriceList = immutableHelper.reduce(priceData, (result, item) => {
            const fundName = item.get('issuer', '');
            const shareName = item.get('shareName', '');
            const fullName = fundName + '|' + shareName;

            result[fullName] = this.numberConverterService.toFrontEnd(item.get('price', 0));
            return result;
        }, {});
    }

    /**
     * Request my fund access base of the requested state.
     * @param requested
     * @return void
     */
    requestMyFundAccess(requested): void {
        if (!requested) {
            OfiFundInvestService.defaultRequestFunAccessMy(this.ofiFundInvestService, this.ngRedux, this.connectedWalletId);
        }
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

        this.logService.log('checking requested', this.requestedWalletAddress);
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {

            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
        }
    }

    updateAddressList(addressList) {
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
            if (!this.addressSelected || hasSelectedAddressInList.length === 0) {
                this.logService.log('selecting', this.addressList[0]);
                this.address.setValue([this.addressList[0]], {
                    onlySelf: true,
                    emitEvent: true,
                    emitModelToViewChange: true,
                    emitViewToModelChange: true
                });
                this.handleSelectedAddress(this.addressList[0]);
            } else {
                this.address.setValue([this.addressSelected], {
                    onlySelf: true,
                    emitEvent: true,
                    emitModelToViewChange: true,
                    emitViewToModelChange: true
                });
                this.handleSelectedAddress(this.addressSelected);
            }
        }

        this.changeDetectorRef.markForCheck();
    }
}
