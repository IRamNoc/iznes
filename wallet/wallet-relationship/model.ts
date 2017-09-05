export interface WalletDetail {
    correspondenceAddress: string;
    toWalletId: number;
    keyDetail: string;
}

export interface WalletRelationshipState {
    toRelationshipList: {
        [key: number]: WalletDetail
    };
    requestedToRelationship: boolean;
}
