import {combineReducers, Reducer} from 'redux';

import {UserTourInProgressReducer, UserTourInProgressState} from './inprogress';
import {UserTourReducer, UserTourState} from './usertour';

export {
    OFI_SET_USERTOUR_INPROGRESS,
} from './inprogress/actions';

export {
    OFI_SET_MY_SUBPORTFOLIOS,
    ofiSetMySubportfoliosRequested,
    ofiClearMySubportfoliosRequested,
} from './usertour/actions';

export interface OfiUserTourState {
    inProgress: UserTourInProgressState;
    mySubportfolios: UserTourState;
}

export const OfiUserTourReducer: Reducer<OfiUserTourState> = combineReducers<OfiUserTourState>({
    inProgress: UserTourInProgressReducer,
    mySubportfolios: UserTourReducer,
});
