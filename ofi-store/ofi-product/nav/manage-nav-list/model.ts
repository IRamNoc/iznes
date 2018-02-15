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

export interface OfiManageNavListState {
    navList: Array<NavDetail>;
    currentRequest: CurrentRequest;
    requested: boolean;
}
