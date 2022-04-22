import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 * Set the holding history list.
 */
export const OFI_SET_HOLDING_HISTORY_LIST = `${name}/OFI_SET_HOLDING_HISTORY_LIST`;

export const OFI_SET_REQUESTED_HOLDING_HISTORY = `${name}/OFI_SET_REQUESTED_HOLDING_HISTORY`;
export const ofiSetRequestedHoldingHistory = kAction(OFI_SET_REQUESTED_HOLDING_HISTORY);

export const OFI_CLEAR_REQUESTED_HOLDING_HISTORY = `${name}/OFI_CLEAR_REQUESTED_HOLDING_HISTORY`;
export const ofiClearRequestedHoldingHistory = kAction(OFI_CLEAR_REQUESTED_HOLDING_HISTORY);
