import { combineReducers, Reducer } from 'redux';

import {
    AccountReducer,
    AccountState,
    adminUserReducer,
    AdminUsersState,
    assetReducer,
    AssetState,
    ChainReducer,
    ChainState,
    ConnectionReducer,
    MemberReducer,
    MemberState,
    messageReducer,
    MessageState,
    userReducer,
    UserState,
    walletReducer,
    WalletState
} from '@setl/core-store';

import { OfiReducer, OfiState } from '@ofi/ofi-main';

export interface AppState {
    user: UserState;
    wallet: WalletState;
    message: MessageState;
    userAdmin: AdminUsersState;
    asset: AssetState;
    account: AccountState;
    member: MemberState;
    chain: ChainState;

    ofi: OfiState;
}

const appReducer: Reducer<any> = combineReducers<any>({
    user: userReducer,
    wallet: walletReducer,
    message: messageReducer,
    userAdmin: adminUserReducer,
    asset: assetReducer,
    account: AccountReducer,
    member: MemberReducer,
    chain: ChainReducer,
    connection: ConnectionReducer,

    ofi: OfiReducer
});

export const rootReducer: Reducer<any> = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        state = undefined;
    }

    return appReducer(state, action);
};
