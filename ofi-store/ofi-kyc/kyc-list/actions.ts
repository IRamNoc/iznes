import {name} from './__init__';
import {MyKycList} from './model';
import {Action} from 'redux';
import {kAction} from '@setl/utils/common';

export const SET_MY_KYC_LIST = `${name}/SET_MY_KYC_LIST`;

export interface MyKycListAction extends Action {
    type: string;
    payload: MyKycList;
}

export function KycSetInvestorInvitations(invitations: MyKycList) {
    return {
        type: SET_MY_KYC_LIST,
        payload: invitations,
    };
}


export const SET_MY_KYC_LIST_REQUESTED = `${name}/SET_MY_KYC_LIST_REQUESTED`;
export const SetMyKycListRequested = kAction(SET_MY_KYC_LIST_REQUESTED);

export const CLEAR_MY_KYC_LIST_REQUESTED = `${name}/CLEAR_MY_KYC_LIST_REQUESTED`;
export const ClearMyKycListRequested = kAction(CLEAR_MY_KYC_LIST_REQUESTED);