export enum NavPopupMode {
    ADD,
    EDIT
}

export class ShareModel {
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

export interface NavInfoModel extends ShareModel, NavModel {}