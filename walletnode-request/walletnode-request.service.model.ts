import {WalletNodeRequest, WalletNodeMessageBody} from '@setl/utils/common';

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

