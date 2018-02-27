import {Action} from 'redux';
import * as AuthenticationAction from './actions';
import {AuthenticationState} from './model';
import * as _ from 'lodash';

const initialState: AuthenticationState = {
    token: '',
    apiKey: '',
    useTwoFactor: 0,
    isLogin: false,
    defaultHomePage: '/home'
};

export const AuthenticationReducer = function (state: AuthenticationState = initialState, action: Action) {
    switch (action.type) {
        case AuthenticationAction.SET_AUTH_LOGIN_DETAIL:
            const loginedData = _.get(action, 'payload[1].Data[0]', {});
            const token = _.get(loginedData, 'Token', '');
            const apiKey = _.get(loginedData, 'apiKey', '');
            const useTwoFactor = _.get(loginedData, 'useTwoFactor', '');
            const defaultHomePage = _.get(loginedData, 'defaultHomePage', '');

            const newState = Object.assign({}, state, {
                token,
                apiKey,
                useTwoFactor,
                isLogin: true,
                defaultHomePage
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

        default:
            return state;
    }
};
