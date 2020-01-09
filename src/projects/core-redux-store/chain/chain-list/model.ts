export interface ChainDetail {
    chainId: string;
    chainName: string;
}

export interface ChainListState {
    chainList: {
        [key: string]: ChainDetail
    };
    requested: boolean;
}
