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

export interface DeleteUserMessageBody extends MemberNodeMessageBody {
    token: string;
    userId: string;
}

export interface RequestUserPermissionsBody extends MemberNodeMessageBody {
    token: string;
    entityId: number;
    isTx: number;
}

export interface UpdateUserGroupsBody extends MemberNodeMessageBody {
    token: string;
    userId: string;
    toAdd: any;
    toDelete: any;
    chainId: string;
}

export interface RequestUserWalletPermissions extends MemberNodeMessageBody {
    token: string;
    userId: number;
}

export interface NewUserWalletPermissions extends MemberNodeMessageBody {
    token: string;
    userId: string;
    walletAccess: { [walletId: number]: number }
}

export interface UpdateUserWalletPermissions extends MemberNodeMessageBody {
    token: string;
    userId: string;
    toAdd: { [walletId: number]: number },
    toUpdate: { [walletId: number]: number },
    toDelete: { [walletId: number]: number }
}

export interface RequestUserChainAccessBody extends MemberNodeMessageBody {
    token: string;
    userId: string;
}

export interface UpdateUserChainAccessBody extends MemberNodeMessageBody {
    token: string;
    userId: string;
    toAdd: { [walletId: number]: number },
    toDelete: { [walletId: number]: number }
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

export interface DeleteGroupBody extends MemberNodeMessageBody {
    token: string;
    groupId: string;
}

export interface UpdateAdminPermissionsBody extends MemberNodeMessageBody {
    token: string;
    entityId: number;
    isGroup: number;
    toAdd: any;
    toUpdate: any;
    toDelete: any;
    isAdmin: string;
    chainId?: number;
}

export interface UpdateTxPermissionsBody extends MemberNodeMessageBody {
    token: string;
    entityId: number;
    isGroup: number;
    chainId: number;
    toAdd: any;
    toUpdate: any;
    toDelete: any;
    isAdmin: string;
}

export interface RequestAdminPermissionBody extends MemberNodeMessageBody {
    token: string;
    entityId: string;
    isGroup: string;
    permissionId: string;
    includeGroup: string;
}

export interface RequestTxPermissionBody extends MemberNodeMessageBody {
    token: string;
    entityId: string;
    chainId: string;
    isGroup: string;
    permissionId: string;
    includeGroup: string;
}

export interface RequestWalletNodeListBody extends MemberNodeMessageBody {
    token: string;
}

export interface RequestChainListBody extends MemberNodeMessageBody {
    token: string;
}

export interface RequestMemberChainAccessBody extends MemberNodeMessageBody {
    token: string;
    chainId: number;
}

export interface UpdateMemberChainAccessBody extends MemberNodeMessageBody{
    token: string;
    chainId: number;
    toUpdate: object;
    toAdd: object;
    toDelete: Array<number>;
}
