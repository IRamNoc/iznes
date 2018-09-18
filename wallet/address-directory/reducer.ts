import * as AddressDirectoryActions from './actions';
import { AddressDirectoryState } from './model';
import * as _ from 'lodash';
import { Action } from 'redux';

const initialState: AddressDirectoryState = {};

export const addressDirectoryReducer = function (state: AddressDirectoryState = initialState, action: Action) {
    let newState: AddressDirectoryState = {};

    switch (action.type) {
    case AddressDirectoryActions.SET_ADDRESS_DIRECTORY:
        const addressDirectoryData = _.get(action, 'payload[1].Data', []);
        addressDirectoryData.forEach(
            (wallet) => {
                newState[wallet.option] = {
                    label: wallet.label,
                    iban: wallet.iban,
                    walletID: wallet.walletID,
                };
            },
        );
        newState = Object.assign({}, state, newState);
        return newState;

    default:
        return state;
    }
};
