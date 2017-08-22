export interface MessageDetail {
    mailId: number;
    senderId: number;
    senderPub: string;
    subject: string;
    date: string;
    isActive: boolean;
    isRead: boolean;
}

export interface MyMessagesState {
    messageList: Array<MessageDetail>;
}
