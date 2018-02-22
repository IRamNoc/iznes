export interface NavLatestDetail {
    nav: number;
    navDate: string;
}

export interface CurrentRequest {
    fundName: string;
    navDate: string;
}

export interface OfiNavLatestState {
    navLatest: Array<NavLatestDetail>;
    currentRequest: CurrentRequest;
    requested: boolean;
}
