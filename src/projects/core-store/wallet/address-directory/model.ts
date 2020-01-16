export interface AddressDirectoryDetail {
    label: string;
    iban: string;
    walletID: number;
}

export interface AddressDirectoryState {
    [key: string]: AddressDirectoryDetail;
}
