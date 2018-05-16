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
    baseCentralizationHistory: {},
    centralizationHistory: {},
    requested: false,
};

/* Reducer. */
export const OfiCentralizationReportsListReducer = function (state: CentralizationReports = initialState, action: Action) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiCentralizationReportsActions.OFI_SET_CENTRALIZATION_REPORTS_LIST:
            const data1 = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            if (data1.Status !== 'Fail') {
                const centralizationReportsList = formatCentralizationReportsDataResponse(data1);
                return Object.assign({}, state, {
                    centralizationReportsList
                });
            }
            return state;
        case ofiCentralizationReportsActions.OFI_SET_BASE_CENTRALIZATION_HISTORY:
            const data2 = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            if (data2.Status !== 'Fail') {
                const baseCentralizationHistory = formatBaseCentralizationHistoryDataResponse(data2);
                return Object.assign({}, state, {
                    baseCentralizationHistory
                });
            }
            return state;
        case ofiCentralizationReportsActions.OFI_SET_CENTRALIZATION_HISTORY:
            const data3 = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            if (data3.Status !== 'Fail') {
                const centralizationHistory = formatCentralizationHistoryDataResponse(data3);
                return Object.assign({}, state, {
                    centralizationHistory
                });
            }else{
                const centralizationHistory = {};
                return Object.assign({}, state, {
                    centralizationHistory
                });
            }

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
                aum: item.get('aum'),
                subCutoffDate: item.get('subCutoffDate'),
                redCutoffDate: item.get('redCutoffDate'),
                fundShareID: item.get('fundShareID'),
                fundShareName: item.get('fundShareName'),
                isin: item.get('isin'),
                latestNav: item.get('latestNav'),
                navDate: item.get('navDate'),
                netPosition: item.get('netPosition'),
                netPositionPercentage: item.get('netPositionPercentage'),
                redAmount: item.get('redAmount'),
                redQuantity: item.get('redQuantity'),
                redSettlementDate: item.get('redSettlementDate'),
                shareClassCurrency: item.get('shareClassCurrency'),
                subAmount: item.get('subAmount'),
                subQuantity: item.get('subQuantity'),
                subSettlementDate: item.get('subSettlementDate'),
            };
            i++;
            return result;
        },
        {}));

    return centralizationReportsList.toJS();
}

function formatBaseCentralizationHistoryDataResponse(rawData: Array<any>): Array<CentralizationReportsDetails> {

    const rawDataList = fromJS(rawData);

    let i = 0;
    const data = Map(rawDataList.reduce(
        function (result, item) {
            result[i] = {
                fundName: item.get('fundName'),
                fundShareName: item.get('fundShareName'),
                isin: item.get('isin'),
                shareClassCurrency: item.get('shareClassCurrency'),
                umbrellaFundName: item.get('umbrellaFundName'),
            };
            i++;
            return result;
        },
        {}));

    return data.toJS();
}

function formatCentralizationHistoryDataResponse(rawData: Array<any>): Array<CentralizationReportsDetails> {

    const rawDataList = fromJS(rawData);

    let i = 0;
    const data = Map(rawDataList.reduce(
        function (result, item) {
            result[i] = {
                walletID: item.get('walletID'),
                latestNav: item.get('latestNav'),
                navDate: item.get('navDate'),
                latestNavBackup: item.get('latestNavBackup'),
                navDateBackup: item.get('navDateBackup'),
                subQuantity: item.get('subQuantity'),
                subAmount: item.get('subAmount'),
                subSettlementDate: item.get('subSettlementDate'),
                redQuantity: item.get('redQuantity'),
                redAmount: item.get('redAmount'),
                redSettlementDate: item.get('redSettlementDate'),
                subCutoffDate: item.get('subCutoffDate'),
                redCutoffDate: item.get('redCutoffDate'),
                aum: item.get('aum'),
                netPosition: item.get('netPosition'),
                netPositionPercentage: item.get('netPositionPercentage'),
            };
            i++;
            return result;
        },
        {}));

    return data.toJS();
}

function toggleRequestState(state: CentralizationReports, requested: boolean): CentralizationReports {
    return Object.assign({}, state, {requested});
}