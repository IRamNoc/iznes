import {createSelector} from 'reselect';
import {OfiFundShareDocsState} from './model';
import {OfiState} from '../../../index';

const getOfiState = (state): OfiState => state.ofi;

export const getOfiFundShareDocsCurrentRequest = createSelector(
    getOfiState,
    (state: OfiState) => {
        return state.ofiProduct.ofiFundShareDocs.currentRequest;
    }
);
