/* Core/Redux imports. */
import {Action} from 'redux';

/* Local types. */
import {AmHolders, AmHoldersDetails} from './model';
import * as ofiAmHoldersActions from './actions';
import {immutableHelper} from '@setl/utils';
import {List, fromJS, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: AmHolders = {
    amHoldersList: {},
    requested: false,
};

/* Reducer. */
export const OfiAmHoldersListReducer = function (state: AmHolders = initialState, action: Action) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiAmHoldersActions.OFI_SET_AM_HOLDERS_LIST:

            const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            if (data.Status !== 'Fail' && data.Message !== 'No holders found') {
                const list = formatDataResponse(data);
                return Object.assign({}, state, {
                    list
                });
            }
            return state;

        case ofiAmHoldersActions.OFI_SET_REQUESTED_AM_HOLDERS:
            return toggleRequestState(state, true);

        case ofiAmHoldersActions.OFI_CLEAR_REQUESTED_AM_HOLDERS:
            return toggleRequestState(state, false);

        /* Default. */
        default:
            return state;
    }
};

function formatDataResponse(rawData: Array<any>): Array<AmHoldersDetails> {
    const rawDataList = fromJS(rawData);
    let i = 0;

    const response = Map(rawDataList.reduce(
        function (result, item) {
            result[i] = {
                fundId: item.get('fundId'),
                fundName: item.get('fundName'),
                fundLei: item.get('fundLei'),
                fundCurrency: item.get('fundCurrency'),
                fundAum: item.get('fundAum'),
                fundHolderNumber: item.get('fundHolderNumber'),
                shareId: item.get('shareId'),
                shareName: item.get('shareName'),
                shareIsin: item.get('shareIsin'),
                shareNav: item.get('shareNav'),
                shareUnitNumber: item.get('shareUnitNumber'),
                shareCurrency: item.get('shareCurrency'),
                shareAum: item.get('shareAum'),
                shareHolderNumber: item.get('shareHolderNumber'),
                shareRatio: item.get('shareRatio'),
            };
            i++;
            return result;
        },
        {}));

    return response.toJS();
}

function toggleRequestState(state: AmHolders, requested: boolean): AmHolders {
    return Object.assign({}, state, {requested});
}