import {get as getValue} from 'lodash';

import {MyKycListState, MyKycListAction} from './model';
import {
    SET_MY_KYC_LIST,
    SET_MY_KYC_LIST_REQUESTED,
    CLEAR_MY_KYC_LIST_REQUESTED,

    SET_MY_KYC_OPEN_TABS,
    SET_MY_KYC_OPEN_TAB,
    SET_MY_KYC_OPEN_TAB_ACTIVE,
    CLEAR_MY_KYC_OPEN_TABS,
    CLEAR_MY_KYC_OPEN_TAB
} from './actions';

const initialState: MyKycListState = {
    kycList: [],
    requested: false,
    tabs: []
};

export function MyKycListReducer(
    state: MyKycListState = initialState,
    action: MyKycListAction
): MyKycListState {
    let payload = getValue(action, ['payload', 1, 'Data'], action.payload);
    let index = payload;

    switch (action.type) {
        case SET_MY_KYC_LIST:
            return {
                ...state,
                kycList: payload
            };
        case SET_MY_KYC_LIST_REQUESTED :
            return {
                ...state,
                requested: true
            };
        case CLEAR_MY_KYC_LIST_REQUESTED :
            return {
                ...state,
                requested: false
            };

        case SET_MY_KYC_OPEN_TABS :
            return {
                ...state,
                tabs : payload
            };
        case SET_MY_KYC_OPEN_TAB :
            return {
                ...state,
                tabs : state.tabs.concat(payload)
            };
        case SET_MY_KYC_OPEN_TAB_ACTIVE :
            return {
                ...state,
                tabs : state.tabs.map((tab, i) => {
                    if(i === index){
                        tab.displayed = true;
                    }
                    return tab;
                })
            };
        case CLEAR_MY_KYC_OPEN_TABS :
            return {
                ...state,
                tabs : []
            };
        case CLEAR_MY_KYC_OPEN_TAB :
            return {
                ...state,
                tabs : [...state.tabs.slice(0, index), ...state.tabs.slice(index + 1)]
            };

        default:
            return state;
    }
}
