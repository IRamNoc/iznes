import {
    MyWalletAddressState,
    MyWalletAddressReducer,
    SET_WALLET_ADDRESSES,
    getWalletAddressList
} from './my-wallet-address';
import {combineReducers, Reducer} from 'redux';

export {
    SET_WALLET_ADDRESSES,
    getWalletAddressList
};

export interface WalletState {
    myWalletAddress: MyWalletAddressState;
}

export const walletReducer: Reducer<WalletState> = combineReducers<WalletState>({
    myWalletAddress: MyWalletAddressReducer
});
