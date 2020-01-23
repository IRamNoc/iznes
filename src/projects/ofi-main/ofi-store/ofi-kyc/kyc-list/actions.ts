import {name} from './__init__';
import {MyKycList} from './model';
import {kAction} from '@setl/utils/common';
import {get as getValue} from 'lodash';

export const SET_MY_KYC_LIST = `${name}/SET_MY_KYC_LIST`;

export function KycSetInvestorInvitations(invitations: MyKycList) {
    let payload = getValue(invitations, ['payload', 1, 'Data']);

    return {
        type: SET_MY_KYC_LIST,
        payload
    };
}


export const SET_MY_KYC_LIST_REQUESTED = `${name}/SET_MY_KYC_LIST_REQUESTED`;
export const SetMyKycListRequested = kAction(SET_MY_KYC_LIST_REQUESTED);

export const CLEAR_MY_KYC_LIST_REQUESTED = `${name}/CLEAR_MY_KYC_LIST_REQUESTED`;
export const ClearMyKycListRequested = kAction(CLEAR_MY_KYC_LIST_REQUESTED);


// List of open tabs

export const SET_MY_KYC_OPEN_TABS = `${name}/SET_MY_KYC_OPEN_TABS`;
export function SetMyKycOpenTabs(tabs){
    return {
        type : SET_MY_KYC_OPEN_TABS,
        payload : tabs
    };
}

export const SET_MY_KYC_OPEN_TAB = `${name}/SET_MY_KYC_OPEN_TAB`;
export function SetMyKycOpenTab(tab){
    return {
        type : SET_MY_KYC_OPEN_TAB,
        payload : tab
    };
}

export const SET_MY_KYC_OPEN_TAB_ACTIVE = `${name}/SET_MY_KYC_OPEN_TAB_ACTIVE`;
export function SetMyKycOpenTabActive(index){
    return {
        type : SET_MY_KYC_OPEN_TAB_ACTIVE,
        payload : index
    };
}

export const CLEAR_MY_KYC_OPEN_TABS = `${name}/CLEAR_MY_KYC_OPEN_TABS`;
export const ClearMyKycOpenTabs = kAction(CLEAR_MY_KYC_OPEN_TABS);

export const CLEAR_MY_KYC_OPEN_TAB = `${name}/CLEAR_MY_KYC_OPEN_TAB`;
export function ClearMyKycOpenTab(index){
    return {
        type : CLEAR_MY_KYC_OPEN_TAB,
        payload : index
    };
}