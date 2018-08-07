/* Core/Redux imports. */
import {Action} from 'redux';
/* Local types. */
import {UserToursDetails, UserTourState} from './model';
import * as ofiUserToursActions from './actions';
import {List} from 'immutable';
import {fromJS, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: UserTourState = {
    userTours: null,
    userToursRequested: false,
};

/* Reducer. */
export const UserTourReducer = (state: UserTourState = initialState, action: Action) => {
    switch (action.type) {
        case ofiUserToursActions.OFI_SET_USER_TOURS:
            return handleUserTours(state, action);

        case ofiUserToursActions.OFI_SET_USER_TOURS_REQUESTED:
            return toggleRequestUserTours(state, true);

        case ofiUserToursActions.OFI_CLEAR_USER_TOURS_REQUESTED:
            return toggleRequestUserTours(state, false);

        default:
            return state;
    }
};

const handleUserTours = (state, action) => {
    const data = _.get(action, 'payload[1].Data', {});    // use [] not {} for list and Data not Data[0]

    if (data.Status !== 'Fail') {
        const userTours = (data.length > 0) ? formatDataResponse(data) : null;
        return Object.assign({}, state, {
            userTours,
        });
    }

    return state;
};

const formatDataResponse = (rawData: Array<UserToursDetails>): List<UserToursDetails> => {
    let response: List<UserToursDetails> = List();
    rawData.forEach((item) => {
        const items = {
            type: item.type || '',
            value: item.value || 0,
            walletID: item.walletID || 0,
        };
        response = response.push(items);
    });
    return response;
};

function toggleRequestUserTours(state: UserTourState, userToursRequested: boolean): UserTourState {
    return Object.assign({}, state, {userToursRequested});
}
