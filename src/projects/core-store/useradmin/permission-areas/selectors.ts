import {createSelector} from 'reselect';
import {AdminUsersState} from '../index';
import {
    PermAreasState
} from './index';

const getAdminUser = (state): AdminUsersState => state.userAdmin;

export const getPermAreaLists = createSelector(
    getAdminUser,
    (state: AdminUsersState) => state.permAreaList
);

export const getAdminPermAreaList = createSelector(
    getPermAreaLists,
    (state: PermAreasState) => state.adminPermAreaList
);

export const getTxPermAreaList = createSelector(
    getPermAreaLists,
    (state: PermAreasState) => state.txPermAreaList
);

export const getMenuPermAreaList = createSelector(
    getPermAreaLists,
    (state: PermAreasState) => state.menuPermAreaList
);
