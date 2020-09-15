export interface TransferTab {
    title: {
        icon: string;
        text: string;
    };
    referenceId: string;
    active: string;
    orderData: any;
}

export interface ManageTransferDetails {
    accountKeeperID: any;
    accountLabel: any;
    assetManagementCompanyName: any;
    comment: any;
    currency: any;
    currencyCode: any;
    dateEntered: any;
    externalReference: any;
    fundShareID: any;
    fundShareISIN: any;
    fundShareName: any;
    initialDate: any;
    investorCompanyName: any;
    investorFirstName: any;
    investorLastName: any;
    investorSubportfolioID: any;
    investorWalletID: any;
    investorWalletName: any;
    maximumNumDecimal: any;
    price: any;
    quantity: any;
    referenceID: any;
    theoricalDate: any;
    totalResult: any;
    transferDirection: any;
    transferStatus: any;
    userEntered: any;
}

export interface ManageTransfers {
    transferList: { [referenceId: number]: ManageTransferDetails };
    listTransfer: number[];
    requested: boolean;
    openedTabs: TransferTab[];
    currentPage: number;
    totalResults: number;
}
