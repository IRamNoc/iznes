import {combineReducers, Reducer} from 'redux';

import {
    ManagementCompanyListState,
    ManagementCompanyListReducer,
    SET_MANAGEMENT_COMPANY_LIST,
} from './management-company-list';

export {
    ManagementCompanyListState,
    ManagementCompanyListReducer,
    SET_MANAGEMENT_COMPANY_LIST,
};

export interface ManagementCompanyState {
    managementCompanyList: ManagementCompanyListState;
}

export const ManagementCompanyReducer: Reducer<ManagementCompanyState> = combineReducers<ManagementCompanyState>({
    managementCompanyList: ManagementCompanyListReducer,
});
