import {
    UsersState,
    UsersReducer,
    SET_ADMIN_USERLIST,
    getUsersList
} from './users';

import {
    PermissionGroupState,
    PermissionGroupReducer,
    SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
    getAdminPermissionGroup,
    getTranPermissionGroup
} from './permission-group';

import {
    PermAreasState,
    PermAreasReducer,
    SET_ADMIN_PERM_AREAS_LIST,
    SET_TX_PERM_AREAS_LIST,
    getAdminPermAreaList,
    getTxPermAreaList
} from './permission-areas';

import {
    PermissionsState,
    PermissionsReducer,
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

import {combineReducers, Reducer} from 'redux';

export {
    SET_ADMIN_USERLIST,
    getUsersList
};

export {
    SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
    SET_ADMIN_PERM_AREAS_LIST,
    SET_TX_PERM_AREAS_LIST,
    SET_ADMIN_PERMISSIONS,
    SET_TX_PERMISSIONS,
    getAdminPermissionGroup,
    getTranPermissionGroup,
    getAdminPermAreaList,
    getTxPermAreaList,
    getPermissions,
    getAdminPermissions,
    getTranPermissions
};

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

export interface AdminUsersState {
    users: UsersState;
    permissionGroup: PermissionGroupState;
    permAreaList: PermAreasState;
    permissions: PermissionsState;
    walletNode: WalletNodeState;
    chains: ChainsState;
    chainMembership: ChainMembershipState;
}

export const adminUserReducer: Reducer<AdminUsersState> = combineReducers<AdminUsersState>({
    users: UsersReducer,
    permissionGroup: PermissionGroupReducer,
    permAreaList: PermAreasReducer,
    permissions: PermissionsReducer,
    walletNode: WalletNodeReducer,
    chains: ChainReducer,
    chainMembership: ChainMembershipReducer
});
