import {combineReducers, Reducer} from 'redux';

import {UserTourInProgressReducer, UserTourInProgressState} from './inprogress';
import {UserTourReducer, UserTourState} from './usertour';

export {
    SET_USERTOUR_INPROGRESS,
} from './inprogress/actions';

export {
    SET_USER_TOURS,
    setUserToursRequested,
    clearUserToursRequested,
} from './usertour/actions';

export interface UsersToursState {
    inProgress: UserTourInProgressState;
    userTours: UserTourState;
}

/* Export the comibined reducers of this branch. */
export const UsersToursReducer: Reducer<UsersToursState> = combineReducers<UsersToursState>({
    inProgress: UserTourInProgressReducer,
    userTours: UserTourReducer,
});
