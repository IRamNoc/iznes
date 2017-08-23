import {
    Reducer,
    combineReducers
} from 'redux';

import {
    UserState, userReducer,
    WalletState, walletReducer,
    MessageState, messageReducer,
    AdminUsersState, adminUserReducer,
    AssetState, assetReducer

} from '@setl/core-store';

export interface AppState {
    user: UserState;
    wallet: WalletState;
    message: MessageState;
    userAdmin: AdminUsersState;
    asset: AssetState;
}

export const rootReducer: Reducer<any> = combineReducers<any>({
    user: userReducer,
    wallet: walletReducer,
    message: messageReducer,
    userAdmin: adminUserReducer,
    asset: assetReducer
});
