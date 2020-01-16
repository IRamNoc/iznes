export interface ConnectionDetail {
    walletId: number;
    walletAddress: string;
}

export interface MyConnectionState {
    fromConnectionList: Array<ConnectionDetail>;
    toConnectionList: Array<ConnectionDetail>;
    requestedFromConnectionList: boolean;
    requestedToConnectionList: boolean;
}
