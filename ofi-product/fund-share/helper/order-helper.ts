import * as math from 'mathjs';

import {CalendarHelper} from './calendar-helper';
import {IznesShareDetail} from '../../../ofi-store/ofi-product/fund-share-list/model';
import {OrderType, OrderByType} from '../../../ofi-orders/order.model';
import * as moment from 'moment-business-days';
import * as E from '../FundShareEnum';
import * as ShareValue from '../fundShareValue';
// import {BlockchainContractService} from '../../../../utils/services/blockchain-contract/service';
import {BlockchainContractService} from '@setl/utils/services/blockchain-contract/service';
import {
    Contract,
    ContractData,
    ArrangementData,
    ArrangementActionType,
    ConditionType
// } from '../../../../utils/services/blockchain-contract/model';

} from '@setl/utils/services/blockchain-contract/model';


// todo
// need to check the user balance. when redeeming

export interface OrderRequest {
    token: string;
    shareisin: string;
    portfolioid: string;
    subportfolio: string;
    dateby: string; // (cutoff, valuation, settlement)
    datevalue: string; // (date value relate to dateby)
    ordertype: string; // ('s', 'r')
    orderby: string; // ('q', 'a' )
    ordervalue: string; // (order value relate to orderby)
    comment: string;
}

interface IznShareDetailWithNav extends IznesShareDetail {
    price: number;
    amCompanyID: number;
    amWalletID: number;
    amAddress: string;
    entryFee: number;
    exitFee: number;
    platFormFee: number;
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

type TX = 'tx';
type NewContractType = 'conew';

interface ContractRequestBody {
    messagetype: TX;
    messagebody: {
        txtype: NewContractType,
        walletid: any,
        address: String,
        contractdata: ContractData
    };
}

const OrderTypeNumber = {
    s: 3,
    r: 4
};

const OrderByNumber = {
    q: 1,
    a: 2
};

const NumberMultiplier = 100000;

const AuthoriseRef = 'Confirm receipt of payment';

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
    minInitialRedemptionInAmount: number;
    minInitialRedemptionInShare: number;
    minSubsequentRedemptionInAmount: number;
    minSubsequentRedemptionInShare: number;
    helperTimeStamp: number;


    get feePercentage() {
        return Number({
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
                [OrderByType.Amount]: convertToBlockChainNumber(this.fundShare.minInitialSubscriptionInAmount || 0),
                [OrderByType.Quantity]: convertToBlockChainNumber(this.fundShare.minInitialSubscriptionInShare || 0),
            },
            [OrderType.Redemption]: {
                [OrderByType.Amount]: convertToBlockChainNumber(this.fundShare.minInitialRedemptionInAmount || 0),
                [OrderByType.Quantity]: convertToBlockChainNumber(this.fundShare.minInitialRedemptionInShare || 0),
            }
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

    constructor(fundShare: IznShareDetailWithNav, orderRequest: OrderRequest) {
        this.calendarHelper = new CalendarHelper(fundShare);
        this.orderRequest = orderRequest;
        this.fundShare = fundShare;

        this.dateValue = moment(orderRequest.datevalue, 'DD/MM/YYYY HH:mm');
        this.orderType = OrderTypeNumber[orderRequest.ordertype];
        this.orderBy = OrderByNumber[orderRequest.orderby];
        this.orderValue = Number(orderRequest.ordervalue);
        this.nav = Number(fundShare.price);
        this.orderAsset = fundShare.isin + '|' + fundShare.fundShareName;
        this.amIssuingAddress = fundShare.amAddress;
        this.amWalletId = fundShare.amWalletID;
        this.investorAddress = orderRequest.subportfolio;
        this.investorWalletId = Number(orderRequest.portfolioid);
        this.helperTimeStamp = moment();
    }

    static getChildErrorMessage(response) {
        return {
            orderValid: false,
            errorMessage: response.errorMessage
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
     * @param namespace
     * @param instrument
     * @param amount
     * @param {string} protocol
     * @param {string} metadata
     * @return {{messagetype: string; messagebody: {txtype: string; walletid: any; reference: any; address: any; subjectaddress: any; namespace: any; instrument: any; amount: any; protocol: string | undefined; metadata: string | undefined}}}
     */
    static buildUnencumberRequestBody(walletId: number, ref: string, fromAddress: string, namespace: string, instrument: string, amount: number, protocol = '', metadata = '') {
        return {
            messagetype: 'tx',
            messagebody: {
                txtype: 'unenc',
                walletid: walletId,
                reference: ref,
                address: fromAddress,
                subjectaddress: fromAddress,
                namespace,
                instrument,
                amount,
                protocol,
                metadata
            }
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
                'topic': 'cocom',
                'walletid': walletId,
                'address': commitAddress,
                'function': 'dvp_uk_commit',
                'contractdata': contractData,
                'contractaddress': contractAddress
            }
        };
    }

    static getSubsequentMinFig(fundShareData, orderType, orderByType) {
        return ({
            [OrderType.Subscription]: {
                [OrderByType.Amount]: convertToBlockChainNumber(fundShareData.minSubsequentSubscriptionInAmount || 0),
                [OrderByType.Quantity]: convertToBlockChainNumber(fundShareData.minSubsequentSubscriptionInShare || 0),
            },
            [OrderType.Redemption]: {
                [OrderByType.Amount]: convertToBlockChainNumber(fundShareData.minSubsequentRedemptionInAmount || 0),
                [OrderByType.Quantity]: convertToBlockChainNumber(fundShareData.minSubsequentRedemptionInShare || 0),
            },
        }[orderType] || {})[orderByType] || 0;
    }

    processOrder() {

    }

    buildContractData(): VerifyResponse | ContractData {

        let arrangementData;

        if (this.orderType === OrderType.Subscription) {
            arrangementData = this.buildSubscriptionArrangementData();
        } else if (this.orderType === OrderType.Redemption) {
            arrangementData = this.buildRedemptionArrangementData();
        } else {
            return {
                orderValid: false,
                errorMessage: 'Invalid order type.'
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

        const cutoffDate = orderDates.cutoff.format('YYYY-MM-DD HH:mm');
        const valuationDate = orderDates.valuation.format('YYYY-MM-DD HH:mm');
        const settlementDate = orderDates.settlement.format('YYYY-MM-DD HH:mm');

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
            contractStartTs
        };
    }

    buildContractRequestBody(): VerifyResponse | ContractRequestBody {
        const contractData = this.buildContractData();
        if (!OrderHelper.isResponseGood(contractData as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(contractData);
        }
        return {
            messagetype: 'tx',
            messagebody: {
                txtype: 'conew',
                walletid: this.investorWalletId,
                address: this.investorAddress,
                contractdata: contractData as any
            }
        };
    }

    getOrderDates(): VerifyResponse | OrderDates {
        // the logic is for testing purpose, it will disable all the validation
        if (this.disableValidation) {
            return {
                cutoff: moment().add(1, 'minutes'),
                valuation: moment().add(2, 'minutes'),
                settlement: moment().add(3, 'minutes')
            };
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
                        errorMessage: 'Invalid date'
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
                        errorMessage: 'Invalid date'
                    };
                }

                valuation = this.calendarHelper.getCutoffTimeForSpecificDate(this.dateValue, this.orderType);
                cutoff = this.calendarHelper.getCutoffDateFromValuation(valuation, this.orderType);
                settlement = this.calendarHelper.getSettlementDateFromCutoff(cutoff, this.orderType);

                break;


            case 'settlement':
                dateValid = this.calendarHelper.isValidSettlementDateTime(this.dateValue, this.orderType);
                if (!dateValid) {
                    return {
                        orderValid: false,
                        errorMessage: 'Invalid date'
                    };
                }

                settlement = this.calendarHelper.getCutoffTimeForSpecificDate(this.dateValue, this.orderType);
                cutoff = this.calendarHelper.getCutoffDateFromSettlement(settlement, this.orderType);
                valuation = this.calendarHelper.getValuationDateFromCutoff(cutoff, this.orderType);

                break;

            default:
                return {
                    orderValid: false,
                    errorMessage: 'Invalid date'
                };
        }

        return {
            cutoff,
            valuation,
            settlement
        };
    }

    getOrderPrice(): OrderPrices {
        let price, estimatedPrice;

        price = 0;
        estimatedPrice = this.fundShare.price;

        return {
            price,
            estimatedPrice
        };
    }

    checkOrderValueValid(orderValueToCheck) {
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
            orderValid: true
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

                // calculate fee
                fee = calFee(estimatedAmount, this.feePercentage);

                // net amount
                estimatedAmountWithCost = calNetAmount(estimatedAmount, fee, this.orderRequest.ordertype);
                amountWithCost = 0;

                break;

            case OrderByType.Amount:
                /**
                 * quantity = amount / nav
                 */
                // if redemption amount will always be estimated.
                amount = this.orderType === OrderType.Subscription ? this.orderValue : 0;
                estimatedAmount = this.orderValue;

                // if redemption amount will always be estimated.
                estimatedQuantity = Number(math.format(math.chain(estimatedAmount).divide(this.nav).multiply(NumberMultiplier).done(), 14));
                quantity = this.orderType === OrderType.Subscription ? 0 : estimatedQuantity;

                // calculate fee
                fee = calFee(estimatedAmount, this.feePercentage);

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
            estimatedAmountWithCost
        };
    }

    getOrderTimeStamp(): OrderTimeStamps {
        const orderDate = this.getOrderDates() as OrderDates;
        const settleTimeStamp = Number(orderDate.settlement.valueOf() / 1000);
        const expiryTimeStamp = settleTimeStamp + ExpirySecond;
        return {
            settleTimeStamp,
            expiryTimeStamp
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
                        amount: orderFigures.quantity,
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
                [this.investorAddress, this.orderAsset, this.amIssuingAddress + this.getOrderTimeStamp().expiryTimeStamp, orderFigures.quantity, [], [[this.amIssuingAddress, 0, 0]]]
            ];

        } else if (this.orderBy === OrderByType.Amount) {
            // by amount
            actionData = [
                {
                    actionData: {
                        amount: '(' + orderFigures.amount + ' / nav' + ') * ' + NumberMultiplier,
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
                [this.investorAddress, this.orderAsset, this.amIssuingAddress + this.getOrderTimeStamp().expiryTimeStamp, '(' + orderFigures.amount + ' / nav' + ') * ' + NumberMultiplier,
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
            // on the groupama mvp, we don't need authorisation
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
            creatorAddress: this.investorAddress
        };
    }

    buildRedemptionArrangementData(): ArrangementData | VerifyResponse {
        let actionData;
        const addEncs = [];

        let orderDate = this.getOrderDates();
        let orderFigures = this.getOrderFigures();

        if (!OrderHelper.isResponseGood(orderDate as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderDate);
        } else if (!OrderHelper.isResponseGood(orderFigures as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderDate);
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
                        amount: orderFigures.quantity,
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
            actionData = [
                {
                    actionData: {
                        amount: orderFigures.quantity,
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
            // on the groupama mvp, we don't need authorisation
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
            creatorAddress: this.investorAddress
        };
    }


    checkOrderByIsAllow(orderType = this.orderRequest.orderby): VerifyResponse {
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

    getEncumberReference() {
        return this.amIssuingAddress + String(this.getOrderTimeStamp().settleTimeStamp) + String(this.orderType);
    }

    buildRedeemEncumberRequestBody() {
        let figures = this.getOrderFigures();

        if (!OrderHelper.isResponseGood(figures as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(figures);
        } else {
            figures = figures as OrderFigures;
        }

        const quantity = figures.quantity;

        const messageBody = {
            txtype: 'encum',
            walletid: this.investorWalletId,
            reference: this.getEncumberReference(),
            address: this.investorAddress,
            subjectaddress: this.investorAddress,
            namespace: this.fundShare.isin,
            instrument: this.fundShare.fundShareName,
            amount: quantity,
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
