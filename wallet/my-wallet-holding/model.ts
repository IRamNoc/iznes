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
}

