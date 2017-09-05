import {createSelector} from 'reselect';
import {WalletState} from '../index';
import {WalletRelationshipState} from './index';

export const getWallet = (state): WalletState => state.wallet;

export const getWalletRelationship = createSelector(
    getWallet,
    (state: WalletState) => state.walletRelationship
);

export const getWalletToRelationshipList = createSelector(
    getWalletRelationship,
    (state: WalletRelationshipState) => state.toRelationshipList
);

export const getRequestWalletToRelationshipState = createSelector(
    getWalletRelationship,
    (state: WalletRelationshipState) => state.requestedToRelationship
);
