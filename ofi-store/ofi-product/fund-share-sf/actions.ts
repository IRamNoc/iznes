import {name} from './__init__';
import {Action, ActionCreator} from 'redux';
import {kAction} from '@setl/utils/common';

/**
 * Set request
 */
export const OFI_SET_CURRENT_FUND_SHARE_SF = `${name}/OFI_SET_CURRENT_FUND_SHARE_SF`;

export const OFI_CLEAR_CURRENT_FUND_SHARE_SF = `${name}/OFI_CLEAR_CURRENT_FUND_SHARE_SF`;
export const ofiClearCurrentFundShareSelectedFund = kAction(OFI_CLEAR_CURRENT_FUND_SHARE_SF);

interface OfiSetCurrentFundShareSelectedFund extends Action {
    currentFundId: number;
}

export const ofiSetCurrentFundShareSelectedFund: ActionCreator<OfiSetCurrentFundShareSelectedFund> = (currentFundId) => ({
    type: OFI_SET_CURRENT_FUND_SHARE_SF,
    currentFundId
});