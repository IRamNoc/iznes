export interface statusAuditTrailItem {
    kycID: number;
    oldStatus: -2|-1|0|1|2;
    newStatus: -2|-1|0|1|2;
    modifiedBy: string;
    dateEntered: string; // DATETIME
    message: string|null;
}
