export interface NavDetail {
    managementCompany?: string;
    shareId: number;
    fundId: number;
    fundShareName: string;
    isin: number;
    currency: string;
    nav: number;
    navEstimated?: number;
    navTechnical?: number;
    navValidated?: number;
    navDate: string;
    navPubDate: string;
    status: number;
    nextValuationDate: string;
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
