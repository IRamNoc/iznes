// my-detail
import {
    MyDetailState,
    MyDetailReducer,
    LOGIN_REQUEST,
    SET_LOGIN_DETAIL,
    RESET_LOGIN_DETAIL,
    loginRequestAC,
    getMyDetail
} from './my-detail';
import {combineReducers, Reducer} from 'redux';

export {
    LOGIN_REQUEST, SET_LOGIN_DETAIL, RESET_LOGIN_DETAIL, loginRequestAC,
    getMyDetail
};

// authentication
import {
    AuthenticationState,
    AuthenticationReducer,
    SET_AUTH_LOGIN_DETAIL,
    RESET_AUTH_LOGIN_DETAIL,
    getAuthentication
} from './authentication';
export {SET_AUTH_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL, getAuthentication};


export interface UserState {
    myDetail: MyDetailState;
    authentication: AuthenticationState;
}

export const userReducer: Reducer<UserState> = combineReducers<UserState>({
    myDetail: MyDetailReducer,
    authentication: AuthenticationReducer
});

