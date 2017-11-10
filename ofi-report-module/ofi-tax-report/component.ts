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
import {FormControl, FormGroup} from '@angular/forms';

interface ClientTxViewListItem {
    transactionId: number;
    fundName: string;
    type: ActionDirection;
    grossAmount: number;
    quantity: number;
    taxCredit: number;
    amountToDeclared: number;
    deliveryDate: number;
}

@Component({
    selector: 'app-ofi-tax-report',
    templateUrl: 'component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiTaxReportComponent implements OnInit, OnDestroy {
    tabsControl: Array<any>;

    showRelatedTxModal: boolean;

    connectedWalletId: number;

    // Date picker configuration
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'DD-MM-YYYY',
        closeOnSelect: true,
        opens: 'right',
        locale: 'en',
    };

    // Date range search form
    dateRangeForm: FormGroup;
    fromDateValue: string;
    toDateValue: string;

    // client txt data
    clientTxListObj: any;
    clientTxList: Array<any>;

    // Pnl instances
    // use to keep track of the pnl for each fund share
    pnlRegister: any;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    assetBalances: Array<any>;

    // The related subscription txs that we want to check of particular redemption.
    relatedRedemptionTxList: Array<any>;
    totalAmountToDeclared: number;


    // List of redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['ofi', 'ofiClientTx', 'ofiClientTxList', 'allTxList']) clientTxListOb;
    @select(['ofi', 'ofiClientTx', 'ofiClientTxList', 'requested']) clientTxListRequestedOb;

    constructor(private _ngRedux: NgRedux<any>,
                private _ofiClientTxService: OfiClientTxService,
                private _numberConverterService: NumberConverterService,
                private _alertsService: AlertsService,
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

        this.fromDateValue = mDateHelper.unixTimestampToDateStr(mDateHelper.substractYear(new Date(), 1), 'DD/MM/YYYY');
        this.toDateValue = mDateHelper.getCurrentUnixTimestampStr('DD/MM/YYYY');

        this.dateRangeForm = new FormGroup({
            fromDate: new FormControl(this.fromDateValue),
            toDate: new FormControl(this.toDateValue)
        });

        this.relatedRedemptionTxList = [];

        // List of observable subscription.
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
        }));
        this.subscriptionsArray.push(this.clientTxListRequestedOb.subscribe(requested => this.requestClientTx(requested)));
        this.subscriptionsArray.push(this.clientTxListOb.subscribe(clientTxList => {
            this.updateClientTxList(clientTxList);
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

    updateClientTxList(clientTxListData) {
        this.clientTxListObj = clientTxListData;
        clientTxListData = this.filterTxsWithDate(clientTxListData);

        this.pnlRegister = this.processClientTxList(clientTxListData);

        const allTxs = immutableHelper.reduce(clientTxListData, (result, item) => {
            return Object.assign({}, result, item.toJS());

        }, {});

        this.clientTxList = immutableHelper.reduce(allTxs, (result, item) => {
            const txType = item.get('transactionType', 0);
            const relavantTx = [ActionDirection.REDEMPTION];
            if (!relavantTx.includes(txType)) {
                return result;
            }

            const fundName = item.get('transactionInstrumentName', '');
            const transactionId = item.get('transactionId', 0);
            const grossAmount = _.get(this.pnlRegister, [fundName, 'tradeList', transactionId, 'pnl'], 0);
            const quantity = this._numberConverterService.toFrontEnd(item.get('transactionUnits', 0));
            const taxCredit = 0;
            const amountToDeclared = grossAmount + taxCredit;
            const dateStr = item.get('transactionSettlementDate', '');
            const deliveryDate = mDateHelper.dateStrToUnixTimestamp(dateStr, 'YYYY-MM-DD HH:mm:ss');

            const thisTx: ClientTxViewListItem = {
                transactionId,
                fundName,
                type: item.get('transactionType', 0),
                grossAmount,
                quantity,
                taxCredit,
                amountToDeclared,
                deliveryDate
            };

            result.push(thisTx);
            return result;
        }, []);

        this.totalAmountToDeclared = immutableHelper.reduce(this.pnlRegister, (result, item) => {
            return result + item.realisePnl;
        }, 0);

        this._changeDetectorRef.markForCheck();
    }

    filterTxsWithDate(clientTxListData): any {
        const fromDate = mDateHelper.dateStrToUnixTimestamp(this.fromDateValue + ' ' + '00:00', 'DD/MM/YYYY HH:mm');
        const toDate = mDateHelper.dateStrToUnixTimestamp(this.toDateValue + ' ' + '23:59', 'DD/MM/YYYY HH:mm');

        return immutableHelper.reduce(clientTxListData, (result, shareTxs, shareName) => {

            result[shareName] = shareTxs.reduce((txResult, tx) => {
                const thisDateStr = tx.get('transactionDate', '');
                const thisDate = mDateHelper.dateStrToUnixTimestamp(thisDateStr, 'YYYY-MM-DD');

                if (thisDate >= fromDate && thisDate <= toDate) {
                    const thisTxId = tx.get('transactionId', 0);
                    txResult[thisTxId] = tx.toJS();
                }

                return txResult;

            }, {});

            return result;

        }, {});
    }

    /**
     * Process clientTxList
     *
     * @param clientTxList
     * @return {{}}
     */
    processClientTxList(clientTxList) {
        const price = 120;

        const newPnlRegister = {};

        for (const shareName of Object.keys(clientTxList)) {
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

    viewRelateTxs(transactionId: number, shareName: string) {
        const txDetail = this.clientTxListObj[shareName][transactionId];
        const txType = txDetail.transactionType;
        if (txType === ActionDirection.REDEMPTION) {
            const fundName = txDetail.transactionInstrumentName;
            const relatedTxIds = _.get(this.pnlRegister, [fundName, 'tradeList', transactionId, 'relatedSubscription'], []);

            this.relatedRedemptionTxList = immutableHelper.reduce(relatedTxIds, (result, item) => {
                const tx = this.clientTxListObj[shareName][item];
                const transactionPrice = this._numberConverterService.toFrontEnd(tx.transactionPrice);
                const transactionDeliveryDate = mDateHelper.dateStrToUnixTimestamp(tx.transactionDate, 'YYYY-MM-DD HH:mm:ss');

                result.push({
                    transactionInstrumentName: tx.transactionInstrumentName,
                    transactionType: tx.transactionType,
                    transactionId: tx.transactionId,
                    transactionRefId: tx.transactionRefId,
                    transactionPrice,
                    transactionUnits: this._numberConverterService.toFrontEnd(tx.transactionUnits),
                    transactionSettlement: this._numberConverterService.toFrontEnd(tx.transactionSettlement),
                    transactionDeliveryDate
                });
                return result;
            }, []);

            // show modal;
            this.showRelatedTxModal = true;
            this._changeDetectorRef.detectChanges();


        } else {
            this.showWarning('No related txs are found');
        }
    }

    dateChange(dateType, $event) {
        if (dateType === 'from') {
            this.fromDateValue = $event;
        } else {
            this.toDateValue = $event;
        }
        this.updateClientTxList(this.clientTxListObj);
    }

    showWarning(response) {

        const message = _.get(response, '[1].Data[0].Message', '');

        this._alertsService.create('warning', `
                    <table class="table grid">

                        <tbody>
                            <tr>
                                <td class="text-center text-danger">${message}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

}

