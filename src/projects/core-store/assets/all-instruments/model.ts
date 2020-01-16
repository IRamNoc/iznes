export interface InstrumentFullDetail {
    issuer: string;
    instrument: string;
    issuerAddress: string;
    metaData: any;
}

export interface AllInstrumentsState {
    instrumentList: {
        [assetName: string]: InstrumentFullDetail
    };
    requested: boolean;
}

