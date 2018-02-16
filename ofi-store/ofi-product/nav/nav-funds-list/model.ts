export interface NavDetail {
    shareId: number;
    fundId: number;
    fundShareName: string;
    isin: number;
    currency: string;
    nav: number;
    navDate: string;
    status: number;
}

export interface CurrentRequest {
    fundName: string;
    navDateField: string;
    navDate: string;
}

export interface OfiNavFundsListState {
    navFundsList: Array<NavDetail>;
    currentRequest: CurrentRequest;
    requested: boolean;
}
