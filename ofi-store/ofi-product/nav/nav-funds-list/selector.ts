import {createSelector} from 'reselect';
import {OfiNavFundsListState} from './model';
import {OfiState} from '../../../index';

const getOfiState = (state): OfiState => state.ofi;

export const getOfiNavFundsListCurrentRequest = createSelector(
    getOfiState,
    (state: OfiState) => {
        return state.ofiProduct.ofiManageNav.ofiNavFundsList.currentRequest;
    }
);
