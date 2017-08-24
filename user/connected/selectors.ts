import {createSelector} from 'reselect';
import {UserState} from '../index';
import {ConnectedState} from './model';

export const getUser = (state): UserState => state.user;

export const getConnected = createSelector(
    getUser,
    (state: UserState) => state.connected
);

export const getConnectedChain = createSelector(
    getConnected,
    (state: ConnectedState) => state.connectedChain
);

export const getConnectedWallet = createSelector(
    getConnected,
    (state: ConnectedState) => state.connectedWallet
);
