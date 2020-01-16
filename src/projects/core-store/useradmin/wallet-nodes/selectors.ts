import {createSelector} from 'reselect';
import {AdminUsersState} from '../index';
import {WalletNodeState} from './index';

const getUserAdmin = (state): AdminUsersState => state.userAdmin;

export const getWalletNode = createSelector(
    getUserAdmin,
    (state: AdminUsersState) => state.walletNode);

export const getWalletNodeList = createSelector(
    getWalletNode,
    (state: WalletNodeState) => Object.assign({}, state.walletNodeList)
);
