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

import {
    OfiManageNavState,
    OfiManageNavReducer,
    SET_NAV_FUNDS_LIST,
    setRequestedNavFundsList,
    clearRequestedNavFundsList,
    ofiSetCurrentNavFundsListRequest,
    getOfiNavFundsListCurrentRequest
} from './nav';

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

    SET_NAV_FUNDS_LIST,
    setRequestedNavFundsList,
    clearRequestedNavFundsList,
    ofiSetCurrentNavFundsListRequest,
    getOfiNavFundsListCurrentRequest
};

export interface OfiProductState {
    ofiManagementCompany: ManagementCompanyState;
    ofiSicav: SicavState;
    ofiFund: FundState;
    ofiManageNav: OfiManageNavState;
}

export const OfiProductReducer: Reducer<OfiProductState> = combineReducers<OfiProductState>({
    ofiManagementCompany: ManagementCompanyReducer,
    ofiSicav: SicavReducer,
    ofiFund: FundReducer,
    ofiManageNav: OfiManageNavReducer
});
