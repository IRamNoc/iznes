export interface WalletDirectoryDetail {
    Glei: string;
    commuPub: string;
    walletID: number;
    walletName: string;
}

export interface WalletDirectoryState {
    walletList: {
        [key: string]: WalletDirectoryDetail,
    };
}
