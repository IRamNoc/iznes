import { MyKycRequestedState } from './model';
import {
    MyKycRequestedAction,
    SET_MY_KYC_REQUESTED_IDS,
    CLEAR_MY_KYC_REQUESTED_IDS,

    SET_MY_KYC_REQUESTED_PERSIST,
    CLEAR_MY_KYC_REQUESTED_PERSIST,

    SET_STAKEHOLDER_RELATIONS,
} from './actions';

import { get as getValue, clone } from 'lodash';

const initialState: MyKycRequestedState = {
    kycs: [],
    formPersist: {},
    stakeholderRelations: [],
};

export function myKycRequestedReducer(
    state: MyKycRequestedState = initialState,
    action: MyKycRequestedAction,
): MyKycRequestedState {
    let formPersist;
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
        case SET_MY_KYC_REQUESTED_PERSIST:
            formPersist = clone(state.formPersist);
            formPersist[payload] = true;

            return {
                ...state,
                formPersist,
            };
        case CLEAR_MY_KYC_REQUESTED_PERSIST:
            formPersist = clone(initialState.formPersist);

            return {
                ...state,
                formPersist,
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
