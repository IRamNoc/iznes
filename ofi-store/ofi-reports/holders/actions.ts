import {name} from './__init__';
import {kAction} from '@setl/utils/common';
import {Action, ActionCreator} from 'redux';

/**
 * Set the order list.
 */
export const OFI_SET_AM_HOLDERS_LIST = `${name}/OFI_SET_AM_HOLDERS_LIST`;

export const OFI_SET_REQUESTED_AM_HOLDERS = `${name}/OFI_SET_REQUESTED_AM_HOLDERS`;
export const ofiSetRequestedAmHolders = kAction(OFI_SET_REQUESTED_AM_HOLDERS);

export const OFI_CLEAR_REQUESTED_AM_HOLDERS = `${name}/OFI_CLEAR_REQUESTED_AM_HOLDERS`;
export const ofiClearRequestedAmHolders = kAction(OFI_CLEAR_REQUESTED_AM_HOLDERS);

