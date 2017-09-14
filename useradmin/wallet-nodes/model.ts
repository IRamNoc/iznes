export interface WalletNodeDetail {
    walletNodeId: number;
    walletNodeName: string;
    chainId: number;
    chainName: string;
    nodeAddress: string;
    nodePath: string;
    nodePort: number;
}

export interface WalletNodeState {
    walletNodeList: {
        [walletId: number]: WalletNodeDetail
    };
    requestedWalletNodeList: boolean;
}

