import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface RequestAccountListMessageBody extends MemberNodeMessageBody {
    token: string;
}


