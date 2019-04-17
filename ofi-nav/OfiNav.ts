export enum NavPopupMode {
    ADD,
    ADD_EXISTING,
    EDIT,
    DELETE,
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
    units?: number;
    shareAum: number;
    numberOfShares: number;
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

export enum CurrencySymbols {
    EUR = '€',
    USD = '$',
    GBP = '£',
    CHF = 'CHF',
    JPY = '¥',
    AUD = '$',
    NOK = 'kr',
    SEK = 'kr',
    ZAR = 'R',
    RUB = '₽',
    SGD = '$',
    AED = 'د.إ',
    CNY = '¥',
    PLN = 'zł',
}
