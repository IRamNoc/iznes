export interface FundShareAuditDetail {
    fundShareID: number;
    fundName: string;
    fundShareName: string;
    field: string;
    mltag?: string;
    oldValue: any;
    newValue: any;
    userName: string;
    date: string;
}

export interface OfiFundShareAuditState {
    fundShareAudit: {
        [shareId: string]: FundShareAuditDetail
    };
    requestedFundShareAudit: boolean;
}
