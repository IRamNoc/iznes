import {name} from './__init__';
import {kAction} from '@setl/utils/common';

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
 * Set requested wallet issuer to true.
 */
export const SET_REQUESTED_WALLET_ISSUER = `${name}/SET_REQUESTED_WALLET_ISSUER`;
export const setRequestedWalletIssuer = kAction(SET_REQUESTED_WALLET_ISSUER);

/**
 * Set my issuers list
 */
export const SET_WALLET_ISSUER_LIST = `${name}/SET_WALLET_ISSUER_LIST`;
