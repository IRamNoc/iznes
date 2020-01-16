import {name} from './__init__';
import {kAction} from '@setl/utils/common';

/**
 * Set wallet to relationship
 */
export const SET_WALLET_TO_RELATIONSHIP = `${name}/SET_WALLET_TO_RELATIONSHIP`;

/**
 * Set (Set to true) request wallet to-relationship state
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_WALLET_TO_RELATIONSHIP = `${name}/SET_REQUESTED_WALLET_TO_RELATIONSHIP`;
export const setRequestedWalletToRelationship = kAction(SET_REQUESTED_WALLET_TO_RELATIONSHIP);

/**
 * Clear (Set to false) request wallet to-relationship state
 * Flag that to indicate we will need to request it when we need it.
 */
export const CLEAR_REQUESTED_WALLET_TO_RELATIONSHIP = `${name}/CLEAR_REQUESTED_WALLET_ISSUER`;
export const clearRequestedWalletToRelationship = kAction(CLEAR_REQUESTED_WALLET_TO_RELATIONSHIP);
