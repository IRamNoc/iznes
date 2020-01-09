import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 * Set the user issued assets list
 */
export const OFI_SET_USER_ISSUED_ASSETS = `${name}/OFI_SET_USER_ISSUED_ASSETS`;

/**
 * Set (Set to true) request user issued assets state
 * Flag that to indicate we do not need to request it again.
 */
export const OFI_SET_REQUESTED_USER_ISSUED_ASSETS = `${name}/OFI_SET_REQUESTED_USER_ISSUED_ASSETS`;
export const ofiSetRequestedUserIssuedAssets = kAction(OFI_SET_REQUESTED_USER_ISSUED_ASSETS);


/**
 * Clear (set to false) user issued assets state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const OFI_CLEAR_REQUESTED_USER_ISSUED_ASSETS = `${name}/OFI_CLEAR_REQUESTED_USER_ISSUED_ASSETS`;
export const ofiClearRequestedIssuedAssets = kAction(OFI_CLEAR_REQUESTED_USER_ISSUED_ASSETS);
