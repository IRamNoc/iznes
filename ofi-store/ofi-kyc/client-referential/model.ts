export interface ClientReferentialDetails {
    kycID: any;
    clientReference: any;
    walletName: any;
    companyName: any;
    leiCode: any;
    legalForm: any;
    sectorActivity: any;
    email: any;
    alreadyCompleted: any;
}

export interface OfiClientReferentialState {
    clientReferential: Array<ClientReferentialDetails>;
    requested: boolean;
}
