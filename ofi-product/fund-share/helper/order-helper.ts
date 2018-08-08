import * as math from 'mathjs';

import { CalendarHelper } from './calendar-helper';
import { IznesShareDetail } from '../../../ofi-store/ofi-product/fund-share-list/model';
import { OrderType, OrderByType } from '../../../ofi-orders/order.model';
import * as moment from 'moment-business-days';
import * as E from '../FundShareEnum';
import * as ShareValue from '../fundShareValue';
import * as _ from 'lodash';

// ** please don't remove this below commented import please,
// as i use it for building the compiled version
//import {BlockchainContractService} from '../../../../utils/services/blockchain-contract/service';
import { BlockchainContractService } from '@setl/utils/services/blockchain-contract/service';
import {
    Contract,
    ContractData,
    ArrangementData,
    ArrangementActionType,
    ConditionType

// ** please don't remove this below commented import please,
// as i use it for building the compiled version
//} from '../../../../utils/services/blockchain-contract/model';
} from '@setl/utils/services/blockchain-contract/model';

import { Base64 } from './base64';

// 30 days
const orderSettlementThreshold = 30;

// todo
// need to check the user balance. when redeeming

export interface OrderRequest {
    token: string;
    shareisin: string;
    portfolioid: string;
    subportfolio: string;
    dateby: string; // (cutoff, valuation, settlement)
    datevalue: string; // (date value relate to dateby)
    ordertype: string; // ('s', 'r', 'sb')
    orderby: string; // ('q', 'a' )
    ordervalue: string; // (order value relate to orderby)
    comment: string;
    // The reason we need 'sb'(sell buy) in ordertype, and we want to keep the existing two order type: sub and redeem.
    // So when we got ordertype of 'sb' in the backend, we want to split the request into two orders (subscription and
    // redemption), but we also need a way to identify whether a order is sell buy order.
    // the flag isellbuy does not allow to pass in buy the frontend, the backend will append it to the request accordingly.
    issellbuy?: boolean;
}

export interface IznShareDetailWithNav extends IznesShareDetail {
    price: number;
    priceDate: string;
    priceStatus: number;
    amCompanyID: number;
    amWalletID: number;
    amAddress: string;
    entryFee: number;
    exitFee: number;
    hasShareAccess: number;
    platFormFee: number;
    investorHoling: number;
    holidayMgmtConfig: string;
}

interface VerifyResponse {
    orderValid: boolean;
    errorMessage?: string;
}

interface OrderDates {
    cutoff: any;
    valuation: any;
    settlement: any;
}

interface OrderFigures {
    quantity: number;
    estimatedQuantity: number;
    amount: number;
    estimatedAmount: number;
    amountWithCost: number;
    estimatedAmountWithCost: number;
}

interface OrderTimeStamps {
    settleTimeStamp: number;
    expiryTimeStamp: number;
}

interface OrderPrices {
    price: number;
    estimatedPrice: number;
}

interface OrderRequestBody {
    investorAddress: string;
    amCompanyID: number;
    amWalletID: number;
    amAddress: string;
    orderStatus: number;
    currency: number;
    fundShareID: number;
    byAmountOrQuantity: number;
    price: number;
    estimatedPrice: number;
    quantity: number;
    estimatedQuantity: number;
    amount: number;
    estimatedAmount: number;
    amountWithCost: number;
    estimatedAmountWithCost: number;
    feePercentage: number;
    platFormFee: number;
    cutoffDate: any;
    valuationDate: any;
    settlementDate: any;
    orderNote: string;
    contractExpiryTs: number;
    contractStartTs: number;

}

interface UpdateOrderResponse {
    orderID: number;
    orderType: number;
    investorWalletID: number;
    investorAddress: string;
    amCompanyID: number;
    amWalletID: number;
    amAddress: string;
    orderStatus: number;
    currency: number;
    fundShareID: number;
    byAmountOrQuantity: number;
    price: number;
    estimatedPrice: number;
    quantity: number;
    estimatedQuantity: number;
    amount: number;
    estimatedAmount: number;
    amountWithCost: number;
    estimatedAmountWithCost: number;
    feePercentage: number;
    platFormFee: number;
    cutoffDate: string;
    valuationDate: string;
    settlementDate: string;
    orderNote: string;
    contractAddr: string;
    contractExpiryTs: number;
    contractStartTs: number;
    navEntered: string;
    canceledBy: number;
    dateEntered: string;
    fundShareName: string;
    isin: string;
    investorWalletName: string;
    amComPub: string;
    amAccountID: number;
    investorAccountID: number;
    clientReference: string;
    subportfolioName: string;
}

type TX = 'tx';
type NewContractType = 'conew';

interface ContractRequestBody {
    messagetype: TX;
    messagebody: {
        txtype: NewContractType,
        walletid: any,
        address: String,
        contractdata: ContractData,
    };
}

const OrderTypeNumber = {
    s: 3,
    r: 4,
};

const OrderByNumber = {
    q: 1,
    a: 2,
};

const NumberMultiplier = 100000;

const AuthoriseRef = 'Confirm payment sent';

const ExpirySecond = 2592000;

export class OrderHelper {
    calendarHelper: CalendarHelper;
    orderRequest: OrderRequest;
    fundShare: IznShareDetailWithNav;
    dateValue: any;
    orderType: number;
    orderBy: number;
    orderValue: number;
    nav: number;
    orderAsset: string;
    amIssuingAddress: string;
    amWalletId: number;
    investorAddress: string;
    investorWalletId: number;
    minInitialSubscriptionInAmount: number;
    minInitialSubscriptionInShare: number;
    minSubsequentSubscriptionInAmount: number;
    minSubsequentSubscriptionInShare: number;
    minSubsequentRedemptionInAmount: number;
    minSubsequentRedemptionInShare: number;

    // used for testing, when validation is turned off
    fakeCuoff: any;
    fakeValuation: any;
    fakeSettlement: any;

    get feePercentage() {
        return this.isSellBuy ?
            0 :
            Number({
            [OrderType.Subscription]: this.fundShare.entryFee || 0,
            [OrderType.Redemption]: this.fundShare.exitFee || 0,
        }[this.orderType]);
    }

    get currency() {
        return Number({
            [OrderType.Subscription]: this.fundShare.shareClassCurrency || 0,
            [OrderType.Redemption]: this.fundShare.redemptionCurrency || 0,
        }[this.orderType]);
    }

    get initialMinFig() {
        return ({
            [OrderType.Subscription]: {
                [OrderByType.Amount]: (this.fundShare.minInitialSubscriptionInAmount || 0),
                [OrderByType.Quantity]: (this.fundShare.minInitialSubscriptionInShare || 0),
            },
        }[this.orderType] || {})[this.orderBy] || 0;
    }

    get disableValidation(): Boolean {
        return Number(this.fundShare.isProduction) === 0;
    }

    get subsequentMinFig() {

        return OrderHelper.getSubsequentMinFig(this.fundShare, this.orderType, this.orderBy);
    }

    get orderAllowCategory() {
        return Number({
            [OrderType.Subscription]: this.fundShare.subscriptionCategory || 0,
            [OrderType.Redemption]: this.fundShare.redemptionCategory || 0,
        }[this.orderType]);
    }

    get isSellBuy(): boolean {
        // if the share is not allow to play a sell buy order, we don't bother to check.
        if (!this.isAllowSellBuy) {
           return false;
        }
       return this.orderRequest.ordertype === 'sb' || this.orderRequest.issellbuy;
    }

    get isAllowSellBuy(): boolean {
        const isAllowSellBuy = this.fundShare.allowSellBuy;
        return Number(isAllowSellBuy) === 1;
    }

    constructor(fundShare: IznShareDetailWithNav, orderRequest: OrderRequest) {
        this.calendarHelper = new CalendarHelper(fundShare);
        this.orderRequest = orderRequest;
        this.fundShare = fundShare;

        this.dateValue = moment(orderRequest.datevalue, 'YYYY-MM-DD HH:mm');
        this.orderType = OrderTypeNumber[orderRequest.ordertype];
        this.orderBy = OrderByNumber[orderRequest.orderby];
        this.orderValue = Number(orderRequest.ordervalue);
        this.nav = Number(fundShare.price);
        this.orderAsset = fundShare.isin + '|' + fundShare.fundShareName;
        this.amIssuingAddress = fundShare.amAddress;
        this.amWalletId = fundShare.amWalletID;
        this.investorAddress = orderRequest.subportfolio;
        this.investorWalletId = Number(orderRequest.portfolioid);

        // used for testing when validation is turned off
        // this.fakeCuoff = moment().add(10, 'seconds');
        // this.fakeValuation = moment().add(15, 'seconds');
        // this.fakeSettlement = moment().add(20, 'seconds');

        this.fakeCuoff = moment().add(5, 'minutes');
        this.fakeValuation = this.fakeCuoff.clone().utc().set({ hour: 0, minute: 0, second: 1 });
        this.fakeSettlement = moment().add(15, 'minutes');

    }

    static getChildErrorMessage(response) {
        return {
            orderValid: false,
            errorMessage: response.errorMessage,
        };
    }

    static isResponseGood(response: VerifyResponse): boolean {
        return !('orderValid' in response) || response.orderValid;
    }

    /**
     *
     * @param walletId
     * @param ref
     * @param fromAddress: benificiary/administrator address
     * @param toAddress: asset owner address
     * @param namespace
     * @param instrument
     * @param amount
     * @param {string} protocol
     * @param {string} metadata
     * @return {{messagetype: string; messagebody: {txtype: string; walletid: any; reference: any; address: any; subjectaddress: any; namespace: any; instrument: any; amount: any; protocol: string | undefined; metadata: string | undefined}}}
     */
    static buildUnencumberRequestBody(walletId: number, ref: string, fromAddress: string, toAddress: string, namespace: string, instrument: string, amount: number, protocol = '', metadata = '') {
        return {
            messagetype: 'tx',
            messagebody: {
                txtype: 'unenc',
                walletid: walletId,
                reference: ref,
                address: fromAddress,
                subjectaddress: toAddress,
                namespace,
                instrument,
                amount,
                protocol,
                metadata,
            },
        };
    }

    /**
     * build cancel contract request body
     * @param fundShareData
     * @param orderType
     * @param orderByType
     * @return {any | number}
     */

    static buildCancelContract(walletId: number, contractAddress: string, commitAddress: string) {
        const contractData = BlockchainContractService.buildCancelContractMessageBody(contractAddress, commitAddress).contractdata;

        return {
            messageType: 'tx',
            messageBody: {
                topic: 'cocom',
                walletid: walletId,
                address: commitAddress,
                function: 'dvp_uk_commit',
                contractdata: contractData,
                contractaddress: contractAddress,
            },
        };
    }

    static getSubsequentMinFig(fundShareData, orderType, orderByType) {
        return ({
            [OrderType.Subscription]: {
                [OrderByType.Amount]: (fundShareData.minSubsequentSubscriptionInAmount || 0),
                [OrderByType.Quantity]: (fundShareData.minSubsequentSubscriptionInShare || 0),
            },
            [OrderType.Redemption]: {
                [OrderByType.Amount]: (fundShareData.minSubsequentRedemptionInAmount || 0),
                [OrderByType.Quantity]: (fundShareData.minSubsequentRedemptionInShare || 0),
            },
        }[orderType] || {})[orderByType] || 0;
    }

    static buildOrderReleaseShareRequestBody(order: UpdateOrderResponse) {
        const walletId = order.amWalletID;
        const ref = order.amAddress + String(order.contractStartTs) + String(OrderType.Subscription);
        const fromAddress = order.amAddress;
        const toAddress = order.investorAddress;
        const namespace = order.isin;
        const instrument = order.fundShareName;
        const amount = order.quantity;

        return OrderHelper.buildUnencumberRequestBody(
            walletId,
            ref,
            fromAddress,
            toAddress,
            namespace,
            instrument,
            amount,
        );
    }

    static buildOrderSendSharePdfRequestBody(order: UpdateOrderResponse, holding: number) {
        const decimalPlaces = 5;
        const orderReference = pad(order.orderID, 11, '0');
        const orderType = Number(order.orderType);
        let subject;

        if (orderType === OrderType.Subscription) {
            subject = 'Certification of Book Entry - SUBSCRIPTION ' + orderReference;
        } else {
            subject = 'Certification of Book Entry - REDEMPTION ' + orderReference;
        }

        const generalBody = subject;

        const todayStr = moment().utc().format('YYYY-MM-DD');

        const actionJson = {
            type: 'sendPdf',
            data: {
                pdfType: 'share',
                pdfMetadata: {
                    fundName: order.fundShareName,
                    isinCode: order.isin,
                    fundsForm: 'Fonds commun de placement',
                    nationality: 'Français',
                    clientName: order.investorWalletName, // Customer Wallet Name
                    subportfolioName: order.subportfolioName,
                    listDate: todayStr,
                    reference: orderReference,
                    clientReference: order.clientReference,
                    date: todayStr,
                    numberOfShares: toNormalScale(Number(holding), 5)
                },
            },
        };

        const hasAction = true;

        return OrderHelper.buildSendMessage(
            subject, generalBody, actionJson, order.amWalletID,
            order.amComPub, [order.investorAddress, order.amAddress], hasAction,
        );
    }

    static buildSendMessage(subject: string, mailGeneralContent: string, mailActionJson: any, senderWalletId: number,
                            senderPub: string, recipientWalletAddresses: Array<string>, hasAction: boolean) {

        const mailBody = JSON.stringify({
            general: Base64.encode(mailGeneralContent),
            action: mailActionJson,
        });

        const recipients = OrderHelper.buildAddressRecipients(recipientWalletAddresses);

        return {
            mailSubject: Base64.encode(subject),
            mailBody,
            senderId: senderWalletId,
            senderPub,
            recipients,
            parentId: 0,
            arrangementId: 0,
            arrangementStatus: 0,
            attachment: 0,
            hasAction,
            isDraft: 0,
        };
    }

    static buildAddressRecipients(addresses: Array<string>): { [address: string]: 0 } {
        return addresses.reduce((result, item, index) => {
            result[item] = 0;
            return result;
        }, {});
    }

    static getAddressFreeBalanceFromHolderResponse(response: any, address: string): number {
        const encumbrances = _.get(response, ['data', 'encumbrances'], {});
        const holders = _.get(response, ['data', 'holders'], {});

        const totalHolding: number = _.get(holders, [address], 0);
        const encumbered: number = _.get(encumbrances, [address], 0);

        return totalHolding - encumbered;
    }

    static buildRequestInvestorHoldingRequestBody(order: UpdateOrderResponse | IznShareDetailWithNav) {
        const walletId = order.amWalletID;
        const namespace = order.isin;
        const instrument = order.fundShareName;

        return {
            messagetype: 'request',
            messagebody: {
                topic: 'holders',
                walletid: walletId,
                namespace,
                instrument,
            },
        };
    }

    /**
     * Build redemption's authorisation commit request body
     *
     * @param {UpdateOrderResponse} order
     * @return {{messagetype: string; messagebody: {txtype: string; walletid: number; address: string; function: string; contractdata: {contractfunction: string; issuingaddress: string; contractaddress: string; party: any[]; commitment: any[]; receive: any[]; authorise: string[][]}; contractaddress: string}}}
     */
    static buildRedeemAuthorisationCommitReqeustBody(order: UpdateOrderResponse) {
        const contractData = {
            contractfunction: 'dvp_uk_commit',
            issuingaddress: order.amAddress,
            contractaddress: order.contractAddr,
            party: [],
            commitment: [],
            receive: [],
            authorise: [
                [order.amAddress, AuthoriseRef, '', ''],
            ],
        };

        const messageBody = {
            txtype: 'cocom',
            walletid: order.amWalletID,
            address: order.amAddress,
            function: 'dvp_uk_commit',
            contractdata: contractData,
            contractaddress: order.contractAddr,
        };

        return {
            messagetype: 'tx',
            messagebody: messageBody,
        };
    }


    buildContractData(): VerifyResponse | ContractData {

        let arrangementData;

        // check if nav for the share is exist
        const navCheck = this.checkShareNavIsValid();
        if (!OrderHelper.isResponseGood(navCheck)) {
            return OrderHelper.getChildErrorMessage(navCheck);
        }

        // check if fund access for the share is exist
        const shareAccessCheck = this.checkHasShareAccess();
        if (!OrderHelper.isResponseGood(shareAccessCheck)) {
            return OrderHelper.getChildErrorMessage(shareAccessCheck);
        }

        if (this.orderType === OrderType.Subscription) {
            arrangementData = this.buildSubscriptionArrangementData();
        } else if (this.orderType === OrderType.Redemption) {
            arrangementData = this.buildRedemptionArrangementData();
        } else {
            return {
                orderValid: false,
                errorMessage: 'Invalid order type.',
            };
        }

        if (!OrderHelper.isResponseGood(arrangementData)) {
            return OrderHelper.getChildErrorMessage(arrangementData);
        }
        let contractData = BlockchainContractService.arrangementToContractData(arrangementData as ArrangementData);
        if (!OrderHelper.isResponseGood(arrangementData)) {
            return OrderHelper.getChildErrorMessage(contractData);
        } else {
            contractData = contractData as Contract;
        }

        return contractData.contractData;
    }

    buildOrderRequestBody(): VerifyResponse | OrderRequestBody {
        const investorAddress = this.investorAddress;
        const amCompanyID = this.fundShare.amCompanyID;
        const amWalletID = this.fundShare.amWalletID;
        const amAddress = this.amIssuingAddress;
        const orderStatus = 1;
        const currency = this.currency;
        const fundShareID = this.fundShare.fundShareID;
        const byAmountOrQuantity = this.orderBy;
        const price = 0;
        const estimatedPrice = this.nav;
        let orderFigure = this.getOrderFigures();

        if (!OrderHelper.isResponseGood(orderFigure as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderFigure);
        } else {
            orderFigure = orderFigure as OrderFigures;
        }

        const quantity = orderFigure.quantity;
        const estimatedQuantity = orderFigure.estimatedQuantity;
        const amount = orderFigure.amount;
        const estimatedAmount = orderFigure.estimatedAmount;
        const amountWithCost = orderFigure.amountWithCost;
        const estimatedAmountWithCost = orderFigure.estimatedAmountWithCost;
        const feePercentage = this.feePercentage;
        const platFormFee = this.fundShare.platFormFee || 0;

        let orderDates = this.getOrderDates();
        if (!OrderHelper.isResponseGood(orderDates as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderDates);
        } else {
            orderDates = orderDates as OrderDates;
        }

        const cutoffDate = orderDates.cutoff.utc().format('YYYY-MM-DD HH:mm');
        const valuationDate = orderDates.valuation.utc().format('YYYY-MM-DD HH:mm');
        const settlementDate = orderDates.settlement.utc().format('YYYY-MM-DD HH:mm');

        const orderNote = this.orderRequest.comment;

        const orderTimeStamps = this.getOrderTimeStamp();

        const contractExpiryTs = orderTimeStamps.expiryTimeStamp;
        const contractStartTs = orderTimeStamps.settleTimeStamp;

        return {
            investorAddress,
            amCompanyID,
            amWalletID,
            amAddress,
            orderStatus,
            currency,
            fundShareID,
            byAmountOrQuantity,
            price,
            estimatedPrice,
            quantity,
            estimatedQuantity,
            amount,
            estimatedAmount,
            amountWithCost,
            estimatedAmountWithCost,
            feePercentage,
            platFormFee,
            cutoffDate,
            valuationDate,
            settlementDate,
            orderNote,
            contractExpiryTs,
            contractStartTs,
        };
    }

    buildContractRequestBody(): VerifyResponse | ContractRequestBody {
        const contractData = this.buildContractData();
        if (!OrderHelper.isResponseGood(contractData as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(contractData);
        }
        const walletid = this.amWalletId;
        const address = this.amIssuingAddress;
        return {
            messagetype: 'tx',
            messagebody: {
                txtype: 'conew',
                walletid,
                address,
                contractdata: contractData as any,
            },
        };
    }

    getFakeDatesString() {
        try {
            const [fakeCutoffStr, fakeValuationStr, fakeSettelmentStr] = this.orderRequest.datevalue.split(';');

            const validFakeCutoffStr = moment.utc(fakeCutoffStr, 'YYYY-MM-DD HH:mm')._isValid;
            const validFakeValuationStr = moment.utc(fakeValuationStr, 'YYYY-MM-DD HH:mm')._isValid;
            const validFakeSettelmentStr = moment.utc(fakeSettelmentStr, 'YYYY-MM-DD HH:mm')._isValid;

            if (validFakeCutoffStr && validFakeValuationStr && validFakeSettelmentStr) {
                return {
                    cutoff: moment.utc(fakeCutoffStr, 'YYYY-MM-DD HH:mm'),
                    valuation: moment.utc(fakeValuationStr, 'YYYY-MM-DD').set({ hour: 0, minute: 0, second: 1 }),
                    settlement: moment.utc(fakeSettelmentStr, 'YYYY-MM-DD HH:mm'),
                };
            }
            return {
                cutoff: this.fakeCuoff,
                valuation: this.fakeValuation,
                settlement: this.fakeSettlement,
            };

        } catch (e) {
            return {
                cutoff: this.fakeCuoff,
                valuation: this.fakeValuation,
                settlement: this.fakeSettlement,
            };
        }
    }

    getOrderDates(): VerifyResponse | OrderDates {
        // the logic is for testing purpose, it will disable all the validation
        if (this.disableValidation) {
            return this.getFakeDatesString();
        }

        // depend on order by cutoff, valuation, and settlement date.
        let dateValid = false;
        let cutoff, valuation, settlement;

        switch (this.orderRequest.dateby) {
        case 'cutoff':
            dateValid = this.calendarHelper.isValidCutoffDateTime(this.dateValue, this.orderType);
            if (!dateValid) {
                return {
                    orderValid: false,
                    errorMessage: 'Invalid date',
                };
            }

            cutoff = this.calendarHelper.getCutoffTimeForSpecificDate(this.dateValue, this.orderType);
            valuation = this.calendarHelper.getValuationDateFromCutoff(cutoff, this.orderType);
            settlement = this.calendarHelper.getSettlementDateFromCutoff(cutoff, this.orderType);

            break;

        case 'valuation':
            dateValid = this.calendarHelper.isValidValuationDateTime(this.dateValue, this.orderType);
            if (!dateValid) {
                return {
                    orderValid: false,
                    errorMessage: 'Invalid date',
                };
            }

            cutoff = this.calendarHelper.getCutoffDateFromValuation(this.dateValue, this.orderType);
            cutoff = this.calendarHelper.getCutoffTimeForSpecificDate(cutoff, this.orderType);
            valuation = this.calendarHelper.getValuationDateFromCutoff(cutoff, this.orderType);
            settlement = this.calendarHelper.getSettlementDateFromCutoff(cutoff, this.orderType);

            break;


        case 'settlement':
            dateValid = this.calendarHelper.isValidSettlementDateTime(this.dateValue, this.orderType);
            if (!dateValid) {
                return {
                    orderValid: false,
                    errorMessage: 'Invalid date',
                };
            }

            cutoff = this.calendarHelper.getCutoffDateFromSettlement(this.dateValue, this.orderType);
            cutoff = this.calendarHelper.getCutoffTimeForSpecificDate(cutoff, this.orderType);
            valuation = this.calendarHelper.getValuationDateFromCutoff(cutoff, this.orderType);
            settlement = this.calendarHelper.getSettlementDateFromCutoff(cutoff, this.orderType);

            break;

        default:
            return {
                orderValid: false,
                errorMessage: 'Invalid date',
            };
        }

        if (settlement.diff(moment(), 'days') > orderSettlementThreshold) {
            return {
                orderValid: false,
                errorMessage: 'Settlement date has to be within a month',
            };
        }

        return {
            cutoff,
            valuation,
            settlement,
        };
    }

    getOrderPrice(): OrderPrices {
        let price, estimatedPrice;

        price = 0;
        estimatedPrice = this.fundShare.price;

        return {
            price,
            estimatedPrice,
        };
    }

    checkOrderValueValid(orderValueToCheck) {
        // we the order type is sell buy, we don't bother to check it.
        if (this.isSellBuy) {
            return {
                orderValid: true,
            };
        }

        // Check order value (quantity / amount) is meet requirements:
        // - [] greater than initial min order value ;
        // - [x] greater than subsequent min order value ;
        if (orderValueToCheck < this.subsequentMinFig) {
            return {
                orderValid: false,
                errorMessage: 'Order value does not meet subsequent minimum'
            };
        }

        return {
            orderValid: true,
        };
    }

    getOrderFigures(): VerifyResponse | OrderFigures {
        let quantity, estimatedQuantity, amount, estimatedAmount, amountWithCost, estimatedAmountWithCost, fee;

        const checkOrderValue = this.checkOrderValueValid(this.orderValue);
        if (!OrderHelper.isResponseGood(checkOrderValue)) {
            return OrderHelper.getChildErrorMessage(checkOrderValue);
        }

        const checkAllowOrderType = this.checkOrderByIsAllow();

        if (!OrderHelper.isResponseGood(checkAllowOrderType)) {
            return OrderHelper.getChildErrorMessage(checkAllowOrderType);
        }

        switch (this.orderBy) {
        case OrderByType.Quantity:
            quantity = this.orderValue;
            estimatedQuantity = this.orderValue;

            /**
             * amount = unit * nav
             */
            amount = 0;
            estimatedAmount = Number(math.format(math.chain(quantity).multiply(this.nav).divide(NumberMultiplier).done(), 14));

            // change to 2 decimal place
            estimatedAmount = this.getAmountTwoDecimal(estimatedAmount);

            // calculate fee
            fee = calFee(estimatedAmount, this.feePercentage);

            // net amount change to 2 decimal place
            fee = this.getAmountTwoDecimal(fee);

            // net amount
            estimatedAmountWithCost = calNetAmount(estimatedAmount, fee, this.orderRequest.ordertype);

            amountWithCost = 0;

            break;

        case OrderByType.Amount:
            /**
             * quantity = amount / nav
             */

            // if redemption amount will always be estimated.
            estimatedQuantity = Number(math.format(math.chain(this.orderValue).divide(this.nav).multiply(NumberMultiplier).done(), 14));

            // make sure the quantity meet the share maximumNumberDecimal
            // 1. convert back to normal number scale
            // 2. meeting the maximumNumberDecimal, and always round down.
            // 3. convert back to blockchain number scale
            estimatedQuantity = roundDown(estimatedQuantity, this.fundShare.maximumNumDecimal);

            quantity = 0;

            // if we are using known nav, we use the quantity to work out the new amount
            // if we are using unknow nav, we put the specified amount back.
            if (this.isKnownNav()) {
                estimatedAmount = Number(math.format(math.chain(estimatedQuantity).multiply(this.nav).divide(NumberMultiplier).done(), 14));

                // change to 2 decimal place
                estimatedAmount = this.getAmountTwoDecimal(estimatedAmount);

                amount = estimatedAmount;
            }else {
                estimatedAmount = this.orderValue;
                amount = this.orderValue;
            }

            // calculate fee
            fee = calFee(estimatedAmount, this.feePercentage);

            // change to 2 decimal place
            fee = this.getAmountTwoDecimal(fee);

            // net amount
            estimatedAmountWithCost = calNetAmount(estimatedAmount, fee, this.orderRequest.ordertype);

            amountWithCost = calNetAmount(estimatedAmount, fee, this.orderRequest.ordertype);

            break;

        default:
            return {
                orderValid: false,
                errorMessage: 'Invalid orderBy type'
            };
        }

        return {
            quantity,
            estimatedQuantity,
            amount,
            estimatedAmount,
            amountWithCost,
            estimatedAmountWithCost,
        };
    }


    /**
     * Get Amount to Two Decimal Places and converts to blockchain number
     *
     * @param amount
     * @returns {number}
     */
    getAmountTwoDecimal(amount) {
        amount = Math.round((amount / NumberMultiplier) * 100) / 100;
        return (amount * NumberMultiplier);
    }

    getOrderTimeStamp(): OrderTimeStamps {
        const orderDate = this.getOrderDates() as OrderDates;
        const settleTimeStamp = Number(Math.floor(orderDate.settlement.valueOf() / 1000));
        const expiryTimeStamp = settleTimeStamp + ExpirySecond;
        return {
            settleTimeStamp,
            expiryTimeStamp,
        };
    }

    checkShareNavIsValid(): VerifyResponse {

        let orderValid = true;
        let errorMessage = '';

        if (Number(this.fundShare.price) <= 0) {
            orderValid = false;
            errorMessage = 'Nav less than or equal 0';
        }

        return {
            orderValid,
            errorMessage,
        };
    }

    checkHasShareAccess(): VerifyResponse {
        let orderValid = true;
        let errorMessage = '';

        if (Number(this.fundShare.hasShareAccess) !== 1) {
            orderValid = false;
            errorMessage = 'Fund access is not exist';
        }

        return {
            orderValid,
            errorMessage,
        };

    }

    checkRedemptionOrderValue(orderFigures: OrderFigures): VerifyResponse {
        let orderValid = true;
        let errorMessage = '';

        if (Number(this.fundShare.investorHoling) < orderFigures.quantity) {
            orderValid = false;
            errorMessage = 'Insufficient number of share to redeem.';
        }

        return {
            orderValid,
            errorMessage,
        };

    }

    buildSubscriptionArrangementData(): ArrangementData | VerifyResponse {
        let actionData, addEncs;
        // [investorAddress, issueAsset, '', cpToEncToBank, [[bankAddress, 0, 0], [item.address, 0, 0]], []]

        let orderDate = this.getOrderDates();
        let orderFigures = this.getOrderFigures();

        if (!OrderHelper.isResponseGood(orderDate as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderDate);
        } else if (!OrderHelper.isResponseGood(orderFigures as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderFigures);
        } else {
            orderDate = orderDate as OrderDates;
            orderFigures = orderFigures as OrderFigures;
        }

        const settleTimeStamp = Number(orderDate.settlement.valueOf() / 1000);
        const expiryTimeStamp = settleTimeStamp + ExpirySecond;

        // byType: Subscribe by quantity or by amount.
        if (this.orderBy === OrderByType.Quantity) {
            // by quantity

            actionData = [
                {
                    actionData: {
                        amount: `${orderFigures.quantity} + nav * 0`,
                        amountType: 'amount',
                        asset: this.orderAsset,
                        dataItem: [],
                        fromAddress: this.amIssuingAddress,
                        toAddress: this.investorAddress,
                        metaData: {
                            clientTxType: 'subscription'
                        }
                    },
                    actionType: ArrangementActionType.ISSUE
                }
            ];

            addEncs = [
                [this.investorAddress, this.orderAsset, this.getEncumberReference(), orderFigures.quantity, [], [[this.amIssuingAddress, 0, 0]]]
            ];

        } else if (this.orderBy === OrderByType.Amount) {
            // by amount
            const decimalDivider = Math.pow(10, Number(this.fundShare.maximumNumDecimal));
            // the formula before apply maximum number decimal.
            let amountStr = '(' + orderFigures.amount + ' / nav' + ') * ' + NumberMultiplier;
            // apply maximum number decimal.
            amountStr = 'floor((' + amountStr + '/' + NumberMultiplier + ' * ' + decimalDivider + ')) / ' + decimalDivider + ' * ' + NumberMultiplier;

            actionData = [
                {
                    actionData: {
                        amount: amountStr,
                        amountType: 'amount',
                        asset: this.orderAsset,
                        dataItem: [],
                        fromAddress: this.amIssuingAddress,
                        toAddress: this.investorAddress,
                        metaData: {
                            clientTxType: 'subscription'
                        }
                    },
                    actionType: ArrangementActionType.ISSUE
                }
            ];

            addEncs = [
                [this.investorAddress, this.orderAsset, this.getEncumberReference(), amountStr,
                    [], [[this.amIssuingAddress, 0, 0]]]];


        } else {
            return {
                orderValid: false,
                errorMessage: 'Invalid action-by type.'
            };
        }

        const conditions = [
            {
                conditionData: {
                    executeTimeStamp: settleTimeStamp
                },
                conditionType: ConditionType.TIME
            },
            // {
            //     conditionData: {
            //         authoriseRef: AuthoriseRef,
            //         address: this.amIssuingAddress
            //     },
            //     conditionType: ConditionType.AUTHORISE
            // }
        ];

        return {
            actions: actionData,
            conditions,
            datas: [
                {
                    'parameter': 'nav',
                    'address': this.amIssuingAddress
                }
            ],
            addEncs,
            useEncum: [true, this.getEncumberReference()],
            expiry: expiryTimeStamp,
            numStep: '1',
            stepTitle: 'Subscription order for ' + this.orderAsset,
            mustSigns: { [this.investorAddress]: false, [this.amIssuingAddress]: true },
            creatorAddress: 'not being used'  // not being used
        };
    }

    buildRedemptionArrangementData(): ArrangementData | VerifyResponse {
        let actionData;
        const addEncs = [];

        let orderDate = this.getOrderDates();
        let orderFigures = this.getOrderFigures();

        if (!OrderHelper.isResponseGood(orderDate as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderDate);
        }
        if (!OrderHelper.isResponseGood(orderFigures as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderDate);
        }

        orderDate = orderDate as OrderDates;
        orderFigures = orderFigures as OrderFigures;

        const figureCheck = this.checkRedemptionOrderValue(orderFigures);
        if (!OrderHelper.isResponseGood(figureCheck)) {
            return OrderHelper.getChildErrorMessage(figureCheck);
        }

        const settleTimeStamp = Number(orderDate.settlement.valueOf() / 1000);
        const expiryTimeStamp = settleTimeStamp + ExpirySecond;

        // byType: Subscribe by quantity or by amount.
        if (this.orderBy === OrderByType.Quantity) {
            // by quantity

            actionData = [
                {
                    actionData: {
                        amount: `${orderFigures.quantity} + nav * 0`,
                        amountType: 'amount',
                        asset: this.orderAsset,
                        dataItem: [],
                        fromAddress: this.investorAddress,
                        toAddress: this.amIssuingAddress,
                        metaData: {
                            clientTxType: 'redemption'
                        }
                    },
                    actionType: ArrangementActionType.SEND
                }
            ];

            // addEncs = [
            //     [this.investorAddress, this.orderAsset, this.amIssuingAddress + this.getOrderTimeStamp().expiryTimeStamp, orderFigures.quantity, [], [[this.amIssuingAddress, 0, 0]]]
            // ];

        } else if (this.orderBy === OrderByType.Amount) {
            // by amount
            const decimalDivider = Math.pow(10, Number(this.fundShare.maximumNumDecimal)) ;
            // the formula before apply maximum number decimal.
            let amountStr = '(' + orderFigures.amount + ' / nav' + ') * ' + NumberMultiplier;
            // apply maximum number decimal.
            amountStr = 'floor(' + amountStr + '/' + NumberMultiplier + ' * ' + decimalDivider + ') / ' + decimalDivider + ' * ' + NumberMultiplier;

            actionData = [
                {
                    actionData: {
                        amount: amountStr,
                        amountType: 'amount',
                        asset: this.orderAsset,
                        dataItem: [],
                        fromAddress: this.investorAddress,
                        toAddress: this.amIssuingAddress,
                        metaData: {
                            clientTxType: 'redemption'
                        }
                    },
                    actionType: ArrangementActionType.SEND
                }
            ];

            // addEncs = [
            //     [this.investorAddress, this.orderAsset, this.amIssuingAddress + this.getOrderTimeStamp().expiryTimeStamp, '(' + orderFigures.amount + ' / nav' + ') * ' + NumberMultiplier, [], [[this.amIssuingAddress, 0, 0]]]
            // ];

        } else {
            return {
                orderValid: false,
                errorMessage: 'Invalid action-by type.'
            };
        }

        const conditions = [
            {
                conditionData: {
                    executeTimeStamp: settleTimeStamp
                },
                conditionType: ConditionType.TIME
            },
            {
                conditionData: {
                    authoriseRef: AuthoriseRef,
                    address: this.amIssuingAddress,
                },
                conditionType: ConditionType.AUTHORISE
            }
        ];

        return {
            actions: actionData,
            conditions,
            datas: [
                {
                    'parameter': 'nav',
                    'address': this.amIssuingAddress
                }
            ],
            addEncs,
            useEncum: [true, this.getEncumberReference()],
            expiry: expiryTimeStamp,
            numStep: '1',
            stepTitle: 'Redemption order for ' + this.orderAsset,
            mustSigns: { [this.investorAddress]: false, [this.amIssuingAddress]: true },
            creatorAddress: 'not being used' // not being used
        };
    }


    checkOrderByIsAllow(orderType = this.orderRequest.orderby): VerifyResponse {

        // if the order type is sell buy, we don't care about the 'allow by amount' and 'allow by quantity' in the characteristics.
        if (this.isSellBuy) {
            // if order type of sell buy is allow in the share.
           if (this.isAllowSellBuy) {
               return {
                   orderValid: true,
               };
           }

           // if not allow sell buy, we reject it.
            return {
                orderValid: false,
                errorMessage: 'Sell buy is not allow for the share.',
            };
        }

        const tryingToOrderBy = OrderByNumber[orderType] - 1;
        // check if order type is allow
        const typesAllow = this.orderAllowCategory;

        if (typesAllow === 2) {
            return {
                orderValid: true
            };
        }

        if (typesAllow !== tryingToOrderBy) {
            return {
                orderValid: false,
                errorMessage: 'Not allow to order by this type'
            };
        } else {
            return {
                orderValid: true
            };
        }
    }

    /**
     * Get encumber reference
     * @return {string}
     */
    getEncumberReference() {
        return this.amIssuingAddress + String(this.getOrderTimeStamp().settleTimeStamp) + String(this.orderType);
    }

    /**
     * Get poa reference
     * @return {string}
     */
    getPoaReference() {
        return 'poa-' + this.amIssuingAddress + String(this.getOrderTimeStamp().settleTimeStamp) + String(this.orderType);
    }

    /**
     * Create Encumber request body for redemption order
     *
     * @return {any}
     */
    buildRedeemEncumberRequestBody() {
        let figures = this.getOrderFigures();

        if (!OrderHelper.isResponseGood(figures as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(figures);
        } else {
            figures = figures as OrderFigures;
        }

        const quantity = figures.estimatedQuantity;

        const messageBody = {
            txtype: 'encum',
            walletid: this.investorWalletId,
            reference: this.getEncumberReference(),
            address: this.investorAddress,
            subjectaddress: this.investorAddress,
            namespace: this.fundShare.isin,
            instrument: this.fundShare.fundShareName,
            amount: quantity,
            iscumulative: true,
            beneficiaries: [[this.amIssuingAddress, 0, 0]],
            administrators: [[this.amIssuingAddress, 0, 0]],
            protocol: '',
            metadata: ''
        };

        return {
            messagetype: 'tx',
            messagebody: messageBody
        };
    }

    /***
     * Create redemption order's poa transaction. Give am's permission to refresh the encumber amount for investor
     *
     * @return {any}
     */
    buildRedeemEncumberPoaRequestBody() {
        let figures = this.getOrderFigures();

        if (!OrderHelper.isResponseGood(figures as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(figures);
        } else {
            figures = figures as OrderFigures;
        }

        const quantity = figures.estimatedQuantity;

        const messageBody = {
            txtype: 'poaad',
            walletid: this.investorWalletId,
            address: this.investorAddress,
            attorneyaddress: this.amIssuingAddress,
            permissions: [
                {
                    txtype: 'encum',
                    amount: quantity * 10,
                    assets: [
                        `${this.fundShare.isin}|${this.fundShare.fundShareName}`
                    ]
                }
            ],
            poareference: this.getPoaReference(),
            enddate: this.getOrderTimeStamp().expiryTimeStamp
        };

        return {
            messagetype: 'tx',
            messagebody: messageBody
        };
    }

    /**
     * Check the order we placing is known nav.
     * To be qualify as known nav:
     * - latest nav is same nav date of the order
     * - The nav is status is validated.
     */
    isKnownNav(): boolean {
        // get the current chosen nav date
        const orderNavDate = (this.getOrderDates() as OrderDates).valuation.format('YYYY-MM-DD');

        // get the latest nav's date
        const latestNavDate = moment(this.fundShare.priceDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');

        // get the latest nav's status
        const latestNavStatus = this.fundShare.priceStatus;

        // check if latest nav's status is  validated
        // check if latest nav's date is same as the order's
        if (Number(latestNavStatus) !== -1) {
            return false;
        }

        if (orderNavDate !== latestNavDate) {
            return false;
        }

        return true;
    }
}

/**
 * Calculate order fee.
 *
 * @param amount
 * @param feePercent
 * @return {number}
 */
export function calFee(amount: number | string, feePercent: number | string): number {
    amount = Number(amount);
    feePercent = Number(feePercent) / NumberMultiplier;
    return Number(math.format(math.chain(amount).multiply(feePercent).done(), 14));
}

export function convertToBlockChainNumber(num) {
    return Number(math.format(math.chain(num).multiply(NumberMultiplier).done(), 14));
}

/**
 * Calculate order net amount.
 *
 * @param {number | string} amount
 * @param {number | string} fee
 * @param {string} orderType
 * @return {number}
 */
export function calNetAmount(amount: number | string, fee: number | string, orderType: string): number {
    amount = Number(amount);
    fee = Number(fee);
    return {
        s: Number(math.format(math.chain(amount).add(fee).done(), 14)),
        r: Number(math.format(math.chain(amount).subtract(fee).done(), 14))
    }[orderType];
}

/**
 *  padding number from left.
 *
 * @param num
 * @param width
 * @param fill
 * @return {string}
 */
export function pad(num: number, width: number, fill: string): string {
    const numberStr = num.toString();
    const len = numberStr.length;
    return len >= width ? numberStr : new Array(width - len + 1).join(fill) + numberStr;
}

export function toNormalScale(num: number, numDecimal: number): number {
    return math.format(math.chain(num).divide(NumberMultiplier).done(), { notation: 'fixed', precision: numDecimal });
}

/**
 * Round Down Numbers
 * eg 0.15151 becomes 0.151
 * eg 0.15250 becomes 0.152
 *
 * @param number
 * @param decimals
 * @returns {number}
 */
export function roundDown(number: any, decimals: any = 0) {
    // convert to normal number scale.
    const normalNum = math.format(math.chain(number).divide(NumberMultiplier).done(), 14);
    const roundedNum = (Math.floor(normalNum * Math.pow(10, decimals)) / Math.pow(10, decimals));

    // convert back to blockchainScale
    return math.format(math.chain(roundedNum).multiply(NumberMultiplier).done(), 14);
}
