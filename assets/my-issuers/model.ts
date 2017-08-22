export interface IssuerDetail {
    issuer: string;
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
    newIssuerRequest: NewIssuerRequest;
}

