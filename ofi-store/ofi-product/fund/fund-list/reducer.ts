import { Action } from 'redux';
import * as moment from 'moment';
import * as FundActions from './actions';
import { FundListState, IznesFundDetail } from './model';
import * as _ from 'lodash';
import { fromJS, Map } from 'immutable';

const initialState: FundListState = {
    iznFundList: {},
    requestedIznesFund: false,
    audit: {},
};

export const FundListReducer = function (state: FundListState = initialState, action: Action) {
    switch (action.type) {
        case FundActions.SET_REQUESTED_IZN_FUNDS:
            return handleSetIznesFundsRequested(state);

        case FundActions.CLEAR_REQUESTED_IZN_FUNDS:
            return clearSetIznesFundsRequested(state);

        case FundActions.GET_IZN_FUND_LIST:
            return handleGetIznesFunds(state, action);

        case FundActions.SET_FUND_AUDIT:
            return handleSetFundAudit(state, action);

        default:
            return state;
    }
};

function handleSetIznesFundsRequested(state: FundListState): FundListState {
    return Object.assign({}, state, {
        requestedIznesFund: true,
    });
}

function clearSetIznesFundsRequested(state: FundListState): FundListState {
    return Object.assign({}, state, {
        requestedIznesFund: false,
    });
}

function handleGetIznesFunds(state: FundListState, action: Action): any {
    const data = _.get(action, 'payload[1].Data', []);

    const iznFundList = data.reduce(
        (sum, fund) => {
            const principlePromoterID = (fund.principlePromoterID) ? JSON.parse(fund.principlePromoterID) : null;
            const payingAgentID = (fund.payingAgentID) ? JSON.parse(fund.payingAgentID) : null;
            const investmentAdvisorID = (fund.investmentAdvisorID) ? JSON.parse(fund.investmentAdvisorID) : null;

            let fiscalYearEnd = null;

            // Get fund.fiscalYearEnd in MM-DD format
            if (fund.fiscalYearEnd !== null) {
                if (fund.fiscalYearEnd.length === 19) { // e.g. '2018-05-01 00:00:00'
                    fiscalYearEnd = fund.fiscalYearEnd.substr(5, 5); // '05-01'
                } else if (fund.fiscalYearEnd.length === 5) { // e.g. '05-01'
                    fiscalYearEnd = fund.fiscalYearEnd; // '05-01'
                }
            }

            // TODO: delete temp values
            const registerOfficeAddressLine2 = null;
            const registerOfficeAddressZipCode = null;
            const registerOfficeAddressCity = null;
            const registerOfficeAddressCountry = null;

            const fundData: IznesFundDetail = {
                ..._.omit(fund, ['Status']),
                fundCreationDate: fund.fundCreationDate !== null ? fund.fundCreationDate.substr(0, 10) : null,
                fundLaunchate: fund.fundLaunchate !== null ? fund.fundLaunchate.substr(0, 10) : null,
                fiscalYearEnd,
                principlePromoterID,
                payingAgentID,
                investmentAdvisorID,
                registerOfficeAddressLine2, // TODO: remove temp value
                registerOfficeAddressZipCode, // TODO: remove temp value
                registerOfficeAddressCity, // TODO: remove temp value
                registerOfficeAddressCountry, // TODO: remove temp value
            };

            return {
                ...sum,
                [fund.fundID]: fundData,
            };
        },
        {},
    );

    return {
        ...state,
        iznFundList,
    };
}

function handleSetFundAudit(state: FundListState, action): FundListState {
    const data = _.get(action.payload, [1, 'Data']);
    if (!data.length) {
        return state;
    }

    const offset = new Date().getTimezoneOffset();

    return {
        ...state,
        audit: {
            ...state.audit,
            [data[0].fundID]: data.map((audit) => {
                return {
                    ...audit,
                    dateModified: moment(audit.dateModified)
                        .subtract(offset, 'minutes')
                        .format('YYYY-MM-DD HH:mm:ss'),
                };
            }),
        },
    };
}
