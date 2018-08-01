/* Core/Redux imports. */
import {Action} from 'redux';
/* Local types. */
import {UserToursDetails, UserTourState} from './model';
import * as ofiShareHoldersActions from './actions';
import {List} from 'immutable';
import {fromJS, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: UserTourState = {
    userTours: List<UserToursDetails>(),
    userToursRequested: false,
};

/* Reducer. */
export const UserTourReducer = (state: UserTourState = initialState, action: Action) => {
    switch (action.type) {
        case ofiShareHoldersActions.OFI_SET_USER_TOURS:
            return handleUserTours(state, action);

        case ofiShareHoldersActions.ofiSetUserToursRequested:
            return toggleRequestUserTours(state, true);

        case ofiShareHoldersActions.ofiClearUserToursRequested:
            return toggleRequestUserTours(state, false);

        default:
            return state;
    }
};

const handleUserTours = (state, action) => {
    const data = _.get(action, 'payload[1].Data', {});    // use [] not {} for list and Data not Data[0]

    if (data.Status !== 'Fail') {
        const userTours = formatDataResponse(data);
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
            walletID: item.walletID || false,
        };
        response = response.push(items);
    });
    return response;
};

function toggleRequestUserTours(state: UserTourState, userToursRequested: boolean): UserTourState {
    return Object.assign({}, state, {userToursRequested});
}
