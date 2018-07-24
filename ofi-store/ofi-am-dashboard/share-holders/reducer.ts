/* Core/Redux imports. */
import {Action} from 'redux';
/* Local types. */
import {FundsByUserDetails, FundWithHoldersDetails, OfiShareHoldersState} from './model';
import * as ofiShareHoldersActions from './actions';
import {List} from 'immutable';
import {fromJS, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: OfiShareHoldersState = {
    fundsByUserList: List<FundsByUserDetails>(),
    fundsByUserRequested: false,
    fundWithHoldersList: List<FundWithHoldersDetails>(),
    fundWithHoldersRequested: false,
};

/* Reducer. */
export const OfiShareHoldersListReducer = (state: OfiShareHoldersState = initialState, action: Action) => {
    switch (action.type) {
        case ofiShareHoldersActions.OFI_SET_FUNDS_BY_USER_LIST:
            return handleGetShareHolders(state, action);

        case ofiShareHoldersActions.OFI_SET_FUNDS_BY_USER_REQUESTED:
            return toggleRequestState(state, true);

        case ofiShareHoldersActions.OFI_CLEAR_FUNDS_BY_USER_REQUESTED:
            return toggleRequestState(state, false);

        case ofiShareHoldersActions.OFI_SET_FUNDS_WITH_HOLDERS_LIST:
            return handleGetFundWithHolders(state, action);

        case ofiShareHoldersActions.OFI_SET_FUNDS_WITH_HOLDERS_REQUESTED:
            return toggleRequestState2(state, true);

        case ofiShareHoldersActions.OFI_CLEAR_FUNDS_WITH_HOLDERS_REQUESTED:
            return toggleRequestState2(state, false);

        default:
            return state;
    }
};

const handleGetShareHolders = (state, action) => {
    const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

    if (data.Status !== 'Fail') {
        const fundsByUserList = formatDataResponse(data);
        return Object.assign({}, state, {
            fundsByUserList,
        });
    }

    return state;
};

const handleGetFundWithHolders = (state, action) => {
    const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]
    if (data.Status !== 'Fail') {
        const fundWithHoldersList = new Array(data);
        return Object.assign({}, state, {
            fundWithHoldersList,
        });
    }

    return state;
};

const formatDataResponse = (rawData: Array<FundsByUserDetails>): List<FundsByUserDetails> => {
    let response: List<FundsByUserDetails> = List();
    rawData.forEach((item) => {
        const items = {
            fundId: item.fundId,
            fundName: item.fundName,
            fundLei: item.fundLei || '',
        };
        response = response.push(items);
    });
    return response;
};

function toggleRequestState(state: OfiShareHoldersState, fundsByUserRequested: boolean): OfiShareHoldersState {
    return Object.assign({}, state, {fundsByUserRequested});
}

function toggleRequestState2(state: OfiShareHoldersState, fundWithHoldersRequested: boolean): OfiShareHoldersState {
    return Object.assign({}, state, {fundWithHoldersRequested});
}
