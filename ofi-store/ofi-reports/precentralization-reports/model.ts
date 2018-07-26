export interface PrecentralizationReportsFundsDetails {

}
export interface PrecentralizationReportsFundsList {

}
export interface PrecentralizationReportsSharesDetails {

}
export interface PrecentralizationReportsSharesList {

}

export interface PrecentralizationReports {
    fundsDetailsList: {
        [key: string]: PrecentralizationReportsFundsDetails
    };
    fundsList: {
        [key: string]: PrecentralizationReportsFundsList
    };
    requestedFundsList: boolean;
    sharesDetailsList: {
        [key: string]: PrecentralizationReportsSharesDetails
    };
    sharesList: {
        [key: string]: PrecentralizationReportsSharesList
    };
    requestedSharesList: boolean;
}
