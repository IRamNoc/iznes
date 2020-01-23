export interface MessageDetail {
    mailId: number;
    senderId: number;
    senderPub: string;
    senderImg: string;
    recipientId: number;
    recipientPub: string;
    recipientImg: string;
    subject: string;
    date: string;
    isActive: boolean;
    isRead: boolean;
    isActed: boolean;
    content: string;
    action: string;
    isDecrypted: boolean;
}

export interface MyMessagesState {
    messageList: Array<MessageDetail>;
    needRunDecrypt: boolean;
    counts: Array<MessageCounts>;
    requestMailInitial: boolean;
    requestMailList: boolean;
}

export interface MessageCounts {
    inbox: number;
    sent: number;
    inboxUnread: number;
    draft: number;
    deleted: number;
    action: number;
    totalActions: number;
    unreadArrangement: number;
    totalArrangement: number;
}
