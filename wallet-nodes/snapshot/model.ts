export interface WalletNodeSnapshotDetail {
    Height: number;
    TXCount: number;
    Timestamp: number;
    TX24Hours : number;
}

export interface WalletNodeInitialSnapshotDetail{
    TX24Hours : number;
    LastBlock : WalletNodeSnapshotDetail;
    Hostname : string;
}

export interface WalletNodeBlockChainDetail{
    Hostname : string
}

export interface WalletNodeSnapshotsState {
    blockChainInfo : WalletNodeBlockChainDetail;
    snapshotList: WalletNodeSnapshotDetail[];
}