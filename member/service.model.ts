import {MemberNodeMessageBody} from '@setl/utils/common';

export interface RequestManageMemberListMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface AddMemberMessageBody extends MemberNodeMessageBody {
    token: string;
    membername: string;
    email: string;
}

export interface EditMemberMessageBody extends MemberNodeMessageBody {
    token: string;
    memberid: number;
    membername: string;
}

export interface DeleteMemberMessageBody extends MemberNodeMessageBody {
    token: string;
    memberid: number;
}
