import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface RequestAdminUsersMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface RequestOwnWalletsMessage extends MemberNodeRequest {
    MessageBody: RequestAdminUsersMessageBody;
}
