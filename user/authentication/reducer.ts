import { Action } from 'redux';
import * as AuthenticationAction from './actions';
import { AuthenticationState } from './model';
import * as _ from 'lodash';

const initialState: AuthenticationState = {
    token: '',
    apiKey: '',
    useTwoFactor: 0,
    isLogin: false,
    defaultHomePage: '/home',
    mustChangePassword: false,
    changedPassword: false
};

export const AuthenticationReducer = function (state: AuthenticationState = initialState, action: Action) {
    switch (action.type) {
    case AuthenticationAction.SET_AUTH_LOGIN_DETAIL:
        const loginedData = _.get(action, 'payload[1].Data[0]', {});
        const token = _.get(loginedData, 'Token', '');
        const apiKey = _.get(loginedData, 'apiKey', '');
        const useTwoFactor = _.get(loginedData, 'useTwoFactor', '');
        const defaultHomePage = _.get(loginedData, 'defaultHomePage', '');
        let mustChangePassword = _.get(loginedData, 'mustChangePassword', false);
        if (mustChangePassword === 0 || mustChangePassword === 1) {
            mustChangePassword = (mustChangePassword === 1);
        }

        const newState = Object.assign({}, state, {
            token,
            apiKey,
            useTwoFactor,
            isLogin: true,
            defaultHomePage,
            mustChangePassword,
        });

        return newState;

    case AuthenticationAction.RESET_AUTH_LOGIN_DETAIL:
        return initialState;

    case AuthenticationAction.SET_NEW_PASSWORD:

        const tokenData = _.get(action, 'payload[1].Data[0]', {});
        const newToken = _.get(tokenData, 'Token', '');
        const changedPassword = true;

        const newTokenState = Object.assign({}, state, {
            newToken,
            changedPassword
        });

        return newTokenState;

    case AuthenticationAction.CLEAR_MUST_CHANGE_PASSWORD:
        mustChangePassword = false;
        return Object.assign({}, state, {
            mustChangePassword
        });

    case AuthenticationAction.RESET_HOMEPAGE:
        return Object.assign({}, state, {
            defaultHomePage: '/user-administration/subportfolio'
        });

    default:
        return state;
    }
};
