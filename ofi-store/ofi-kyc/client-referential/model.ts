export interface ClientReferentialDetails {
    kycID: any;
    clientReference: any;
    walletName: any;
    registeredCompanyName: any;
    leiCode: any;
    legalForm: any;
    sectorActivity: any;
    email: any;
}

export interface OfiClientReferentialState {
    clientReferential: Array<ClientReferentialDetails>;
    requested: boolean;
}
