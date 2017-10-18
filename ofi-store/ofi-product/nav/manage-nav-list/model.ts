export interface NavDetail {
    price: number;
}

export interface CurrentRequest {
    fundName: string;
    navDate: string;
    status: number;
    pageNum: number;
    pageSize: number;
}

export interface OfiManageNavListState {
    navList: Array<NavDetail>;
    currentRequest: CurrentRequest;
    requested: boolean;
}
