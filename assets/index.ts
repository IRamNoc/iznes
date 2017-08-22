import {combineReducers, Reducer} from 'redux';

import {
    MyIssuersState,
    MyIssuersReducer,
    REGISTER_ISSUER_SUCCESS,
    REGISTER_ISSUER_FAIL,
    getNewIssuerRequest,
    finishRegisterIssuerNotification
} from './my-issuers';

export {
    REGISTER_ISSUER_SUCCESS,
    REGISTER_ISSUER_FAIL,
    getNewIssuerRequest,
    finishRegisterIssuerNotification
};

export interface AssetState {
    myIssuers: MyIssuersState;
}

export const assetReducer: Reducer<AssetState> = combineReducers({
    myIssuers: MyIssuersReducer
});


