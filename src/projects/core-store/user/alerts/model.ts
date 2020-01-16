export interface AlertDetail {
    alertData: any;
}

export interface AlertState {
    alerts: {
        [key: string]: AlertDetail,
    };
}
