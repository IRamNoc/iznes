import {combineReducers, Reducer} from 'redux';

import {
    MyIssuersState,
    MyIssuersReducer,
    REGISTER_ISSUER_SUCCESS,
    REGISTER_ISSUER_FAIL,
    getNewIssuerRequest,
    finishRegisterIssuerNotification,
    getRequestedIssuerState,
    setRequestedWalletIssuer,
    SET_WALLET_ISSUER_LIST,
    getWalletIssuerDetail
} from './my-issuers';

import {
    // State and reducer
    MyInstrumentsState,
    MyInstrumentsReducer,

    // Actions and action creator
    REGISTER_ASSET_SUCCESS,
    REGISTER_ASSET_FAIL,
    finishRegisterInstrumentNotification,
    setRequestedWalletInstrument,
    SET_MY_INSTRUMENTS_LIST,

    // Selectors
    getNewInstrumentRequest,
    getRequestedInstrumentState,
    getMyInstrumentsList
} from './my-instruments';

export {
    REGISTER_ISSUER_SUCCESS,
    REGISTER_ISSUER_FAIL,
    getNewIssuerRequest,
    finishRegisterIssuerNotification,
    getRequestedIssuerState,
    setRequestedWalletIssuer,
    SET_WALLET_ISSUER_LIST,
    getWalletIssuerDetail
};

export {
    MyInstrumentsState,
    MyInstrumentsReducer,
    REGISTER_ASSET_SUCCESS,
    REGISTER_ASSET_FAIL,
    finishRegisterInstrumentNotification,
    setRequestedWalletInstrument,
    SET_MY_INSTRUMENTS_LIST,
    getNewInstrumentRequest,
    getRequestedInstrumentState,
    getMyInstrumentsList
};

export interface AssetState {
    myIssuers: MyIssuersState;
    myInstruments: MyInstrumentsState;
}

export const assetReducer: Reducer<AssetState> = combineReducers({
    myIssuers: MyIssuersReducer,
    myInstruments: MyInstrumentsReducer
});


