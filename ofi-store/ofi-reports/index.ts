import {combineReducers, Reducer} from 'redux';

import {CentralizationReports, OfiCentralizationReportsListReducer} from './centralization-reports';

export {
    OFI_SET_CENTRALIZATION_REPORTS_LIST,
    ofiClearRequestedCentralizationReports,
    ofiSetRequestedCentralizationReports,
    ofiCentralizationReportsActions
} from './centralization-reports';

export interface OfiReportsState {
    centralizationReports: CentralizationReports;
}

export const OfiReportsReducer: Reducer<OfiReportsState> = combineReducers<OfiReportsState>({
    centralizationReports: OfiCentralizationReportsListReducer,
});
