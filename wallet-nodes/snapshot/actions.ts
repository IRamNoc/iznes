import {name} from './__init__';
import {kAction} from '@setl/utils/common';
import {ActionCreator,Action} from 'redux';
import {WalletNodeSnapshotDetail} from "./model";


/**
 * Add chain snapshot to list
 */
export const ADD_WALLETNODE_SNAPSHOT = `${name}/ADD_WALLETNODE_SNAPSHOT`;

export interface WalletNodeSnapshot extends Action{
    snapshot: WalletNodeSnapshotDetail;
}
export const addWalletNodeSnapshot: ActionCreator<WalletNodeSnapshot> = (snapshot) => ({
    type : ADD_WALLETNODE_SNAPSHOT,
    snapshot : snapshot
});
