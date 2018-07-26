/* Core/Redux imports. */
import {Action} from 'redux';

/* Local types. */
import {PrecentralizationReports, PrecentralizationReportsSharesDetails} from './model';
import * as precentralizationReportsActions from './actions';
import {immutableHelper} from '@setl/utils';
import {List, fromJS, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: PrecentralizationReports = {
    fundsDetailsList: {},
    fundsList: {},
    requestedFundsList: false,
    sharesDetailsList: {},
    sharesList: {},
    requestedSharesList: false,
};

/* Reducer. */
export const PrecentralizationReportsListReducer = function (state: PrecentralizationReports = initialState, action: Action) {
    switch (action.type) {
        /* Set Coupon List. */
        case precentralizationReportsActions.SET_PRECENTRA_FUNDS_DETAILS_LIST:
            const data1 = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            if (data1.Status !== 'Fail') {
                const fundsDetailsList = data1;
                return Object.assign({}, state, {
                    fundsDetailsList
                });
            }
            return state;

        case precentralizationReportsActions.SET_PRECENTRA_FUNDS_LIST:
            const data2 = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            if (data2.Status !== 'Fail') {
                const fundsList = formatPrecentralizationFundsListDataResponse(data2);
                return Object.assign({}, state, {
                    fundsList
                });
            }
            return state;

        case precentralizationReportsActions.SET_REQUESTED_PRECENTRA_FUNDS_LIST:
            return toggleRequestStateFundsList(state, true);

        case precentralizationReportsActions.CLEAR_REQUESTED_PRECENTRA_FUNDS_LIST:
            return toggleRequestStateFundsList(state, false);

        case precentralizationReportsActions.SET_PRECENTRA_SHARES_DETAILS_LIST:
            const data3 = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            if (data3.Status !== 'Fail') {
                const sharesDetailsList = data3;
                return Object.assign({}, state, {
                    sharesDetailsList
                });
            }
            return state;

        case precentralizationReportsActions.SET_PRECENTRA_SHARES_LIST:
            const data4 = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            if (data4.Status !== 'Fail') {
                const sharesList = formatPrecentralizationSharesListDataResponse(data4);
                return Object.assign({}, state, {
                    sharesList
                });
            }
            return state;

        case precentralizationReportsActions.SET_REQUESTED_PRECENTRA_SHARES_LIST:
            return toggleRequestStateSharesList(state, true);

        case precentralizationReportsActions.CLEAR_REQUESTED_PRECENTRA_SHARES_LIST:
            return toggleRequestStateSharesList(state, false);

        /* Default. */
        default:
            return state;
    }
};

function formatPrecentralizationFundsDetailsListDataResponse(rawData: Array<any>): Array<PrecentralizationReportsSharesDetails> {
    const rawDataList = fromJS(rawData);

    let i = 0;

    const fundsDetails = Map(rawDataList.reduce(
        function (result, item) {
            console.log(item);
            result[i] = {
                totals: item.get('totals'),
                shares: item.get('shares'),
            };
            i++;
            return result;
        },
        {}));

    return fundsDetails.toJS();
}

function formatPrecentralizationSharesDetailsListDataResponse(rawData: Array<any>): Array<PrecentralizationReportsSharesDetails> {
    const rawDataList = fromJS(rawData);

    let i = 0;

    const sharesDetails = Map(rawDataList.reduce(
        function (result, item) {
            console.log(item);
            result[i] = {
                totals: item.get('totals'),
                shares: item.get('shares'),
            };
            i++;
            return result;
        },
        {}));

    return sharesDetails.toJS();
}

function formatPrecentralizationFundsListDataResponse(rawData: Array<any>): Array<PrecentralizationReportsSharesDetails> {
    const rawDataList = fromJS(rawData);

    let i = 0;

    const fundsList = Map(rawDataList.reduce(
        function (result, item) {
            result[i] = {
                fundId: item.get('fundId'),
                fundName: item.get('fundName'),
                lei: item.get('lei'),
            };
            i++;
            return result;
        },
        {}));

    return fundsList.toJS();
}

function formatPrecentralizationSharesListDataResponse(rawData: Array<any>): Array<PrecentralizationReportsSharesDetails> {
    const rawDataList = fromJS(rawData);

    let i = 0;

    const sharesList = Map(rawDataList.reduce(
        function (result, item) {
            result[i] = {
                shareId: item.get('shareId'),
                shareName: item.get('shareName'),
                isin: item.get('isin'),
            };
            i++;
            return result;
        },
        {}));

    return sharesList.toJS();
}

function toggleRequestStateFundsList(state: PrecentralizationReports, requestedFundsList: boolean): PrecentralizationReports {
    return Object.assign({}, state, {requestedFundsList});
}

function toggleRequestStateSharesList(state: PrecentralizationReports, requestedSharesList: boolean): PrecentralizationReports {
    return Object.assign({}, state, {requestedSharesList});
}