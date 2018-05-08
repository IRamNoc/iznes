export interface NavAuditDetail {
    fundShareID: number;
    logType: string;
    navDate: string;
    previousPrice: number;
    price: number;
    userName: string;
    valuationFrequency: number;
    total: number;
}

export interface OfiNavAuditState {
    navAudit: {
        [shareId: string]: NavAuditDetail
    };
    requestedNavAudit: boolean;
}
