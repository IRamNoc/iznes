import {
    Reducer,
    combineReducers
} from 'redux';

import {
    UserState, userReducer,
    WalletState, walletReducer,
    MessageState, messageReducer,
    AdminUsersState, adminUserReducer,
    AssetState, assetReducer,
    AccountState, AccountReducer,
    MemberState, MemberReducer,
} from '@setl/core-store';

export interface AppState {
    user: UserState;
    wallet: WalletState;
    message: MessageState;
    userAdmin: AdminUsersState;
    asset: AssetState;
    adminUsers: AdminUsersState;
    account: AccountState;
    member: MemberState;
}

const appReducer: Reducer<any> = combineReducers<any>({
    user: userReducer,
    wallet: walletReducer,
    message: messageReducer,
    userAdmin: adminUserReducer,
    asset: assetReducer,
    account: AccountReducer,
    member: MemberReducer
});

export const rootReducer: Reducer<any> = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        state = undefined;
    }

    return appReducer(state, action);
};
