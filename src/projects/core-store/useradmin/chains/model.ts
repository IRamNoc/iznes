export interface ChainDetail {
    chainId: number;
    chainName: string;
}

export interface ChainsState {
    chainList: {
        [chainId: number]: ChainDetail
    };
    requestedChainList: boolean;
}
