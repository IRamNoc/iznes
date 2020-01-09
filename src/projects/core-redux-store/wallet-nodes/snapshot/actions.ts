import {name} from './__init__';
import {ActionCreator,Action} from 'redux';
import {WalletNodeSnapshotDetail, WalletNodeInitialSnapshotDetail} from "./model";


/**
 * Add chain snapshot to list
 */
export const ADD_WALLETNODE_SNAPSHOT = `${name}/ADD_WALLETNODE_SNAPSHOT`;
export interface WalletNodeSnapshotAction extends Action{
    snapshot: WalletNodeSnapshotDetail;
}
export const addWalletNodeSnapshot: ActionCreator<WalletNodeSnapshotAction> = (snapshot) => ({
    type : ADD_WALLETNODE_SNAPSHOT,
    snapshot : snapshot
});

export const ADD_WALLETNODE_INITIAL_SNAPSHOT = `${name}/ADD_WALLETNODE_INITIAL_SNAPSHOT`;
export interface WalletNodeInitialSnapshotAction extends Action{
    snapshot: WalletNodeInitialSnapshotDetail;
}
export const addWalletNodeInitialSnapshot: ActionCreator<WalletNodeInitialSnapshotAction> = (snapshot) => ({
    type : ADD_WALLETNODE_INITIAL_SNAPSHOT,
    snapshot : snapshot
});
