import {name} from './__init__';
import {MyKycRequestedIds} from './model';
import {Action} from 'redux';
import {kAction} from '@setl/utils/common';

export const SET_MY_KYC_REQUESTED_IDS = `${name}/SET_MY_KYC_REQUESTED_IDS`;

export interface MyKycRequestedAction extends Action {
    type: string;
    payload: MyKycRequestedIds;
}

export function MyKycSetRequestedKycs(kycIds: MyKycRequestedIds) {
    return {
        type: SET_MY_KYC_REQUESTED_IDS,
        payload: kycIds,
    };
}

export const CLEAR_MY_KYC_REQUESTED_IDS = `${name}/CLEAR_MY_KYC_REQUESTED_IDS`;
export const ClearMyKycRequestedIds = kAction(CLEAR_MY_KYC_REQUESTED_IDS);