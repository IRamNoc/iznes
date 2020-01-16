import {Action} from 'redux';
import * as MyDetailActions from './actions';
import {MyDetailState} from './model';
import * as _ from 'lodash';
import {
    convertUtcStrToLocalStr,
    getCurrentUnixTimestampStr,
} from '@setl/utils/helper/m-date-wrapper';

const initialState: MyDetailState = {
    username: '',
    emailAddress: '',
    userId: 0,
    lastLogin: '',
    userType: 0,
    userTypeStr: '',
    firstName: '',
    lastName: '',
    admin: false,
    accountId: 0,
    memberId: 0,
    companyName: '',
    phoneCode: '',
    phoneNumber: '',
    defaultWalletID: -1,
    sessionTimeoutSecs: 0,
};

const UserTypeStr = {
    '15': 'system_admin',
    '25': 'chain_admin',
    '27': 'bank',
    '35': 'member_user',
    '36': 'am',
    '45': 'standard_user',
    '46': 'investor',
    '47': 'valuer',
    '48': 'custodian',
    '49': 'cac',
    '50': 'registrar',
    '60': 't2s',
    '65': 'rooster_operator'
};

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const MyDetailReducer = function (state: MyDetailState = initialState, action: Action): MyDetailState {
    let emailAddress = '';

    switch (action.type) {
        case MyDetailActions.LOGIN_REQUEST:
            return state;

        case MyDetailActions.SET_LOGIN_DETAIL:

            const loginedData = _.get(action, 'payload[1].Data[0]', {});
            const username = _.get(loginedData, 'UserName', '');
            emailAddress = _.get(loginedData, 'EMailAddress', '');
            const userId = _.get(loginedData, 'UserID', 0);

            const l = _.get(loginedData, 'last_login', '');
            const lastLogin = l ? convertUtcStrToLocalStr(l, DATE_FORMAT, 'YYYY-MM-DD HH:mm')
                : getCurrentUnixTimestampStr('YYYY-MM-DD HH:mm');

            const userType = _.get(loginedData, 'userType', 0);
            const userTypeStr = UserTypeStr[userType];
            const admin = !!_.get(loginedData, 'admin', 0);
            const accountId = _.get(loginedData, 'accontID', '');
            const memberId = _.get(loginedData, 'memberID', '');
            const defaultWalletID = _.get(loginedData, 'defaultWalletID', '');
            const sessionTimeoutSecs = _.get(loginedData, 'sessionTimeoutSecs', 0);

            return Object.assign({}, state, {
                username,
                emailAddress,
                userId,
                lastLogin,
                userType,
                userTypeStr,
                admin,
                accountId,
                memberId,
                defaultWalletID,
                sessionTimeoutSecs,
            });

        case MyDetailActions.SET_USER_DETAILS:

            const userDetailsData = _.get(action, 'payload[1].Data[0]', {});

            const displayName = _.get(userDetailsData, 'displayName', '');
            const firstName = _.get(userDetailsData, 'firstName', '');
            const lastName = _.get(userDetailsData, 'lastName', '');
            emailAddress = _.get(userDetailsData, 'emailAddress', '');
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
            const companyName = _.get(userDetailsData, 'companyName', '');
            const phoneCode = _.get(userDetailsData, 'phoneCode', '');
            const phoneNumber = _.get(userDetailsData, 'phoneNumber', '');

            return Object.assign({}, state, {
                displayName,
                firstName,
                lastName,
                emailAddress,
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
                profileText,
                companyName,
                phoneCode,
                phoneNumber
            });

        case MyDetailActions.RESET_LOGIN_DETAIL:
            return initialState;

        default:
            return state;
    }
};
