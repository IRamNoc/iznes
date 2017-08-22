import {AsyncTaskResponseAction} from '@setl/utils/SagaHelper/actions';
import * as UsersActions from './actions';
import {UsersState, UsersDetail} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: UsersState = {
    usersList: []
};

export const UsersReducer = function (state: UsersState = initialState,
                                          action: AsyncTaskResponseAction) {
    switch (action.type) {
        case UsersActions.SET_ADMIN_USERLIST:
            /*
                We're setting the users list.
                So first, lets's get the list from the socket response.
            */
            console.log(action);
            const usersData = _.get(action, 'payload[1].Data', []);
            console.log(usersData);

            /* Next we'll use a function to tidy the data up. */
            const usersList = formatUserList(usersData);

            /* Let's now assign differences to the current state. */
            // const newState = Object.assign({}, state, {
            //     usersList
            // });

            /* And finally return the new state. */
            return state;
        default:
            return state;
    }
};

function formatUserList (rawResponse: Array<any>):Array<any> {

    console.log( ' |--- Format User List' );
    console.log( ' | rawResponse: ', rawResponse );

    return [];

}
