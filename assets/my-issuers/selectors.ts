import {createSelector} from 'reselect';
import {AssetState} from '../index';
import {MyIssuersState} from './index';

const getAsset = (state): AssetState => state.asset;

export const getMyIssuers = createSelector(
    getAsset,
    (state: AssetState) => state.myIssuers
);

export const getNewIssuerRequest = createSelector(
    getMyIssuers,
    (state: MyIssuersState) => state.newIssuerRequest
);


