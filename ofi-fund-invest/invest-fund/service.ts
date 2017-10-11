import {Injectable} from '@angular/core';

import {WalletnodeTxService} from '@setl/core-req-services';
import {
    BlockchainContractService,
    MoneyValuePipe,
    NumberConverterService,
    immutableHelper,
    ConditionType,
    ArrangementActionType,
    commonHelper
} from '@setl/utils';

@Injectable()
export class InvestFundFormService {

    constructor(private _walletNodeTxService: WalletnodeTxService,
                private _moneyValuePipe: MoneyValuePipe,
                private _numberConverterService: NumberConverterService) {
    }

    handleForm(formValue, shareMetaData, actionType): void {
        const decimalisation = immutableHelper.get(shareMetaData, 'decimalisation', 2);
        const quantity = this._moneyValuePipe.parse(immutableHelper.get(formValue, 'quantity', 0), decimalisation);
        const grossAmount = this._moneyValuePipe.parse(immutableHelper.get(formValue, 'quantity', 0), decimalisation);
        const investorAddress = immutableHelper.get(formValue, 'address', '');
        const comment = immutableHelper.get(formValue, 'comment', '');
        const shareName = immutableHelper.get(shareMetaData, 'shareName', '');
        const byType = immutableHelper.get(formValue, 'byType', '');
        let authoriseRef = '';
        const settleTimeStamp = 0;
        const expiryTimeStamp = settleTimeStamp + 10;
        const issuerAddress = '';

        // Convert to to blockchain integer number
        const quantityParse = this._numberConverterService.toBlockchain(quantity);
        const grossAmountParse = this._numberConverterService.toBlockchain(grossAmount);

        if (actionType === 'subscribe') {
            console.log('submitting subscribe');

            authoriseRef = 'Confirm receipt of payment';

            this.constructArrangementData({
                quantity: quantityParse,
                grossAmount: grossAmountParse,
                shareName,
                issuerAddress,
                investorAddress,
                settleTimeStamp,
                actionType,
                byType,
                authoriseRef,
                expiryTimeStamp
            });

        } else if (actionType === 'redeem') {
            console.log('submitting redeem');
        }
    }

    private constructArrangementData(formData: {
        quantity: number;
        grossAmount: number;
        shareName: string;
        issuerAddress: string;
        investorAddress: string;
        settleTimeStamp: number;
        actionType: string;
        byType: number;
        authoriseRef: string;
        expiryTimeStamp: number;
    }) {

        let actionData = [];
        const {
            quantity,
            grossAmount,
            shareName,
            issuerAddress,
            investorAddress,
            settleTimeStamp,
            actionType,
            byType,
            authoriseRef,
            expiryTimeStamp
        } = formData;

        const currentWalletName = '';

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
                        asset: shareName,
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

        } else {
            throw new Error('Invalid action-by type.');
        }

        const arrangementData = {
            actions: actionData,
            condition: [
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
            expiry: expiryTimeStamp,
            numStep: '1',
            stepTitle: commonHelper.capitalizeFirstLetter(actionType) + ' of ' + shareName + ' from ' + currentWalletName,
            creatorAddress: ''
        };

        const contractData = BlockchainContractService.arrangementToContractData(arrangementData);

        console.log('request to walletnode to create contract ', contractData);
    }
}


// function test() {
//
//     var actionsData;
//
//     if (subscribeType == 'byUnit') {
//         // By unit
//         if (!isDistributor) {
//             actionsData = [
//                 {
//                     actionData: {
//                         'amount': units,
//                         'amountType': 'amount',
//                         'asset': asset,
//                         'dataItem': '.',
//                         'fromAddr': issuerAddr,
//                         'sharePrice': -1,
//                         'toAddr': investorAddr
//                     },
//                     actionType: 'issue'
//                 },
//
//                 {
//                     actionData: {
//                         'amount': "(" + units + ' * nav / ' + document.dataGlobal.OFI_DECIMALISATION + ') * (1 + ' + entryPercent + ' )',
//                         'amountType': 'amount',
//                         'asset': currency,
//                         'dataItem': '.',
//                         'fromAddr': investorAddr,
//                         'sharePrice': -1,
//                         'toAddr': issuerAddr
//                     },
//                     actionType: 'send'
//                 },
//
//                 {
//                     actionData: {
//                         'amount': 100000,
//                         'amountType': 'amount',
//                         'asset': currency,
//                         'dataItem': '.',
//                         'fromAddr': investorAddr,
//                         'sharePrice': -1,
//                         'toAddr': platformAddr
//                     },
//                     actionType: 'send'
//                 }
//             ];
//
//         } else {
//             actionsData = [
//                 {
//                     actionData: {
//                         'amount': units,
//                         'amountType': 'amount',
//                         'asset': asset,
//                         'dataItem': '.',
//                         'fromAddr': issuerAddr,
//                         'sharePrice': -1,
//                         'toAddr': investorAddr
//                     },
//                     actionType: 'issue'
//                 },
//
//                 {
//                     actionData: {
//                         'amount': "(" + units + ' * nav / ' + document.dataGlobal.OFI_DECIMALISATION + ') * (1 + ' + entryPercent + ' )',
//                         'amountType': 'amount',
//                         'asset': currency,
//                         'dataItem': '.',
//                         'fromAddr': investorAddr,
//                         'sharePrice': -1,
//                         'toAddr': issuerAddr
//                     },
//                     actionType: 'send'
//                 },
//
//                 {
//                     actionData: {
//                         'amount': 100000,
//                         'amountType': 'amount',
//                         'asset': currency,
//                         'dataItem': '.',
//                         'fromAddr': investorAddr,
//                         'sharePrice': -1,
//                         'toAddr': platformAddr
//                     },
//                     actionType: 'send'
//                 },
//
//                 {
//                     actionData: {
//                         'amount': "(" + units + ' * nav / ' + document.dataGlobal.OFI_DECIMALISATION + ') * (' + document.dataGlobal.OFI_DISTRIBUTOR_COM_SUB + ' )',
//                         // 'amount': "(" + units + ' * nav / ' + document.dataGlobal.OFI_DECIMALISATION + ')',
//                         'amountType': 'amount',
//                         'asset': currency,
//                         'dataItem': '.',
//                         'fromAddr': issuerAddr,
//                         'sharePrice': -1,
//                         'toAddr': distributorAddr
//                     },
//                     actionType: 'send'
//                 }
//             ];
//         }
//     } else if (subscribeType === 'byAmount') {
//         // By amount
//         if (!isDistributor) {
//             actionsData = [
//                 {
//                     actionData: {
//                         'amount': '((' + consideration + ' * (1 - ' + entryPercent + ' ) ) / nav) * ' + document.dataGlobal.OFI_DECIMALISATION,
//                         'amountType': 'amount',
//                         'asset': asset,
//                         'dataItem': '.',
//                         'fromAddr': issuerAddr,
//                         'sharePrice': -1,
//                         'toAddr': investorAddr
//                     },
//                     actionType: 'issue'
//                 },
//
//                 {
//                     actionData: {
//                         'amount': consideration,
//                         'amountType': 'amount',
//                         'asset': currency,
//                         'dataItem': '.',
//                         'fromAddr': investorAddr,
//                         'sharePrice': -1,
//                         'toAddr': issuerAddr
//                     },
//                     actionType: 'send'
//                 },
//
//                 {
//                     actionData: {
//                         'amount': 100000,
//                         'amountType': 'amount',
//                         'asset': currency,
//                         'dataItem': '.',
//                         'fromAddr': investorAddr,
//                         'sharePrice': -1,
//                         'toAddr': platformAddr
//                     },
//                     actionType: 'send'
//                 }
//             ];
//
//         } else {
//             actionsData = [
//                 {
//                     actionData: {
//                         'amount': '((' + consideration + ' * (1 - ' + entryPercent + ' ) ) / nav) * ' + document.dataGlobal.OFI_DECIMALISATION,
//                         'amountType': 'amount',
//                         'asset': asset,
//                         'dataItem': '.',
//                         'fromAddr': issuerAddr,
//                         'sharePrice': -1,
//                         'toAddr': investorAddr
//                     },
//                     actionType: 'issue'
//                 },
//
//                 {
//                     actionData: {
//                         'amount': consideration,
//                         'amountType': 'amount',
//                         'asset': currency,
//                         'dataItem': '.',
//                         'fromAddr': investorAddr,
//                         'sharePrice': -1,
//                         'toAddr': issuerAddr
//                     },
//                     actionType: 'send'
//                 },
//
//                 {
//                     actionData: {
//                         'amount': 100000,
//                         'amountType': 'amount',
//                         'asset': currency,
//                         'dataItem': '.',
//                         'fromAddr': investorAddr,
//                         'sharePrice': -1,
//                         'toAddr': platformAddr
//                     },
//                     actionType: 'send'
//                 },
//
//                 {
//                     actionData: {
//                         'amount': consideration + '* (' +
//                         document.dataGlobal.OFI_DISTRIBUTOR_COM_SUB + ' )',
//                         'amountType': 'amount',
//                         'asset': currency,
//                         'dataItem': '.',
//                         'fromAddr': issuerAddr,
//                         'sharePrice': -1,
//                         'toAddr': distributorAddr
//                     },
//                     actionType: 'send'
//                 }
//             ];
//         }
//     }
//
//     var contractData = {
//         actions: actionsData,
//         conditions: [
//             {
//                 conditionData: {
//                     executeTimeStamp: settleTimeStamp
//                 },
//                 conditionType: 'time'
//             }
//         ],
//         datas: [
//             {
//                 'parameter': 'nav',
//                 'addr': issuerAddr
//             }
//         ],
//         docs: [],
//         expiry: expiryTimeStamp,
//         numStep: '1',
//         steptitle: "Subscription of " + asset + ' from ' + getCurrentInUserWalletDetail().walletName
//     };
//
//     if (!checkAllObjectValuesNotEmpty(requestData)) {
//
//         showWarning(
//             getTranslation("txt_missingfields", 'Missing Fields'),
//             getTranslation("txt_requiredfieldsmissing", 'Required Field(s) is(are) missing.')
//         );
//
//         return false;
//     }
//
//     var investorWalletDetail = getCurrentInUserWalletDetail();
//     var investorBankDetail = getOneBanckWalletDetail();
//
//     requestData['metaData'] = {
//         currency: currency,
//         units: units,
//         price: price,
//         consideration: consideration,
//         ref: reference,
//         assetISIN: isin,
//         registrar: registrar,
//         feePercent: entryPercent,
//         investorID: investorID,
//         investorWalletID: document.dataCache.inUseWallet,
//         investorWalletName: investorWalletDetail.walletName,
//         investorWalletCommuPub: investorWalletDetail.commuPub,
//         investorWalletAddr: investorAddr,
//         investorWalletBankID: investorBankDetail.walletID,
//         investorWalletBankCommuPub: investorBankDetail.commuPub
//     };
//
//     requestData['metaData'] = JSON.stringify(requestData['metaData']);
//
//     requestData['contractData'] = contractData;
//
//     var processContractData = arrangementDomDataToContractData(requestData['contractData']);
//
//     if (!contractData) {
//         return;
//     }
//
//     walletCreateContract(processContractData).done(function (message) {
//         var contractExpiry = message.data.contractdata.expiry;
//         var contractAddr = message.data.toaddr;
//
//         // Store doc if there are any.
//         storeDocumentOnContractCreate(message);
//
//         saveArrangement(requestData).done(function (data) {
//             var arrangementID = data[0].arrangementID;
//             requestData['arrangementID'] = arrangementID;
//
//             showSuccessMessage("Action Executed", "<strong>Arrangement ID:</strong><br/>" +
//                 pad(arrangementID, 12));
//
//             // send notification to all parties about the new arrangement
//             sendSubscriptionInitiateMsg(requestData);
//
//             // store the contract address associate with the arrangement id.
//             dbAddArrangementContractMap(contractAddr, arrangementID, contractExpiry);
//
//             resetSubscribeTransfer();
//
//             // redirect to list of funds
//             processMenuEvent(undefined, 'menu_list_of_funds');
//         });
//     });
// }
// )
// ;
// }
