import {createSelector} from 'reselect';
import {OfiNavFundViewState} from './model';
import {OfiState} from '../../../index';

const getOfiState = (state): OfiState => state.ofi;

export const getOfiNavFundViewCurrentRequest = createSelector(
    getOfiState,
    (state: OfiState) => {
        return state.ofiProduct.ofiManageNav.ofiNavFundView.currentRequest;
    }
);
