export interface ConnectionDetail {
    walletId: number;
    walletAddress: string;
}

export interface MyConnectionState {
    connectionList: Array<ConnectionDetail>;
    requestedConnections: boolean;
}
