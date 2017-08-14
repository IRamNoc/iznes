import {Action} from 'redux';
import * as AuthenticationAction from './actions';
import {AuthenticationState} from './model';
import _ from 'lodash';

const initialState: AuthenticationState = {
    token: '',
    apiKey: '',
    useTwoFactor: 0,
    isLogin: false
};

export const AuthenticationReducer = function (state: AuthenticationState = initialState, action: Action) {
    switch (action.type) {
        case AuthenticationAction.SET_AUTH_LOGIN_DETAIL:
            const loginedData = _.get(action, 'payload[1].Data[0]', {});
            const token = _.get(loginedData, 'Token', '');
            const apiKey = _.get(loginedData, 'apiKey', '');
            const useTwoFactor = _.get(loginedData, 'useTwoFactor', '');

            const newState = Object.assign({}, state, {
                token,
                apiKey,
                useTwoFactor,
                isLogin: true
            });

            return newState;

        case AuthenticationAction.RESET_AUTH_LOGIN_DETAIL:
            return initialState;

        default:
            return state;
    }
};
