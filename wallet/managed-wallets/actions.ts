import {name} from './__init__';
import {WalletTab} from './model';
import {Action, ActionCreator} from 'redux';

/**
 * Set wallet list
 */
export const SET_MANAGED_WALLETS = `${name}/SET_MANAGED_WALLETS`;

// update tabs
export const SET_ALL_TABS = `${name}/SET_ALL_TABS`;

export interface SetAllTab extends Action {
    tabs: Array<WalletTab>;
}

export const setAllTabs: ActionCreator<SetAllTab> = (tabs: Array<WalletTab>) => (
    {
        type: SET_ALL_TABS,
        tabs
    }
);
