import {Action} from 'redux';
import * as ManagementCompanyActions from './actions';
import {ManagementCompanyDetail, managementCompanyListState, invManagementCompanyListState} from './model';
import * as _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: managementCompanyListState = {
    managementCompanyList: {},
    requested: false,
};
const invInitialState: invManagementCompanyListState = {
    investorManagementCompanyList: {},
    invRequested: false,
};

export const managementCompanyListReducer = function (state: managementCompanyListState = initialState, action: Action) {

    switch (action.type) {
        case ManagementCompanyActions.SET_MANAGEMENT_COMPANY_LIST:
            const mcData = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]
            const managementCompanyList = formatManagementCompanyDataResponse(mcData);
            const newState = Object.assign({}, state, {
                managementCompanyList,
            });
            return newState;

        case ManagementCompanyActions.SET_REQUESTED_MANAGEMENT_COMPANY:
            return handleSetRequested(state, action);

        case ManagementCompanyActions.CLEAR_REQUESTED_MANAGEMENT_COMPANY:
            return handleClearRequested(state, action);

        default:
            return state;
    }
};

export const invManagementCompanyListReducer = function (state: invManagementCompanyListState = invInitialState, action: Action) {

    switch (action.type) {
        case ManagementCompanyActions.SET_INV_MANAGEMENT_COMPANY_LIST:
            const mcData2 = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]
            const investorManagementCompanyList = formatManagementCompanyDataResponse(mcData2);
            const newState2 = Object.assign({}, state, {
                investorManagementCompanyList,
            });
            return newState2;

        case ManagementCompanyActions.SET_REQUESTED_INV_MANAGEMENT_COMPANY:
            return handleSetINVRequested(state, action);

        case ManagementCompanyActions.CLEAR_REQUESTED_MANAGEMENT_COMPANY:
            return handleClearINVRequested(state, action);

        default:
            return state;
    }
};

function formatManagementCompanyDataResponse(rawCompanyData: Array<any>): Array<ManagementCompanyDetail> {
    const rawCompanyDataList = fromJS(rawCompanyData);

    const companyDetailList = Map(rawCompanyDataList.reduce(
        function (result, item) {
            result[item.get('companyID')] = {
                companyID: item.get('companyID'),
                companyName: item.get('companyName'),
                country: item.get('country'),
                addressPrefix: item.get('addrPrefix'),  // addressPrefix to addrPrefix
                postalAddressLine1: item.get('postalAddressLine1'),
                postalAddressLine2: item.get('postalAddressLine2'),
                city: item.get('city'),
                stateArea: item.get('stateArea'),
                postalCode: item.get('postalcode'), // postalCode to postalcode
                taxResidence: item.get('taxResidence'),
                registrationNum: item.get('registrationNum'),
                supervisoryAuthority: item.get('supervisoryAuthority'),
                numSiretOrSiren: item.get('numSIRETorSIREN'),   // numSiretOrSiren to numSIRETorSIREN
                creationDate: item.get('creationDate'),
                shareCapital: item.get('shareCapital'),
                commercialContact: item.get('commercialContact'),
                operationalContact: item.get('operationalContact'),
                directorContact: item.get('directorContact'),
                lei: item.get('lei'),
                bic: item.get('bic'),
                giinCode: item.get('giinCode'),
                logoName: item.get('logoName'),
                logoURL: item.get('logoURL'),
            };
            return result;
        },
        {}));

    return companyDetailList.toJS();
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {managementCompanyListReducer}
 */
function handleSetRequested(state: managementCompanyListState, action: Action): managementCompanyListState {
    const requested = true;

    return Object.assign({}, state, {
        requested,
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {managementCompanyListReducer}
 */
function handleClearRequested(state: managementCompanyListState, action: Action): managementCompanyListState {
    const requested = false;

    return Object.assign({}, state, {
        requested,
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {managementCompanyListReducer}
 */
function handleSetINVRequested(state: invManagementCompanyListState, action: Action): invManagementCompanyListState {
    const invRequested = true;

    return Object.assign({}, state, {
        invRequested,
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {managementCompanyListReducer}
 */
function handleClearINVRequested(state: invManagementCompanyListState, action: Action): invManagementCompanyListState {
    const invRequested = false;

    return Object.assign({}, state, {
        invRequested,
    });
}
