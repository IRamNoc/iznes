import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiCentralizationReportsRequestBody extends OfiMemberNodeBody {
    token: string;
    search?: any;
}

export interface OfiBaseCentralizationHistoryRequestBody extends OfiMemberNodeBody {
    token: string;
    fundShareID: any;
}

export interface OfiCentralizationHistoryRequestBody extends OfiMemberNodeBody {
    token: string;
    fundShareID: any;
    dateFrom: any;
    dateTo: any;
    dateRange: any;
}

export interface OfiAmHoldersRequestBody extends OfiMemberNodeBody {
    token: string;
}
