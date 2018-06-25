import {combineReducers, Reducer} from 'redux';

import {
    managementCompanyListState,
    invManagementCompanyListState,
    managementCompanyListReducer,
    invManagementCompanyListReducer,
    SET_MANAGEMENT_COMPANY_LIST,
    SET_INV_MANAGEMENT_COMPANY_LIST,
} from './management-company-list';

export {
    managementCompanyListState,
    invManagementCompanyListState,
    managementCompanyListReducer,
    SET_MANAGEMENT_COMPANY_LIST,
    SET_INV_MANAGEMENT_COMPANY_LIST,
};

export interface ManagementCompanyState {
    managementCompanyList: managementCompanyListState;
    investorManagementCompanyList: invManagementCompanyListState;
}

export const ManagementCompanyReducer: Reducer<ManagementCompanyState> = combineReducers<ManagementCompanyState>({
    managementCompanyList: managementCompanyListReducer,
    investorManagementCompanyList: invManagementCompanyListReducer,
});
