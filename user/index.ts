// my-detail
import {
    MyDetailState,
    MyDetailReducer,
    LOGIN_REQUEST,
    SET_LOGIN_DETAIL,
    RESET_LOGIN_DETAIL,
    loginRequestAC,
    getMyDetail,
    SET_USER_DETAILS,
} from './my-detail';
import { combineReducers, Reducer } from 'redux';

export {
    LOGIN_REQUEST, SET_LOGIN_DETAIL, RESET_LOGIN_DETAIL, loginRequestAC, SET_USER_DETAILS,
    getMyDetail,
};

// authentication
import {
    AuthenticationState,
    AuthenticationReducer,
    SET_AUTH_LOGIN_DETAIL,
    RESET_AUTH_LOGIN_DETAIL,
    getAuthentication,
    SET_NEW_PASSWORD,
    CLEAR_MUST_CHANGE_PASSWORD,
    resetHomepage,
    UPDATE_TWO_FACTOR,
} from './authentication';

export {
    SET_AUTH_LOGIN_DETAIL,
    RESET_AUTH_LOGIN_DETAIL,
    getAuthentication,
    SET_NEW_PASSWORD,
    CLEAR_MUST_CHANGE_PASSWORD,
    resetHomepage,
    UPDATE_TWO_FACTOR,
};

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
    resetMembernodeSessionManager,
} from './connected';

export {
    setConnectedWallet,
    setConnectedChain,
    getConnected,
    getConnectedChain,
    getConnectedWallet,
    setMembernodeSessionManager,
    resetMembernodeSessionManager,
};

// site settings
import {
    SiteSettingsReducer,
    SiteSettingsState,
    setVersion,
    setLanguage,
    setMenuShown,
    getSiteSettings,
    setMenuCollapsed,
    SET_PRODUCTION,
    SET_VERSION,
    SET_LANGUAGE,
    SET_SITE_MENU,
    SET_FORCE_TWO_FACTOR,
    SET_MENU_COLLAPSED,
} from './site-settings';

import { permissionsReducer, PermissionsState } from './permissions';

export {
    PermissionsState,
    permissionsReducer,
    SET_PERMISSIONS_LIST,
    SET_PERMISSIONS_REQUESTED,
    RESET_PERMISSIONS_REQUESTED,
} from './permissions';

export {
    setVersion,
    setLanguage,
    setMenuShown,
    getSiteSettings,
    setMenuCollapsed,
    SET_PRODUCTION,
    SET_VERSION,
    SET_LANGUAGE,
    SET_SITE_MENU,
    SET_FORCE_TWO_FACTOR,
    SET_MENU_COLLAPSED,
};

import {
    AlertState,
    SET_ALERTS,
    alertReducer,
} from './alerts';

export {
    SET_ALERTS,
}

export interface UserState {
    alerts: AlertState,
    myDetail: MyDetailState;
    authentication: AuthenticationState;
    connected: ConnectedState;
    siteSettings: SiteSettingsState;
    permissions: PermissionsState;
}

export const userReducer: Reducer<UserState> = combineReducers<UserState>({
    alerts: alertReducer,
    myDetail: MyDetailReducer,
    authentication: AuthenticationReducer,
    connected: ConnectedReducer,
    siteSettings: SiteSettingsReducer,
    permissions: permissionsReducer,
});