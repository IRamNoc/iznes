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

export interface MyIssuersState {
    issuerList: Array<IssuerDetail>;
    requestedWalletIssuer: boolean;
    newIssuerRequest: NewIssuerRequest;
    walletIssuerDetail: {
        walletIssuer: string;
        walletIssuerAddress: string;
    };
    lastCreated: LastRegisterIssuerDetail;
}

