import { name } from './__init__';
import { kAction } from '@setl/utils/common';
import { Action, ActionCreator } from 'redux';

export const OFI_SET_CLIENT_REFERENTIAL = `${name}/OFI_SET_CLIENT_REFERENTIAL`;

/**
 * Set (Set to true) request list state
 * Flag that to indicate we do not need to request it again.
 */
export const OFI_SET_REQUESTED_CLIENT_REFERENTIAL = `${name}/OFI_SET_REQUESTED_CLIENT_REFERENTIAL`;
export const ofiSetRequestedClientReferential = kAction(OFI_SET_REQUESTED_CLIENT_REFERENTIAL);

/**
 * Clear (set to false) request list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const OFI_CLEAR_REQUESTED_CLIENT_REFERENTIAL = `${name}/OFI_CLEAR_REQUESTED_CLIENT_REFERENTIAL`;
export const ofiClearRequestedClientReferential = kAction(OFI_CLEAR_REQUESTED_CLIENT_REFERENTIAL);
