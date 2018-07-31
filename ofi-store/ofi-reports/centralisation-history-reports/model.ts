export interface CentralisationHistoryReportsDetails {
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

export interface BaseCentralisationHistoryDetails {
    fundName: any;
    fundShareName: any;
    isin: any;
    shareClassCurrency: any;
    umbrellaFundName: any;
}

export interface CentralisationHistoryDetails {
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

export interface CentralisationHistoryReports {
    centralisationHistoryReportsList: {
        [key: string]: CentralisationHistoryReportsDetails
    };
    baseCentralisationHistory: {
        [key: string]: BaseCentralisationHistoryDetails
    };
    centralisationHistory: {
        [key: string]: CentralisationHistoryDetails
    };
    requested: boolean;
}
