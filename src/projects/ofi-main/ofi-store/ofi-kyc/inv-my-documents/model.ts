export interface InvMyDocumentDetails {

}

export interface OfiInvMyDocumentsState {
    myDocumentsList: {
        [key: string]: InvMyDocumentDetails
    };
    requested: boolean;
}
