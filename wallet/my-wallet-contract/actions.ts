import {name} from './__init__';
import {kAction} from '@setl/utils/common';
import {ActionCreator, Action} from 'redux';

/**
 * Update last created contract
 * @type {string}
 */
export const UPDATE_LAST_CREATED_CONTRACT_DETAIL = `${name}/UPDATE_LAST_CREATED_CONTRACT_DETAIL`;
interface UpdateLastCreatedContractDetail extends Action {
    data: any;
}
export const updateLastCreatedContractDetail: ActionCreator<UpdateLastCreatedContractDetail> =
    (data) => ({
        type: UPDATE_LAST_CREATED_CONTRACT_DETAIL,
        data
    });

/**
 * Set last created contract
 *
 * @type {string}
 */
export const SET_LAST_CREATED_CONTRACT_DETAIL = `${name}/SET_LAST_CREATED_CONTRACT_DETAIL`;
interface SetLastCreatedContractDetail extends Action {
    data: any;
    metaData: any;
}
export const setLastCreatedContractDetail: ActionCreator<SetLastCreatedContractDetail> =
    (data, metaData) => ({
        type: SET_LAST_CREATED_CONTRACT_DETAIL,
        data,
        metaData
    });

export const CLEAR_CONTRACT_NEED_HANDLE = `${name}/CLEAR_CONTRACT_NEED_HANDLE`;
export const clearContractNeedHandle = kAction(CLEAR_CONTRACT_NEED_HANDLE);
