import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface RequestOwnMessagesBody extends MemberNodeMessageBody {
    token: string;
    mailId: number;
    fromWalletId: number;
    toWalletId: number;
    sinceMessageId: number;
    pageCount: number;
    pageSize: number;
    arrangementId: number;
    isDraft: number;
    isDeleted: number;
    isAction: number;
    search: string;
    arrangementStatus: number;
}

export interface DecryptMessagesBody extends MemberNodeMessageBody {
    token: string;
    walletId: string;
    bobPub: string;
    encryptedMessage: string;
}

export interface RequestOwnMessagesMessage extends MemberNodeRequest {
    MessageBody: RequestOwnMessagesBody;
}
