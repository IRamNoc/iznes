import {MemberNodeMessageBody} from '@setl/utils/common';

export interface FundRequestMessageBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
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
