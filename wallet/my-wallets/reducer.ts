import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';
import * as MyWalletActions from './actions';
import {MyWalletsState, WalletDetail} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: MyWalletsState = {
    walletList: []
};

export const MyWalletsReducer = function (state: MyWalletsState = initialState,
                                          action: AsyncTaskResponseAction) {
    switch (action.type) {
        case MyWalletActions.SET_OWN_WALLETS:
            const walletsData = _.get(action, 'payload[1].Data', []);

            console.log(walletsData[0]);

            const walletList = formatWalletsDataResponse(walletsData);

            const newState = Object.assign({}, state, {
                walletList
            });

            return newState;

        default:
            return state;
    }
};

function formatWalletsDataResponse(rawWalletsData: Array<any>): Array<WalletDetail> {

    const rawWalletsDataList = fromJS(rawWalletsData);
    let walletDetailList = List<WalletDetail>();

    walletDetailList = rawWalletsDataList.map(
        function (thisWalletDetail) {

            const formattedDetail = {
                    correspondenceAddress: thisWalletDetail.get('CorrespondenceAddress'),
                    GLEI: thisWalletDetail.get('GLEI'),
                    accountId: thisWalletDetail.get('accountID'),
                    bankWalletId: thisWalletDetail.get('bankWalletID'),
                    commuPub: thisWalletDetail.get('commuPub'),
                    permission: thisWalletDetail.get('permission'),
                    permissionDetail: thisWalletDetail.get('permissionDetail'),
                    userId: thisWalletDetail.get('userID'),
                    walletId: thisWalletDetail.get('walletID'),
                    walletLocked: thisWalletDetail.get('walletLocked'),
                    walletName: thisWalletDetail.get('walletName'),
                    walletType: thisWalletDetail.get('walletType'),
                    walletTypeName: thisWalletDetail.get('walletTypeName'),
                }
            ;

            return formattedDetail;
        }
    );

    return walletDetailList.toJS();
}
