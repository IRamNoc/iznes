export enum NavPopupMode {
    ADD,
    EDIT
}

export class ShareModel {
    name: string;
    ISIN: number;
    ASM?: string;
}

export class NavModel {
    value: number;
    lastValue?: number;
    currency: string;
    date: string;
    pubDate: string;
    status: string;
    aum?: number;
    units?: number;
}

export interface NavInfoModel extends ShareModel, NavModel {}