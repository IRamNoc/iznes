/* Core/Redux imports. */
import {Action} from 'redux';
/* Local types. */
import {UserTourInProgressState} from './model';
import * as ofiUserTourInProgressActions from './actions';
import {List} from 'immutable';
import {fromJS, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: UserTourInProgressState  = {
    inProgress: false,
};

/* Reducer. */
export const UserTourInProgressReducer = (state: UserTourInProgressState  = initialState, action: Action) => {
    switch (action.type) {
        case ofiUserTourInProgressActions.SET_USERTOUR_INPROGRESS:
            return handleInProgress(state, action);

        default:
            return state;
    }
};

const handleInProgress = (state, action) => {
    const data = _.get(action, 'data', {});

    const inProgress = data;
    return Object.assign({}, state, {
        inProgress,
    });
};