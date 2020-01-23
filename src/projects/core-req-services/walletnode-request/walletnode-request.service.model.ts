import { WalletNodeRequest, WalletNodeMessageBody } from '@setl/utils/common';

export interface WalletAddressRequestMessageBody extends WalletNodeMessageBody {
    topic: string;
    walletid: number;
    namespace?: string;
    classid?: string;
    address?: string;
}

export interface WalletAddressRequestMessage extends WalletNodeRequest {
    MessageBody: WalletAddressRequestMessageBody;
}

export interface WalletIssuerRequestMessageBody extends WalletNodeMessageBody {
    walletid: number;
    address: string;
}

export interface RequestWalletHoldingMessageBody extends WalletNodeMessageBody {
    topic: string;
    walletid: number;
    namespace?: string;
    classid?: string;
    address?: string;
}

export interface WalletInstrumentRequestMessageBody extends WalletAddressRequestMessageBody {
    walletid: number;
}

export interface RequestContractByAddressBody extends WalletAddressRequestMessageBody {
    walletid: number;
    address: string;
}

export interface RequestTransactionHistoryBody extends WalletNodeMessageBody {
    walletids: number[];
    chainid: number;
    pagesize: number;
    classid: string;
    pagenum: number;
}

export interface RequestContractsByWalletBody extends WalletNodeMessageBody {
    walletid: number;
}
