import {
    ContractData,
} from '@setl/utils/services/blockchain-contract/model';
import { IznesShareDetail } from '../../../ofi-store/ofi-product/fund-share-list/model';

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

export interface VerifyResponse {
    orderValid: boolean;
    errorMessage?: string;
}

export interface OrderDates {
    cutoff: any;
    valuation: any;
    settlement: any;
}

export interface OrderFigures {
    quantity: number;
    estimatedQuantity: number;
    amount: number;
    estimatedAmount: number;
    amountWithCost: number;
    estimatedAmountWithCost: number;
}

export interface OrderTimeStamps {
    settleTimeStamp: number;
    expiryTimeStamp: number;
}

export interface OrderPrices {
    price: number;
    estimatedPrice: number;
}

export interface OrderRequestBody {
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
    uniqueRef: string;
}

export interface UpdateOrderResponse {
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
    uniqueRef: string;
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

export interface ContractRequestBody {
    messagetype: 'tx';
    messagebody: {
        txtype: 'conew',
        walletid: any,
        address: String,
        contractdata: ContractData,
    };
}

export const OrderTypeNumber = {
    s: 3,
    r: 4,
};
export const orderTypeToString = {
    3: 's',
    4: 'r',
};

export const OrderByNumber = {
    q: 1,
    a: 2,
};
