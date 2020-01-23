export interface IssuerDetail {
    issuer: string;
    issuerAddress: string;
}

export interface NewIssuerRequest {
    issuerIdentifier: string;
    issuerAddress: string;
    txHash: string;
    status: boolean;
    needNotify: boolean;
}

export interface LastRegisterIssuerDetail {
    txHash: string;
    fromAddress: string;
    namespace: string;
    inBlockchain: boolean;
    needHandle: boolean;
    metaData: any;
}

export interface WalletIssuerDetail {
    walletIssuer: string;
    walletIssuerAddress: string;
}

export interface IssuerList {
    [walletId: number]: IssuerDetail;
}

export interface MyIssuersState {
    issuerList: IssuerList;
    requestedWalletIssuer: boolean;
    newIssuerRequest: NewIssuerRequest;
    walletIssuerDetail: WalletIssuerDetail;
    lastCreated: LastRegisterIssuerDetail;
}

