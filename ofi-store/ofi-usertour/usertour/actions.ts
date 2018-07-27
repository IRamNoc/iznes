import {name} from './__init__';
import {kAction} from '@setl/utils/common';

export const OFI_SET_MY_SUBPORTFOLIOS = `${name}/OFI_SET_MY_SUBPORTFOLIOS`;

export const OFI_SET_MY_SUBPORTFOLIOS_REQUESTED = `${name}/OFI_SET_MY_SUBPORTFOLIOS_REQUESTED`;
export const ofiSetMySubportfoliosRequested = kAction(OFI_SET_MY_SUBPORTFOLIOS_REQUESTED);

export const OFI_CLEAR_MY_SUBPORTFOLIOS_REQUESTED = `${name}/OFI_CLEAR_MY_SUBPORTFOLIOS_REQUESTED`;
export const ofiClearMySubportfoliosRequested = kAction(OFI_CLEAR_MY_SUBPORTFOLIOS_REQUESTED);