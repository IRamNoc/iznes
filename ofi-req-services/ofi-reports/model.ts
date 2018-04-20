import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiCentralizationReportsRequestBody extends OfiMemberNodeBody {
    token: string;
    search?: any;
}