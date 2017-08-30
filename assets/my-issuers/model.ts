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

export interface MyIssuersState {
    issuerList: Array<IssuerDetail>;
    requestedWalletIssuer: boolean;
    newIssuerRequest: NewIssuerRequest;
    walletIssuerDetail: {
        walletIssuer: string;
        walletIssuerAddress: string;
    };
}

