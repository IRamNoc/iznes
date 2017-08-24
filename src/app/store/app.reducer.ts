import {
    Reducer,
    combineReducers
} from 'redux';

import {
    UserState, userReducer,
    WalletState, walletReducer,
    AssetState, assetReducer,
    AdminUsersState, adminUserReducer

} from '@setl/core-store';


export interface AppState {
    user: UserState;
    wallet: WalletState;
    asset: AssetState;
    adminUsers: AdminUsersState;
}

export const rootReducer: Reducer<any> = combineReducers<any>({
    user: userReducer,
    wallet: walletReducer,
    asset: assetReducer,
    adminUsers: adminUserReducer
});
