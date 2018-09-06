import { name } from './__init__';
import { ActionCreator, Action } from 'redux';

/**
 * Add TX hash to list
 */
export const ADD_WALLETNODE_TX_STATUS = `${name}/ADD_WALLETNODE_TX_STATUS`;
export const UPDATE_WALLETNODE_TX_STATUS = `${name}/UPDATE_WALLETNODE_TX_STATUS`;

export interface UpdateWalletnodeTxStatusAction extends Action {
    data: any;
}

export const updateWalletnodeTxStatus: ActionCreator<UpdateWalletnodeTxStatusAction> =
    data => ({
        type: UPDATE_WALLETNODE_TX_STATUS,
        data,
    });
