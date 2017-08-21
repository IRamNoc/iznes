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