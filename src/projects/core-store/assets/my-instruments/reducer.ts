import {Action} from 'redux';
import * as MyInstrumentActions from './actions';
import {InstrumentDetail, NewInstrumentRequest, MyInstrumentsState} from './model';
import * as _ from 'lodash';
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
    },
    newIssueAssetRequest: {
        issuerIdentifier: '',
        issuerAddress: '',
        instrument: '',
        toAddress: '',
        amount: 0,
        txHash: '',
        status: false,
        needNotify: false
    },
    newSendAssetRequest: {
        issuerIdentifier: '',
        issuerAddress: '',
        instrument: '',
        toAddress: '',
        amount: 0,
        txHash: '',
        status: false,
        needNotify: false
    }
};

export const MyInstrumentsReducer = function (state: MyInstrumentsState = initialState,
                                              action: Action): MyInstrumentsState {
    let registerInstrumentData;
    let needNotify;
    let newInstrumentRequest;
    let newState;
    let requestedWalletInstrument;
    let instrumentListRawData;
    let instrumentList;
    let issueAssetRawData;
    let sendAssetRawData;
    let newIssueAssetRequest;
    let newSendAssetRequest;

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


        case MyInstrumentActions.CLEAR_REQUESTED_WALLET_INSTRUMENT:
            requestedWalletInstrument = false;

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

        case MyInstrumentActions.ISSUE_ASSET_SUCCESS:
            issueAssetRawData = _.get(action, 'payload[1]data', []);

            newIssueAssetRequest = {
                issuerIdentifier: _.get(issueAssetRawData, 'namespace', ''),
                issuerAddress: _.get(issueAssetRawData, 'fromaddr', ''),
                instrument: _.get(issueAssetRawData, 'classid', ''),
                toAddress: _.get(issueAssetRawData, 'toaddr', ''),
                amount: _.get(issueAssetRawData, 'amount', ''),
                txHash: _.get(issueAssetRawData, 'hash', ''),
                status: true,
                needNotify: true
            };

            newState = Object.assign({}, state, {
                newIssueAssetRequest
            });

            return newState;

        case MyInstrumentActions.ISSUE_ASSET_FAIL:
            newIssueAssetRequest = {
                issuerIdentifier: '',
                issuerAddress: '',
                instrument: '',
                toAddress: '',
                amount: 0,
                txHash: '',
                status: false,
                needNotify: false
            };

            newState = Object.assign({}, state, {
                newIssueAssetRequest
            });

            return newState;

        case MyInstrumentActions.SEND_ASSET_SUCCESS:
            sendAssetRawData = _.get(action, 'payload[1]data', []);

            newSendAssetRequest = {
                issuerIdentifier: _.get(sendAssetRawData, 'namespace', ''),
                issuerAddress: _.get(sendAssetRawData, 'fromaddr', ''),
                instrument: _.get(sendAssetRawData, 'classid', ''),
                toAddress: _.get(sendAssetRawData, 'toaddr', ''),
                amount: _.get(sendAssetRawData, 'amount', ''),
                txHash: _.get(sendAssetRawData, 'hash', ''),
                status: true,
                needNotify: true
            };

            newState = Object.assign({}, state, {
                newSendAssetRequest
            });

            return newState;

        case MyInstrumentActions.SEND_ASSET_FAIL:
            newIssueAssetRequest = {
                issuerIdentifier: '',
                issuerAddress: '',
                instrument: '',
                toAddress: '',
                amount: 0,
                txHash: '',
                status: false,
                needNotify: false
            };

            newState = Object.assign({}, state, {
                newIssueAssetRequest
            });

            return newState;


        case MyInstrumentActions.FINISH_ISSUE_ASSET_NOTIFICATION:
            needNotify = false;

            newIssueAssetRequest = Object.assign({}, state.newIssueAssetRequest, {
                needNotify
            });
            newState = Object.assign({}, state, {
                newIssueAssetRequest
            });

            return newState;

        case MyInstrumentActions.FINISH_SEND_ASSET_NOTIFICATION:
            needNotify = false;

            newSendAssetRequest = Object.assign({}, state.newSendAssetRequest, {
                needNotify
            });
            newState = Object.assign({}, state, {
                newSendAssetRequest
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
