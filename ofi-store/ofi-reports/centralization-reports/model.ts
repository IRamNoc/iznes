export interface CentralizationReportsDetails {
    aum: any;
    cutoffDate: any;
    fundShareID: any;
    fundShareName: any;
    isin: any;
    latestNav: any;
    navDate: any;
    netPosition: any;
    netPositionPercentage: any;
    redAmount: any;
    redQuantity: any;
    settlementDate: any;
    shareClassCurrency: any;
    subAmount: any;
    subQuantity: any;
}

export interface BaseCentralizationHistoryDetails {
    fundName: any;
    fundShareName: any;
    isin: any;
    shareClassCurrency: any;
    umbrellaFundName: any;
}

export interface CentralizationHistoryDetails {
    walletID: any;
    latestNav: any;
    navDate: any;
    latestNavBackup: any;
    navDateBackup: any;
    settlementDate: any;
    subQuantity: any;
    subAmount: any;
    redQuantity: any;
    redAmount: any;
    cutoffDate: any;
    aum: any;
    netPosition: any;
    netPositionPercentage: any;
}

export interface CentralizationReports {
    centralizationReportsList: {
        [key: string]: CentralizationReportsDetails
    };
    baseCentralizationHistory: {
        [key: string]: BaseCentralizationHistoryDetails
    };
    centralizationHistory: {
        [key: string]: CentralizationHistoryDetails
    };
    requested: boolean;
}
