import {AsyncTaskResponseAction} from '@setl/utils/SagaHelper/actions';
import * as UsersActions from './actions';
import {UsersState, UsersDetail} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: UsersState = {
    usersList: []
};

export const UsersReducer = function (
    state: UsersState = initialState,
    action: AsyncTaskResponseAction
) {
    switch (action.type) {
        case UsersActions.SET_ADMIN_USERLIST:
            /* We're setting the users list.
               So first, lets's get the list from the socket response. */
            const usersData = _.get(action, 'payload[1].Data', []);

            /* Next we'll use a function to tidy the data up. */
            const usersList = formatUserList(usersData);

            /* Let's now assign differences to the current state. */
            const newState = Object.assign({}, state, {
                usersList
            });

            /* And finally return the new state. */
            return newState;
        default:
            return state;
    }
};

/**
 * Format User List
 * A helper to format the raw user array given by the socket server.
 *
 * @param {rawResponse} array - The raw array given.
 *
 * @return {newStructure} object - The object of users by ID.
 */
function formatUserList (rawResponse: Array<any>):{} {

    /* Lets define the new structure, an object. */
    const newStructure = {};

    /* We'll loop over the array and make it so each key is a user ID in the new
       object, the value will be the user's data as an object. */
    let i:number;
    for (i = 0; i < rawResponse.length; i++) {
        newStructure[ rawResponse[i].userID ] = rawResponse[i];
    }

    /* Lastly, return. */
    return newStructure;
}
