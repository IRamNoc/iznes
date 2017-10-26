import {name} from './__init__';
import {kAction} from '@setl/utils/common';
import {Action, ActionCreator} from 'redux';

/**
 * Register new issuer success
 */
export const REGISTER_ISSUER_SUCCESS = `${name}/REGISTER_ISSUER_SUCCESS`;

/**
 * Register new issuer fail.
 */
export const REGISTER_ISSUER_FAIL = `${name}/REGISTER_ISSUER_FAIL`;


/**
 * Finish register new issuer notification
 */
export const FINISH_REGISTER_ISSUER_NOTIFICATION = `${name}/FINISH_REGISTER_ISSUER_NOTIFICATION`;
export const finishRegisterIssuerNotification = kAction(FINISH_REGISTER_ISSUER_NOTIFICATION);


/**
 * Set (Set to true) request wallet issuer state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_WALLET_ISSUER = `${name}/SET_REQUESTED_WALLET_ISSUER`;
export const setRequestedWalletIssuer = kAction(SET_REQUESTED_WALLET_ISSUER);

/**
 * Clear (Set to false) request wallet issuer state
 * Flag that to indicate we will need to request when we need it.
 */
export const CLEAR_REQUESTED_WALLET_ISSUER = `${name}/CLEAR_REQUESTED_WALLET_ISSUER`;
export const clearRequestedWalletIssuer = kAction(CLEAR_REQUESTED_WALLET_ISSUER);

/**
 * Set my issuers list
 */
export const SET_WALLET_ISSUER_LIST = `${name}/SET_WALLET_ISSUER_LIST`;

/**
 * Update last created register issuer.
 * @type {string}
 */
export const UPDATE_LAST_CREATED_REGISTER_ISSUER_DETAIL = `${name}/UPDATE_LAST_CREATED_REGISTER_ISSUER_DETAIL`;

interface UpdateLastCreatedRegisterIssuerDetail extends Action {
    data: any;
}

export const updateLastCreatedRegisterIssuerDetail: ActionCreator<UpdateLastCreatedRegisterIssuerDetail> =
    (data) => ({
        type: UPDATE_LAST_CREATED_REGISTER_ISSUER_DETAIL,
        data
    });

/**
 * Set last created register issuer.
 *
 * @type {string}
 */
export const SET_LAST_CREATED_REGISTER_ISSUER_DETAIL = `${name}/SET_LAST_CREATED_REGISTER_ISSUER_DETAIL`;

interface SetLastCreatedRegisterIssuerDetail extends Action {
    data: any;
    metaData: any;
}

export const setLastCreatedRegisterIssuerDetail: ActionCreator<SetLastCreatedRegisterIssuerDetail> =
    (data, metaData) => ({
        type: SET_LAST_CREATED_REGISTER_ISSUER_DETAIL,
        data,
        metaData
    });

export const CLEAR_REGISTER_ISSUER_NEED_HANDLE = `${name}/CLEAR_REGISTER_ISSUER_NEED_HANDLE`;
export const clearRegisterIssuerNeedHandle = kAction(CLEAR_REGISTER_ISSUER_NEED_HANDLE);
