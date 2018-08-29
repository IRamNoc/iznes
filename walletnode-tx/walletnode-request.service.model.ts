import { WalletNodeRequest, WalletNodeMessageBody } from '@setl/utils/common';

export interface RegisterIssuerMessageBody extends WalletNodeMessageBody {
    walletid: number;
    name: string;
    address: string;
    metadata: object;
}

export interface RegisterIssuerMessage extends WalletNodeRequest {
    MessageBody: RegisterIssuerMessageBody;
}

export interface DeleteIssuerMessageBody extends WalletNodeMessageBody {
    walletid: number;
    name: string;
    address: string;
    metadata: object;
}

export interface RegisterAssetMessageBody extends WalletNodeMessageBody {
    walletid: number;
    address: string;
    namespace: string;
    instrument: string;
    metadata: object;
}

export interface DeleteAssetMessageBody extends WalletNodeMessageBody {
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

export interface VoidAssetMessageBody extends WalletNodeMessageBody {
    walletid: number;
    address: string;
    namespace: string;
    instrument: string;
    amount: number;
    paymentlist: object;
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

export interface EncumberMessageBody extends WalletNodeMessageBody {
    txtype: number;
    walletid: number;
    reference: string;
    address: string;
    subjectaddress: string;
    namespace: string;
    instrument: string;
    amount: number;
    beneficiaries: any;
    administrators: any;
    protocol: number;
    metadata: number;
    iscumulative: boolean;
}

export interface UnencumberMessageBody extends WalletNodeMessageBody {
    txtype: number;
    walletid: number;
    reference: string;
    address: string;
    subjectaddress: string;
    namespace: string;
    instrument: string;
    amount: number;
    protocol: number;
    metadata: number;
}
