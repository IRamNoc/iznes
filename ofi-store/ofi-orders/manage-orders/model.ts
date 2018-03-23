export interface OrderTab {
    title: {
        icon: string;
        text: string;
    };
    orderId: string;
    active: string;
    orderData: any;
}

export interface ManageOrderDetails {
    amAddress: any;
    amCompanyID: any;
    amWalletID: any;
    amountWithCost: any;
    byAmountOrQuantity: any;
    canceledBy: any;
    contractAddr: any;
    contractExpiryTs: any;
    contractStartTs: any;
    currency: any;
    cutoffDate: any;
    estimatedAmountWithCost: any;
    estimatedPrice: any;
    estimatedQuantity: any;
    feePercentage: any;
    fundShareID: any;
    fundShareName: any;
    iban: any;
    investorAddress: any;
    investorWalletID: any;
    isin: any;
    label: any;
    navEntered: any;
    orderID: any;
    orderNote: any;
    orderStatus: any;
    orderType: any;
    investorIban: any;
    orderFundShareID: any;
    platFormFee: any;
    price: any;
    quantity: any;
    settlementDate: any;
    totalResult: any;
    valuationDate: any;
}

export interface ManageOrders {
    orderList: {
        [key: string]: ManageOrderDetails
    };
    requested: boolean;
    newOrder: boolean;
    openedTabs: Array<OrderTab>;
}
