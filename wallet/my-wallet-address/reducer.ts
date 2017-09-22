import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';
import * as MyWalletAddressActions from './actions';
import {SET_REQUESTED_WALLET_ADDRESSES, CLEAR_REQUESTED_WALLET_ADDRESSES} from './actions';
import {MyWalletAddressState, AddressDetail} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: MyWalletAddressState = {
    addressList: []
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

        default:
            return state;
    }
}

function formatAddressResponse(rawAddressData: Array<any>): Array<AddressDetail> {
    const rawAddressDataList = fromJS(rawAddressData);
    let addressDetailList = List<AddressDetail>();

    addressDetailList = rawAddressDataList.map(
        function (thisAddressDetail) {

            const formattedDetail = {
                addr: thisAddressDetail.get(0),
                pub: thisAddressDetail.get(1)
            };

            return formattedDetail;
        }
    );

    return addressDetailList.toJS();

}

/**
 * Handle SET_REQUESTED_WALLET_ADDRESS action.
 *
 * @param state
 * @return {{}&U&{requested: boolean}}
 */
function handleSetRequestedWalletAddresses(state) {
    const requested = true;

    return Object.assign({}, state, {
        requested
    });
}


/**
 * Handle CLEAR_REQUESTED_WALLET_ADDRESS action.
 *
 * @param state
 * @return {{}&U&{requested: boolean}}
 */
function handleClearRequestedWalletAddresses(state) {
    const requested = false;

    return Object.assign({}, state, {
        requested
    });
}
