import {Action} from 'redux';
import * as MyInstrumentActions from './actions';
import {InstrumentDetail, NewInstrumentRequest, MyInstrumentsState} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: MyInstrumentsState = {
    instrumentList: [],
    requestedWalletInstrument: false,
    newInstrumentRequest: {
        issuerIdentifier: '',
        issuerAddress: '',
        instrument: '',
        txHash: '',
        status: false,
        needNotify: false
    }
};

export const MyInstrumentsReducer = function (state: MyInstrumentsState = initialState,
                                              action: Action) {
    let registerInstrumentData;
    let issuerIdentifier;
    let issuerAddress;
    let instrumentIdentifier;
    let txHash;
    let status;
    let needNotify;
    let newInstrumentRequest;
    let newState;

    switch (action.type) {
        case MyInstrumentActions.REGISTER_ASSET_SUCCESS:
            registerInstrumentData = _.get(action, 'payload[1].data', {});

            newInstrumentRequest = formatNewInstrumentRequest(registerInstrumentData);

            newState = Object.assign({}, state, {
                newInstrumentRequest
            });

            return newState;

        case MyInstrumentActions.REGISTER_ASSET_FAIL:
            return state;

        case MyInstrumentActions.FINISH_REGISTER_INSTRUMENT_NOTIFICATION:
            needNotify = false;
            //
            // newIssuerRequest = Object.assign({}, state.newIssuerRequest, {
            //     needNotify
            // });
            // newState = Object.assign({}, state, {
            //     newIssuerRequest
            // });

            return state;

        case MyInstrumentActions.SET_REQUESTED_WALLET_INSTRUMENT:
            return state;

        case MyInstrumentActions.SET_MY_INSTRUMENTS_LIST:
            return state;

        default:
            return state;
    }
};


function formatNewInstrumentRequest(rawRegisterInstrumentData: object): NewInstrumentRequest {
    const issuerIdentifier = _.get(rawRegisterInstrumentData, 'namespace', '');
    const issuerAddress = _.get(rawRegisterInstrumentData, 'fromaddr', '');
    const instrument = _.get(rawRegisterInstrumentData, 'classid', '');
    const txHash = _.get(rawRegisterInstrumentData, 'hash', '');
    const status = true;
    const needNotify = true;

    return {
        issuerIdentifier,
        issuerAddress,
        instrument,
        txHash,
        status,
        needNotify
    };
}

