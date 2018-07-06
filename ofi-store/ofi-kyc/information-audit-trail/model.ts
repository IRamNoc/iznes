export interface informationAuditTrailItem {
    kycID: number;
    subsection: string;
    modifiedField: string;
    oldValue: string;
    newValue: string;
    modifiedBy: string;
    dateModified: string; // DATETIME
}
