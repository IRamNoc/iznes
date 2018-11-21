import { Inject, Injectable } from '@angular/core';
import { WalletnodeTxService } from '@setl/core-req-services';
import {
    APP_CONFIG,
    AppConfig,
    ArrangementActionType,
    BlockchainContractService,
    commonHelper,
    ConditionType,
    immutableHelper,
    mDateHelper,
    MoneyValuePipe,
    NumberConverterService,
    SagaHelper,
} from '@setl/utils';
import { NgRedux } from '@angular-redux/store';
import { setLastCreatedContractDetail } from '@setl/core-store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { OfiFundInvestService } from '../../ofi-req-services/ofi-fund-invest/service';
import { ArrangementType } from '../../ofi-req-services/ofi-fund-invest/model';
import * as _ from 'lodash';

@Injectable()
export class InvestFundFormService {
    private appConfig: AppConfig;
    private divider: number;

    constructor(private ngRedux: NgRedux<any>,
                private walletNodeTxService: WalletnodeTxService,
                public moneyValuePipe: MoneyValuePipe,
                private numberConverterService: NumberConverterService,
                private alertsService: AlertsService,
                private ofiFundInvestService: OfiFundInvestService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {
        this.divider = appConfig.numberDivider;
    }

    handleForm(formValue, shareMetaData, actionType): void {
        const decimalisation = immutableHelper.get(shareMetaData, 'decimalisation', 2);
        const quantity = this.moneyValuePipe.parse(immutableHelper.get(formValue, 'quantity', 0), decimalisation);
        const grossAmount = this.moneyValuePipe.parse(immutableHelper.get(formValue, 'grossAmount', 0), decimalisation);
        const investorAddress = immutableHelper.get(formValue, 'address', '');
        const comment = immutableHelper.get(formValue, 'comment', '');
        const issuer = immutableHelper.get(shareMetaData, 'issuer', '');
        const shareName = immutableHelper.get(shareMetaData, 'shareName', '');
        const asset = issuer + '|' + shareName;
        const byType = immutableHelper.get(formValue, 'byType', '');
        let authoriseRef = '';
        const settlementDateTimeStr = immutableHelper.get(formValue, 'settlementDate', '') + ' ' +
            immutableHelper.get(shareMetaData, 'settlementTime', '');
        const settleTimeStamp = mDateHelper.dateStrToUnixTimestamp(settlementDateTimeStr, 'DD/MM/YYYY HH:mm') / 1000;
        // should use settlement plus 30 day
        const expirySecond = 2592000;
        const expiryTimeStamp = settleTimeStamp + expirySecond; // + 1min from settlement.
        const issuerAddress = immutableHelper.get(formValue, 'shareIssuerAddress', '');
        const walletId = immutableHelper.get(formValue, 'walletId', 0);
        const walletName = immutableHelper.get(formValue, 'walletName', 0);
        const feePercentInt = immutableHelper.get(shareMetaData, 'feePercent', 0);
        const feePercent = feePercentInt / 100;
        const platFormFee = immutableHelper.get(shareMetaData, 'platformFee', 0);

        // Convert to to blockchain integer number
        const quantityParse = this.numberConverterService.toBlockchain(quantity);
        const grossAmountParse = this.numberConverterService.toBlockchain(grossAmount);
        const platFormFeeParse = this.numberConverterService.toBlockchain(platFormFee);
        const navParse = this.numberConverterService.toBlockchain(shareMetaData.nav);

        const subPortfolio = immutableHelper.get(formValue, 'subPortfolio', '');

        authoriseRef = 'Confirm receipt of payment';

        const arrangementData = this.constructArrangementData({
            quantity: quantityParse,
            grossAmount: grossAmountParse,
            asset,
            issuerAddress,
            investorAddress,
            settleTimeStamp,
            actionType,
            byType,
            authoriseRef,
            expiryTimeStamp,
            walletName,
            feePercent,
            platFormFee: platFormFeeParse,
        });

        const contractData: any = BlockchainContractService.arrangementToContractData(arrangementData);

        // create contract in the blockchain
        // Create a saga pipe.
        const asyncTaskPipes = this.walletNodeTxService.newContract({
            walletId,
            address: contractData.creatorAddress,
            function: contractData.contractFunction,
            contractData: contractData.contractData,
        });

        // Send a saga action.
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipes,
            (data) => {
                // show success walletnode request message
                this.showSuccessResponse();

                // Save last created contact along with meta data for creating arrangement.
                const userId = immutableHelper.get(formValue, 'userId', 0);
                const walletCommuPub = immutableHelper.get(formValue, 'walletCommuPub', '');
                const creatorId = walletId;
                const type = {
                    subscribe: ArrangementType.SUBSCRIBE,
                    redeem: ArrangementType.REDEEM,
                }[actionType];

                const metaData = {
                    currency: shareMetaData.currency,
                    units: quantityParse,
                    price: navParse,
                    consideration: grossAmountParse,
                    ref: formValue.comment,
                    assetISIN: shareMetaData.isin,
                    registrar: shareMetaData.registrar,
                    feePercent: shareMetaData.feePercent,
                    investorId: userId,
                    investorWalletId: walletId,
                    investorWalletName: walletName,
                    investorWalletCommuPub: walletCommuPub,
                    investorWalletAddr: investorAddress,
                    investorWalletBankID: 0,
                    investorWalletBankCommuPub: '',
                    investorSubPortfolio: subPortfolio,
                    iban: _.get(formValue, 'iban', ''),
                };

                const parties = {
                    [issuerAddress]: {
                        canRead: 1,
                        canWrite: 1,
                        canDelete: 1,
                        partyType: 2,
                    },
                };

                const cutoffDateTimeStr = formValue.cutoffDate + ' ' + shareMetaData.cutoffTime;
                const valuationDateTimeStr = formValue.valuationDate + ' ' + shareMetaData.valuationTime;

                const cutoffDateTimeNum = mDateHelper.dateStrToUnixTimestamp(cutoffDateTimeStr, 'DD/MM/YYYY HH:mm');
                const valuationDateTimeNum = mDateHelper.dateStrToUnixTimestamp(valuationDateTimeStr, 'DD/MM/YYYY HH:mm');

                const cutoffDateTimeDBFormat = mDateHelper.unixTimestampToDateStr(cutoffDateTimeNum, 'YYYY-MM-DD HH:mm');
                const valuationDateTimeDBFormat = mDateHelper.unixTimestampToDateStr(valuationDateTimeNum, 'YYYY-MM-DD HH:mm');
                const settlementDateTimeDBFormat = mDateHelper.unixTimestampToDateStr(settleTimeStamp * 1000, 'YYYY-MM-DD HH:mm');

                this.ngRedux.dispatch(setLastCreatedContractDetail(data, {
                    actionType: 'ofi-arrangement',
                    arrangementData: {
                        creatorId,
                        type,
                        metaData: JSON.stringify(metaData),
                        asset,
                        investBy: byType,
                        quantity: byType === 0 ? quantityParse : 0,
                        amountWithCost: byType === 1 ? grossAmountParse : 0,
                        feePercent: feePercentInt,
                        platFormFee: platFormFeeParse,
                        parties,
                        cutoff: cutoffDateTimeDBFormat,
                        delivery: settlementDateTimeDBFormat,
                        valuation: valuationDateTimeDBFormat,
                    },
                }))
                ;
            },
            (data) => {
                this.showWalletNodeErrorResponse(data);
            },
        ));
    }

    private constructArrangementData(formData: {
        quantity: number;
        grossAmount: number;
        asset: string;
        issuerAddress: string;
        investorAddress: string;
        settleTimeStamp: number;
        actionType: string;
        byType: number;
        authoriseRef: string;
        expiryTimeStamp: number;
        walletName: string;
        feePercent: number;
        platFormFee: number;
    }) {

        let actionData = [];
        const {
            quantity,
            grossAmount,
            asset,
            issuerAddress,
            investorAddress,
            settleTimeStamp,
            actionType,
            byType,
            authoriseRef,
            expiryTimeStamp,
            walletName,
            feePercent,
            platFormFee,
        } = formData;

        if (actionType === 'subscribe') {
            // byType: Subscribe by quantity or by amount.
            // 0: by quantity
            // 1: by amount
            if (byType === 0) {
                // by quantity

                actionData = [
                    {
                        actionData: {
                            amount: quantity,
                            amountType: 'amount',
                            asset,
                            dataItem: [],
                            fromAddress: issuerAddress,
                            toAddress: investorAddress,
                            metaData: {
                                clientTxType: 'subscription',
                            },
                        },
                        actionType: ArrangementActionType.ISSUE,
                    },
                ];
            } else if (byType === 1) {
                // by amount
                actionData = [
                    {
                        actionData: {
                            amount: '(((' + grossAmount + ' - ' + platFormFee + ' ) / (1 + ' + feePercent + ' ) ) / nav) * ' +
                            this.divider,
                            amountType: 'amount',
                            asset,
                            dataItem: [],
                            fromAddress: issuerAddress,
                            toAddress: investorAddress,
                            metaData: {
                                clientTxType: 'subscription',
                            },
                        },
                        actionType: ArrangementActionType.ISSUE,
                    },
                ];

            } else {
                throw new Error('Invalid action-by type.');
            }
        } else if (actionType === 'redeem') {
            // byType: Redeem by quantity or by amount.
            // 0: by quantity
            // 1: by amount
            if (byType === 0) {
                // by quantity
                actionData = [
                    {
                        actionData: {
                            amount: quantity,
                            amountType: 'amount',
                            asset,
                            dataItem: [],
                            fromAddress: investorAddress,
                            toAddress: issuerAddress,
                            metaData: {
                                clientTxType: 'redemption',
                            },
                        },
                        actionType: ArrangementActionType.SEND,
                    },
                ];
            } else if (byType === 1) {

                // by amount
                actionData = [
                    {
                        actionData: {
                            amount: '(' + grossAmount + ' / nav ) * ' + this.divider,
                            amountType: 'amount',
                            asset,
                            dataItem: [],
                            fromAddress: investorAddress,
                            toAddress: issuerAddress,
                            metaData: {
                                clientTxType: 'redemption',
                            },
                        },
                        actionType: ArrangementActionType.SEND,
                    },
                ];

            } else {
                throw new Error('Invalid action-by type.');
            }
        } else {
            throw new Error('Invalid investment action type.');
        }

        const conditions = [
            {
                conditionData: {
                    executeTimeStamp: settleTimeStamp,
                },
                conditionType: ConditionType.TIME,
            },
            {
                conditionData: {
                    authoriseRef,
                    address: issuerAddress,
                },
                conditionType: ConditionType.AUTHORISE,
            },
        ];

        return {
            actions: actionData,
            conditions,
            datas: [
                {
                    parameter: 'nav',
                    address: issuerAddress,
                },
            ],
            expiry: expiryTimeStamp,
            numStep: '1',
            stepTitle: commonHelper.capitalizeFirstLetter(actionType) + ' of ' + asset + ' from ' + walletName,
            creatorAddress: investorAddress,
        };
    }

    showWalletNodeErrorResponse(response) {
        let message = _.get(response, '[1].data.status', '');
        if (message === '') {
            message = _.get(response, '[1].status', '');
        }

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

    showSuccessResponse() {
        this.alertsService.create('waiting', `
                    <table class="table grid">
                        <tbody>
                            <tr>
                                <td class="text-left text-success" width="500px">
                                <i class="fa fa-clock-o text-primary" aria-hidden="true"></i>
                                &nbsp;${this.translate.translate('Waiting order to be put in blockchain ledger')}</div></td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

    showInvalidForm(message) {
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
}
