import { Action } from 'redux';
import * as FundActions from './actions';
import { FundDetail, FundListState, IznesFundDetail } from './model';
import * as _ from 'lodash';
import { fromJS, Map } from 'immutable';

const initialState: FundListState = {
    fundList: {},
    requested: false,
    iznFundList: {},
    requestedIznesFund: false,
    audit: {},
};

export const FundListReducer = function (state: FundListState = initialState, action: Action) {
    switch (action.type) {
    case FundActions.SET_FUND_LIST:

        const fdata = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

        const fundList = formatFundDataResponse(fdata);
        return Object.assign({}, state, {
            fundList,
        });

    case FundActions.SET_FUND_SHARE_LIST:

        const fsdata = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

        const fundShareList = formatFundshareDataResponse(fsdata);
        return Object.assign({}, state, {
            fundShareList,
        });

    case FundActions.SET_REQUESTED_FUND:
        return handleSetRequested(state, action);

    case FundActions.CLEAR_REQUESTED_FUND:
        return handleClearRequested(state, action);

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

function formatFundDataResponse(rawFundData: Array<any>): Array<FundDetail> {

    const rawFundDataList = fromJS(rawFundData);

    const fundDetailList = Map(rawFundDataList.reduce(
        function (result, item) {
            result[item.get('fundID')] = {
                fundID: item.get('fundID'),
                draft: item.get('draft'),
                fundName: item.get('fundName'),
                fundProspectus: item.get('fundProspectus'),
                fundReport: item.get('fundReport'),
                fundLei: item.get('fundLei'),
                fundSICAVID: item.get('fundSICAVID'),
            };
            return result;
        },
        {}));

    return fundDetailList.toJS();
}

function formatFundshareDataResponse(rawFundShareData: Array<any>): Array<FundDetail> {
    const rawFundShareDataList = fromJS(rawFundShareData);

    const fundShareDetailList = Map(rawFundShareDataList.reduce(
        function (result, item) {
            result[item.get('fundID')] = {
                // fundID: item.get('fundID'),
                // fundName: item.get('fundName'),
                // fundProspectus: item.get('fundProspectus'),
                // fundReport: item.get('fundReport'),
                // fundLei: item.get('fundLei'),
                // fundSICAVID: item.get('fundSICAVID'),
            };
            return result;
        },
        {}));

    return fundShareDetailList.toJS();
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {FundListReducer}
 */
function handleSetRequested(state: FundListState, action: Action): FundListState {
    const requested = true;

    return Object.assign({}, state, {
        requested,
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {FundListReducer}
 */
function handleClearRequested(state: FundListState, action: Action): FundListState {
    const requested = false;

    return Object.assign({}, state, {
        requested,
    });
}

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

    const iznFundList = data.reduce((sum, fund) => {
        const principlePromoterID = (fund.principlePromoterID) ? JSON.parse(fund.principlePromoterID) : null;
        const payingAgentID = (fund.payingAgentID) ? JSON.parse(fund.payingAgentID) : null;
        const investmentAdvisorID = (fund.investmentAdvisorID) ? JSON.parse(fund.investmentAdvisorID) : null;

        const fundData: IznesFundDetail = {
            ..._.omit(fund, ['Status']),
            fundCreationDate: fund.fundCreationDate !== null ? fund.fundCreationDate.substr(0, 10) : null,
            fundLaunchate: fund.fundLaunchate !== null ? fund.fundLaunchate.substr(0, 10) : null,
            fiscalYearEnd: fund.fiscalYearEnd !== null ? fund.fiscalYearEnd.substr(0, 7) : null,
            principlePromoterID,
            payingAgentID,
            investmentAdvisorID,
        };

        return {
            ...sum,
            [fund.fundID]: fundData,
        };
    },                              {});

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
    return {
        ...state,
        audit: {
            ...state.audit,
            [data[0].fundID]: data,
        },
    };
}
