import {createSelector} from 'reselect';
import {AdminUsersState} from '../index';
import {AdminPermAreasState} from './index';

const getAdminUser = (state): AdminUsersState => state.userAdmin;

export const getAdminPermAreaList = createSelector(
    getAdminUser,
    (state: AdminUsersState) => state.permAreaList
);
