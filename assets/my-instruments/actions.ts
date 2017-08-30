import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 * Register new asset success
 */
export const REGISTER_ASSET_SUCCESS = `${name}/REGISTER_ASSET_SUCCESS`;

/**
 * Register new asset fail.
 */
export const REGISTER_ASSET_FAIL = `${name}/REGISTER_ASSET_FAIL`;


/**
 * Finish register new Asset notification
 */
export const FINISH_REGISTER_INSTRUMENT_NOTIFICATION = `${name}/FINISH_REGISTER_INSTRUMENT_NOTIFICATION `;
export const finishRegisterInstrumentNotification = kAction(FINISH_REGISTER_INSTRUMENT_NOTIFICATION);

export const SET_REQUESTED_WALLET_INSTRUMENT = `${name}/SET_REQUESTED_WALLET_INSTRUMENT`;
export const setRequestedWalletInstrument = kAction(SET_REQUESTED_WALLET_INSTRUMENT);

/**
 *  Set my instruments list
 */
export const SET_MY_INSTRUMENTS_LIST = `${name}/SET_MY_INSTRUMENTS_LIST`;

