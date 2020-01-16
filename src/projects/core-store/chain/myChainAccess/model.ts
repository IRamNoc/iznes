export interface MyChainAccessDetail {
    chainId: number;
    chainName: string;
    nodeAddress: string;
    nodeId: number;
    nodeName: string;
    nodePath: string;
    nodePort: number;
    userId: number;
}

export interface MyChainAccessState {
    myChainAccess: { [chainId: number]: MyChainAccessDetail };
    requested: boolean;
}
