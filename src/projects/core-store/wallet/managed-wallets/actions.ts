import { name } from './__init__';
import { WalletTab } from './model';
import { Action, ActionCreator } from 'redux';

/**
 * Set wallet list
 */
export const SET_MANAGED_WALLETS = `${name}/SET_MANAGED_WALLETS`;

/**
 * Add new wallet to list
 */
export const SET_WALLET_ADDED = `${name}/SET_WALLET_ADDED`;

/**
 * Update wallet list
 */
export const SET_WALLET_UPDATED = `${name}/SET_WALLET_UPDATED`;

/**
 * Delete wallet list
 */
export const SET_WALLET_DELETED = `${name}/SET_WALLET_DELETED`;

// update tabs
export const SET_ALL_TABS = `${name}/SET_ALL_TABS`;

export interface SetAllTab extends Action {
    tabs: WalletTab[];
}

export const setAllTabs: ActionCreator<SetAllTab> = (tabs: WalletTab[]) => (
{
    type: SET_ALL_TABS,
    tabs,
}
);
