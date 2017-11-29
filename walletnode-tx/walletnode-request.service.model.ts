import {WalletNodeRequest, WalletNodeMessageBody} from '@setl/utils/common';

export interface RegisterIssuerMessageBody extends WalletNodeMessageBody {
    walletid: number;
    name: string;
    address: string;
    metadata: object;
}

export interface RegisterIssuerMessage extends WalletNodeRequest {
    MessageBody: RegisterIssuerMessageBody;
}

export interface RegisterAssetMessageBody extends WalletNodeMessageBody {
    walletid: number;
    address: string;
    namespace: string;
    instrument: string;
    metadata: object;
}

export interface IssueAssetMessageBody extends WalletNodeMessageBody {
    walletid: number;
    namespace: string;
    instrument: string;
    address: string;
    amount: number;
}

export interface SendAssetMessageBody extends WalletNodeMessageBody {
    walletid: number;
    namespace: string;
    instrument: string;
    fromaddress: string;
    toaddress: string;
    amount: number;
}

export interface NewAddressMessageBody extends WalletNodeMessageBody {
    walletid: number;
    register: string;
}

export interface NewContractMessageBody extends WalletNodeMessageBody {
    walletid: number;
    address: string;
    'function': string;
    contractdata: string;
}

