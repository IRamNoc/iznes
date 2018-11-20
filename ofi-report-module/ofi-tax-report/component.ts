import {
    Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Pipe,
    PipeTransform,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgRedux, select } from '@angular-redux/store';
import { OfiClientTxService } from '../../ofi-req-services/ofi-client-tx/service';
import { setRequestedClientTxList } from '../../ofi-store/ofi-client-txs/ofi-client-tx-list/actions';
import { immutableHelper, NumberConverterService, mDateHelper, commonHelper, LogService } from '@setl/utils';
import { PnlHelper, ActionDirection, TradeDetail } from '../pnlHelper/class';
import * as _ from 'lodash';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { OfiFundInvestService } from '../../ofi-req-services/ofi-fund-invest/service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    InitialisationService,
    MyWalletsService,
    WalletNodeRequestService,
} from '@setl/core-req-services';
import {
    setRequestedWalletAddresses,
} from '@setl/core-store';
import * as math from 'mathjs';
import { MultilingualService } from '@setl/multilingual';

interface ClientTxViewListItem {
    transactionId: number;
    transactionRefId: number;
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
    styleUrls: ['./component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OfiTaxReportComponent implements OnInit, OnDestroy {
    tabsControl: Array<any>;

    showRelatedTxModal: boolean;

    connectedWalletId: number;
    requestedWalletAddress: boolean;
    addressSelected: any;
    address: FormControl;

    addressList: Array<any>;

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

    sharePriceList: object;

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
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'requested']) requestedOfiInvestorFundListOb;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) shareDataOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;

    constructor(private ngRedux: NgRedux<any>,
                private ofiClientTxService: OfiClientTxService,
                private numberConverterService: NumberConverterService,
                private alertsService: AlertsService,
                private ofiFundInvestService: OfiFundInvestService,
                private myWalletService: MyWalletsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private logService: LogService,
                public translate: MultilingualService,
                private changeDetectorRef: ChangeDetectorRef,
    ) {
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
                    colorClass: '',
                },
                active: true,
            },
        ];

        this.fromDateValue = mDateHelper.unixTimestampToDateStr(mDateHelper.substractYear(new Date(), 1), 'DD/MM/YYYY');
        this.toDateValue = mDateHelper.getCurrentUnixTimestampStr('DD/MM/YYYY');
        this.address = new FormControl('', [Validators.required]);

        this.dateRangeForm = new FormGroup({
            fromDate: new FormControl(this.fromDateValue),
            toDate: new FormControl(this.toDateValue),
        });

        this.relatedRedemptionTxList = [];
        this.sharePriceList = {};

        // List of observable subscription.
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connected) => {
            this.connectedWalletId = connected;
        }));
        this.subscriptionsArray.push(this.requestedOfiInvestorFundListOb.subscribe(
            requested => this.requestMyFundAccess(requested)));
        this.subscriptionsArray.push(this.shareDataOb.subscribe((shareData) => {
            this.updateSharePrice(shareData);
        }));
        this.subscriptionsArray.push(this.clientTxListRequestedOb.subscribe(requested => this.requestClientTx(requested)));
        this.subscriptionsArray.push(this.clientTxListOb.subscribe((clientTxList) => {
            this.updateClientTxList(clientTxList);
        }));
        this.subscriptionsArray.push(this.addressListOb.subscribe(addressList => this.updateAddressList(addressList)));
        this.subscriptionsArray.push(this.requestedAddressListOb.subscribe((requested) => {
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
            OfiClientTxService.defaultRequestWalletClientTxs(
                this.ofiClientTxService,
                this.ngRedux,
                this.connectedWalletId,
                '',
            );
        }
    }

    updateClientTxList(clientTxListData) {
        this.clientTxListObj = clientTxListData;

        clientTxListData = this.filterTxsWithAddress(clientTxListData, this.addressSelected);
        clientTxListData = this.filterTxsWithDate(clientTxListData);

        this.pnlRegister = this.processClientTxList(clientTxListData);

        const allTxs = immutableHelper.reduce(
            clientTxListData,
            (result, item) => {
                return Object.assign({}, result, item.toJS());

            },
            {},
        );

        this.clientTxList = immutableHelper.reduce(
            allTxs,
            (result, item) => {
                const txType = item.get('transactionType', 0);
                const relavantTx = [ActionDirection.REDEMPTION];
                if (!relavantTx.includes(txType)) {
                    return result;
                }

                const fundName = item.get('transactionInstrumentName', '');
                const transactionId = item.get('transactionId', 0);
                const transactionRefId = item.get('transactionRefId', 0);
                const grossAmount = math.round(_.get(this.pnlRegister, [fundName, 'tradeList', transactionId, 'pnl']), 2);
                const quantity = this.numberConverterService.toFrontEnd(item.get('transactionUnits', 0));
                const taxCredit = 0;
                const amountToDeclared = math.round(grossAmount + taxCredit, 2);
                const dateStr = item.get('transactionSettlementDate', '');
                const deliveryDate = mDateHelper.dateStrToUnixTimestamp(dateStr, 'YYYY-MM-DD HH:mm:ss');

                const thisTx: ClientTxViewListItem = {
                    transactionId,
                    transactionRefId,
                    fundName,
                    type: item.get('transactionType', 0),
                    grossAmount,
                    quantity,
                    taxCredit,
                    amountToDeclared,
                    deliveryDate,
                };

                result.push(thisTx);
                return result;
            },
            [],
        );

        this.totalAmountToDeclared = math.round(immutableHelper.reduce(
            this.pnlRegister,
            (result, item) => {
                return result + item.realisePnl;
            },
            2,
        ));

        this.changeDetectorRef.markForCheck();
    }

    filterTxsWithDate(clientTxListData): any {
        const fromDate = mDateHelper.dateStrToUnixTimestamp(this.fromDateValue + ' ' + '00:00', 'DD/MM/YYYY HH:mm');
        const toDate = mDateHelper.dateStrToUnixTimestamp(this.toDateValue + ' ' + '23:59', 'DD/MM/YYYY HH:mm');

        return immutableHelper.reduce(
            clientTxListData,
            (result, shareTxs, shareName) => {
                result[shareName] = shareTxs.reduce(
                    (txResult, tx) => {
                        const thisDateStr = tx.get('transactionDate', '');
                        const thisDate = mDateHelper.dateStrToUnixTimestamp(thisDateStr, 'YYYY-MM-DD');

                        if (thisDate >= fromDate && thisDate <= toDate) {
                            const thisTxId = tx.get('transactionId', 0);
                            txResult[thisTxId] = tx.toJS();
                        }

                        return txResult;
                    },
                    {},
                );

                return result;
            },
            {},
        );
    }

    filterTxsWithAddress(clientTxListData, addressObj): any {
        const address = _.get(addressObj, 'id', '');

        return immutableHelper.reduce(
            clientTxListData,
            (result, shareTxs, shareName) => {
                result[shareName] = shareTxs.reduce(
                    (txResult, tx) => {
                        const thisTxAddr = tx.get('transactionAddress', '');

                        if (thisTxAddr === address) {
                            const thisTxId = tx.get('transactionId', 0);
                            txResult[thisTxId] = tx.toJS();
                        }

                        return txResult;

                    },
                    {},
                );

                return result;
            },
            {},
        );
    }

    handleSelectedAddress(value) {
        this.addressSelected = value;
        this.updateClientTxList(this.clientTxListObj);
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
            newPnlRegister[shareName] = new PnlHelper(price, this.numberConverterService);

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

            this.relatedRedemptionTxList = immutableHelper.reduce(
                relatedTxIds,
                (result, item) => {
                    const tx = this.clientTxListObj[shareName][item];
                    const transactionPrice = this.numberConverterService.toFrontEnd(tx.transactionPrice);
                    const transactionDeliveryDate = mDateHelper.dateStrToUnixTimestamp(tx.transactionDate, 'YYYY-MM-DD HH:mm:ss');

                    result.push({
                        transactionInstrumentName: tx.transactionInstrumentName,
                        transactionType: tx.transactionType,
                        transactionId: tx.transactionId,
                        transactionRefId: tx.transactionRefId,
                        transactionPrice,
                        transactionUnits: this.numberConverterService.toFrontEnd(tx.transactionUnits),
                        transactionSettlement: math.round(this.numberConverterService.toFrontEnd(tx.transactionSettlement), 2),
                        transactionDeliveryDate,
                    });
                    return result;
                },
                [],
            );

            // show modal;
            this.showRelatedTxModal = true;
            this.changeDetectorRef.detectChanges();
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

    updateSharePrice(priceData) {
        this.sharePriceList = immutableHelper.reduce(
            priceData,
            (result, item) => {
                const fundName = item.get('issuer', '');
                const shareName = item.get('shareName', '');
                const fullName = fundName + '|' + shareName;

                result[fullName] = this.numberConverterService.toFrontEnd(item.get('price', 0));
                return result;
            },
            {},
        );
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
        this.addressList = immutableHelper.reduce(
            addressList,
            (result, item) => {
                const addr = item.get('addr', false);
                const label = item.get('label', false);

                if (addr && label) {
                    const addressItem = {
                        id: item.get('addr', ''),
                        text: item.get('label', ''),
                    };

                    result.push(addressItem);
                }
                return result;
            },
            [],
        );

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
                    emitViewToModelChange: true,
                });
                this.handleSelectedAddress(this.addressList[0]);
            } else {
                this.address.setValue([this.addressSelected], {
                    onlySelf: true,
                    emitEvent: true,
                    emitModelToViewChange: true,
                    emitViewToModelChange: true,
                });
                this.handleSelectedAddress(this.addressSelected);
            }
        }

        this.changeDetectorRef.markForCheck();
    }

    showWarning(response) {
        const message = _.get(response, '[1].Data[0].Message', '');

        this.alertsService.create('warning', `
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
