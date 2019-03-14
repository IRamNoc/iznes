export interface ClientReferentialDetails {
    clientReference: any;
    walletName: any;
    companyName: any;
    email: any;
    investorType: number;
    investmentMethod: string;
}

export interface OfiClientReferentialState {
    clientReferential: Array<ClientReferentialDetails>;
    requested: boolean;
}
