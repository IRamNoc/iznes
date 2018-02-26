export interface NavFundHistoryItem {
    
}

export interface CurrentRequest {
    shareId: string;
    navDateFrom: string;
    navDateTo: string;
}

export interface OfiNavFundHistoryState {
    navFundHistory: Array<NavFundHistoryItem>;
    currentRequest: CurrentRequest;
    requested: boolean;
}
