export interface NavDetail {
    shareId: number;
    fundId: number;
    fundShareName: string;
    isin: number;
    currency: string;
    nav: number;
    navDate: string;
    navPubDate: string;
    status: number;
    asm: string;
    numberOfShares: number;
    shareAum: number;
}

export interface CurrentRequest {
    shareId?: number;
    fundName: string;
    navDateField: string;
    navDate: string;
}

export interface OfiNavFundViewState {
    navFundView: NavDetail;
    currentRequest: CurrentRequest;
    requested: boolean;
}
