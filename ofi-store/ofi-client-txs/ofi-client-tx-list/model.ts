export const enum ClientTxType {
    SUBSCRIPTION = 1,
    REDEMPTION,
    CASH_PAY,
    CASH_RECEIVE
}

export const enum ClientTxLegType {
    PARENET = 1,
    CHIlD
}

export interface TxDetail {
    transactionId: number;
    transactionParentId: number;
    transactionHash: string;
    transactionWalletId: number;
    transactionAddress: string;
    blockNumber: number;
    transactionInstrument: number;
    transactionInstrumentName: string;
    transactionType: ClientTxType;
    transactionType_Contra: ClientTxType;
    transactionUnits: number;
    transactionSignedUnits: number;
    transactionPrice: number;
    transactionCosts: number;
    transactionSettlement: number;
    transactionSignedSettlement: number;
    transactionSettlementCurrencyId: string;
    transactionCounterparty: number;
    transactionValueDate: string;
    transactionSettlementDate: string;
    transactionConfirmationDate: string;
    transactionIsTransfer: boolean;
    transactionLeg: ClientTxLegType;
    transactionDateEntered: string;
}

export interface TxList {
    [transactionId: number]: TxDetail;
}

export interface OfiClientTxsListState {
    txList: TxList;
    requested: boolean;
}
