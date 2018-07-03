import {MyKycListState} from './model';
import {
    MyKycListAction,
    SET_MY_KYC_LIST,
    SET_MY_KYC_LIST_REQUESTED,
    CLEAR_MY_KYC_LIST_REQUESTED
} from './actions';

import {get as getValue} from 'lodash';

const initialState: MyKycListState = {
    kycList : [],
    requested : false
};

export function MyKycListReducer(
    state: MyKycListState = initialState,
    action: MyKycListAction
): MyKycListState {
    let payload = getValue(action, ['payload', 1, 'Data']);

    switch (action.type) {
        case SET_MY_KYC_LIST:
            return {
                ...state,
                kycList : payload
            };
        case SET_MY_KYC_LIST_REQUESTED :
            return {
                ...state,
                requested : true
            };
        case CLEAR_MY_KYC_LIST_REQUESTED :
            return {
                ...state,
                requested : false
            };
        default:
            return state;
    }
}
