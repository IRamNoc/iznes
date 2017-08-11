import {Action} from 'redux';
import * as MyDetailActions from './actions';

export interface MyDetailState {
    username: string;
}

const initialState: MyDetailState = {
    username: ''
};

export const MyDetailReducer = function (state: MyDetailState = initialState, action: Action) {
    switch (action.type) {
        case MyDetailActions.LOGIN_REQUEST:
            return state;

        case MyDetailActions.LOGIN_SUCCESS:

            const username = action['payload'][1]['Data'][0]['UserName'];
            console.log('hit here');
            console.log(action);
            console.log(username);
            return {
                username: username
            };

        case MyDetailActions.LOGIN_FAIL:
            return state;

        default:
            return state;
    }
}

