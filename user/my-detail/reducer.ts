import {Action} from 'redux';
import * as MyDetailActions from './actions';
import {MyDetailState} from './model';
import * as _ from 'lodash';


const initialState: MyDetailState = {
    username: '',
    emailAddress: '',
    userId: 0,
    lastLogin: '',
    userType: 0,
    firstName: '',
    lastName: '',
    admin: false,
    accountId: 0,
    memberId: 0
};

export const MyDetailReducer = function (state: MyDetailState = initialState, action: Action) {

    let newState = {};

    switch (action.type) {
        case MyDetailActions.LOGIN_REQUEST:
            return state;

        case MyDetailActions.SET_LOGIN_DETAIL:

            const loginedData = _.get(action, 'payload[1].Data[0]', {});
            const username = _.get(loginedData, 'UserName', '');
            const emailAddress = _.get(loginedData, 'EMailAddress', '');
            const userId = _.get(loginedData, 'UserID', 0);
            const lastLogin = _.get(loginedData, 'last_login', '');
            const userType = _.get(loginedData, 'userType', '');
            const admin = _.get(loginedData, 'admin', 0) ? true : false;
            const accountId = _.get(loginedData, 'accontID', '');
            const memberId = _.get(loginedData, 'memberID', '');

            newState = Object.assign({}, state, {
                username,
                emailAddress,
                userId,
                lastLogin,
                userType,
                admin,
                accountId,
                memberId
            });

            return newState;

        case MyDetailActions.SET_USER_DETAILS:

            const userDetailsData = _.get(action, 'payload[1].Data[0]', {});

            const displayName = _.get(userDetailsData, 'displayName', '');
            const firstName = _.get(userDetailsData, 'firstName', '');
            const lastName = _.get(userDetailsData, 'lastName', '');
            const mobilePhone = _.get(userDetailsData, 'mobilePhone', '');
            const addressPrefix = _.get(userDetailsData, 'addressPrefix', '');
            const address1 = _.get(userDetailsData, 'address1', '');
            const address2 = _.get(userDetailsData, 'address2', '');
            const address3 = _.get(userDetailsData, 'address3', '');
            const address4 = _.get(userDetailsData, 'address4', '');
            const postalCode = _.get(userDetailsData, 'postalCode', '');
            const country = _.get(userDetailsData, 'country', '');
            const memorableQuestion = _.get(userDetailsData, 'memorableQuestion', '');
            const memorableAnswer = _.get(userDetailsData, 'memorableAnswer', '');
            const profileText = _.get(userDetailsData, 'profileText', '');

            newState = Object.assign({}, state, {
                displayName,
                firstName,
                lastName,
                mobilePhone,
                addressPrefix,
                address1,
                address2,
                address3,
                address4,
                postalCode,
                country,
                memorableQuestion,
                memorableAnswer,
                profileText
            });

            return newState;

        case MyDetailActions.RESET_LOGIN_DETAIL:
            return initialState;

        default:
            return state;
    }
}
