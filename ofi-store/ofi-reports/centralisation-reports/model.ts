export interface CentralisationReportsFundsDetails {

}
export interface CentralisationReportsFundsList {

}
export interface CentralisationReportsSharesDetails {

}
export interface CentralisationReportsSharesList {

}

export interface CentralisationReports {
    fundsDetailsList: {
        [key: string]: CentralisationReportsFundsDetails
    };
    fundsList: {
        [key: string]: CentralisationReportsFundsList
    };
    requestedFundsList: boolean;
    sharesDetailsList: {
        [key: string]: CentralisationReportsSharesDetails
    };
    sharesList: {
        [key: string]: CentralisationReportsSharesList
    };
    requestedSharesList: boolean;
}
