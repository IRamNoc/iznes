import {name} from './__init__';
import {kAction} from '@setl/utils/common';

// FUND LIST BY USER
export const OFI_SET_FUNDS_BY_USER_LIST = `${name}/OFI_SET_FUNDS_BY_USER_LIST`;

export const OFI_SET_FUNDS_BY_USER_REQUESTED = `${name}/OFI_SET_FUNDS_BY_USER_REQUESTED`;
export const ofiSetFundsByUserRequested = kAction(OFI_SET_FUNDS_BY_USER_REQUESTED);

export const OFI_CLEAR_FUNDS_BY_USER_REQUESTED = `${name}/OFI_CLEAR_FUNDS_BY_USER_REQUESTED`;
export const ofiClearFundsByUserRequested = kAction(OFI_CLEAR_FUNDS_BY_USER_REQUESTED);

// FUND BY ID WITH HOLDERS
export const OFI_SET_FUNDS_WITH_HOLDERS_LIST = `${name}/OFI_SET_FUNDS_WITH_HOLDERS_LIST`;

export const OFI_SET_FUNDS_WITH_HOLDERS_REQUESTED = `${name}/OFI_SET_FUNDS_WITH_HOLDERS_REQUESTED`;
export const ofiSetFundsWithHoldersRequested = kAction(OFI_SET_FUNDS_WITH_HOLDERS_REQUESTED);

export const OFI_CLEAR_FUNDS_WITH_HOLDERS_REQUESTED = `${name}/OFI_CLEAR_FUNDS_WITH_HOLDERS_REQUESTED`;
export const ofiClearFundsWithHoldersRequested = kAction(OFI_CLEAR_FUNDS_WITH_HOLDERS_REQUESTED);