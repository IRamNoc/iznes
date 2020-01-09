import {name} from './__init__';
import { Action, ActionCreator } from 'redux';

/**
 * Set wallet list
 */
export const SET_OWN_WALLETS = `${name}/SET_OWN_WALLETS`;

/**
 * Delete wallet from own wallet list
 * @type {string}
 */
type WalletId = number;
export const DELETE_FROM_OWN_WALLETS = `${name}/DELETE_FROM_OWN_WALLETS`;

export interface DeleteFromOwnWallet extends Action {
    walletIds: WalletId[];
}

export const deleteFromOwnWallets: ActionCreator<DeleteFromOwnWallet> = (walletIds: WalletId[]) => ({
    type: DELETE_FROM_OWN_WALLETS,
    walletIds,
});

export const ADD_TO_OWN_WALLETS = `${name}/ADD_TO_OWN_WALLETS`;
export interface AddToOwnWallet extends Action {
    walletIds: NewWallet[];
}
export interface NewWallet {
    walletID: number;
    commuPub: string;
    permission: number;
    walletName: string;
    walletType: number;
    userID: number;
    permissionDetail: string;
    accountID: number;
    walletLocked: number;
    walletTypeName: string;
    GLEI: string;
    bankWalletID: number;
    CorrespondenceAddress: string;
}
export const addToOwnWallets: ActionCreator<AddToOwnWallet> = (walletIds: NewWallet[]) => ({
    type: ADD_TO_OWN_WALLETS,
    walletIds,
});
