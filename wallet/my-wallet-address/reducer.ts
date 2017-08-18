import {AsyncTaskResponseAction} from '@setl/utils/SagaHelper/actions';
import * as MyWalletAddressActions from './actions';
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

        default:
            return state;
    }
}

function formatAddressResponse(rowAddressData: Array<any>): Array<AddressDetail> {
    const rowAddressDataList = fromJS(rowAddressData);
    let addressDetailList = List<AddressDetail>();

    addressDetailList = rowAddressDataList.map(
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
