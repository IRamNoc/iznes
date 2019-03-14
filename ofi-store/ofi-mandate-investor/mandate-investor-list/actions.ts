import { name } from './__init__';
import { kAction } from '@setl/utils/common';

export const OFI_SET_MANDATE_INVESTOR_LIST = `${name}/OFI_SET_MANDATE_INVESTOR_LIST`;
export const OFI_REQUEST_MANDATE_INVESTORS = `${name}/OFI_REQUEST_MANDATE_INVESTORS`;
export const OFI_MANDATE_INVESTORS_REQUESTED = `${name}/OFI_MANDATE_INVESTORS_REQUESTED`;

export const ofiRequestMandateInvestors = kAction(OFI_REQUEST_MANDATE_INVESTORS);
export const ofiMandateInvestorsRequested = kAction(OFI_MANDATE_INVESTORS_REQUESTED);
