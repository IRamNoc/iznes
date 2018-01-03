import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';
import * as MyWalletAddressActions from './actions';
import {AddressDetailList, MyWalletAddressState} from './model';
import _ from 'lodash';
import {fromJS} from 'immutable';

const initialState: MyWalletAddressState = {
    addressList: {},
    requestedAddressList: false,
    requestedLabel: false,
    requestedCompleteAddresses: false
};

export const MyWalletAddressReducer = function (state: MyWalletAddressState = initialState,
                                                action: AsyncTaskResponseAction) {
    switch (action.type) {
        case MyWalletAddressActions.SET_WALLET_ADDRESSES:
            return handleSetWalletAddresses(state, action);

        case MyWalletAddressActions.SET_REQUESTED_WALLET_ADDRESSES:
            return handleSetRequestedWalletAddresses(state);

        case MyWalletAddressActions.CLEAR_REQUESTED_WALLET_ADDRESSES:
            return handleClearRequestedWalletAddresses(state);

        case MyWalletAddressActions.SET_WALLET_LABEL:
            return handleSetWalletLabel(state, action);

        case MyWalletAddressActions.SET_REQUESTED_WALLET_LABEL:
            return handleSetRequestedWalletLabel(state);

        case MyWalletAddressActions.CLEAR_REQUESTED_WALLET_LABEL:
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
            };

            result[thisAddressDetail.get(0)] = formattedDetail;

            return result;
        }, {}
    );

    return addressDetailList;
}

/**
 * handle set wallet addresses action
 * @param state
 * @param action
 */
function handleSetWalletAddresses(state, action) {
    const addressData = _.get(action, 'payload[1].data', []);

    const addressListData = formatAddressResponse(addressData);
    const currentAddressList = state.addressList;

    const addressListDataImu = fromJS(addressListData);
    const currentAddressListImu = fromJS(currentAddressList);

    const newAddressListImu = addressListDataImu.mergeDeep(currentAddressListImu);

    return Object.assign({}, state, {
        requestedCompleteAddresses: true,
        addressList: newAddressListImu.toJS()
    });

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
    const requestedCompleteAddresses = false;
    const addressList = [];

    return Object.assign({}, state, {
        addressList,
        requestedAddressList,
        requestedCompleteAddresses
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
        const iban = _.get(item, 'iban', '');

        result[address] = {
            addr: address,
            label,
            iban
        };

        return result;
    }, {});

    const currentAddressLit = state.addressList;
    const currentAddressListImu = fromJS(currentAddressLit);
    const formattedLabelDataImu = fromJS(formattedLabelData);

    const newAddressListImu = currentAddressListImu.mergeDeep(formattedLabelDataImu);

    return Object.assign({}, state, {
        addressList: newAddressListImu.toJS()
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
