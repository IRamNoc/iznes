import {Action} from 'redux';
import * as MyInstrumentActions from './actions';
import {InstrumentDetail, NewInstrumentRequest, MyInstrumentsState} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: MyInstrumentsState = {
    instrumentList: {},
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
    let needNotify;
    let newInstrumentRequest;
    let newState;
    let requestedWalletInstrument;
    let instrumentListRawData;
    let instrumentList;

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

            newInstrumentRequest = Object.assign({}, state.newInstrumentRequest, {
                needNotify
            });
            newState = Object.assign({}, state, {
                newInstrumentRequest
            });

            return newState;

        case MyInstrumentActions.SET_REQUESTED_WALLET_INSTRUMENT:
            requestedWalletInstrument = true;

            newState = Object.assign({}, state, {
                requestedWalletInstrument
            });

            return newState;

        case MyInstrumentActions.SET_MY_INSTRUMENTS_LIST:
            instrumentListRawData = _.get(action, 'payload[1]data', []);

            instrumentList = formatToWalletInstrumentList(instrumentListRawData);

            newState = Object.assign({}, state, {
                instrumentList
            });

            return newState;

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

/**
 * Convert raw wallet instrument list response to the format we want
 * @param rawInstruments
 */
function formatToWalletInstrumentList(rawInstruments: Array<any>): {
    [key: string]: InstrumentDetail
} {
    const rawInstrumentsList = fromJS(rawInstruments);

    const walletInstrumentObject = rawInstrumentsList.reduce(
        function (result, item) {
            const issuer = item.get(1);
            const instrument = item.get(2);
            const issuerAddress = item.get(0);
            const assetName = issuer + '|' + instrument;

            result[assetName] = {
                issuer,
                instrument,
                issuerAddress
            };

            return result;
        }, {}
    );

    return walletInstrumentObject;
}
