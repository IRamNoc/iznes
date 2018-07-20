import {name} from './__init__';
import {MyKycRequestedIds} from './model';
import {Action} from 'redux';

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