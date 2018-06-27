import { name } from './__init__';
import { statusAuditTrailItem } from './model';
import { Action } from 'redux';

export const SET_STATUS_AUDIT_TRAIL = `${name}/SET_STATUS_AUDIT_TRAIL`;
export const SET_STATUS_AUDIT_TRAIL_REQUESTED = `${name}/SET_STATUS_AUDIT_TRAIL_REQUESTED`;
export const SET_STATUS_AUDIT_TRAIL_RESET = `${name}/SET_STATUS_AUDIT_TRAIL_RESET`;

export interface statusAuditTrailAction extends Action {
    type: string;
    payload: {
        kycID: number;
        data: statusAuditTrailItem[];
    };
}

export function setStatusAuditTrail(kycID: number, data) {
    return {
        type: SET_STATUS_AUDIT_TRAIL,
        payload: {
            kycID,
            data,
        },
    };
}

export function setStatusAuditTrailRequested() {
    return {
        type: SET_STATUS_AUDIT_TRAIL_REQUESTED,
    };
}

export function setStatusAuditTrailReset() {
    return {
        type: SET_STATUS_AUDIT_TRAIL_RESET,
    };
}
