import {
    Reducer,
    combineReducers
} from 'redux';

import {
    UserState, userReducer,
    WalletState, walletReducer,
    AdminUsersState, adminUserReducer,
    AssetState, assetReducer

} from '@setl/core-store';


export interface AppState {
    user: UserState;
    wallet: WalletState;
    userAdmin: AdminUsersState;
    asset: AssetState;
}

export const rootReducer: Reducer<any> = combineReducers<any>({
    user: userReducer,
    wallet: walletReducer,
    userAdmin: adminUserReducer,
    asset: assetReducer
});
