export enum NavPopupMode {
    ADD,
    EDIT
}

export class ShareModel {
    shareId: number;
    fundShareName: string;
    isin: number;
    asm?: string;
}

export class NavModel {
    nav: number;
    lastValue?: number;
    currency: string;
    date: string;
    pubDate: string;
    status: string;
    aum?: number;
    units?: number;
}

export class NavFundHistoryItem {
    shareId: number;
    currency: string;
    nav: number;
    navDate: string;
    status: number;
}

export interface NavInfoModel extends ShareModel, NavModel {}