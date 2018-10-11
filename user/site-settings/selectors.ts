import { createSelector } from 'reselect';
import { UserState } from '../index';
import { SiteSettingsState } from './model';

const getUser = (state): UserState => state.user;

export const getSiteSettings = createSelector(
    getUser,
    (state: UserState) => state.siteSettings);
