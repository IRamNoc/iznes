export interface TransactionsDetail {
    success: boolean;
    fail: boolean;
    request?: {};
    dateRequested: string;
}

export interface WalletNodeTransactionStatusState {
    [hash: string]: TransactionsDetail;
}