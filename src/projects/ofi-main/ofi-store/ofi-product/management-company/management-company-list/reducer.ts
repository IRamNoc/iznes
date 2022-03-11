import { Action } from 'redux';
import * as ManagementCompanyActions from './actions';
import { ManagementCompanyDetail, ManagementCompanyListState, InvManagementCompanyListState } from './model';
import * as _ from 'lodash';
import { List, fromJS, Map } from 'immutable';

const initialState: ManagementCompanyListState = {
    managementCompanyList: {},
    requested: false,
};
const invInitialState: InvManagementCompanyListState = {
    investorManagementCompanyList: List<ManagementCompanyDetail>(),
    invRequested: false,
};

export const managementCompanyListReducer = function (state: ManagementCompanyListState = initialState, action: Action) {

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

export const invManagementCompanyListReducer = function (state: InvManagementCompanyListState = invInitialState, action: Action) {

    switch (action.type) {
        case ManagementCompanyActions.SET_INV_MANAGEMENT_COMPANY_LIST:
            return handleGetInvestorManagementCompanyList(state, action);

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
        (result, item) => {
            result[item.get('companyID')] = {
                companyID: item.get('companyID'),
                companyName: item.get('companyName'),
                emailAddress: item.get('emailAddress'),
                legalFormName: item.get('legalFormName'),
                country: item.get('country'),
                postalAddressLine1: item.get('postalAddressLine1'),
                postalAddressLine2: item.get('postalAddressLine2'),
                city: item.get('city'),
                postalCode: item.get('postalcode'), // postalCode to postalcode
                taxResidence: item.get('taxResidence'),
                rcsMatriculation: item.get('rcsMatriculation'),
                supervisoryAuthority: item.get('supervisoryAuthority'),
                numSiretOrSiren: item.get('numSIRETorSIREN'),   // numSiretOrSiren to numSIRETorSIREN
                shareCapital: item.get('shareCapital'),
                commercialContact: item.get('commercialContact'),
                operationalContact: item.get('operationalContact'),
                directorContact: item.get('directorContact'),
                lei: item.get('lei'),
                bic: item.get('bic'),
                giinCode: item.get('giinCode'),
                websiteUrl: item.get('websiteUrl'),
                phoneNumberPrefix: item.get('phoneNumberPrefix'),
                phoneNumber: item.get('phoneNumber'),
                logoTitle: item.get('logoTitle'),
                logoHash: item.get('logoHash'),
                signatureTitle: item.get('signatureTitle'),
                signatureHash: item.get('signatureHash'),
                externalEmail: item.get('externalEmail'),
                emailValidation: item.get('emailValidation'),
                mt502Email: item.get('mt502Email'),
                subManagementCompany1: item.get('subManagementCompany1'),
                subManagementCompany2: item.get('subManagementCompany2'),
                subManagementCompany3: item.get('subManagementCompany3'),
                subManagementCompany4: item.get('subManagementCompany4')
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
function handleSetRequested(state: ManagementCompanyListState, action: Action): ManagementCompanyListState {
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
function handleClearRequested(state: ManagementCompanyListState, action: Action): ManagementCompanyListState {
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
function handleSetINVRequested(state: InvManagementCompanyListState, action: Action): InvManagementCompanyListState {
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
function handleClearINVRequested(state: InvManagementCompanyListState, action: Action): InvManagementCompanyListState {
    const invRequested = false;

    return Object.assign({}, state, {
        invRequested,
    });
}

function handleGetInvestorManagementCompanyList(state: InvManagementCompanyListState, action): InvManagementCompanyListState {
    const response = action.payload[1].Data;
    let investorManagementCompanyList = List<any>();

    if (response.length > 0) {
        response.forEach((it) => {
            const item = Map({
                companyID: it.companyID,
                companyName: it.companyName,
                emailAddress: it.emailAddress,
                legalFormName: it.legalFormName,
                country: it.country,
                postalAddressLine1: it.postalAddressLine1,
                postalAddressLine2: it.postalAddressLine2,
                city: it.city,
                postalCode: it.postalcode,
                taxResidence: it.taxResidence,
                rcsMatriculation: it.rcsMatriculation,
                supervisoryAuthority: it.supervisoryAuthority,
                numSiretOrSiren: it.numSIRETorSIREN,
                shareCapital: it.shareCapital,
                commercialContact: it.commercialContact,
                operationalContact: it.operationalContact,
                directorContact: it.directorContact,
                lei: it.lei,
                bic: it.bic,
                giinCode: it.giinCode,
                websiteUrl: it.websiteUrl,
                phoneNumberPrefix: it.phoneNumberPrefix,
                phoneNumber: it.phoneNumber,
                logoTitle: it.logoTitle,
                logoHash: it.logoHash,
                signatureTitle: it.signatureTitle,
                signatureHash: it.signatureHash,
                isThirdPartyKyc: !!it.isThirdPartyKyc,
                managementCompanyType: it.managementCompanyType,
                externalEmail: it.externalEmail,
                emailValidation: it.emailValidation,
                mt502Email: it.mt502Email,
            });

            investorManagementCompanyList = investorManagementCompanyList.push(item);
        });
    }

    return { ...state, investorManagementCompanyList };
}
