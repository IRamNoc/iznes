export interface InstrumentDetail {
    issuer: string;
    instrument: string;
    issuerAddress: string;
}

export interface NewInstrumentRequest {
    issuerIdentifier: string;
    issuerAddress: string;
    instrument: string;
    txHash: string;
    status: boolean;
    needNotify: boolean;
}

export interface NewIssueAssetRequest {
    issuerIdentifier: string;
    issuerAddress: string;
    instrument: string;
    toAddress: string;
    amount: number;
    txHash: string;
    status: boolean;
    needNotify: boolean;
}

export interface NewSendAssetRequest {
    issuerIdentifier: string;
    issuerAddress: string;
    instrument: string;
    toAddress: string;
    amount: number;
    txHash: string;
    status: boolean;
    needNotify: boolean;
}

export interface MyInstrumentsState {
    instrumentList: {
        [key: string]: InstrumentDetail
    };
    requestedWalletInstrument: boolean;
    newInstrumentRequest: NewInstrumentRequest;
    newIssueAssetRequest: NewIssueAssetRequest;
    newSendAssetRequest: NewSendAssetRequest;
}

