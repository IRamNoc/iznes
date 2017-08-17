export interface AddressDetail {
    pub: string;
    addr: string;
}

export interface MyWalletAddressState {
    addressList: Array<AddressDetail>;
}
