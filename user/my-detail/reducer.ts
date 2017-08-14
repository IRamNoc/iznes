import {Action} from 'redux';
import * as MyDetailActions from './actions';
import {MyDetailState} from './model';
import _ from 'lodash';


const initialState: MyDetailState = {
    username: '',
    emailAddress: '',
    userId: 0,
    lastLogin: '',
    userType: 0
};

export const MyDetailReducer = function (state: MyDetailState = initialState, action: Action) {
    switch (action.type) {
        case MyDetailActions.LOGIN_REQUEST:
            return state;

        case MyDetailActions.SET_LOGIN_DETAIL:

            const loginedData = _.get(action, 'payload[1].Data[0]', {});
            const username = _.get(loginedData, 'UserName', '');
            const emailAddress = _.get(loginedData, 'EMailAddress', '');
            const userId = _.get(loginedData, 'UserID', 0);
            const lastLogin = _.get(loginedData, 'lastLogin', '');
            const userType = _.get(loginedData, 'userType', '');


            const newState = Object.assign({}, state, {
                username,
                emailAddress,
                userId,
                lastLogin,
                userType
            });

            return newState;

        case MyDetailActions.RESET_LOGIN_DETAIL:
            return initialState;

        default:
            return state;
    }
}

