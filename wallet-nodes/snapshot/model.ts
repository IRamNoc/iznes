export interface WalletNodeSnapshotDetail {
    height: number,
    TXCount: number,
    Timestamp: number
}

export interface WalletNodeInitialSnapshotDetail{
    LastBlock : WalletNodeSnapshotDetail
}

export interface WalletNodeSnapshotListState {
    snapshotList: WalletNodeSnapshotDetail[]
}