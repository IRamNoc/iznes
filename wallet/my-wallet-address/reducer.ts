import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';
import * as MyWalletAddressActions from './actions';
import {
    SET_REQUESTED_WALLET_ADDRESSES,
    CLEAR_REQUESTED_WALLET_ADDRESSES,
    SET_WALLET_LABEL,
    SET_REQUESTED_WALLET_LABEL,
    CLEAR_REQUESTED_WALLET_LABEL
} from './actions';
import {MyWalletAddressState, AddressDetail, AddressDetailList} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: MyWalletAddressState = {
    addressList: {},
    requestedAddressList: false,
    requestedLabel: false,
};

export const MyWalletAddressReducer = function (state: MyWalletAddressState = initialState,
                                                action: AsyncTaskResponseAction) {
    switch (action.type) {
        case MyWalletAddressActions.SET_WALLET_ADDRESSES:
            console.log(action);


            const addressData = _.get(action, 'payload[1].data', []);

            const addressList = formatAddressResponse(addressData);

            const newState = Object.assign({}, state, {
                addressList
            });

            return newState;

        case SET_REQUESTED_WALLET_ADDRESSES:
            return handleSetRequestedWalletAddresses(state);

        case CLEAR_REQUESTED_WALLET_ADDRESSES:
            return handleClearRequestedWalletAddresses(state);

        case SET_WALLET_LABEL:
            return handleSetWalletLabel(state, action);

        case SET_REQUESTED_WALLET_LABEL:
            return handleSetRequestedWalletLabel(state);

        case CLEAR_REQUESTED_WALLET_LABEL:
            return handleClearRequestedWalletLabel(state);

        default:
            return state;
    }
};

function formatAddressResponse(rawAddressData: Array<any>): AddressDetailList {
    const rawAddressDataList = fromJS(rawAddressData);

    const addressDetailList: AddressDetailList = rawAddressDataList.reduce(
        function (result, thisAddressDetail) {

            const formattedDetail = {
                addr: thisAddressDetail.get(0),
                pub: thisAddressDetail.get(1),
                label: ''
            };

            result[thisAddressDetail.get(0)] = formattedDetail;

            return result;
        }, {}
    );

    return addressDetailList;

}

/**
 * Handle SET_REQUESTED_WALLET_ADDRESS action.
 *
 * @param state
 * @return {{}&U&{requested: boolean}}
 */
function handleSetRequestedWalletAddresses(state) {
    const requestedAddressList = true;

    return Object.assign({}, state, {
        requestedAddressList
    });
}


/**
 * Handle CLEAR_REQUESTED_WALLET_ADDRESS action.
 *
 * @param state
 * @return {{}&U&{requested: boolean}}
 */
function handleClearRequestedWalletAddresses(state) {
    const requestedAddressList = false;

    return Object.assign({}, state, {
        requestedAddressList
    });
}

/**
 * Handle set address label
 *
 * @param state
 * @param action
 * @return {any}
 */
function handleSetWalletLabel(state, action): MyWalletAddressState {
    const labelData = _.get(action, 'payload[1][Data]', []);

    const formattedLabelData = labelData.reduce((result, item) => {
        const address = _.get(item, 'option', '');
        const label = _.get(item, 'label', '');

        result[address] = {
            label
        };

        return result;
    }, {});

    const currentAddressLit = state.addressList;
    const currentAddressListImu = fromJS(currentAddressLit);

    const newAddressImu = currentAddressListImu.map((addressItem, address) => {
        return addressItem.set('label', formattedLabelData[address]['label']);
    });

    return Object.assign({}, state, {
        addressList: newAddressImu.toJS()
    });
}

/**
 * Handle SET_REQUESTED_WALLET_LABEL action.
 *
 * @param state
 * @return {{}&U&{requested: boolean}}
 */
function handleSetRequestedWalletLabel(state) {
    const requestedLabel = true;

    return Object.assign({}, state, {
        requestedLabel
    });
}


/**
 * Handle CLEAR_REQUESTED_WALLET_LABEL action.
 *
 * @param state
 * @return {{}&U&{requested: boolean}}
 */
function handleClearRequestedWalletLabel(state) {
    const requestedLabel = false;

    return Object.assign({}, state, {
        requestedLabel
    });
}
