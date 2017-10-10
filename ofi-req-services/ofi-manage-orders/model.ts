import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiRequestArrangements extends OfiMemberNodeBody {
    status: string;
    sortOrder: string;
    sortBy: string;
    partyType: string;
    pageSize: string;
    pageNum: string;
    asset: string;
    arrangementType: string;
}
