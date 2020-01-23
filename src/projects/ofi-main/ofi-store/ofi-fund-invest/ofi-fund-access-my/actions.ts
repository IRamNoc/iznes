import { name } from './__init__';
import { kAction } from '@setl/utils/common';

/**
 *  Set fund access my
 */
export const SET_FUND_ACCESS_MY = `${name}/SET_FUND_ACCESS_MY`;

/**
 * Set (Set to true) request fund access my fund access list state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_FUND_ACCESS_MY = `${name}/SET_REQUESTED_FUND_ACCESS_MY`;
export const setRequestedFundAccessMy = kAction(SET_REQUESTED_FUND_ACCESS_MY);

/**
 * Clear (set to false) request my fund access state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_FUND_ACCESS_MY = `${name}/CLEAR_REQUESTED_FUND_ACCESS_MY`;
export const clearRequestedFundAccessMy = kAction(CLEAR_REQUESTED_FUND_ACCESS_MY);

export const VALIDATE_KIID = `${name}/VALIDATE_KIID`;
export const validateKiid = shareID => ({
    type: VALIDATE_KIID,
    payload: shareID,
});
export const OFI_FUND_LATEST_NAV = `${name}/OFI_FUND_LATEST_NAV`;
export const ofiFundLatestNav = data => ({ type: OFI_FUND_LATEST_NAV, payload: data });
