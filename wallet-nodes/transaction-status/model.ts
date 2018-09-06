export interface TransactionsDetail {
    complete: string;
    txtype?: string;
    dateRequested: string;
}

export interface WalletNodeTransactionStatusState {
    [hash: string]: TransactionsDetail;
}