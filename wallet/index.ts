import {
    MyWalletAddressState,
    MyWalletAddressReducer,
    SET_WALLET_ADDRESSES,
    getWalletAddressList
} from './my-wallet-address';

import {
    MyWalletsState,
    MyWalletsReducer,
    SET_OWN_WALLETS,
    getMyWalletList
} from './my-wallets';

import {
    MyWalletHoldingState,
    MyWalletHoldingReducer,
    SET_WALLET_HOLDING,
    getWalletHoldingByAsset,
    getWalletHoldingByAddress
} from './my-wallet-holding';

import {combineReducers, Reducer} from 'redux';

export {
    SET_WALLET_ADDRESSES,
    getWalletAddressList
};

export {
    SET_OWN_WALLETS,
    getMyWalletList
};

export {
    SET_WALLET_HOLDING,
    getWalletHoldingByAddress,
    getWalletHoldingByAsset
};

export interface WalletState {
    myWalletAddress: MyWalletAddressState;
    myWallets: MyWalletsState;
    myWalletHolding: MyWalletHoldingState;
}

export const walletReducer: Reducer<WalletState> = combineReducers<WalletState>({
    myWalletAddress: MyWalletAddressReducer,
    myWallets: MyWalletsReducer,
    myWalletHolding: MyWalletHoldingReducer
});
