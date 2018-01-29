/* Users */
import {
    UsersState,
    UsersReducer,
} from './users';
export {
    SET_ADMIN_USERLIST,
    getUsersList,
    userAdminActions
} from './users';

/* Permission groups. */
import {
    PermissionGroupState,
    PermissionGroupReducer,
} from './permission-group';
export {
    SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
    getAdminPermissionGroup,
    getTranPermissionGroup
} from './permission-group';

/* Permission areas. */
import {
    PermAreasState,
    PermAreasReducer,
} from './permission-areas';
export {
    SET_ADMIN_PERM_AREAS_LIST,
    SET_TX_PERM_AREAS_LIST,
    getAdminPermAreaList,
    getTxPermAreaList
} from './permission-areas';

/* Group permissions. */
import {
    PermissionsState,
    PermissionsReducer,
} from './permissions';
export {
    SET_ADMIN_PERMISSIONS,
    SET_TX_PERMISSIONS,
    getPermissions,
    getAdminPermissions,
    getTranPermissions,
} from './permissions';

import {
    WalletNodeState,
    WalletNodeReducer,
    SET_WALLET_NODE_LIST,
    setRequestedWalletNodeList,
    clearRequestedWalletNodeList,
    getWalletNodeList
} from './wallet-nodes';

import {
    ChainsState,
    ChainReducer,
    SET_CHAIN_LIST,
    setRequestedChainList,
    clearRequestedChainList
} from './chains';

import {
    ChainMembershipState,
    ChainMembershipReducer,
    SET_CHAIN_MEMBERSHIP_LIST,
    getCurrentChainMembershipList
} from './chainMembership';

/* Users permissions. */
import {
    UsersPermissionsState,
    UsersPermissionsReducer,
} from './users-permissions';

export {
    SET_USERS_ADMIN_PERMISSIONS,
    SET_USERS_TX_PERMISSIONS,
    getUsersPermissions,
    getUsersAdminPermissions,
    getUsersTxPermissions,
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
    getWalletNodeList
};

export {
    SET_CHAIN_LIST,
    setRequestedChainList,
    clearRequestedChainList
};

export {
    SET_CHAIN_MEMBERSHIP_LIST,
    getCurrentChainMembershipList
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
}

/* Import Redux reducers to combine. */
import {combineReducers, Reducer} from 'redux';

/* Export the comibined reducers of this branch. */
export const adminUserReducer: Reducer<AdminUsersState> = combineReducers<AdminUsersState>({
    users: UsersReducer,
    permissionGroup: PermissionGroupReducer,
    permAreaList: PermAreasReducer,
    permissions: PermissionsReducer,
    walletNode: WalletNodeReducer,
    chains: ChainReducer,
    chainMembership: ChainMembershipReducer,
    usersPermissions: UsersPermissionsReducer,
    usersWalletPermissions: UsersWalletPermissionsReducer,
    usersChainAccess: UsersChainAccessReducer,
});
