import {Action} from 'redux';
import * as ManagementCompanyActions from './actions';
import {ManagementCompanyListState} from './model';
import _ from 'lodash';


const initialState: ManagementCompanyListState = {
    managementCompanyList: {},
    requested: false
};

export const ManagementCompanyListReducer = function (state: ManagementCompanyListState = initialState, action: Action) {

    let newState = {};

    switch (action.type) {
        case ManagementCompanyActions.SET_MANAGEMENT_COMPANY_LIST:

            const mcData = _.get(action, 'payload[1].Data[0]', {});

            const companyID = _.get(mcData, 'companyID', '');
            const companyName = _.get(mcData, 'companyName', '');
            const country = _.get(mcData, 'country', '');
            const addressPrefix = _.get(mcData, 'addressPrefix', '');
            const postalAddressLine1 = _.get(mcData, 'postalAddressLine1', '');
            const postalAddressLine2 = _.get(mcData, 'postalAddressLine2', '');
            const city = _.get(mcData, 'city', '');
            const stateArea = _.get(mcData, 'stateArea', '');
            const postalCode = _.get(mcData, 'postalCode', '');
            const taxResidence = _.get(mcData, 'taxResidence', '');
            const registrationNum = _.get(mcData, 'registrationNum', '');
            const supervisoryAuthority = _.get(mcData, 'supervisoryAuthority', '');
            const numSiretOrSiren = _.get(mcData, 'numSiretOrSiren', '');
            const creationDate = _.get(mcData, 'creationDate', '');
            const shareCapital = _.get(mcData, 'shareCapital', '');
            const commercialContact = _.get(mcData, 'commercialContact', '');
            const operationalContact = _.get(mcData, 'operationalContact', '');
            const directorContact = _.get(mcData, 'directorContact', '');
            const lei = _.get(mcData, 'lei', '');
            const bic = _.get(mcData, 'bic', '');
            const giinCode = _.get(mcData, 'giinCode', '');
            const logoName = _.get(mcData, 'logoName', '');
            const logoURL = _.get(mcData, 'logoURL', '');

            newState = Object.assign({}, state, {
                companyID,
                companyName,
                country,
                addressPrefix,
                postalAddressLine1,
                postalAddressLine2,
                city,
                stateArea,
                postalCode,
                taxResidence,
                registrationNum,
                supervisoryAuthority,
                numSiretOrSiren,
                creationDate,
                shareCapital,
                commercialContact,
                operationalContact,
                directorContact,
                lei,
                bic,
                giinCode,
                logoName,
                logoURL
            });

            return newState;

        default:
            return state;
    }
};
