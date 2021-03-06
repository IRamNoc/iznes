export interface FundCharacteristic {
    sCutOffOffset: number;
    sCutoffTime: string;
    sCutoffDateTimeStr: string;
    sCutoffDateTimeNumber: number;
    rCutOffOffset: number;
    rCutoffTime: string;
    rCutoffDateTimeStr: string;
    rCutoffDateTimeNumber: number;
    sValuationTime: string;
    sValuationDateTimeStr: string;
    sValuationDateTimeNumber: number;
    rValuationTime: string;
    rValuationDateTimeStr: string;
    rValuationDateTimeNumber: number;
    settlementDateOffset: number;
    sSettlementTime: string;
    sSettlementDateTimeStr: string;
    sSettlementDateTimeNumber: number;
    rSettlementTime: string;
    rSettlementDateTimeStr: string;
    rSettlementDateTimeNumber: number;
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
