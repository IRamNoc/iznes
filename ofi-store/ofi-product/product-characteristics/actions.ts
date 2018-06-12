import { name } from './__init__';
import { Action, ActionCreator } from 'redux';
import { kAction } from '@setl/utils/common';

/**
 * Set (Set to true) request
 * Flag that to indicate we do not need to request it again.
 */
export const SET_REQUESTED_PRODUCT_CHARACTERISTICS = `${name}/SET_REQUESTED_PRODUCT_CHARACTERISTICS`;
export const setRequestedProductCharacteristics = kAction(SET_REQUESTED_PRODUCT_CHARACTERISTICS);

/**
 * Clear (set to false) request
 * Flag that to indicate we will ned to request it when we need it.
 */
export const CLEAR_REQUESTED_PRODUCT_CHARACTERISTICS = `${name}/CLEAR_REQUESTED_PRODUCT_CHARACTERISTICS`;
export const clearRequestedProductCharacteristics = kAction(CLEAR_REQUESTED_PRODUCT_CHARACTERISTICS);

/**
 *  Set fund share
 */
export const SET_PRODUCT_CHARACTERISTICS = `${name}/SET_PRODUCT_CHARACTERISTICS`;

/**
 *  Update fund share
 */
export const UPDATE_PRODUCT_CHARACTERISTICS = `${name}/UPDATE_PRODUCT_CHARACTERISTICS`;

/**
 * Set request
 */
export const OFI_SET_CURRENT_PRODUCT_CHARACTERISTICS = `${name}/OFI_SET_CURRENT_PRODUCT_CHARACTERISTICS`;

interface setProductCharacteristics extends Action {
    payload: any;
}

export const setProductCharacteristics: ActionCreator<setProductCharacteristics> = payload => ({
    type: SET_REQUESTED_PRODUCT_CHARACTERISTICS,
    payload,
});
