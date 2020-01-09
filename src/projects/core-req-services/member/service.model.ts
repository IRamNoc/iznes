import {MemberNodeMessageBody} from '@setl/utils/common';

export interface RequestManageMemberListMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface AddMemberMessageBody extends MemberNodeMessageBody {
    token: string;
    memberName: string;
    email: string;
}

export interface EditMemberMessageBody extends MemberNodeMessageBody {
    token: string;
    memberId: number;
    memberName: string;
}

export interface DeleteMemberMessageBody extends MemberNodeMessageBody {
    token: string;
    memberId: number;
}
