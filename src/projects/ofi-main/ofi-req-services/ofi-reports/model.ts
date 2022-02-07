import { MemberNodeMessageBody } from '@setl/utils/common';

export interface MemberNodeMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiBaseCentralisationHistoryRequestBody
    extends MemberNodeMessageBody {
    token: string;
    fundShareID: any;
}

export interface OfiCentralisationHistoryRequestBody extends MemberNodeMessageBody {
    token: string;
    fundShareID: any;
    dateFrom: any;
    dateTo: any;
    dateRange: any;
}

export interface OfiAmHoldersRequestBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiHolderDetailRequestData {
    shareId: number;
    selectedFilter: number;
}

export interface OfiHolderDetailRequestBody extends MemberNodeMessageBody {
    token: string;
    shareId: number;
    selectedFilter: number;
}

export interface InvestorHoldingRequestData {
    walletID: number;
    amCompanyID: number;
    accountID: number;
}

export interface InvestorGenerateAICRequestData {
    fromDate: string;
    isin: string;
    subportfolio: string;
    walletId: number;
}

export interface InvestorGenerateAICRequestBody extends MemberNodeMessageBody {
    token: string;
    fromDate: string;
    isin: string;
    subportfolio: string;
    walletId: number;
}

export interface InvestorHoldingRequestBody extends MemberNodeMessageBody {
    token: string;
    walletID: number;
    amCompanyID: number;
    accountID: number;
}

/* PRECENTRALISATION */
export interface PrecentralisationRequestSharesBody extends MemberNodeMessageBody {
    token: string;
    shareId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

export interface PrecentralisationSharesRequestData {
    shareId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

export interface PrecentralisationRequestFundsBody extends MemberNodeMessageBody {
    token: string;
    fundId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

export interface PrecentralisationFundsRequestData {
    fundId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

/* CENTRALISATION */
export interface CentralisationRequestSharesBody extends MemberNodeMessageBody {
    token: string;
    shareId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

export interface CentralisationSharesRequestData {
    shareId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

export interface CentralisationRequestFundsBody extends MemberNodeMessageBody {
    token: string;
    fundId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

export interface CentralisationFundsRequestData {
    fundId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

export interface CentralisationHistoryRequestData {
    fundShareID: any;
    dateFrom: any;
    dateTo: any;
    dateRange: any;
}

export interface AMGenerateAICRequestData {
    isin: string;
    fromDate: string;
    subportfolio: string;
    client:string;
}

export interface AMGenerateAICRequestBody extends MemberNodeMessageBody {
    token: string;
    isin: string;
    fromDate: string;
    subportfolio: string;
    client:string;



}

