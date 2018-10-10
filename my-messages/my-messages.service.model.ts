import { MemberNodeRequest, MemberNodeMessageBody } from '@setl/utils/common';

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
    bobWalletId: string;
    alicePublicKey: string;
    encryptedMessage: string;
}

export interface RequestOwnMessagesMessage extends MemberNodeRequest {
    MessageBody: RequestOwnMessagesBody;
}

export interface SendMessageBody extends MemberNodeMessageBody {
    token: string;
    mailSubject: string;
    mailBody: string;
    senderId: number;
    senderPub: string;
    recipients: string;
    parentId: number;
    arrangementId: number;
    arrangementStatus: number;
    attachment: number;
    hasAction: number;
    isDraft: number;
}

export interface MailInitBody extends MemberNodeMessageBody {
    token: string;
    walletId: number;
    search: string;
}

export interface MarkAsDelete extends MemberNodeMessageBody {
    token: string;
    walletId: number;
    mailsToMark: object;
    isDelete: number;
}

export interface MarkAsRead extends MemberNodeMessageBody {
    token: string;
    walletId: number;
    mailsToMark: object;
}

export interface MarkAsActed extends MemberNodeMessageBody {
    token: string;
    walletId: number;
    mailsToMarkActed: object;
    txHash: string;
}
