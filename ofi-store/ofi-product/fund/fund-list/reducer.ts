import {Action} from 'redux';
import * as FundActions from './actions';
import {FundDetail, FundListState} from './model';
import * as _ from 'lodash';
import {List, fromJS, Map} from 'immutable';


const initialState: FundListState = {
    fundList: {},
    requested: false
};

export const FundListReducer = function (state: FundListState = initialState, action: Action) {

    switch (action.type) {
        case FundActions.SET_FUND_LIST:

            const fdata = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            const fundList = formatFundDataResponse(fdata);
            return Object.assign({}, state, {
                fundList
            });

        case FundActions.SET_FUND_SHARE_LIST:

            const fsdata = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            const fundShareList = formatFundshareDataResponse(fsdata);
            return Object.assign({}, state, {
                fundShareList
            });

        case FundActions.SET_REQUESTED_FUND:
            return handleSetRequested(state, action);

        case FundActions.CLEAR_REQUESTED_FUND:
            return handleClearRequested(state, action);

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
    // console.log('reducer fundShare', rawFundShareData);
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
        requested
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
        requested
    });
}
