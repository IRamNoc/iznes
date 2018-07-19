import {combineReducers, Reducer} from 'redux';

import {PrecentralizationReports, PrecentralizationReportsListReducer} from './precentralization-reports';
import {CentralizationReports, OfiCentralizationReportsListReducer} from './centralization-reports';
import {OfiAmHoldersListReducer, OfiHolderState} from './holders';

export {
    OFI_SET_CENTRALIZATION_REPORTS_LIST,
    OFI_SET_BASE_CENTRALIZATION_HISTORY,
    OFI_SET_CENTRALIZATION_HISTORY,
    ofiClearRequestedCentralizationReports,
    ofiSetRequestedCentralizationReports,
    ofiCentralizationReportsActions
} from './centralization-reports';

export {
    SET_PRECENTRA_SHARES_DETAILS_LIST,
    SET_PRECENTRA_SHARES_LIST,
    setRequestedPrecentraSharesList,
    clearRequestedPrecentraSharesList,
} from './precentralization-reports';

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

export interface OfiReportsState {
    centralizationReports: CentralizationReports;
    precentralizationReports: PrecentralizationReports;
    amHolders: OfiHolderState;
}

export const OfiReportsReducer: Reducer<OfiReportsState> = combineReducers<OfiReportsState>({
    precentralizationReports: PrecentralizationReportsListReducer,
    centralizationReports: OfiCentralizationReportsListReducer,
    amHolders: OfiAmHoldersListReducer,
});
