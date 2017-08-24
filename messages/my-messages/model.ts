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

}

export interface MyMessagesState {
    messageList: Array<MessageDetail>;
    needRunDecrypt: boolean;
}
