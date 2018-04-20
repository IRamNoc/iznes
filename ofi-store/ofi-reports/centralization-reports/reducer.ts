/* Core/Redux imports. */
import {Action} from 'redux';

/* Local types. */
import {CentralizationReports, CentralizationReportsDetails} from './model';
import * as ofiCentralizationReportsActions from './actions';
import {immutableHelper} from '@setl/utils';
import {List, fromJS, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: CentralizationReports = {
    centralizationReportsList: {},
    requested: false,
};

/* Reducer. */
export const OfiCentralizationReportsListReducer = function (state: CentralizationReports = initialState, action: Action) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiCentralizationReportsActions.OFI_SET_CENTRALIZATION_REPORTS_LIST:
            // return ofiSetOrderList(state, action);

            const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            if (data.Status !== 'Fail') {
                const centralizationReportsList = formatCentralizationReportsDataResponse(data);
                return Object.assign({}, state, {
                    centralizationReportsList
                });
            }
            return state;

        case ofiCentralizationReportsActions.OFI_SET_REQUESTED_CENTRALIZATION_REPORTS:
            return toggleRequestState(state, true);

        case ofiCentralizationReportsActions.OFI_CLEAR_REQUESTED_CENTRALIZATION_REPORTS:
            return toggleRequestState(state, false);

        /* Default. */
        default:
            return state;
    }
};

function formatCentralizationReportsDataResponse(rawData: Array<any>): Array<CentralizationReportsDetails> {
    const rawDataList = fromJS(rawData);

    let i = 0;

    const centralizationReportsList = Map(rawDataList.reduce(
        function (result, item) {
            result[i] = {
                cutoffDate: item.get('cutoffDate'),
                fundShareID: item.get('fundShareID'),
                fundShareName: item.get('fundShareName'),
                isin: item.get('isin'),
                latestNav: item.get('latestNav'),
                latestNavBackup: item.get('latestNavBackup'),
                navDate: item.get('navDate'),
                navDateBackup: item.get('navDateBackup'),
                redAmount: item.get('redAmount'),
                redQuantity: item.get('redQuantity'),
                settlementDate: item.get('settlementDate'),
                shareClassCurrency: item.get('shareClassCurrency'),
                subAmount: item.get('subAmount'),
                subQuantity: item.get('subQuantity'),
            };
            i++;
            return result;
        },
        {}));

    return centralizationReportsList.toJS();
}

function toggleRequestState(state: CentralizationReports, requested: boolean): CentralizationReports {
    return Object.assign({}, state, {requested});
}