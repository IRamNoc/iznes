import {createSelector} from 'reselect';
import {OfiNavLatestState} from './model';
import {OfiState} from '../../../index';

const getOfiState = (state): OfiState => state.ofi;

export const getOfiNavLatestCurrentRequest = createSelector(
    getOfiState,
    (state: OfiState) => {
        return state.ofiProduct.ofiManageNav.ofiNavLatest.currentRequest;
    }
);
