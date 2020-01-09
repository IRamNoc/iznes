import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 * Set the order list.
 */
export const OFI_SET_AM_HOLDERS_LIST = `${name}/OFI_SET_AM_HOLDERS_LIST`;

export const OFI_SET_REQUESTED_AM_HOLDERS = `${name}/OFI_SET_REQUESTED_AM_HOLDERS`;
export const ofiSetRequestedAmHolders = kAction(OFI_SET_REQUESTED_AM_HOLDERS);

export const OFI_CLEAR_REQUESTED_AM_HOLDERS = `${name}/OFI_CLEAR_REQUESTED_AM_HOLDERS`;
export const ofiClearRequestedAmHolders = kAction(OFI_CLEAR_REQUESTED_AM_HOLDERS);

// INV - My Holdings
export const OFI_SET_INV_HOLDINGS_LIST = `${name}/OFI_SET_INV_HOLDINGS_LIST`;

export const OFI_SET_REQUESTED_INV_HOLDINGS = `${name}/OFI_SET_REQUESTED_INV_HOLDINGS`;
export const ofiSetRequestedInvHoldings = kAction(OFI_SET_REQUESTED_INV_HOLDINGS);

export const OFI_CLEAR_REQUESTED_INV_HOLDINGS = `${name}/OFI_CLEAR_REQUESTED_INV_HOLDINGS`;
export const ofiClearRequestedInvHoldings = kAction(OFI_CLEAR_REQUESTED_INV_HOLDINGS);

// Holder detail
export const OFI_GET_SHARE_HOLDER_DETAIL = `${name}/OFI_GET_SHARE_HOLDER_DETAIL`;

export const OFI_SET_HOLDER_DETAIL_REQUESTED = `${name}/OFI_SET_HOLDER_DETAIL_REQUESTED`;
export const ofiSetHolderDetailRequested = kAction(OFI_SET_HOLDER_DETAIL_REQUESTED);

export const OFI_CLEAR_HOLDER_DETAIL_REQUESTED = `${name}/OFI_CLEAR_HOLDER_DETAIL_REQUESTED`;
export const ofiClearHolderDetailRequested = kAction(OFI_CLEAR_HOLDER_DETAIL_REQUESTED);


