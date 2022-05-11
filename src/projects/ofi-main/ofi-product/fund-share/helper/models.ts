import {
    ContractData,
//} from '@setl/utils/services/blockchain-contract/model'; //notcompile
} from '../../../../utils/services/blockchain-contract/model'; //compile
import { IznesShareDetail } from '../../../ofi-store/ofi-product/fund-share-list/model';
import { NavStatus } from "../../../ofi-req-services/ofi-product/nav/model";

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
    reference: string;
    // The reason we need 'sb'(sell buy) in ordertype, and we want to keep the existing two order type: sub and redeem.
    // So when we got ordertype of 'sb' in the backend, we want to split the request into two orders (subscription and
    // redemption), but we also need a way to identify whether a order is sell buy order.
    // the flag isellbuy does not allow to pass in buy the frontend, the backend will append it to the request accordingly.
    issellbuy?: boolean;
    isTransfer?: boolean;
}

export interface IznShareDetailWithNav extends IznesShareDetail {
    amCompanyID: number;
    amWalletID: number;
    amAddress: string;
    entryFee: number;
    exitFee: number;
    hasShareAccess: number;
    platFormFee: number;
    fundClassificationId: number;
    investorHoling: number;
    holidayMgmtConfig: string;
    investorTotalHolding: number;
    investorTotalEncumber: number;
    investorRedemptionEncumber: number;
    buyCentralizationCalendar: string [];
    buyNAVCalendar: string [];
    buySettlementCalendar: string [];
    sellCentralizationCalendar: string [];
    sellNAVCalendar: string [];
    sellSettlementCalendar: string [];
    subscriptionFeeInFavourOfFundCalculation: number;
    redemptionFeeInFavourOfFundCalculation: number;
    subscriptionFeeInFavourOfFund: number;
    redemptionFeeInFavourOfFund: number;
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
    knownNav: boolean;
    validatedPrice: number;
    feeInFavorOfFund: number;
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
    feeInFavorOfFund: number;
    feePercentage: number;
    platFormFee: number;
    classificationFee: number;
    cutoffDate: any;
    valuationDate: any;
    settlementDate: any;
    orderNote: string;
    contractExpiryTs: number;
    contractStartTs: number;
    uniqueRef: string;
    isKnownNav: number; // 1 is known, 0 is unknown
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

export interface ShareRegistrationCertificateEmailPayload {
    orderID: number;
    orderType: number;
    fundShareName: string;
    isin: string;
    investorWalletName: string;
    subportfolioName: string;
    clientReference: string;
    amWalletID: number;
    amComPub: string;
    investorAddress: string;
    amAddress: string;
    amCompanyName: string;
    amCompanyLegalForm: string;
    amCompanyShareCapital: string;
    amCompanyAddressLine1: string;
    amCompanyAddressLine2: string;
    amCompanyZipcode: string;
    amCompanyCity: string;
    amCompanyCountry: string;
    amCompanyRcsMatriculation: string;
    amCompanyWebsiteUrl: string;
    amCompanyPhoneNumber: string;
    amCompanyID: number;
    setl_db_b64_amCompanyLogo: any;
    setl_db_b64_amCompanySignature: any;
    emailtransactnotice: any;
    emailcertificationbookentry: any;
}

export interface InvestorBalances {
    investorTotalHolding: number;
    investorTotalEncumber: number;
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

export const RoundedQuantityType = {
    Commercial: 0,
    Lower: 1,
}

export interface NavData {
    value: number;
    date: string;
    status: NavStatus;
}

export const fundClassifications = {
    1: { text: 'Equity', fee: 0.00003, dp: 3 },
    2: { text: 'Bond', fee: 0.00003, dp: 3 },
    3: { text: 'Multi-Asset', fee: 0.00003, dp: 3 },
    4: { text: 'Money Market or Cash Equivalent', fee: 0.0000, dp: 2 },
    5: { text: 'Absolute Return Innovative Strategies - ARIS', fee: 0.00003, dp: 3 },
    6: { text: 'Other', fee: 0.00003, dp: 3 },
};

