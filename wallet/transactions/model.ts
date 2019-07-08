export interface Transaction {
    baseChain: number;
    fromAddr: string;
    toAddr: string;
    fromPub: string;
    hash: string;
    shortHash: string;
    utc: string;
    txType: string;
    amount: number;
    issuer: string;
    instrument: string;
    height: string;
    protocol: string;
    sig: string;
}

interface TransactionListMarker {
    timestamp?: number;
    address?: string;
    nonce?: number;
}

interface TransactionListPage {
    page: number;
    before: TransactionListMarker;
    after: TransactionListMarker;
    next: TransactionListMarker;
    transactions: Transaction[];
}

export interface TransactionList {
    currentPage: number;
    requestedPage: number;
    loading: boolean;
    pages: TransactionListPage[];
}

export interface TransactionListByAsset {
    [asset: string]: TransactionList;
}

export interface Transactions {
    all: TransactionList;
    byAsset: TransactionListByAsset;
    byAssetCrossWallets: TransactionListByAsset;
}
