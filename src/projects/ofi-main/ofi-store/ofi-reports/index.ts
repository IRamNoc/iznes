import {combineReducers, Reducer} from 'redux';

import {CentralisationReports, CentralisationReportsListReducer} from './centralisation-reports';
import {PrecentralisationReports, PrecentralisationReportsListReducer} from './precentralisation-reports';
import {OfiAmHoldersListReducer, OfiHolderState} from './holders';
import { OfiHoldingHistoryListReducer, OfiHoldingHistoryState } from './holding-history/index'; 
export {
    SET_CENTRA_SHARES_DETAILS_LIST,
    SET_CENTRA_SHARES_LIST,
    setRequestedCentraSharesList,
    clearRequestedCentraSharesList,
    SET_CENTRA_FUNDS_DETAILS_LIST,
    SET_CENTRA_FUNDS_LIST,
    setRequestedCentraFundsList,
    clearRequestedCentraFundsList,
} from './centralisation-reports';

export {
    SET_PRECENTRA_SHARES_DETAILS_LIST,
    SET_PRECENTRA_SHARES_LIST,
    setRequestedPrecentraSharesList,
    clearRequestedPrecentraSharesList,
    SET_PRECENTRA_FUNDS_DETAILS_LIST,
    SET_PRECENTRA_FUNDS_LIST,
    setRequestedPrecentraFundsList,
    clearRequestedPrecentraFundsList,
} from './precentralisation-reports';

export {
    OFI_SET_AM_HOLDERS_LIST,
    OFI_SET_INV_HOLDINGS_LIST,
    ofiClearRequestedAmHolders,
    ofiSetRequestedAmHolders,
    ofiSetHolderDetailRequested,
    ofiClearHolderDetailRequested,
    ofiSetRequestedInvHoldings,
    ofiClearRequestedInvHoldings,
    OFI_GET_SHARE_HOLDER_DETAIL,
} from './holders';

export {
    OFI_SET_HOLDING_HISTORY_LIST,
    OFI_SET_REQUESTED_HOLDING_HISTORY,
    ofiSetRequestedHoldingHistory,
    OFI_CLEAR_REQUESTED_HOLDING_HISTORY,
    ofiClearRequestedHoldingHistory,
} from './holding-history/index';


export interface OfiReportsState {
    centralisationReports: CentralisationReports;
    precentralisationReports: PrecentralisationReports;
    amHolders: OfiHolderState;
    holdingHistory: OfiHoldingHistoryState;
}

export const OfiReportsReducer: Reducer<OfiReportsState> = combineReducers<OfiReportsState>({
    centralisationReports: CentralisationReportsListReducer,
    precentralisationReports: PrecentralisationReportsListReducer,
    amHolders: OfiAmHoldersListReducer,
    holdingHistory: OfiHoldingHistoryListReducer,
});
