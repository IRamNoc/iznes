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
    clearRequestedWalletIssuer,
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
    clearRequestedWalletInstrument,
    SET_MY_INSTRUMENTS_LIST,
    ISSUE_ASSET_SUCCESS,
    ISSUE_ASSET_FAIL,
    finishIssueAssetNotification,

    // Selectors
    getNewInstrumentRequest,
    getRequestedInstrumentState,
    getMyInstrumentsList,
    getNewIssueAssetRequest
} from './my-instruments';

import {
    // State and reducer
    AllInstrumentsState,
    AllInstrumentsReducer,

    // Actions and action creator
    SET_ALL_INSTRUMENTS_LIST,
    setRequesteAllInstruments,
    clearRequestedAllInstruments
} from './all-instruments';

export {
    REGISTER_ISSUER_SUCCESS,
    REGISTER_ISSUER_FAIL,
    getNewIssuerRequest,
    finishRegisterIssuerNotification,
    getRequestedIssuerState,
    setRequestedWalletIssuer,
    clearRequestedWalletIssuer,
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
    clearRequestedWalletInstrument,
    SET_MY_INSTRUMENTS_LIST,
    ISSUE_ASSET_SUCCESS,
    ISSUE_ASSET_FAIL,
    getNewInstrumentRequest,
    getRequestedInstrumentState,
    getMyInstrumentsList,
    getNewIssueAssetRequest,
    finishIssueAssetNotification
};

export {
    SET_ALL_INSTRUMENTS_LIST,
    setRequesteAllInstruments,
    clearRequestedAllInstruments
};

export interface AssetState {
    myIssuers: MyIssuersState;
    myInstruments: MyInstrumentsState;
    allInstruments: AllInstrumentsState;
}

export const assetReducer: Reducer<AssetState> = combineReducers<AssetState>({
    myIssuers: MyIssuersReducer,
    myInstruments: MyInstrumentsReducer,
    allInstruments: AllInstrumentsReducer
});
