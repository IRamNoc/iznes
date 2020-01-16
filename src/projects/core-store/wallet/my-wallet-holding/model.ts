export interface HoldingByAddress {
    [walletId: number]: object;
}

export interface HoldingByAsset {
    [walletId: number]: object;
}

export interface MyWalletHoldingState {
    holdingByAddress: HoldingByAddress;
    holdingByAsset: HoldingByAsset;
    requested: boolean;
    // flag record whether balance from all wallet
    requestedAll: boolean;
}
