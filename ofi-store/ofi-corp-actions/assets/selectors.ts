import {createSelector} from 'reselect';
import {OfiState} from '../../index';
import {OfiUserAssetsState} from '.';
import {OfiCorpActionsState} from '../index';

const getOfi = (state): OfiState => {
    return state.ofi
};

const getOfiCorpActions = createSelector(
    getOfi,
    (state: OfiState): OfiCorpActionsState => {
        return state.ofiCorpActions
    }
);

export const getOfiUserAsset = createSelector(
    getOfiCorpActions,
    (state: OfiCorpActionsState): OfiUserAssetsState => {
        return state.ofiUserAssets
    }
);

export const getOfiUserIssuedAssets = createSelector(
    getOfiUserAsset,
    (state: OfiUserAssetsState): Array<any> => {
        return state.ofiUserAssetList
    }
);
