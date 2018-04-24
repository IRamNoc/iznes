import {Action} from 'redux';
import * as UmbrellaFundActions from './actions';
import {UmbrellaFundDetail, UmbrellaFundListState} from './model';
import * as _ from 'lodash';
import {fromJS, Map} from 'immutable';


const initialState: UmbrellaFundListState = {
    umbrellaFundList: {},
    requested: false
};

export const UmbrellaFundListReducer = function (state: UmbrellaFundListState = initialState, action: Action) {

    switch (action.type) {
        case UmbrellaFundActions.SET_UMBRELLA_FUND_LIST:

            const ufdata = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            const umbrellaFundList = formatUmbrellaFundDataResponse(ufdata);
            return Object.assign({}, state, {
                umbrellaFundList
            });

        case UmbrellaFundActions.SET_REQUESTED_UMBRELLA_FUND:
            return handleSetRequested(state, action);

        case UmbrellaFundActions.CLEAR_REQUESTED_UMBRELLA_FUND:
            return handleClearRequested(state, action);

        default:
            return state;
    }
};

function formatUmbrellaFundDataResponse(rawUmbrellaFundData: Array<any>): Array<UmbrellaFundDetail> {

    const rawUmbrellaFundDataList = fromJS(rawUmbrellaFundData);

    const umbrellaFundDetailList = Map(rawUmbrellaFundDataList.reduce(
        function (result, item) {
            result[item.get('umbrellaFundID')] = {
                umbrellaFundID: item.get('umbrellaFundID').toString(),
                umbrellaFundName: item.get('umbrellaFundName'),
                registerOffice: item.get('registerOffice'),
                registerOfficeAddress: item.get('registerOfficeAddress'),
                legalEntityIdentifier: item.get('legalEntityIdentifier'),
                domicile: item.get('domicile'),
                umbrellaFundCreationDate: item.get('umbrellaFundCreationDate').split(' ')[0],
                managementCompanyID: item.get('managementCompanyID', '').toString(),
                fundAdministratorID: item.get('fundAdministratorID', '').toString(),
                custodianBankID: item.get('custodianBankID', '').toString(),
                investmentAdvisorID: item.get('investmentAdvisorID', '') ? item.get('investmentAdvisorID', '').toString() : '',
                payingAgentID: item.get('payingAgentID', '') ? item.get('payingAgentID', '').toString() : '',
                transferAgentID: item.get('transferAgentID', '') ? item.get('transferAgentID', '').toString() : '',
                centralisingAgentID: item.get('centralisingAgentID', '') ? item.get('centralisingAgentID', '').toString() : '',
                giin: item.get('giin'),
                delegatedManagementCompanyID: item.get('delegatedManagementCompanyID', '') ? item.get('delegatedManagementCompanyID', '').toString() : '',
                auditorID: item.get('auditorID', '') ? item.get('auditorID', '').toString() : '',
                taxAuditorID: item.get('taxAuditorID', '') ? item.get('taxAuditorID', '').toString() : '',
                principlePromoterID: item.get('principlePromoterID', '') ? item.get('principlePromoterID', '').toString() : '',
                legalAdvisorID: item.get('legalAdvisorID', '') ? item.get('legalAdvisorID', '').toString() : '',
                directors: item.get('directors'),
                internalReference: item.get('internalReference'),
                additionnalNotes: item.get('comment'),
            };
            return result;
        },
        {}));

    return umbrellaFundDetailList.toJS();
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {UmbrellaFundListReducer}
 */
function handleSetRequested(state: UmbrellaFundListState, action: Action): UmbrellaFundListState {
    const requested = true;

    return Object.assign({}, state, {
        requested
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {UmbrellaFundListReducer}
 */
function handleClearRequested(state: UmbrellaFundListState, action: Action): UmbrellaFundListState {
    const requested = false;

    return Object.assign({}, state, {
        requested
    });
}
