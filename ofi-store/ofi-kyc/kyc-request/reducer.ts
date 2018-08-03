import {MyKycRequestedState} from './model';
import {
    MyKycRequestedAction,
    SET_MY_KYC_REQUESTED_IDS,
    CLEAR_MY_KYC_REQUESTED_IDS
} from './actions';

import {get as getValue} from 'lodash';

const initialState: MyKycRequestedState = {
     kycs : []
};

export function MyKycRequestedReducer(
    state: MyKycRequestedState = initialState,
    action: MyKycRequestedAction
): MyKycRequestedState {
    let payload = getValue(action, ['payload']);
    switch (action.type) {
        case SET_MY_KYC_REQUESTED_IDS:
            return {
                kycs : payload
            };
        case CLEAR_MY_KYC_REQUESTED_IDS:
            return {
                kycs : []
            };
        default:
            return state;
    }
}
