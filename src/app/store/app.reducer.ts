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
    WalletState,
    WorkflowState,
    WorkflowReducer,
    HighlightListState,
    HighlightListReducer,
    AccountAdminState,
    accountAdminReducer,
} from '@setl/core-store';

import { OfiReducer, OfiState } from '@ofi/ofi-main';

export interface AppState {
    user: UserState;
    wallet: WalletState;
    message: MessageState;
    userAdmin: AdminUsersState;
    asset: AssetState;
    account: AccountState;
    accountAdmin: AccountAdminState;
    member: MemberState;
    chain: ChainState;
    workflow: WorkflowState;
    highlight: HighlightListState;
    ofi: OfiState;
}

const appReducer: Reducer<any> = combineReducers<any>({
    user: userReducer,
    wallet: walletReducer,
    message: messageReducer,
    userAdmin: adminUserReducer,
    asset: assetReducer,
    account: AccountReducer,
    accountAdmin: accountAdminReducer,
    member: MemberReducer,
    chain: ChainReducer,
    connection: ConnectionReducer,
    workflow: WorkflowReducer,
    highlight: HighlightListReducer,
    ofi: OfiReducer,
});

export const rootReducer: Reducer<any> = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        state = undefined;
    }

    return appReducer(state, action);
};
