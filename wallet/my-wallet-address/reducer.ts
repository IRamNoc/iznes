import { AsyncTaskResponseAction } from '@setl/utils/sagaHelper/actions';
import * as MyWalletAddressActions from './actions';
import { AddressDetailList, MyWalletAddressState } from './model';
import * as _ from 'lodash';
import { fromJS } from 'immutable';

const initialState: MyWalletAddressState = {
    addressList: {},
    requestedAddressList: false,
    requestedLabel: false,
    requestedCompleteAddresses: false,
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

    case MyWalletAddressActions.SET_WALLET_LABEL_UPDATED:
        return handleSetWalletLabelUpdated(state, action);

    case MyWalletAddressActions.SET_REQUESTED_WALLET_LABEL:
        return handleSetRequestedWalletLabel(state);

    case MyWalletAddressActions.CLEAR_REQUESTED_WALLET_LABEL:
        return handleClearRequestedWalletLabel(state);

    default:
        return state;
    }
};

function formatAddressResponse(rawAddressData: any[]): AddressDetailList {
    const rawAddressDataList = fromJS(rawAddressData);

    const addressDetailList: AddressDetailList = rawAddressDataList.reduce(
        (result, thisAddressDetail) => {
            const formattedDetail = {
                addr: thisAddressDetail.get(0),
                pub: thisAddressDetail.get(1),
            };

            result[thisAddressDetail.get(0)] = formattedDetail;

            return result;
        },
        {},
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

    const newAddressListImu = _.pickBy(addressListDataImu.mergeDeep(currentAddressListImu).toJS(), (value) => {
        return value.deleted === 0;
    });

    return Object.assign({}, state, {
        requestedCompleteAddresses: true,
        addressList: newAddressListImu,
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
        requestedAddressList,
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

    return Object.assign({}, state, {
        requestedAddressList,
        requestedCompleteAddresses,
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
    const formattedLabelData = labelData.reduce(
        (result, item) => {
            const address = _.get(item, 'option', '');
            const label = _.get(item, 'label', '');
            const iban = _.get(item, 'iban', '');
            const deleted = _.get(item, 'deleted', '');

            result[address] = {
                addr: address,
                label,
                iban,
                deleted,
            };

            return result;
        },
        {},
    );

    const currentAddressLit = state.addressList;
    const currentAddressListImu = fromJS(currentAddressLit);
    const formattedLabelDataImu = fromJS(formattedLabelData);

    const newAddressListImu = _.pickBy(currentAddressListImu.mergeDeep(formattedLabelDataImu).toJS(), (value) => {
        return value.deleted === 0;
    });

    return Object.assign({}, state, {
        addressList: newAddressListImu,
    });
}

/**
 * Handle SET_WALLET_LABEL_UPDATED action
 *
 * @param state
 * @param action
 * @return {any}
 */
function handleSetWalletLabelUpdated(state, action): MyWalletAddressState {
    /* Get the payload from the JSON object. */
    const updatedLabel = _.get(action, 'payload[1].Data');

    /* Clone the wallet labels list. */
    const newList = JSON.parse(JSON.stringify(state.addressList));

    /* Loop over the wallet labels list and... */
    Object.keys(newList).find((key) => {
        if (newList[key].addr === updatedLabel.option) {
            /* ...if the label is found in the list, update it. */
            newList[key].label = updatedLabel.label;
            newList[key].iban = updatedLabel.iban;

            return newList;
        }
    });

    /* Return the old state with the updated wallet label list. */
    return Object.assign({}, state, { addressList: newList });
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
        requestedLabel,
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
        requestedLabel,
    });
}
