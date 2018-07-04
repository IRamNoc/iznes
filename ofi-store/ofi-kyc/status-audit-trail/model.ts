export interface statusAuditTrailItem {
    kycID: number;
    oldStatus: string;
    newStatus: string;
    modifiedBy: string;
    dateEntered: string; // DATETIME
    message: string|null;
}
