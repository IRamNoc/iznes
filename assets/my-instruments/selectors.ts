import {createSelector} from 'reselect';
import {AssetState} from '../index';
import {MyInstrumentsState} from './index';

const getAsset = (state): AssetState => state.asset;

export const getMyInstruments = createSelector(
    getAsset,
    (state: AssetState) => state.myInstruments
);

export const getNewInstrumentRequest = createSelector(
    getMyInstruments,
    (state: MyInstrumentsState) => state.newInstrumentRequest
);

export const getRequestedInstrumentState = createSelector(
    getMyInstruments,
    (state: MyInstrumentsState) => state.requestedWalletInstrument
);

