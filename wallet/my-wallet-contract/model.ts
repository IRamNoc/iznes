export interface ContractDetail {
    constractData: any;
    requested: boolean;
}

export interface ContractList {
    [walletId: number]: {
        [contractAddress: string]: ContractDetail;
    };
}

export interface LastContractDetail {
    txHash: string;
    contractAddress: string;
    inBlockchain: boolean;
    contractExpiry: number;
    needHandle: boolean;
    metaData: any;
}

export interface MyWalletContractState {
    contractList: ContractList;
    lastCreated: LastContractDetail;
}

