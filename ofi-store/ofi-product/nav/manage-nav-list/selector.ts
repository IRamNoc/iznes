import {createSelector} from 'reselect';
import {OfiManageNavListState} from './model';
import {OfiState} from '../../../index';

const getOfiState = (state): OfiState => state.ofi;

export const getOfiManageNavListCurrentRequest = createSelector(
    getOfiState,
    (state: OfiState) => {
        return state.ofiProduct.ofiManageNav.ofiManageNavList.currentRequest;
    }
);
