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
    amCompanyName: any;
    amWalletID: any;
    amount: any;
    amountWithCost: any;
    byAmountOrQuantity: any;
    canceledBy: any;
    contractAddr: any;
    contractExpiryTs: any;
    contractStartTs: any;
    currency: any;
    cutoffDate: any;
    estimatedAmount: any;
    estimatedAmountWithCost: any;
    estimatedPrice: any;
    latestNav: number;
    latestNavDate: any;
    initialized: any;
    estimatedQuantity: any;
    feePercentage: any;
    firstName: any;
    fundShareID: any;
    fundShareName: any;
    iban: any;
    investorAddress: any;
    investorCompanyName: any;
    investorWalletID: any;
    isin: any;
    label: any;
    lastName: any;
    navEntered: any;
    orderDate: any;
    orderID: any;
    orderNote: any;
    orderStatus: any;
    orderType: any;
    isTransfer: any;
    reference: any;
    platFormFee: any;
    price: any;
    quantity: any;
    settlementDate: any;
    totalResult: any;
    valuationDate: any;
    maximumNumDecimal: number;
    paymentMsgStatus: string;
}

export interface ManageOrders {
    orderList: { [orderId: number]: ManageOrderDetails };
    listOrder: number[];
    requested: boolean;
    openedTabs: OrderTab[];
    filters: any;
    currentPage: number;
    totalResults: number;
}
