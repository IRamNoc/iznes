import {Action} from 'redux';
import * as ManagementCompanyActions from './actions';
import {ManagementCompanyDetail, ManagementCompanyListState} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';


const initialState: ManagementCompanyListState = {
    managementCompanyList: {},
    requested: false
};

export const ManagementCompanyListReducer = function (state: ManagementCompanyListState = initialState, action: Action) {

    let newState = {};

    switch (action.type) {
        case ManagementCompanyActions.SET_MANAGEMENT_COMPANY_LIST:

            const mcData = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            console.log('companyList[] reducer', mcData[0]);

            const managementCompanyList = formatManagementCompanyDataResponse(mcData);

            const newState = Object.assign({}, state, {
                managementCompanyList
            });

            return newState;

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
                addressPrefix: item.get('addressPrefix'),
                postalAddressLine1: item.get('postalAddressLine1'),
                postalAddressLine2: item.get('postalAddressLine2'),
                city: item.get('city'),
                stateArea: item.get('stateArea'),
                postalCode: item.get('postalCode'),
                taxResidence: item.get('taxResidence'),
                registrationNum: item.get('registrationNum'),
                supervisoryAuthority: item.get('supervisoryAuthority'),
                numSiretOrSiren: item.get('numSiretOrSiren'),
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