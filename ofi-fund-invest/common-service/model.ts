export interface FundCharacteristic {
    sCutoffDate: number;
    sCutoffTime: string;
    rCutoffDate: number;
    rCutoffTime: string;
    sValuationDate: number;
    sValuationTime: string;
    rValuationDate: number;
    rValuationTime: string;
    sSettlementDate: number;
    sSettlementTime: string;
    rSettlementDate: number;
    rSettlementTime: string;
    knownNav: boolean;
    entryFee: number;
    sAcquiredFee: number;
    exitFee: number;
    rAcquiredFee: number;
    platformFee: number;
    sAllowType: string;
    rAllowType: string;
    decimalisation: number;
    sMinValue: number;
    sMinUnit: number;
    nav: number;
}
