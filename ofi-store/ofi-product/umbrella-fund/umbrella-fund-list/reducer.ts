import { Action } from 'redux';
import * as UmbrellaFundActions from './actions';
import { UmbrellaFundDetail, UmbrellaFundListState } from './model';
import * as _ from 'lodash';
import { fromJS, Map } from 'immutable';

const initialState: UmbrellaFundListState = {
    umbrellaFundList: {},
    requested: false,
};

export const umbrellaFundListReducer = function (state: UmbrellaFundListState = initialState, action: Action) {

    switch (action.type) {
    case UmbrellaFundActions.SET_UMBRELLA_FUND_LIST:

        const ufdata = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

        const umbrellaFundList = formatUmbrellaFundDataResponse(ufdata);
        return Object.assign({}, state, {
            umbrellaFundList,
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
        (result, item) => {
            result[item.get('umbrellaFundID')] = {
                umbrellaFundID: item.get('umbrellaFundID').toString(),
                draft: item.get('draft'),
                draftUser: item.get('draftUser'),
                draftDate: item.get('draftDate'),
                umbrellaFundName: item.get('umbrellaFundName'),
                registerOffice: item.get('registerOffice'),
                registerOfficeAddress: item.get('registerOfficeAddress'),
                legalEntityIdentifier: item.get('legalEntityIdentifier'),
                domicile: item.get('domicile'),
                umbrellaFundCreationDate: item.get('umbrellaFundCreationDate'),
                managementCompanyID: item.get('managementCompanyID'),
                fundAdministratorID: item.get('fundAdministratorID'),
                custodianBankID: item.get('custodianBankID'),
                investmentAdvisorID: JSON.parse(item.get('investmentAdvisorID')),
                payingAgentID: JSON.parse(item.get('payingAgentID')),
                transferAgentID: item.get('transferAgentID'),
                centralisingAgentID: item.get('centralisingAgentID'),
                giin: item.get('giin'),
                delegatedManagementCompanyID: item.get('delegatedManagementCompanyID'),
                auditorID: item.get('auditorID'),
                taxAuditorID: item.get('taxAuditorID'),
                principlePromoterID: JSON.parse(item.get('principlePromoterID')),
                legalAdvisorID: item.get('legalAdvisorID'),
                directors: item.get('directors'),
                internalReference: item.get('internalReference'),
                additionnalNotes: item.get('additionnalNotes'),
            };

            if (!!result[item.get('umbrellaFundID')].umbrellaFundCreationDate) {
                result[item.get('umbrellaFundID')].umbrellaFundCreationDate = result[item.get('umbrellaFundID')].umbrellaFundCreationDate.split(' ')[0];
            }

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
        requested,
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
        requested,
    });
}
