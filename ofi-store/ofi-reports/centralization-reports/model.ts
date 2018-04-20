export interface CentralizationReportsDetails {
    cutoffDate: any;
    fundShareID: any;
    fundShareName: any;
    isin: any;
    latestNav: any;
    latestNavBackup: any;
    navDate: any;
    navDateBackup: any;
    redAmount: any;
    redQuantity: any;
    settlementDate: any;
    shareClassCurrency: any;
    subAmount: any;
    subQuantity: any;
}

export interface CentralizationReports {
    centralizationReportsList: {
        [key: string]: CentralizationReportsDetails
    };
    requested: boolean;
}
