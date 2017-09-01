import {createSelector} from 'reselect';
import {AdminUsersState} from '../index';
import {PermAreasState} from './index';

const getAdminUser = (state): AdminUsersState => state.userAdmin;

export const getAdminPermAreaList = createSelector(
    getAdminUser,
    (state: AdminUsersState) => state.permAreaList
);

export const getTxPermAreaList = createSelector(
    getAdminUser,
    (state: AdminUsersState) => state.permAreaList
);
