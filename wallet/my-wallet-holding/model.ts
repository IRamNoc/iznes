export interface HoldingByAddress {
    wallet: string;
}

export interface HoldingByAsset {
    wallet: string;
}

export interface MyWalletHoldingState {
    holdingByAddress: object;
    holdingByAsset: object;
}

