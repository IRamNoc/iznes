import {createSelector} from 'reselect';
import {WalletState} from '../index';
import {MyWalletHoldingState} from './index';

const getWallet = (state): WalletState => state.wallet;

export const getWalletHolding = createSelector(
    getWallet,
    (state: WalletState) => state.myWalletHolding
);

export const getWalletHoldingByAddress = createSelector(
    getWalletHolding,
    (state: MyWalletHoldingState) => state.holdingByAddress
);

export const getWalletHoldingByAsset = createSelector(
    getWalletHolding,
    (state: MyWalletHoldingState) => state.holdingByAsset
);


