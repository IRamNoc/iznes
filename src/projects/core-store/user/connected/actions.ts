import {
    ActionCreator,
    Action
} from 'redux';

import {name} from './__init__';
import {kAction} from '@setl/utils/common';

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

export const RESET_MEMBERNODE_SESSION_MANAGER = `${name}/RESET_MEMBERNODE_SESSION_MANAGER`;
export const resetMembernodeSessionManager = kAction(RESET_MEMBERNODE_SESSION_MANAGER);

export const SET_MEMBERNODE_SESSION_MANAGER = `${name}/SET_MEMBERNODE_SESSION_MANAGER`;

interface SetMembernodeSessionManager extends Action {
    remainingSecond: number;
}

export const setMembernodeSessionManager: ActionCreator<SetMembernodeSessionManager> = (remainingSecond: number) => (
    {
        type: SET_MEMBERNODE_SESSION_MANAGER,
        remainingSecond
    }
);

/**
 * Set connected chain id.
 */
interface SetConnectedChainAction extends Action {
    chainId: number;
}

export const SET_CONNECTED_CHAIN = `${name}/SET_CONNECTED_CHAIN`;

export const setConnectedChain: ActionCreator<SetConnectedChainAction> = (chainId) => ({
    type: SET_CONNECTED_CHAIN,
    chainId: chainId
});

