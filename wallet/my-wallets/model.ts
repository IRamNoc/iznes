export interface WalletDetail {
    correspondenceAddress: string;
    GLEI: string;
    accountId: number;
    bankWalletId: number;
    commuPub: string;
    permission: number;
    permissionDetail: number;
    userId: number;
    walletId: number;
    walletLocked: number;
    walletName: string;
    walletType: number;
    walletTypeName: string;
}

export interface MyWalletsState {
    walletList: {
        [key: string]: WalletDetail,
    };
}
