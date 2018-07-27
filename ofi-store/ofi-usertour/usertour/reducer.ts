/* Core/Redux imports. */
import {Action} from 'redux';
/* Local types. */
import {MySubPortfoliosDetails, UserTourState} from './model';
import * as ofiShareHoldersActions from './actions';
import {List} from 'immutable';
import {fromJS, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: UserTourState = {
    mySubPortfolios: List<MySubPortfoliosDetails>(),
    mySubPortfoliosRequested: false,
};

/* Reducer. */
export const UserTourReducer = (state: UserTourState = initialState, action: Action) => {
    switch (action.type) {
        case ofiShareHoldersActions.OFI_SET_MY_SUBPORTFOLIOS:
            return handleMySubPortfolios(state, action);

        case ofiShareHoldersActions.OFI_SET_MY_SUBPORTFOLIOS_REQUESTED:
            return toggleRequestMySubportfolios(state, true);

        case ofiShareHoldersActions.OFI_CLEAR_MY_SUBPORTFOLIOS_REQUESTED:
            return toggleRequestMySubportfolios(state, false);

        default:
            return state;
    }
};

const handleMySubPortfolios = (state, action) => {
    const data = _.get(action, 'payload[1].Data', {});    // use [] not {} for list and Data not Data[0]

    if (data.Status !== 'Fail') {
        const mySubPortfolios = formatDataResponse(data);
        return Object.assign({}, state, {
            mySubPortfolios,
        });
    }

    return state;
};

const formatDataResponse = (rawData: Array<MySubPortfoliosDetails>): List<MySubPortfoliosDetails> => {
    let response: List<MySubPortfoliosDetails> = List();
    rawData.forEach((item) => {
        const items = {
            isDone: item.isDone || false,
        };
        response = response.push(items);
    });
    return response;
};

function toggleRequestMySubportfolios(state: UserTourState, mySubPortfoliosRequested: boolean): UserTourState {
    return Object.assign({}, state, {mySubPortfoliosRequested});
}
