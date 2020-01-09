import * as _ from 'lodash';
import {
    investorInvitationAction,
    SET_INVESTOR_INVITATIONS_LIST,
    SET_INVESTOR_INVITATIONS_LIST_REQUESTED,
    SET_INVESTOR_INVITATIONS_LIST_RESET,
} from './actions';
import { investorInvitation } from './model';
import { convertToLocal } from '@setl/utils/helper/m-date-wrapper';

export interface investorInvitationState {
    requested: boolean;
    data: investorInvitation[];
}

const initialState = {
    requested: false,
    data: [],
};

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export function investorInvitationReducer(
    state: investorInvitationState = initialState,
    action: investorInvitationAction,
): investorInvitationState {
    switch (action.type) {
    case SET_INVESTOR_INVITATIONS_LIST:
        let data = _.get(action.payload, [1, 'Data'], []);
        if (data.length) {
            data = data.map(item => ({
                ...item,
                inviteSent: item.inviteSent ? convertToLocal(item.inviteSent, dateFormat) : item.inviteSent,
                tokenUsedAt: item.tokenUsedAt ? convertToLocal(item.tokenUsedAt, dateFormat) : item.tokenUsedAt,
                kycStarted: item.kycStarted ? convertToLocal(item.kycStarted, dateFormat) : item.kycStarted,
            }));
        }
        return {
            ...state,
            data,
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
