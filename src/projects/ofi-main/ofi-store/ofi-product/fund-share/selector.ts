import {createSelector} from 'reselect';
import {OfiFundShareState} from './model';
import {OfiState} from '../../../index';

const getOfiState = (state): OfiState => state.ofi;

export const getOfiFundShareCurrentRequest = createSelector(
    getOfiState,
    (state: OfiState) => {
        return state.ofiProduct.ofiFundShare.currentRequest;
    }
);
