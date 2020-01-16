import {createSelector} from 'reselect';
import {UserState} from '../index';

const getUser = (state): UserState => state.user;

export const getMyDetail = createSelector(
    getUser,
    (state: UserState) => state.myDetail);
