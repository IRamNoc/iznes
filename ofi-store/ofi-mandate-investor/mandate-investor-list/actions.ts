import { name } from './__init__';
import { kAction } from '@setl/utils/common';

export const OFI_SET_MANDATE_INVESTOR_LIST = `${name}/OFI_SET_MANDATE_INVESTOR_LIST`;
export const OFI_MANDATE_INVESTORS_REQUESTED = `${name}/OFI_MANDATE_INVESTORS_REQUESTED`;
export const OFI_NEW_MANDATE_INVESTOR = `${name}/OFI_NEW_MANDATE_INVESTOR`;

export const ofiMandateInvestorsRequested = kAction(OFI_MANDATE_INVESTORS_REQUESTED);
export const ofiNewMandateInvestor = payload => ({ type: OFI_NEW_MANDATE_INVESTOR, payload });
