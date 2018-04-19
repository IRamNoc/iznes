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

interface OrderRequest {
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
                [OrderByType.Amount]: convertToBlockChainNumber(this.fundShare.minInitialSubscriptionInAmount),
                [OrderByType.Quantity]: convertToBlockChainNumber(this.fundShare.minInitialSubscriptionInShare),
            },
            [OrderType.Redemption]: {
                [OrderByType.Amount]: convertToBlockChainNumber(this.fundShare.minInitialRedemptionInAmount),
                [OrderByType.Quantity]: convertToBlockChainNumber(this.fundShare.minInitialRedemptionInShare),
            }
        }[this.orderType] || {})[this.orderBy] || 0;
    }

    get subsequentMinFig() {

        return OrderHelper.getSubsequentMinFig(this.fundShare, this.orderType, this.orderBy);
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

    static getSubsequentMinFig(fundShareData, orderType, orderByType) {
        return ({
            [OrderType.Subscription]: {
                [OrderByType.Amount]: convertToBlockChainNumber(fundShareData.minSubsequentSubscriptionInAmount),
                [OrderByType.Quantity]: convertToBlockChainNumber(fundShareData.minSubsequentSubscriptionInShare),
            },
            [OrderType.Redemption]: {
                [OrderByType.Amount]: convertToBlockChainNumber(fundShareData.minSubsequentRedemptionInAmount),
                [OrderByType.Quantity]: convertToBlockChainNumber(fundShareData.minSubsequentRedemptionInShare),
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
                amount = this.orderValue;
                estimatedAmount = this.orderValue;

                quantity = Number(math.format(math.chain(estimatedAmount).divide(this.nav).multiply(NumberMultiplier).done(), 14));

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
            {
                conditionData: {
                    authoriseRef: AuthoriseRef,
                    address: this.amIssuingAddress
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
            expiry: expiryTimeStamp,
            numStep: '1',
            stepTitle: 'Subscription order for ' + this.orderAsset,
            creatorAddress: this.investorAddress
        };
    }

    buildRedemptionArrangementData(): ArrangementData | VerifyResponse {
        let actionData, addEncs;

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
                        fromAddress: this.investorAddress,
                        toAddress: this.amIssuingAddress,
                        metaData: {
                            clientTxType: 'redemption'
                        }
                    },
                    actionType: ArrangementActionType.SEND
                }
            ];

            addEncs = [
                [this.investorAddress, this.orderAsset, this.amIssuingAddress + this.getOrderTimeStamp().expiryTimeStamp, '(' + orderFigures.amount + ' / nav' + ') * ' + NumberMultiplier, [], [[this.amIssuingAddress, 0, 0]]]
            ];

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
                    address: this.amIssuingAddress
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
            expiry: expiryTimeStamp,
            numStep: '1',
            stepTitle: 'Subscription order for ' + this.orderAsset,
            creatorAddress: this.investorAddress
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
