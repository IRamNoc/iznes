import {name} from './__init__';
import {kAction} from '@setl/utils/common';

export const OFI_SET_USER_TOURS = `${name}/OFI_SET_USER_TOURS`;

export const OFI_SET_USER_TOURS_REQUESTED = `${name}/OFI_SET_USER_TOURS_REQUESTED`;
export const ofiSetUserToursRequested = kAction(OFI_SET_USER_TOURS_REQUESTED);

export const OFI_CLEAR_USER_TOURS_REQUESTED = `${name}/OFI_CLEAR_USER_TOURS_REQUESTED`;
export const ofiClearUserToursRequested = kAction(OFI_CLEAR_USER_TOURS_REQUESTED);