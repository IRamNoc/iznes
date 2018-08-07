import {MemberNodeMessageBody} from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiUsertoursRequestBody extends OfiMemberNodeBody {
    token: string;
}
