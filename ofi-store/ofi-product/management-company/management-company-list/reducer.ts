import {Action} from 'redux';
import * as ManagementCompanyActions from './actions';
import {ManagementCompanyDetail, ManagementCompanyListState} from './model';
import * as _ from 'lodash';
import {List, fromJS, Map} from 'immutable';


const initialState: ManagementCompanyListState = {
    managementCompanyList: {},
    requested: false
};

export const ManagementCompanyListReducer = function (state: ManagementCompanyListState = initialState, action: Action) {

    switch (action.type) {
        case ManagementCompanyActions.SET_MANAGEMENT_COMPANY_LIST:

            const mcData = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]
            const managementCompanyList = formatManagementCompanyDataResponse(mcData);
            const newState = Object.assign({}, state, {
                managementCompanyList
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
 * @return {ManagementCompanyListReducer}
 */
function handleSetRequested(state: ManagementCompanyListState, action: Action): ManagementCompanyListState {
    const requested = true;

    return Object.assign({}, state, {
        requested
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {ManagementCompanyListReducer}
 */
function handleClearRequested(state: ManagementCompanyListState, action: Action): ManagementCompanyListState {
    const requested = false;

    return Object.assign({}, state, {
        requested
    });
}
