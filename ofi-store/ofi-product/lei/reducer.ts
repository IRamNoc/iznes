import { LeiState } from './model';
import {
    SET_LEI_LIST,
    SET_REQUESTED_LEI,
    CLEAR_REQUESTED_LEI,
} from './actions';

const initialState: LeiState = {
    lei: [],
    isFetched: false,
};

export const leiReducer = function (state: LeiState = initialState, action) {
    switch (action.type) {
        case SET_LEI_LIST:
            return {
                ...state,
                lei: action.payload,
            };
        case SET_REQUESTED_LEI:
            return {
                ...state,
                isFetched: true,
            };
        case CLEAR_REQUESTED_LEI:
            return {
                ...state,
                isFetched: false,
            };
        default:
            return state;
    }
};
