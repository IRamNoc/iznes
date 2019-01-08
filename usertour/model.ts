import {MemberNodeMessageBody} from '@setl/utils/common';

export interface MemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface UsertoursRequestBody extends MemberNodeBody {
    token: string;
}
