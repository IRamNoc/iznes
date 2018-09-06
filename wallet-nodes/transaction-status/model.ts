export interface TransactionsDetail {
    complete: string;
    txtype?: string;
    lastUpdated: string;
}

export interface WalletNodeTransactionStatusState {
    [hash: string]: TransactionsDetail;
}