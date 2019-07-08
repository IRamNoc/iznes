import { AllWalletAddressesState } from './model';
import { Action } from 'redux';
import { SET_ALL_WALLET_ADDRESSES } from './actions';
import * as _ from 'lodash';

const initialState: AllWalletAddressesState = {
    addresses: undefined,
};

export const AllWalletAddressesReducer = function (state: AllWalletAddressesState = initialState,
                                                   action: Action) {

    switch (action.type) {
        case SET_ALL_WALLET_ADDRESSES:
            return Object.assign({}, state, { addresses: _.get(action, 'payload[1].Data', []) });
        default:
            return state;
    }
};
