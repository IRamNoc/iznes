import {name} from './__init__';
import {investorInvitation} from './model';
import {Action} from 'redux';
import * as _ from 'lodash';

export const SET_INVESTOR_INVITATIONS_LIST = `${name}/SET_INVESTOR_INVITATIONS_LIST`;
export const SET_INVESTOR_INVITATIONS_LIST_REQUESTED = `${name}/SET_INVESTOR_INVITATIONS_LIST_REQUESTED`;
export const SET_INVESTOR_INVITATIONS_LIST_RESET = `${name}/SET_INVESTOR_INVITATIONS_LIST_RESET`;

export interface investorInvitationAction extends Action {
    type: string;
    payload: investorInvitation[];
}

export function setInvestorInvitationList(d: investorInvitation[]) {
    return {
        type: SET_INVESTOR_INVITATIONS_LIST,
        payload: d,
    };
}

export function setInvestorInvitationListRequested() {
    return {
        type: SET_INVESTOR_INVITATIONS_LIST_REQUESTED,
    };
}

export function setInvestorInvitationListReset() {
    return {
        type: SET_INVESTOR_INVITATIONS_LIST_RESET,
    };
}
