import { name } from './__init__';
import { kAction, kPayloadAction } from '@setl/utils/common';
import { Action, ActionCreator } from 'redux';
import { SET_STATUS_AUDIT_TRAIL_RESET } from "../../ofi-kyc/status-audit-trail/actions";

/**
 * Set the order list.
 */
export const OFI_SET_PM_LIST = `${name}/OFI_SET_PM_LIST`;

/**
 * Set (Set to true) request manage pm list state
 * Flag that to indicate we do not need to request it again.
 */
export const OFI_SET_REQUESTED_PM_LIST = `${name}/OFI_SET_REQUESTED_PM_LIST`;
export const ofiSetRequestedPmList = kAction(OFI_SET_REQUESTED_PM_LIST);

/**
 * Set detail of a particular pm access.
 */
export const OFI_SET_PM_DETAIL = `${name}/OFI_SET_PM_DETAIL`;

/**
 * Update detail of a particular pm access.
 */
export const OFI_UPDATE_PM_DETAIL = `${name}/OFI_UPDATE_PM_DETAIL`;
export function ofiUpdatePmDetail(pmDetail: {pmId: number; fundId: number; walletId: number; kycId: number}) {
    return {
        type: OFI_UPDATE_PM_DETAIL,
        pmDetail,
    };
}

export const OFI_SET_WM_DETAIL = `${name}/OFI_SET_WM_DETAIL`;

/**
 * Update mandate investors of a particular wm.
 */
export const OFI_UPDATE_WM_DETAIL = `${name}/OFI_UPDATE_PM_DETAIL`;
export function ofiUpdateWmDetail(pmDetail: {pmId: number; investorID: number; walletId: number; kycId: number}) {
    return {
        type: OFI_UPDATE_WM_DETAIL,
        pmDetail,
    };
}

/**
 * New pm.
 */
export const OFI_ADD_NEW_PM = `${name}/OFI_ADD_NEW_PM`;
export function ofiAddNewPM(pm: {pmId: number; emailAddress: string; inviteId: number; firstName: string; lastName: string}) {
    return {
        type: OFI_ADD_NEW_PM,
        pm,
    };
}

/**
 * Pm active.
 */
export const OFI_PM_ACTIVE = `${name}/OFI_PM_ACTIVE`;

export function ofiPMActive(pm: { pmId: number; userId: number; }) {
    return {
        type: OFI_PM_ACTIVE,
        pm,
    };
}
