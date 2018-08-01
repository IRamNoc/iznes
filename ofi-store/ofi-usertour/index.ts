import {combineReducers, Reducer} from 'redux';

import {UserTourInProgressReducer, UserTourInProgressState} from './inprogress';
import {UserTourReducer, UserTourState} from './usertour';

export {
    OFI_SET_USERTOUR_INPROGRESS,
} from './inprogress/actions';

export {
    OFI_SET_USER_TOURS,
    ofiSetUserToursRequested,
    ofiClearUserToursRequested,
} from './usertour/actions';

export interface OfiUserTourState {
    inProgress: UserTourInProgressState;
    userTours: UserTourState;
}

export const OfiUserTourReducer: Reducer<OfiUserTourState> = combineReducers<OfiUserTourState>({
    inProgress: UserTourInProgressReducer,
    userTours: UserTourReducer,
});
