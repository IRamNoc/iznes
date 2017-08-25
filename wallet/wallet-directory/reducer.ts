import * as WalletDirectoryActions from './actions';
import {WalletDirectoryDetail, WalletDirectoryState} from './model';
import _ from 'lodash';
import {Action} from 'redux';
import {fromJS, List, Map} from 'immutable';

const initialState: WalletDirectoryState = {
    walletList: {}
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
                walletList
            });

            return state;

        default:
            return state;
    }
};

function formatWalletDirectoryDataResponse(rawWalletDirectoryData: Array<any>): object {
    const rawWalletDirectoryDataList = fromJS(rawWalletDirectoryData);

    const walletDirectoryObject = Map(rawWalletDirectoryDataList.reduce(
        function (result, item) {
            result[item.get('walletID')] = item;
            return result;
        },
        {}));

    return walletDirectoryObject.toJS();
}



