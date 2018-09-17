export interface AddressDirectoryDetail {
    Glei: string;
    commuPub: string;
    walletID: number;
    walletName: string;
}

export interface AddressDirectoryState {
    [key: string]: AddressDirectoryDetail;
}
