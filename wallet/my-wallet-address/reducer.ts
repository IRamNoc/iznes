import {AsyncTaskResponseAction} from '@setl/utils/SagaHelper/actions';
import * as MyWalletAddressActions from './actions';
import {MyWalletAddressState} from './model';
import _ from 'lodash';

const initialState: MyWalletAddressState = {
    addressList: []
};

export const MyWalletAddressReducer = function (state: MyWalletAddressState = initialState,
                                                action: AsyncTaskResponseAction) {
    switch (action.type) {
        case MyWalletAddressActions.SET_WALLET_ADDRESSES:

            const addressData = _.get(action, 'payload[1].Data[0]', {});

            const addressList = _.get(addressData, 'address');

            const newState = Object.assign({}, state, {
                addressList
            })
            return state;

        default:
            return state;
    }
}
