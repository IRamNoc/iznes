import { createSelector } from 'reselect';
import { UserState } from '../index';

export const getUser = (state): UserState => state.user;

export const getAuthentication = createSelector(
    getUser,
    (state: UserState) => state.authentication,
);
