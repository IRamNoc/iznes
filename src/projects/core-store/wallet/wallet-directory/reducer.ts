import * as WalletDirectoryActions from './actions';
import { WalletDirectoryDetail, WalletDirectoryState } from './model';
import * as _ from 'lodash';
import { Action } from 'redux';
import { fromJS, List, Map } from 'immutable';

const initialState: WalletDirectoryState = {
    walletList: {},
};

export const WalletDirectoryReducer = function (state: WalletDirectoryState = initialState,
                                                action: Action) {
    let newState: WalletDirectoryState;
    let walletList: object;

    switch (action.type) {
    case WalletDirectoryActions.SET_WALLET_DIRECTORY:
        const walletDirectoryData = _.get(action, 'payload[1].Data', []);

        walletList = formatWalletDirectoryDataResponse(walletDirectoryData);

        newState = Object.assign({}, state, {
            walletList,
        });

        return newState;
    case WalletDirectoryActions.SET_WALLET_DIRECTORY_WALLET_ADDED:
        return handleSetAddedWallet(action, state);
    case WalletDirectoryActions.SET_WALLET_DIRECTORY_WALLET_UPDATED:
        return handleSetUpdatedWallet(action, state);
    case WalletDirectoryActions.SET_WALLET_DIRECTORY_WALLET_DELETED:
        return handleSetDeletedWallet(action, state);
    default:
        return state;
    }
};

function handleSetAddedWallet(action: Action, state: WalletDirectoryState): WalletDirectoryState {
    const walletAddedData = _.get(action, 'payload[1].Data', []);
    const addedWallet = formatWalletDirectoryDataResponse([walletAddedData]);
    const newWalletList = Object.assign({}, state.walletList, addedWallet);
    const newState = Object.assign({}, state, { walletList: newWalletList });
    return newState;
}

function handleSetUpdatedWallet(action: Action, state: WalletDirectoryState): WalletDirectoryState {
    const updatedWalletData = _.get(action, 'payload[1].Data', []);
    const updatedWalletId = updatedWalletData.walletID;
    const updatedWallet = formatWalletDirectoryDataResponse([updatedWalletData]);
    const newWalletList = JSON.parse(JSON.stringify(state.walletList));

    if (newWalletList[updatedWalletId].walletID === updatedWalletId) {
        newWalletList[updatedWalletId] = updatedWallet[updatedWalletId];
        const newState = Object.assign({}, state, { walletList: newWalletList });
        return newState;
    }
}

function handleSetDeletedWallet(action: Action, state: WalletDirectoryState): WalletDirectoryState {
    const deletedWalletData = _.get(action, 'payload[1].Data', []);
    const deletedWalletId = deletedWalletData.walletID;
    const newWalletList = JSON.parse(JSON.stringify(state.walletList));

    if (newWalletList[deletedWalletId].walletID === deletedWalletId) {
        delete newWalletList[deletedWalletId];
        const newState = Object.assign({}, state, { walletList: newWalletList });
        return newState;
    }
}

function formatWalletDirectoryDataResponse(rawWalletDirectoryData: any[]): object {
    const rawWalletDirectoryDataList = fromJS(rawWalletDirectoryData);

    const walletDirectoryObject = Map(rawWalletDirectoryDataList.reduce(
        (result, item) => {
            result[item.get('walletID')] = item;
            return result;
        },
        {}));

    return walletDirectoryObject.toJS();
}
