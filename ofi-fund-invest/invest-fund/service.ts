import {Inject, Injectable} from '@angular/core';

import {WalletnodeTxService} from '@setl/core-req-services';
import {
    BlockchainContractService,
    MoneyValuePipe,
    NumberConverterService,
    immutableHelper,
    ConditionType,
    ArrangementActionType,
    commonHelper,
    SagaHelper
} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';
import {APP_CONFIG, AppConfig} from '@setl/utils';
import {setLastCreatedContractDetail} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {OfiFundInvestService} from '../../ofi-req-services/ofi-fund-invest/service';
import {ArrangementType} from '../../ofi-req-services/ofi-fund-invest/model';
import _ from 'lodash';

@Injectable()
export class InvestFundFormService {
    private _appConfig: AppConfig;
    private divider: number;

    constructor(private _ngRedux: NgRedux<any>,
                private _walletNodeTxService: WalletnodeTxService,
                private _moneyValuePipe: MoneyValuePipe,
                private _numberConverterService: NumberConverterService,
                private _alertsService: AlertsService,
                private _ofiFundInvestService: OfiFundInvestService,
                @Inject(APP_CONFIG) _appConfig: AppConfig) {
        this.divider = _appConfig.numberDivider;
    }

    handleForm(formValue, shareMetaData, actionType): void {
        const decimalisation = immutableHelper.get(shareMetaData, 'decimalisation', 2);
        const quantity = this._moneyValuePipe.parse(immutableHelper.get(formValue, 'quantity', 0), decimalisation);
        const grossAmount = this._moneyValuePipe.parse(immutableHelper.get(formValue, 'grossAmount', 0), decimalisation);
        const investorAddress = immutableHelper.get(formValue, 'address', '');
        const comment = immutableHelper.get(formValue, 'comment', '');
        const issuer = immutableHelper.get(shareMetaData, 'issuer', '');
        const shareName = immutableHelper.get(shareMetaData, 'shareName', '');
        const asset = issuer + '|' + shareName;
        const byType = immutableHelper.get(formValue, 'byType', '');
        let authoriseRef = '';
        const settleTimeStamp = immutableHelper.get(shareMetaData, 'settlementDateTimeNumber', 0) / 1000;
        // const expiryTimeStamp = settleTimeStamp + 3600; // + 1h from settlement.
        const expiryTimeStamp = settleTimeStamp + 600; // + 1min from settlement.
        const issuerAddress = immutableHelper.get(formValue, 'shareIssuerAddress', '');
        const walletId = immutableHelper.get(formValue, 'walletId', 0);
        const walletName = immutableHelper.get(formValue, 'walletName', 0);
        const feePercent = immutableHelper.get(shareMetaData, 'feePercent', 0) / 100;

        // Convert to to blockchain integer number
        const quantityParse = this._numberConverterService.toBlockchain(quantity);
        const grossAmountParse = this._numberConverterService.toBlockchain(grossAmount);
        const platFormFeeParse = this._numberConverterService.toBlockchain(grossAmount);
        const navParse = this._numberConverterService.toBlockchain(shareMetaData.nav);

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
            platFormFee: platFormFeeParse
        });


        const contractData: any = BlockchainContractService.arrangementToContractData(arrangementData);

        // create contract in the blockchain
        // Create a saga pipe.
        const asyncTaskPipes = this._walletNodeTxService.newContract({
            walletId: walletId,
            address: contractData.creatorAddress,
            'function': contractData.contractFunction,
            contractData: contractData.contractData
        });

        // Send a saga action.
        this._ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipes,
            (data) => {
                // Save last created contact along with meta data for creating arrangement.
                const userId = immutableHelper.get(formValue, 'userId', 0);
                const walletCommuPub = immutableHelper.get(formValue, 'walletCommuPub', '');
                const creatorId = walletId;
                const type = {
                    subscribe: ArrangementType.SUBSCRIBE,
                    redeem: ArrangementType.REDEEM
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
                    investorWalletBankCommuPub: ''
                };

                const parties = {
                    [issuerAddress]: {
                        canRead: 1,
                        canWrite: 1,
                        canDelete: 1,
                        partyType: 2
                    }
                };

                this._ngRedux.dispatch(setLastCreatedContractDetail(data, {
                    actionType,
                    arrangementData: {
                        creatorId,
                        type,
                        metaData: JSON.stringify(metaData),
                        asset: asset,
                        parties,
                        cutoff: shareMetaData.cutoffDateTimeStr,
                        delivery: shareMetaData.settlementDateTimeStr,
                        valuation: shareMetaData.valuationDateTimeStr
                    }
                }));
            },
            (data) => {
                this.showErrorResponse(data);
            }
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
            platFormFee
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
                            asset: asset,
                            dataItem: [],
                            fromAddress: issuerAddress,
                            sharePrice: -1, // only used for phoenix
                            toAddress: investorAddress
                        },
                        actionType: ArrangementActionType.ISSUE
                    }
                ];
            } else if (byType === 1) {
                // by amount
                actionData = [
                    {
                        actionData: {
                            amount: '(((' + grossAmount + ' - ' + platFormFee + ' ) * (1 - ' + feePercent + ' ) ) / nav) * ' +
                            this.divider,
                            amountType: 'amount',
                            asset: asset,
                            dataItem: [],
                            fromAddress: issuerAddress,
                            sharePrice: -1, // only used for phoenix
                            toAddress: investorAddress
                        },
                        actionType: ArrangementActionType.ISSUE
                    }
                ]
                ;

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
                            asset: asset,
                            dataItem: [],
                            fromAddress: investorAddress,
                            sharePrice: -1, // only used for phoenix
                            toAddress: issuerAddress
                        },
                        actionType: ArrangementActionType.SEND
                    }
                ];
            } else if (byType === 1) {

                // by amount
                actionData = [
                    {
                        actionData: {
                            amount: '(' + grossAmount + ' / nav ) * ' + this.divider,
                            amountType: 'amount',
                            asset: asset,
                            dataItem: [],
                            fromAddress: investorAddress,
                            sharePrice: -1, // only used for phoenix
                            toAddress: issuerAddress
                        },
                        actionType: ArrangementActionType.SEND
                    }
                ]
                ;

            } else {
                throw new Error('Invalid action-by type.');
            }
        } else {
            throw new Error('Invalid investment action type.');
        }
        return {
            actions: actionData,
            conditions: [
                {
                    conditionData: {
                        executeTimeStamp: settleTimeStamp
                    },
                    conditionType: ConditionType.TIME
                },
                {
                    conditionData: {
                        authoriseRef: authoriseRef,
                        address: issuerAddress
                    },
                    conditionType: ConditionType.AUTHORISE
                }
            ],
            datas: [
                {
                    'parameter': 'nav',
                    'address': issuerAddress
                }
            ],
            expiry: expiryTimeStamp,
            numStep: '1',
            stepTitle: commonHelper.capitalizeFirstLetter(actionType) + ' of ' + asset + ' from ' + walletName,
            creatorAddress: investorAddress
        };
    }

    createArrangement(requestData): void {
        console.log('creating arrangement');
        const arrangementData = _.get(requestData, 'metaData.arrangementData', {});

        // save arrangement
        const asyncTaskPipe = this._ofiFundInvestService.addArrangementRequest(arrangementData);

        this._ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (response) => {
                // save arrangement and contract map
                const arrangementId = _.get(response, '[1].Data[0].arrangementID', 0);
                if (arrangementId === 0) {
                    throw new Error('Create new order fail');
                }

                const walletId = _.get(arrangementData, 'creatorId', 0);
                const contractAddress = _.get(requestData, 'contractAddress', '');
                const expiry = _.get(requestData, 'contractExpiry', 0);

                const addMapAsyncPipe = this._ofiFundInvestService.addArrangementContractMapRequest({
                    walletId,
                    arrangementId,
                    contractAddress,
                    expiry
                });

                this._ngRedux.dispatch(SagaHelper.runAsyncCallback(
                    addMapAsyncPipe,
                    (addMapResponse) => {
                        console.log('success----------------');
                    },
                    (addMapResponse) => {
                        this.showErrorResponse(addMapResponse);
                    }
                ));

            },
            (response) => {
                this.showErrorResponse(response);
            },
        ));

    }

    showErrorResponse(response) {

        const message = _.get(response, '[1].Data[0].Message', '');

        this._alertsService.create('error', `
                    <table class="table grid">

                        <tbody>
                            <tr>
                                <td class="text-center text-danger">${message}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

    showSuccessResponse(message) {

        this._alertsService.create('success', `
                    <table class="table grid">

                        <tbody>
                            <tr>
                                <td class="text-center text-success">${message}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }
}

