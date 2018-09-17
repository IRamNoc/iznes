import * as AddressDirectoryActions from './actions';
import { AddressDirectoryState } from './model';
import * as _ from 'lodash';
import { Action } from 'redux';

const initialState: AddressDirectoryState = {};

export const addressDirectoryReducer = function (state: AddressDirectoryState = initialState, action: Action) {
    let newState: AddressDirectoryState;
    let addressList: object;

    switch (action.type) {
    case AddressDirectoryActions.SET_ADDRESS_DIRECTORY:
        const addressDirectoryData = _.get(action, 'payload[1].Data', []);
        addressList = formatAddressDirectoryDataResponse(addressDirectoryData);
        newState = Object.assign({}, state, addressList);
        return newState;

    default:
        return state;
    }
};

function formatAddressDirectoryDataResponse(rawAddresses: any[]): object {
    const addresses = {};
    rawAddresses.forEach(
        (wallet) => {
            addresses[wallet.option] = {
                label: wallet.label,
                iban: wallet.iban,
            };
        },
    );
    return { [rawAddresses[0].walletID]: addresses };
}
