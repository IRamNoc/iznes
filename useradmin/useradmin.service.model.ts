import { MemberNodeRequest, MemberNodeMessageBody } from '@setl/utils/common';

export interface RequestOwnWalletsMessage extends MemberNodeRequest {
    MessageBody: RequestAdminUsersMessageBody;
}

/*
 Users.
 */
export interface RequestAdminUsersMessageBody extends MemberNodeMessageBody {
    token: string;
    pageFrom: number;
    pageSize: number;
    search: string;
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
    account?: number;
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
    walletAccess: { [walletId: number]: number };
}

export interface UpdateUserWalletPermissions extends MemberNodeMessageBody {
    token: string;
    userId: string;
    toAdd: { [walletId: number]: number };
    toUpdate: { [walletId: number]: number };
    toDelete: { [walletId: number]: number };
}

export interface RequestUserChainAccessBody extends MemberNodeMessageBody {
    token: string;
    userId: string;
}

export interface UpdateUserChainAccessBody extends MemberNodeMessageBody {
    token: string;
    userId: string;
    toAdd: { [walletId: number]: number };
    toDelete: { [walletId: number]: number };
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

export interface UpdateMenuPermissionsBody extends MemberNodeMessageBody {
    token: string;
    entityId: number;
    isGroup: number;
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

export interface RequestMenuPermissionBody extends MemberNodeMessageBody {
    token: string;
    entityId: string;
    isGroup: string;
    permissionId: string;
    includeGroup: string;
}

export interface RequestWalletNodeListBody extends MemberNodeMessageBody {
    token: string;
}

export interface WalletNodeRequestBody extends MemberNodeMessageBody {
    token: any;
    nodeId?: any;
    nodeName: any;
    nodeChain: any;
    nodeAddr: any;
    nodePath: any;
    nodePort: any;
}

export interface DeleteWalletNodeRequestBody extends MemberNodeMessageBody {
    token: any;
    nodeId: any;
}

export interface RequestChainListBody extends MemberNodeMessageBody {
    token: string;
}

export interface RequestMemberChainAccessBody extends MemberNodeMessageBody {
    token: string;
    chainId: number;
}

export interface UpdateMemberChainAccessBody extends MemberNodeMessageBody {
    token: string;
    chainId: number;
    toUpdate: object;
    toAdd: object;
    toDelete: Array<number>;
}

export interface CreateNewWalletBody extends MemberNodeMessageBody {
    /* Core wallet fields. */
    token: string;
    walletName: string;
    walletType: string;
    account: string;

    /* Legal basic fields. */
    uid?: string;
    lei?: string;
    websiteUrl?: string;
    incorporationdate?: string;

    /* Legal corresondence. */
    country?: string;
    addressPrefix?: string;
    address1?: string;
    address2?: string;
    address3?: string;
    address4?: string;
    postalCode?: string;

    /* Individual basic fields. */
    aliases?: string;
    formerName?: string;
    idCardNum?: string;

    /* Individual residential address. */
    rdaCountry?: string;
    rdaAddressPrefix?: string;
    rdaAddress1?: string;
    rdaAddress2?: string;
    rdaAddress3?: string;
    rdaAddress4?: string;
    rdaPostalCode?: string;

    /* Individual corresondence address. */
    caCountry?: string;
    caAddressPrefix?: string;
    caAddress1?: string;
    caAddress2?: string;
    caAddress3?: string;
    caAddress4?: string;
    caPostalCode?: string;

    /* Individual settlement detail. */
    bankWalletID?: string;
    bankName?: string;
    bankIBAN?: string;
    bankBICcode?: string;
    bankAccountName?: string;
    bankAccountNum?: string;
    /* settlement address */
    bdCountry?: string;
    bdAddressPrefix?: string;
    bdAddress1?: string;
    bdAddress2?: string;
    bdAddress3?: string;
    bdAddress4?: string;
    bdPostalCode?: string;
}

export interface UpdateWalletBody extends MemberNodeMessageBody {
    /* Core wallet fields. */
    token: string;
    walletId: string;
    walletName: string;
    walletType: string;
    account: string;
    walletLocked: string;

    /* Legal basic fields. */
    uid?: string;
    lei?: string;
    websiteUrl?: string;
    incorporationdate?: string;

    /* Legal corresondence. */
    country?: string;
    addressPrefix?: string;
    address1?: string;
    address2?: string;
    address3?: string;
    address4?: string;
    postalCode?: string;

    /* Individual basic fields. */
    aliases?: string;
    formerName?: string;
    idcardnum?: string;

    /* Individual residential address. */
    rdaCountry?: string;
    rdaAddressPrefix?: string;
    rdaAddress1?: string;
    rdaAddress2?: string;
    rdaAddress3?: string;
    rdaAddress4?: string;
    rdaPostalCode?: string;

    /* Individual corresondence address. */
    caCountry?: string;
    caAddressPrefix?: string;
    caAddress1?: string;
    caAddress2?: string;
    caAddress3?: string;
    caAddress4?: string;
    caPostalCode?: string;

    /* Individual settlement detail. */
    bankWalletID?: string;
    bankName?: string;
    bankIBAN?: string;
    bankBICcode?: string;
    bankaccountname?: string;
    bankaccountnum?: string;
    /* settlement address */
    bdCountry?: string;
    bdAddressPrefix?: string;
    bdAddress1?: string;
    bdAddress2?: string;
    bdAddress3?: string;
    bdAddress4?: string;
    bdPostalCode?: string;
}

export interface DeleteWalletBody extends MemberNodeMessageBody {
    token: string;
    walletId: string;
}

export interface RequestUserAccountWalletPermission extends MemberNodeMessageBody {
    token: string;
    userId: string;
}

export interface UpdateUserAccountWalletPermissions extends MemberNodeMessageBody {
    token: string;
    userId: string;
    toAdd: { [accountId: number]: number };
    toUpdate: { [accountId: number]: number };
    toDelete: { [walletId: number]: number };
}

export interface RequestUserTypes extends MemberNodeMessageBody {
    token: string;
}

export interface GetUserAdminPermissionsBody extends MemberNodeMessageBody {
    userId: number;
    permissionName: string;
}
