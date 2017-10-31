import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiRequestNavList extends OfiMemberNodeBody {
    fundName: string;
    navDate: string;
    status: number;
    pageNum: number;
    pageSize: number;
}
