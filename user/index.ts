// my-detail
import {
    MyDetailState,
    MyDetailReducer,
    LOGIN_REQUEST,
    SET_LOGIN_DETAIL,
    RESET_LOGIN_DETAIL,
    loginRequestAC,
    getMyDetail,
    SET_USER_DETAILS
} from './my-detail';
import {combineReducers, Reducer} from 'redux';

export {
    LOGIN_REQUEST, SET_LOGIN_DETAIL, RESET_LOGIN_DETAIL, loginRequestAC, SET_USER_DETAILS,
    getMyDetail
};

// authentication
import {
    AuthenticationState,
    AuthenticationReducer,
    SET_AUTH_LOGIN_DETAIL,
    RESET_AUTH_LOGIN_DETAIL,
    getAuthentication,
    SET_NEW_PASSWORD,
} from './authentication';

export {SET_AUTH_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL, getAuthentication, SET_NEW_PASSWORD};


// connected
import {

    ConnectedReducer,
    ConnectedState,
    setConnectedWallet,
    setConnectedChain,
    getConnected,
    getConnectedChain,
    getConnectedWallet,
    setMembernodeSessionManager,
    resetMembernodeSessionManager
} from './connected';

export {
    setConnectedWallet,
    setConnectedChain,
    getConnected,
    getConnectedChain,
    getConnectedWallet,
    setMembernodeSessionManager,
    resetMembernodeSessionManager
};


// site settings
import {
    SiteSettingsReducer,
    SiteSettingsState,
    setLanguage,
    setMenuShown,
    SET_PRODUCTION
} from './site-settings';

export {
    setLanguage,
    setMenuShown,
    SET_PRODUCTION
};


export interface UserState {
    myDetail: MyDetailState;
    authentication: AuthenticationState;
    connected: ConnectedState;
    siteSettings: SiteSettingsState;
}

export const userReducer: Reducer<UserState> = combineReducers<UserState>({
    myDetail: MyDetailReducer,
    authentication: AuthenticationReducer,
    connected: ConnectedReducer,
    siteSettings: SiteSettingsReducer
});

