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

export interface TransactionList {
    [index: number]: Transaction;
}

export interface TransactionsByAsset {
    [asset: string]: Transaction[];
}

export interface Transactions {
    all: TransactionList;
    byAsset: TransactionsByAsset;
}
