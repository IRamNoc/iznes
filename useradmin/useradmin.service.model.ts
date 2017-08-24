import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface RequestAdminUsersMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface RequestOwnWalletsMessage extends MemberNodeRequest {
    MessageBody: RequestAdminUsersMessageBody;
}

export interface CreateUserMessageBody extends MemberNodeMessageBody {
    token: string;
    username: string;
    email: string;
    account: string;
    userType: string;
    password: string;
}
