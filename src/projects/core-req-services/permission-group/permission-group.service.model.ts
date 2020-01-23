import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface RequestPermissionGroupListMessageBody extends MemberNodeMessageBody {
    token: string;
}

