import {Reducer, combineReducers} from 'redux';

import {
    ManagementCompanyState,
    ManagementCompanyReducer,
    SET_MANAGEMENT_COMPANY_LIST,
} from './management-company';

import {
    SicavState,
    SicavReducer,
    SET_SICAV_LIST,
} from './sicav';

import {
    FundState,
    FundReducer,
    SET_FUND_LIST,
} from './fund';

export {
    ManagementCompanyState,
    ManagementCompanyReducer,
    SET_MANAGEMENT_COMPANY_LIST,
    SicavState,
    SicavReducer,
    SET_SICAV_LIST,
    FundState,
    FundReducer,
    SET_FUND_LIST,
};

export interface OfiProductState {
    ofiManagementCompany: ManagementCompanyState;
    ofiSicav: SicavState;
    ofiFund: FundState;
}

export const OfiProductReducer: Reducer<OfiProductState> = combineReducers<OfiProductState>({
    ofiManagementCompany: ManagementCompanyReducer,
    ofiSicav: SicavReducer,
    ofiFund: FundReducer,
});
