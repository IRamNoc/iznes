export interface Address {
    address: string;
    label: string;
    walletId: number;
}

export interface AllWalletAddressesState {
    addresses: Address[];
}
