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

/**
 * Set (Set to true) request wallet instrument state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_WALLET_INSTRUMENT = `${name}/SET_REQUESTED_WALLET_INSTRUMENT`;
export const setRequestedWalletInstrument = kAction(SET_REQUESTED_WALLET_INSTRUMENT);


/**
 * Clear (set to false) request wallet instrument state
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_WALLET_INSTRUMENT = `${name}/CLEAR_REQUESTED_WALLET_INSTRUMENT`;
export const clearRequestedWalletInstrument = kAction(CLEAR_REQUESTED_WALLET_INSTRUMENT);

/**
 *  Set my instruments list
 */
export const SET_MY_INSTRUMENTS_LIST = `${name}/SET_MY_INSTRUMENTS_LIST`;

/**
 * Issue new asset success
 */
export const ISSUE_ASSET_SUCCESS = `${name}/ISSUE_ASSET_SUCCESS`;

/**
 * Issue new asset fail.
 */
export const ISSUE_ASSET_FAIL = `${name}/ISSUE_ASSET_FAIL`;

/**
 * Finish issuer new Asset notification
 */
export const FINISH_ISSUE_ASSET_NOTIFICATION = `${name}/FINISH_ISSUE_ASSET_NOTIFICATION`;
export const finishIssueAssetNotification = kAction(FINISH_ISSUE_ASSET_NOTIFICATION);

/**
 * Send new asset success
 */
export const SEND_ASSET_SUCCESS = `${name}/SEND_ASSET_SUCCESS`;

/**
 * Send new asset fail.
 */
export const SEND_ASSET_FAIL = `${name}/SEND_ASSET_FAIL`;

/**
 * transfer asset success
 */
export const TRANSFER_ASSET_SUCCESS = `${name}/TRANSFER_ASSET_SUCCESS`;

/**
 * transfer new asset fail.
 */
export const TRANSFER_ASSET_FAIL = `${name}/TRANSFER_ASSET_FAIL`;

/**
 * Finish issuer new Asset notification
 */
export const FINISH_SEND_ASSET_NOTIFICATION = `${name}/FINISH_SEND_ASSET_NOTIFICATION`;
export const finishSendAssetNotification = kAction(FINISH_SEND_ASSET_NOTIFICATION);
