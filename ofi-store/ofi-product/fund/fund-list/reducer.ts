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

            const fundData: IznesFundDetail = {
                ..._.omit(fund, ['Status']),
                fundCreationDate: fund.fundCreationDate !== null ? fund.fundCreationDate.substr(0, 10) : null,
                fundLaunchate: fund.fundLaunchate !== null ? fund.fundLaunchate.substr(0, 10) : null,
                fiscalYearEnd: fund.fiscalYearEnd !== null ? fund.fiscalYearEnd : null,
                principlePromoterID,
                payingAgentID,
                investmentAdvisorID,
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
