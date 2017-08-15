import {
    Reducer,
    combineReducers
} from 'redux';

import {
    UserState, userReducer,

} from '@setl/core-store';


export interface AppState {
    user: UserState;
}

export const rootReducer: Reducer<any> = combineReducers<any>({
    user: userReducer
});
