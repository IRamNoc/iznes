import * as MyWalletActions from './actions';
import { MyWalletsState, WalletDetail } from './model';
import * as _ from 'lodash';
import { List, fromJS, Map } from 'immutable';
import { immutableHelper } from '@setl/utils';
import { ADD_TO_OWN_WALLETS, DELETE_FROM_OWN_WALLETS, NewWallet } from './actions';
import { Action } from 'redux';

const initialState: MyWalletsState = {
    walletList: {},
};

export const MyWalletsReducer = function (state: MyWalletsState = initialState,
                                          action: Action) {
    switch (action.type) {
    case MyWalletActions.SET_OWN_WALLETS:
        const walletsData = _.get(action, 'payload[1].Data', []);

        const walletList = formatWalletsDataResponse(walletsData);

        const newState = Object.assign({}, state, {
            walletList,
        });

        return newState;

    case DELETE_FROM_OWN_WALLETS:
        return handleDeleteFromOwnWallets(state, action);

    case ADD_TO_OWN_WALLETS:
        return handleAddToOwnWallets(state, action);

    default:
        return state;
    }
};

function formatWalletsDataResponse(rawWalletsData: any[]): WalletDetail[] {
    const rawWalletsDataList = fromJS(rawWalletsData);

    const walletDetailList = Map(rawWalletsDataList.reduce(
        (result, item) => {
            result[item.get('walletID')] = {
                correspondenceAddress: item.get('CorrespondenceAddress'),
                GLEI: item.get('GLEI'),
                accountId: item.get('accountID'),
                bankWalletId: item.get('bankWalletID'),
                commuPub: item.get('commuPub'),
                permission: item.get('permission'),
                permissionDetail: item.get('permissionDetail'),
                userId: item.get('userID'),
                walletId: item.get('walletID'),
                walletLocked: item.get('walletLocked'),
                walletName: item.get('walletName'),
                walletType: item.get('walletType'),
                walletTypeName: item.get('walletTypeName'),
            };
            return result;
        },
        {}));

    return walletDetailList.toJS();
}

/**
 * Add a wallet to own wallets
 * @param {MyWalletsState} state
 * @param {{walletIds?: NewWallet[]}} action
 * @return {MyWalletsState}
 */
function handleAddToOwnWallets(state: MyWalletsState, action: {type: string; walletIds?: NewWallet[]}): MyWalletsState {
    const newWalletsPayload = _.get(action, 'walletIds', []);
    const currentWallets = immutableHelper.copy(state.walletList);
    const newWallets = newWalletsPayload.reduce((accu, wallet: NewWallet) => {
       accu[wallet.walletID] = {
           correspondenceAddress: _.get(wallet, 'CorrespondenceAddress', null),
           GLEI: _.get(wallet, 'GLEI', null),
           accountId: _.get(wallet, 'accountID', 0),
           bankWalletId: _.get(wallet, 'bankWalletID', 0),
           commuPub: _.get(wallet, 'commuPub', ''),
           permission: _.get(wallet, 'permission', 0),
           permissionDetail: _.get(wallet, 'permissionDetail', ''),
           userId: _.get(wallet, 'userID', 0),
           walletId: _.get(wallet, 'walletID', 0),
           walletLocked: _.get(wallet, 'walletLocked', 0),
           walletName: _.get(wallet, 'walletName', ''),
           walletType: _.get(wallet, 'walletType', 0),
           walletTypeName: _.get(wallet, 'walletTypeName', ''),
       };

       return accu;
    }, currentWallets);

    return Object.assign({}, state, {
        walletList: newWallets,
    });
}

/**
 * Delete wallet from own wallets.
 * @param {MyWalletsState} state
 * @param {{type: string; walletIds?: number[]}} action
 * @return {MyWalletsState}
 */
function handleDeleteFromOwnWallets(state: MyWalletsState, action: {type: string; walletIds?: number[]}): MyWalletsState {
    const walletsToDelete = _.get(action, 'walletIds', []);
    const newWallets = immutableHelper.copy(state.walletList);
    walletsToDelete.map((walletId: number) => {
       delete newWallets[walletId];
    });

    return Object.assign({}, state, {
        walletList: newWallets,
    });

}
