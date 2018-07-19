export interface PrecentralizationReportsSharesDetails {

}
export interface PrecentralizationReportsSharesList {

}

export interface PrecentralizationReports {
    sharesDetailsList: {
        [key: string]: PrecentralizationReportsSharesDetails
    };
    sharesList: {
        [key: string]: PrecentralizationReportsSharesList
    };
    requestedSharesList: boolean;
}
