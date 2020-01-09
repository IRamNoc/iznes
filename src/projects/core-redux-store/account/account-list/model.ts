export interface AccountDetail {
    accountId: number;
    accountName: string;
    description: string;
    parent: number;
    billingWallet: string;
}

export interface AccountListState {
    accountList: {
        [key: string]: AccountDetail
    };
    requestedAccountList: boolean;
}
