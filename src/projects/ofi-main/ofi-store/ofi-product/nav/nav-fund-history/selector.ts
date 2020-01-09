import {createSelector} from 'reselect';
import {OfiNavFundHistoryState} from './model';
import {OfiState} from '../../../index';

const getOfiState = (state): OfiState => state.ofi;

export const getOfiNavFundHistoryCurrentRequest = createSelector(
    getOfiState,
    (state: OfiState) => {
        return state.ofiProduct.ofiManageNav.ofiNavFundHistory.currentRequest;
    }
);
