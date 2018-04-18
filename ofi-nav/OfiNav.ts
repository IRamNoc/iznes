export enum NavPopupMode {
    ADD,
    ADD_EXISTING,
    EDIT,
    DELETE
}

export class ShareModel {
    shareId: number;
    fundShareName: string;
    isin: number;
    asm?: string;
}

export class NavModel {
    nav: number;
    navEstimated?: number;
    navTechnical?: number;
    navValidated?: number;
    currency: string;
    navDate: string;
    navPubDate: string;
    status: string;
    aum?: number;
    units?: number;
}

export class NavLatestModel {
    nav: number;
    navDate: string;
}

export class NavFundHistoryItem {
    shareId: number;
    currency: string;
    nav: number;
    navDate: string;
    status: number;
}

export interface NavInfoModel extends ShareModel, NavModel {}