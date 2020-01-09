export interface PrecentralisationReportsFundsDetails {

}
export interface PrecentralisationReportsFundsList {

}
export interface PrecentralisationReportsSharesDetails {

}
export interface PrecentralisationReportsSharesList {

}

export interface PrecentralisationReports {
    fundsDetailsList: {
        [key: string]: PrecentralisationReportsFundsDetails
    };
    fundsList: {
        [key: string]: PrecentralisationReportsFundsList
    };
    requestedFundsList: boolean;
    sharesDetailsList: {
        [key: string]: PrecentralisationReportsSharesDetails
    };
    sharesList: {
        [key: string]: PrecentralisationReportsSharesList
    };
    requestedSharesList: boolean;
}
