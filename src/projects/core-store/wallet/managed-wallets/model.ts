import { FormControl } from '@angular/forms';

export interface WalletDetail {
    walletId: number;
    walletName: string;
    walletType: number;
    walletLocked: boolean;
    Glei: string;
    accountId: number;
    accountName: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    addressPrefix: string;
    aliases: string;
    bankBicCode: string;
    bankName: string;
    bankWalletId: number;
    bankAccountName: number;
    bankAccountNum: number;
    bdAddress1: string;
    bdAddress2: string;
    bdAddress3: string;
    bdAddress4: string;
    bdAddressPrefix: string;
    bdCountry: string;
    bdPostalCode: string;
    caAddress1: string;
    caAddress2: string;
    caAddress3: string;
    caAddress4: string;
    caAddressPrefix: string;
    caCountry: string;
    caPostalCode: string;
    commuPub: string;
    country: string;
    formerName: string;
    idCardNum: string;
    incorporationData: string;
    parent: number;
    platformRegData: string;
    postalCode: string;
    rdaAddress1: string;
    rdaAddress2: string;
    rdaAddress3: string;
    rdaAddress4: string;
    rdaAddressPrefix: string;
    rdaCountry: string;
    rdaPostalCode: string;
    uid: string;
    websiteUrl: string;
}

export interface WalletTab {
    title: {
        icon: string;
        text: string;
    };
    walletId: number;
    active: boolean;
    formControl?: FormControl;
}

export interface ManagedWalletsState {
    walletList: {
        [key: number]: WalletDetail,
    };
    openedTabs: Array<WalletTab>;
}
