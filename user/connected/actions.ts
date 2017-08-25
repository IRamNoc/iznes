import {
    ActionCreator,
    Action
} from 'redux';

import {name} from './__init__';

/**
 * Set connected wallet
 */
export const SET_CONNECTED_WALLET = `${name}/SET_CONNECTED_WALLET`;
interface SetConnectedWalletAction extends Action {
    walletId: number;
}

export const setConnectedWallet: ActionCreator<SetConnectedWalletAction> = (walletId) => ({
    type: SET_CONNECTED_WALLET,
    walletId: walletId
});


