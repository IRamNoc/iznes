import {createSelector} from 'reselect';
import {OfiFundShareSelectedFundState} from './model';
import {OfiState} from '../../../index';

const getOfiState = (state): OfiState => state.ofi;

export const getOfiFundShareSelectedFund = createSelector(
    getOfiState,
    (state: OfiState) => {
        return state.ofiProduct.ofiFundShareSelectedFund.currentFundId;
    }
);
