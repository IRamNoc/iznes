import { AsyncTaskResponseAction } from '@setl/utils/sagaHelper/actions';
import * as MyWalletActions from './actions';
import { MyWalletsState, WalletDetail } from './model';
import * as _ from 'lodash';
import { List, fromJS, Map } from 'immutable';

const initialState: MyWalletsState = {
    walletList: {},
};

export const MyWalletsReducer = function (state: MyWalletsState = initialState,
                                          action: AsyncTaskResponseAction) {
    switch (action.type) {
    case MyWalletActions.SET_OWN_WALLETS:
        const walletsData = _.get(action, 'payload[1].Data', []);

        const walletList = formatWalletsDataResponse(walletsData);

        const newState = Object.assign({}, state, {
            walletList,
        });

        return newState;
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
