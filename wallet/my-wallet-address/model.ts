export interface AddressDetail {
    pub: string;
    addr: string;
    label: string;
    iban: string;
    deleted: string;
}

export interface AddressDetailList {
    [address: string]: AddressDetail;
}

export interface MyWalletAddressState {
    addressList: AddressDetailList;
    requestedAddressList: boolean;
    requestedLabel: boolean;
    requestedCompleteAddresses: boolean;
}
