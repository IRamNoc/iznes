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

