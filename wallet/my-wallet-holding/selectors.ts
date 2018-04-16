import {createSelector} from 'reselect';
import {WalletState} from '../index';
import {MyWalletHoldingState} from './index';
import {getConnectedWallet} from '../../user/connected';
import {memoize} from 'lodash/memoize';

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
