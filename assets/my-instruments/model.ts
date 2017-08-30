export interface InstrumentDetail {
    issuer: string;
    instrument: string;
}

export interface NewInstrumentRequest {
    issuerIdentifier: string;
    issuerAddress: string;
    instrument: string;
    txHash: string;
    status: boolean;
    needNotify: boolean;
}

export interface MyInstrumentsState {
    instrumentList: Array<InstrumentDetail>;
    requestedWalletInstrument: boolean;
    newInstrumentRequest: NewInstrumentRequest;
}

