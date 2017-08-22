import {
    Reducer,
    combineReducers
} from 'redux';

import {
    UserState, userReducer,
    WalletState, walletReducer,
    AdminUsersState, adminUserReducer

} from '@setl/core-store';


export interface AppState {
    user: UserState;
    wallet: WalletState;
    userAdmin: AdminUsersState;
}

export const rootReducer: Reducer<any> = combineReducers<any>({
    user: userReducer,
    wallet: walletReducer,
    userAdmin: adminUserReducer
});
