export interface ClientReferentialAuditDetails {
    company: any;
    isin: any;
    shareName: any;
    info: any;
    oldValue: any;
    newValue: any;
    modifiedBy: any;
    date: any;
}

export interface OfiClientReferentialAuditState {
    clientReferentialAudit: Array<ClientReferentialAuditDetails>;
}
