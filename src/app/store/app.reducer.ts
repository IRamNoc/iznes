import {
    Reducer,
    combineReducers
} from 'redux';

import {
    UserState, userReducer,
    WalletState, walletReducer,
    AssetState, assetReducer

} from '@setl/core-store';


export interface AppState {
    user: UserState;
    wallet: WalletState;
    asset: AssetState;
}

export const rootReducer: Reducer<any> = combineReducers<any>({
    user: userReducer,
    wallet: walletReducer,
    asset: assetReducer
});
