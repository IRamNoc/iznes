import {combineReducers, Reducer} from 'redux';

import {CentralizationReports, OfiCentralizationReportsListReducer} from './centralization-reports';
import {AmHolders, OfiAmHoldersListReducer} from './holders';

export {
    OFI_SET_CENTRALIZATION_REPORTS_LIST,
    ofiClearRequestedCentralizationReports,
    ofiSetRequestedCentralizationReports,
    ofiCentralizationReportsActions
} from './centralization-reports';

export {
    OFI_SET_AM_HOLDERS_LIST,
    ofiClearRequestedAmHolders,
    ofiSetRequestedAmHolders,
    ofiAmHoldersActions
} from './holders';

export interface OfiReportsState {
    centralizationReports: CentralizationReports;
    amHolders: AmHolders;
}

export const OfiReportsReducer: Reducer<OfiReportsState> = combineReducers<OfiReportsState>({
    centralizationReports: OfiCentralizationReportsListReducer,
    amHolders: OfiAmHoldersListReducer,
});
