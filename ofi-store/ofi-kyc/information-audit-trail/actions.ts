import { name } from './__init__';
import { informationAuditTrailItem } from './model';
import { Action } from 'redux';

export const SET_INFORMATION_AUDIT_TRAIL = `${name}/SET_INFORMATION_AUDIT_TRAIL`;
export const SET_INFORMATION_AUDIT_TRAIL_REQUESTED = `${name}/SET_INFORMATION_AUDIT_TRAIL_REQUESTED`;
export const SET_INFORMATION_AUDIT_TRAIL_RESET = `${name}/SET_INFORMATION_AUDIT_TRAIL_RESET`;

export interface informationAuditTrailAction extends Action {
    type: string;
    payload: {
        kycID: number;
        data: informationAuditTrailItem[];
    };
}

export function setInformationAuditTrail(kycID: number, data) {
    return {
        type: SET_INFORMATION_AUDIT_TRAIL,
        payload: {
            kycID,
            data,
        },
    };
}

export function setInformationAuditTrailRequested() {
    return {
        type: SET_INFORMATION_AUDIT_TRAIL_REQUESTED,
    };
}

export function setInformationAuditTrailReset() {
    return {
        type: SET_INFORMATION_AUDIT_TRAIL_RESET,
    };
}
