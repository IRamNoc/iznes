import {name} from './__init__';
import {kAction} from '@setl/utils/common';
import {Action, ActionCreator} from 'redux';

export const OFI_SET_MY_DOCUMENTS_LIST = `${name}/OFI_SET_MY_DOCUMENTS_LIST`;

/**
 * Set (Set to true) request list state
 * Flag that to indicate we do not need to request it again.
 */
export const OFI_SET_REQUESTED_MY_DOCUMENTS = `${name}/OFI_SET_REQUESTED_MY_DOCUMENTS`;
export const ofiSetRequestedMyDocuments = kAction(OFI_SET_REQUESTED_MY_DOCUMENTS);

/**
 * Clear (set to false) request list state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const OFI_CLEAR_REQUESTED_MY_DOCUMENTS = `${name}/OFI_CLEAR_REQUESTED_MY_DOCUMENTS`;
export const ofiClearRequestedMyDocuments = kAction(OFI_CLEAR_REQUESTED_MY_DOCUMENTS);
