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
    ChainState, ChainReducer
} from '@setl/core-store';

import {
    OfiState,
    OfiReducer
} from '@ofi/ofi-main';

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

    ofi: OfiReducer
});

export const rootReducer: Reducer<any> = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        state = undefined;
    }

    return appReducer(state, action);
};
