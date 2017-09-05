import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface RequestOwnWalletsMessage extends MemberNodeRequest {
    MessageBody: RequestAdminUsersMessageBody;
}

/*
    Users.
*/
export interface RequestAdminUsersMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface CreateUserMessageBody extends MemberNodeMessageBody {
    token: string;
    username: string;
    email: string;
    account: string;
    userType: string;
    password: string;
}

export interface EditUserMessageBody extends MemberNodeMessageBody {
    token: string;
    email: string;
    account: string;
    userType: string;
    userId: string;
    status: string;
}

/*
    Permissions Areas
*/
export interface GetPermissionAreaListBody extends MemberNodeMessageBody {
    token: string;
}

/*
    Permission Groups
*/
export interface CreateNewGroupBody extends MemberNodeMessageBody {
    token: string;
    groupName: string;
    groupDescription: string;
    groupType: string;
}

export interface UpdateGroupBody extends MemberNodeMessageBody {
    token: string;
    groupId: string;
    groupName: string;
    groupDescription: string;
    groupType: string;
}

export interface UpdateAdminPermissionsBody extends MemberNodeMessageBody {
    token: string;
    entityId: number;
    isGroup: number;
    toAdd: any;
    toUpdate: any;
    toDelete: any;
    isAdmin: string;
}

export interface UpdateTxPermissionsBody extends MemberNodeMessageBody {
    token: string;
    entityId: string;
    isGroup: string;
    chainId: string;
    toAdd: string;
    toUpdate: string;
    toDelete: string;
    isAdmin: string;
}

export interface RequestPermissionBody extends MemberNodeMessageBody {
    token: string;
    entityId: string;
    isGroup: string;
    permissionId: string;
    includeGroup: string;
}
