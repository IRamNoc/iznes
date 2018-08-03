import {combineReducers, Reducer} from 'redux';

import {CentralisationReports, CentralisationReportsListReducer} from './centralisation-reports';
import {PrecentralisationReports, PrecentralisationReportsListReducer} from './precentralisation-reports';
import {CentralisationHistoryReports, OfiCentralisationHistoryReportsListReducer} from './centralisation-history-reports';
import {OfiAmHoldersListReducer, OfiHolderState} from './holders';

export {
    OFI_SET_CENTRALIZATION_REPORTS_LIST,
    OFI_SET_BASE_CENTRALIZATION_HISTORY,
    OFI_SET_CENTRALIZATION_HISTORY,
    ofiClearRequestedCentralisationHistoryReports,
    ofiSetRequestedCentralisationHistoryReports,
    ofiCentralisationHistoryReportsActions
} from './centralisation-history-reports';

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

export interface OfiReportsState {
    centralisationHistoryReports: CentralisationHistoryReports;
    centralisationReports: CentralisationReports;
    precentralisationReports: PrecentralisationReports;
    amHolders: OfiHolderState;
}

export const OfiReportsReducer: Reducer<OfiReportsState> = combineReducers<OfiReportsState>({
    centralisationReports: CentralisationReportsListReducer,
    precentralisationReports: PrecentralisationReportsListReducer,
    centralisationHistoryReports: OfiCentralisationHistoryReportsListReducer,
    amHolders: OfiAmHoldersListReducer,
});
