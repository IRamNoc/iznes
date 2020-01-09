export interface CurrentRequest {
    fundShareID?: number;
}

export interface OfiFundShareDocsState {
    fundShareDocuments: {
        [shareId: string]: OfiFundShareDocuments
    };
    requested: boolean;
    currentRequest: CurrentRequest;
}

export interface OfiFundShareDocuments {
    fundShareID: number;
    prospectus: number;
    kiid: number;
    annualActivityReport: number;
    semiAnnualSummary: number;
    sharesAllocation: number;
    sriPolicy: number;
    transparencyCode: number;
    businessLetter: number;
    productSheet: number;
    monthlyFinancialReport: number;
    monthlyExtraFinancialReport: number;
    quarterlyFinancialReport: number;
    quarterlyExtraFinancialReport: number;
    letterToShareholders: number;
    kid: number;
    statutoryAuditorsCertification: number;
    ept: number;
    emt: number;
    tpts2: number;
}
 