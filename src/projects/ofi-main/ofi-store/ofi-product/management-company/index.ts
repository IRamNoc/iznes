import { combineReducers, Reducer } from 'redux';

import {
    ManagementCompanyListState,
    InvManagementCompanyListState,
    managementCompanyListReducer,
    invManagementCompanyListReducer,
    SET_MANAGEMENT_COMPANY_LIST,
    SET_INV_MANAGEMENT_COMPANY_LIST,
} from './management-company-list';

export {
    ManagementCompanyListState,
    InvManagementCompanyListState,
    managementCompanyListReducer,
    SET_MANAGEMENT_COMPANY_LIST,
    SET_INV_MANAGEMENT_COMPANY_LIST,
};

export interface ManagementCompanyState {
    managementCompanyList: ManagementCompanyListState;
    investorManagementCompanyList: InvManagementCompanyListState;
}

export const ManagementCompanyReducer: Reducer<ManagementCompanyState> = combineReducers<ManagementCompanyState>({
    managementCompanyList: managementCompanyListReducer,
    investorManagementCompanyList: invManagementCompanyListReducer,
});
