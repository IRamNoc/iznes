import { MyKycRequestedState } from './model';
import {
    MyKycRequestedAction,
    SET_MY_KYC_REQUESTED_IDS,
    CLEAR_MY_KYC_REQUESTED_IDS,

    SET_STAKEHOLDER_RELATIONS,
} from './actions';

import { get as getValue, clone } from 'lodash';

const initialState: MyKycRequestedState = {
    kycs: [],
    stakeholderRelations: [],
};

export function myKycRequestedReducer(
    state: MyKycRequestedState = initialState,
    action: MyKycRequestedAction,
): MyKycRequestedState {
    const payload = getValue(action, ['payload']);

    switch (action.type) {
        case SET_MY_KYC_REQUESTED_IDS:
            return {
                ...state,
                kycs: payload,
            };
        case CLEAR_MY_KYC_REQUESTED_IDS:
            return {
                ...state,
                kycs: [],
            };
        case SET_STAKEHOLDER_RELATIONS:
            return {
                ...state,
                stakeholderRelations: payload,
            };
        default:
            return state;
    }
}
