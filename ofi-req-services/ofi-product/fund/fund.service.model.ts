import {MemberNodeMessageBody} from '@setl/utils/common';

export interface FundRequestMessageBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
}

export interface HistoryRequestMessageBody extends MemberNodeMessageBody {
    token: any;
    fundId: any;
    shareId: any;
    fieldTag: any;
    dateFrom: any;
    dateTo: any;
    pageNum: any;
    pageSize: any;
}

export interface FundShareRequestMessageBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
    fundId: any;
}

export interface SaveFundRequestBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
    companyId: any;
    fundName: any;
    fundProspectus: any;
    fundReport: any;
    fundLei: any;
    sicavId: any;
}

export interface UpdateFundRequestBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
    fundId: any;
    companyId: any;
    fundName: any;
    fundProspectus: any;
    fundReport: any;
    fundLei: any;
    sicavId: any;
}

export interface SaveFundShareRequestBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
    fundID: any;
    metadata: any;
    issuer: any;
    shareName: any;
    status: any;
}

export interface UpdateFundShareRequestBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
    shareID: any;
    fundID: any;
    metadata: any;
    issuer: any;
    shareName: any;
    status: any;
}

export interface SaveFundHistoryRequestBody extends MemberNodeMessageBody {
    token: any;
    changes: any;
}
