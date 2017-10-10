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
    content: string;
    action: string;
    isDecrypted: boolean;
}

export interface MyMessagesState {
    messageList: Array<MessageDetail>;
    needRunDecrypt: boolean;
    counts: Array<MessageCounts>;
    requestMailInitial: boolean;
}

export interface MessageCounts {
    inbox: number;
    outbox: number;
    inboxUnread: number;
    draft: number;
    deleted: number;
    actions: number;
    totalActions: number;
    unreadArrangement: number;
    totalArrangement: number;
}
