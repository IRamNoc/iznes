export interface AddressDetail {
    pub: string;
    addr: string;
    label: string;
}

export interface AddressDetailList {
    [address: string]: AddressDetail;
}

export interface MyWalletAddressState {
    addressList: AddressDetailList;
    requestedAddressList: boolean;
    requestedLabel: boolean;
}
