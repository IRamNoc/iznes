import {
    Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Pipe,
    PipeTransform
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {NgRedux, select} from '@angular-redux/store';
import {OfiClientTxService} from '../../ofi-req-services/ofi-client-tx/service';
import {setRequestedClientTxList} from '../../ofi-store/ofi-client-txs/ofi-client-tx-list/actions';
import {immutableHelper, NumberConverterService, mDateHelper} from '@setl/utils';
import {PnlHelper, ActionDirection, TradeDetail} from '../pnlHelper/class';
import _ from 'lodash';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {OfiFundInvestService} from '../../ofi-req-services/ofi-fund-invest/service';

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
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiPnlReportComponent implements OnInit, OnDestroy {
    tabsControl: Array<any>;

    showRelatedTxModal: boolean;

    connectedWalletId: number;

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

    assetBalances: Array<any>;

    // The related txs that we want to check of particular asset.
    relatedTxList: Array<any>;


    // List of redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['ofi', 'ofiClientTx', 'ofiClientTxList', 'allTxList']) clientTxListOb;
    @select(['ofi', 'ofiClientTx', 'ofiClientTxList', 'requested']) clientTxListRequestedOb;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'requested']) requestedOfiInvestorFundListOb;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) shareDataOb;

    constructor(private _ngRedux: NgRedux<any>,
                private _ofiClientTxService: OfiClientTxService,
                private _numberConverterService: NumberConverterService,
                private _alertsService: AlertsService,
                private _ofiFundInvestService: OfiFundInvestService,
                private _changeDetectorRef: ChangeDetectorRef) {
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
                    icon: 'fa-search',
                    text: 'Search',
                    colorClass: ''
                },
                active: true
            }
        ];

        this.relatedTxList = [];
        this.activeBalanceList = [];
        this.sharePriceList = {};

        // List of observable subscription.
        this.subscriptionsArray.push(this.requestedOfiInvestorFundListOb.subscribe(
            (requested) => this.requestMyFundAccess(requested)));
        this.subscriptionsArray.push(this.shareDataOb.subscribe((shareData) => {
            this.updateSharePrice(shareData);
        }));
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
        }));
        this.subscriptionsArray.push(this.clientTxListRequestedOb.subscribe(requested => this.requestClientTx(requested)));
        this.subscriptionsArray.push(this.clientTxListOb.subscribe(clientTxList => {
            this.updateActiveBalanceList(clientTxList);
        }));

        this.showRelatedTxModal = false;
    }

    requestClientTx(requestedState: boolean) {

        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this._ngRedux.dispatch(setRequestedClientTxList());

            // Request the list.
            OfiClientTxService.defaultRequestWalletClientTxs(this._ofiClientTxService, this._ngRedux,
                this.connectedWalletId, '');
        }
    }

    updateActiveBalanceList(clientTxListData) {
        this.clientTxListObj = clientTxListData;
        this.pnlRegister = this.processClientTxList(clientTxListData);

        this.activeBalanceList = immutableHelper.reduce(this.pnlRegister, (result, item, key) => {
            const lastMovement = mDateHelper.dateStrToUnixTimestamp(item.lastMovement, 'YYYY-MM-DD HH:mm:ss');

            const thisBalance: ActiveBalanceListItem = {
                fundName: key,
                activeQuantity: item.activeBalance,
                realisePnl: item.realisePnl,
                unRealisePnl: item.unRealisePnl,
                lastMovement
            };

            result.push(thisBalance);
            return result;
        }, []);

        this._changeDetectorRef.detectChanges();
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
            // creat the pnl register for the fund share.
            newPnlRegister[shareName] = new PnlHelper(price, this._numberConverterService);

            // process all the tx for the fund share;
            const txList = clientTxList[shareName];
            for (const transactionId of Object.keys(txList)) {
                newPnlRegister[shareName].execute(txList[transactionId]);
            }
        }

        return newPnlRegister;
    }

    viewRelateTxs(shareName: string) {
        const txsObj = this.clientTxListObj[shareName];

        this.relatedTxList = immutableHelper.reduce(txsObj, (result, item) => {

            const txDateNumber = mDateHelper.dateStrToUnixTimestamp(item.get('transactionDate', ''), 'YYYY-MM-DD HH:mm:ss');

            result.push({
                transactionInstrumentName: item.get('transactionInstrumentName', ''),
                transactionType: item.get('transactionType', ''),
                transactionId: item.get('transactionId', ''),
                transactionPrice: this._numberConverterService.toFrontEnd(item.get('transactionPrice', '')),
                transactionUnits: this._numberConverterService.toFrontEnd(item.get('transactionUnits', '')),
                transactionSettlement: this._numberConverterService.toFrontEnd(item.get('transactionSettlement', '')),
                transactionDate: txDateNumber,
            });
            return result;

        }, []);

        // show modal;
        this.showRelatedTxModal = true;
        this._changeDetectorRef.detectChanges();
    }

    updateSharePrice(priceData) {
        this.sharePriceList = immutableHelper.reduce(priceData, (result, item) => {
            const fundName = item.get('issuer', '');
            const shareName = item.get('shareName', '');
            const fullName = fundName + '|' + shareName;

            result[fullName] = this._numberConverterService.toFrontEnd(item.get('price', 0));
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
            OfiFundInvestService.defaultRequestFunAccessMy(this._ofiFundInvestService, this._ngRedux);
        }
    }

}
