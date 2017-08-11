import {MyDetailState, MyDetailReducer, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL} from './my-detail';
import {combineReducers, Reducer} from 'redux';

export {LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL};


export interface UserState {
    myDetail: MyDetailState;
}

export const userReducer: Reducer<UserState> = combineReducers<UserState>({
    myDetail: MyDetailReducer
});



