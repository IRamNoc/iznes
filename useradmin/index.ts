/* Users */
import {
    UsersState,
    usersReducer,
} from './users';

export {
    SET_ADMIN_USERLIST,
    UPDATE_ADMIN_USERLIST,
    DELETE_FROM_ADMIN_USERLIST,
    getUsersList,
    userAdminActions,
} from './users';

/* UserTypes */
import {
    UserTypesState,
    userTypesReducer,
} from './users-types';

export {
    SET_USER_TYPES,
    SET_REQUESTED_USER_TYPES,
    setRequestedUserTypes,
    clearRequestedUserTypes,
    CLEAR_REQUESTED_USER_TYPES,
} from './users-types';

/* Permission groups. */
import {
    PermissionGroupState,
    PermissionGroupReducer,
} from './permission-group';

export {
    SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
    SET_MENU_PERMISSION_GROUP_LIST,
    getAdminPermissionGroup,
    getTranPermissionGroup,
    getMenuPermissionGroup,
    permissionGroupActions,
} from './permission-group';

/* Permission areas. */
import {
    PermAreasState,
    PermAreasReducer,
} from './permission-areas';

export {
    SET_ADMIN_PERM_AREAS_LIST,
    SET_TX_PERM_AREAS_LIST,
    SET_MENU_PERM_AREAS_LIST,
    getAdminPermAreaList,
    getTxPermAreaList,
    getMenuPermAreaList,
} from './permission-areas';

/* Group permissions. */
import {
    PermissionsState,
    permissionsReducer,
} from './permissions';

export {
    SET_ADMIN_PERMISSIONS,
    SET_TX_PERMISSIONS,
    SET_MENU_PERMISSIONS,
    getPermissions,
    getAdminPermissions,
    getTranPermissions,
    getMenuPermissions,
} from './permissions';

import {
    WalletNodeState,
    WalletNodeReducer,
    SET_WALLET_NODE_LIST,
    setRequestedWalletNodeList,
    clearRequestedWalletNodeList,
    getWalletNodeList,
} from './wallet-nodes';

import {
    ChainsState,
    ChainReducer,
    SET_CHAIN_LIST,
    setRequestedChainList,
    clearRequestedChainList,
} from './chains';

import {
    ChainMembershipState,
    ChainMembershipReducer,
    SET_CHAIN_MEMBERSHIP_LIST,
    getCurrentChainMembershipList,
} from './chainMembership';

/* Users permissions. */
import {
    UsersPermissionsState,
    UsersPermissionsReducer,
} from './users-permissions';

export {
    SET_USERS_ADMIN_PERMISSIONS,
    SET_USERS_TX_PERMISSIONS,
    SET_USERS_MENU_PERMISSIONS,
    getUsersPermissions,
    getUsersAdminPermissions,
    getUsersTxPermissions,
    getUsersMenuPermissions,
} from './users-permissions';

/* Users wallet Permissions. */
import {
    UsersWalletPermissionsState,
    UsersWalletPermissionsReducer,
} from './users-wallet-permissions';

export {
    SET_USERS_WALLET_PERMISSIONS,
    getUsersWalletPermissions,
} from './users-wallet-permissions';

/* Users chain access. */
import {
    UsersChainAccessState,
    UsersChainAccessReducer,
} from './users-chain-access';

export {
    SET_USERS_CHAIN_ACCESS,
    getUsersChainAccess,
} from './users-chain-access';

export {
    SET_WALLET_NODE_LIST,
    setRequestedWalletNodeList,
    clearRequestedWalletNodeList,
    getWalletNodeList,
};

export {
    SET_CHAIN_LIST,
    setRequestedChainList,
    clearRequestedChainList,
};

export {
    SET_CHAIN_MEMBERSHIP_LIST,
    getCurrentChainMembershipList,
};

/* Define this branch of the app redux store. */
export interface AdminUsersState {
    users: UsersState;
    permissionGroup: PermissionGroupState;
    permAreaList: PermAreasState;
    permissions: PermissionsState;
    walletNode: WalletNodeState;
    chains: ChainsState;
    chainMembership: ChainMembershipState;
    usersPermissions: UsersPermissionsState;
    usersWalletPermissions: UsersWalletPermissionsState;
    usersChainAccess: UsersChainAccessState;
    userTypes: UserTypesState;
}

/* Import Redux reducers to combine. */
import { combineReducers, Reducer } from 'redux';

/* Export the comibined reducers of this branch. */
export const adminUserReducer: Reducer<AdminUsersState> = combineReducers<AdminUsersState>({
    users: usersReducer,
    permissionGroup: PermissionGroupReducer,
    permAreaList: PermAreasReducer,
    permissions: permissionsReducer,
    walletNode: WalletNodeReducer,
    chains: ChainReducer,
    chainMembership: ChainMembershipReducer,
    usersPermissions: UsersPermissionsReducer,
    usersWalletPermissions: UsersWalletPermissionsReducer,
    usersChainAccess: UsersChainAccessReducer,
    userTypes: userTypesReducer,
});
