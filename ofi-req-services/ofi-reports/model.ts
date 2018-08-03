import {MemberNodeMessageBody} from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiCentralisationReportsRequestBody extends OfiMemberNodeBody {
    token: string;
    search?: any;
}

export interface OfiBaseCentralisationHistoryRequestBody extends OfiMemberNodeBody {
    token: string;
    fundShareID: any;
}

export interface OfiCentralisationHistoryRequestBody extends OfiMemberNodeBody {
    token: string;
    fundShareID: any;
    dateFrom: any;
    dateTo: any;
    dateRange: any;
}

export interface OfiAmHoldersRequestBody extends OfiMemberNodeBody {
    token: string;
}

export interface OfiHolderDetailRequestData {
    shareId: number;
    selectedFilter: number;
}

export interface OfiHolderDetailRequestBody extends OfiMemberNodeBody {
    token: string;
    shareId: number;
    selectedFilter: number;
}

export interface OfiInvHoldingsDetailRequestBody extends OfiMemberNodeBody {
    token: string;
    walletID: number;
    amCompanyID: number;
}

export interface OfiInvHoldingsDetailRequestData {
    walletID: any;
    amCompanyID: any;
}

export interface CentralisationRequestSharesBody extends OfiMemberNodeBody {
    token: string;
    shareId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

export interface CentralisationRequestFundsBody extends OfiMemberNodeBody {
    token: string;
    fundId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

export interface PrecentralisationRequestSharesBody extends OfiMemberNodeBody {
    token: string;
    shareId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

export interface PrecentralisationRequestFundsBody extends OfiMemberNodeBody {
    token: string;
    fundId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}