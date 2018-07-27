import {MemberNodeMessageBody} from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiMySubportfoliosRequestBody extends OfiMemberNodeBody {
    token: string;
    isDone: string;
}
