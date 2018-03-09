export class ShareSolvency {
    efamaActiveEFCClassification?: string = '';
    efamaMainEFCCategory?: string = ''; 
    hasTripartiteReport?: boolean = false;
    lastTripartiteReportDate?: string = '';
    mifidSecuritiesClassification?: string = '';
    scrMarket = new SCRMarket();
}

class SCRMarket {
    interestRateUp?: number = null; // 1
    interestRateDown?: number = null; // 1
    equityTypeI?: string = ''; // 1
    equityTypeII?: string = ''; // 1
    property?: string = ''; // 1
    spreadBonds?: string = ''; // 1
    spreadStructured?: string = ''; // 1
    spreadDerivativesUp?: number = null; // 1
    spreadDerivativesDown?: number = null; // 1
    fxUp?: number = null; // 1
    fxDown?: number = null; // 1
}