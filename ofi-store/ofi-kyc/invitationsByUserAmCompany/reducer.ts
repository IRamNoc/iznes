import * as _ from 'lodash';
import {
    investorInvitationAction,
    SET_INVESTOR_INVITATIONS_LIST,
    SET_INVESTOR_INVITATIONS_LIST_REQUESTED,
    SET_INVESTOR_INVITATIONS_LIST_RESET,
} from './actions';
import {investorInvitation} from './model';

export interface investorInvitationState {
    requested: boolean;
    data: investorInvitation[];
}

const initialState = {
    requested: false,
    data: [],
};

export function investorInvitationReducer(
    state: investorInvitationState = initialState,
    action: investorInvitationAction
): investorInvitationState {
    switch (action.type) {
        case SET_INVESTOR_INVITATIONS_LIST:
            return {
                ...state,
                data: _.get(action.payload, [1, 'Data'], []),
            };
        case SET_INVESTOR_INVITATIONS_LIST_REQUESTED:
            return {
                ...state,
                requested: true,
            };
        case SET_INVESTOR_INVITATIONS_LIST_RESET:
            return {
                ...state,
                requested: false,
            };
        default:
            return state;
    }
}
