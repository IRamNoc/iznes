import { name } from './__init__';
import { MyKycRequestedIds } from './model';
import { Action } from 'redux';
import { kAction } from '@setl/utils/common';

export const SET_MY_KYC_REQUESTED_IDS = `${name}/SET_MY_KYC_REQUESTED_IDS`;

export interface MyKycRequestedAction extends Action {
    type: string;
    payload: MyKycRequestedIds;
}

export function setMyKycRequestedKycs(kycIds: MyKycRequestedIds) {
    return {
        type: SET_MY_KYC_REQUESTED_IDS,
        payload: kycIds,
    };
}

export const CLEAR_MY_KYC_REQUESTED_IDS = `${name}/CLEAR_MY_KYC_REQUESTED_IDS`;
export const clearMyKycRequestedIds = kAction(CLEAR_MY_KYC_REQUESTED_IDS);

export const SET_MY_KYC_REQUESTED_PERSIST = `${name}/SET_MY_KYC_REQUESTED_PERSIST`;
export function setMyKycRequestedPersist(formName: string) {
    return {
        type: SET_MY_KYC_REQUESTED_PERSIST,
        payload: formName,
    };
}

export const CLEAR_MY_KYC_REQUESTED_PERSIST = `${name}/CLEAR_MY_KYC_REQUESTED_PERSIST`;
export const clearMyKycRequestedPersist = kAction(CLEAR_MY_KYC_REQUESTED_PERSIST);
