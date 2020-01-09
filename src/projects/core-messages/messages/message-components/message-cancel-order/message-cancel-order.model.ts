export class MessageCancelOrderConfig {
    type: string = 'amCancelOrder';
    lang: string;
    orderType: string;
    orderRef: string;
    orderDate: string;
    amCompanyName: string;
    cancelMessage: string;
}
