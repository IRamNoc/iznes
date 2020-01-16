import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';
import * as MyIssuersActions from './actions';
import {
    SET_LAST_CREATED_REGISTER_ISSUER_DETAIL,
    UPDATE_LAST_CREATED_REGISTER_ISSUER_DETAIL,
    CLEAR_REGISTER_ISSUER_NEED_HANDLE
} from './actions';
import {MyIssuersState, IssuerDetail, NewIssuerRequest} from './model';
import * as _ from 'lodash';
import {List, fromJS, Map} from 'immutable';
import {immutableHelper} from '@setl/utils';

const initialState: MyIssuersState = {
    issuerList: [],
    requestedWalletIssuer: false,
    newIssuerRequest: {
        issuerIdentifier: '',
        issuerAddress: '',
        txHash: '',
        status: false,
        needNotify: false
    },
    walletIssuerDetail: {
        walletIssuer: '',
        walletIssuerAddress: ''
    },
    lastCreated: {
        txHash: '',
        fromAddress: '',
        namespace: '',
        inBlockchain: false,
        needHandle: false,
        metaData: false
    }
};

export const MyIssuersReducer = function (state: MyIssuersState = initialState,
                                          action: AsyncTaskResponseAction): MyIssuersState {
    let registerIssuerData;
    let issuerIdentifier;
    let issuerAddress;
    let txHash;
    let status;
    let needNotify;
    let newIssuerRequest;
    let newState;
    let requestedWalletIssuer;
    let issuerListData;
    let issuerList;
    let walletIssuer;
    let walletIssuerAddress;
    let walletIssuerDetail;

    switch (action.type) {
        case MyIssuersActions.REGISTER_ISSUER_SUCCESS:
            registerIssuerData = _.get(action, 'payload[1].data', []);

            issuerIdentifier = _.get(registerIssuerData, 'namespace', '');
            issuerAddress = _.get(registerIssuerData, 'fromaddr', '');
            txHash = _.get(registerIssuerData, 'hash', '');
            status = true;
            needNotify = true;

            newIssuerRequest = {
                issuerIdentifier,
                issuerAddress,
                txHash,
                status,
                needNotify
            };

            newState = Object.assign({}, state, {
                newIssuerRequest
            });

            return newState;

        case MyIssuersActions.REGISTER_ISSUER_FAIL:
            return state;

        case MyIssuersActions.FINISH_REGISTER_ISSUER_NOTIFICATION:
            needNotify = false;

            newIssuerRequest = Object.assign({}, state.newIssuerRequest, {
                needNotify
            });
            newState = Object.assign({}, state, {
                newIssuerRequest
            });

            return newState;

        case MyIssuersActions.SET_REQUESTED_WALLET_ISSUER:
            requestedWalletIssuer = true;

            newState = Object.assign({}, state, {
                requestedWalletIssuer
            });

            return newState;

        case MyIssuersActions.CLEAR_REQUESTED_WALLET_ISSUER:
            requestedWalletIssuer = false;

            newState = Object.assign({}, state, {
                requestedWalletIssuer
            });

            return newState;

        case MyIssuersActions.SET_WALLET_ISSUER_LIST:
            issuerListData = _.get(action, 'payload[1][data]');
            issuerList = formatToWalletIssuerList(issuerListData);
            walletIssuer = _.get(issuerListData, '[0][0]', '');
            walletIssuerAddress = _.get(issuerListData, '[0][1]', '');
            walletIssuerDetail = {
                walletIssuer,
                walletIssuerAddress
            };


            newState = Object.assign({}, state, {
                issuerList,
                walletIssuerDetail
            });

            return newState;

        case SET_LAST_CREATED_REGISTER_ISSUER_DETAIL:
            return handleSetLastCreatedRegisterIssuerDetail(state, action);

        case UPDATE_LAST_CREATED_REGISTER_ISSUER_DETAIL:
            return updateLastCreatedRegisterIssuerDetail(state, action);

        case CLEAR_REGISTER_ISSUER_NEED_HANDLE:
            return handleClearRegisterIssuerNeedHandle(state);

        default:
            return state;
    }
};


function formatToWalletIssuerList(rawWalletIssuerData: Array<any>): {
    [key: string]: IssuerDetail
} {
    const rawWalletIssuerDataList = fromJS(rawWalletIssuerData);

    const walletIssuerObject = Map(rawWalletIssuerDataList.reduce(function (result, item) {
        result[item.get(0)] = {
            issuer: item.get(0),
            issuerAddress: item.get(1)
        };

        return result;

    }, {}));

    return walletIssuerObject.toJS();
}


function handleSetLastCreatedRegisterIssuerDetail(state: MyIssuersState, action: any): MyIssuersState {
    const registerIssuerData = _.get(action, 'data[1].data', {});
    const txHash = _.get(registerIssuerData, 'hash', '');
    const fromAddress = _.get(registerIssuerData, 'fromaddr', '');
    const namespace = _.get(registerIssuerData, 'namespace', '');
    const inBlockchain = false;
    const needHandle = true;
    const metaData = _.get(action, 'metaData', {});

    const lastCreated = {
        txHash,
        fromAddress,
        namespace,
        inBlockchain,
        needHandle,
        metaData
    };

    return Object.assign({}, state, {
        lastCreated
    });
}

function updateLastCreatedRegisterIssuerDetail(state: MyIssuersState, action: any): MyIssuersState {
    // find all updated contract.
    const registerIssuerTx = _.get(action, 'data', []);

    // the last created tx hash.
    const lastCreatedTxHash = state.lastCreated.txHash;

    // the hash of transaction to check.
    const registerIssuerTxHash = _.get(registerIssuerTx, '[3]', '');

    const inBlockchain = lastCreatedTxHash === registerIssuerTxHash;
    const oldLastCreated = state.lastCreated;
    const lastCreated = Object.assign({}, oldLastCreated, {
        inBlockchain
    });

    return Object.assign({}, state, {
        lastCreated
    });
}

/**
 * handle clear register issuer need handle.
 * @param {MyIssuersState} state
 * @return {MyIssuersState}
 */
function handleClearRegisterIssuerNeedHandle(state: MyIssuersState): MyIssuersState {
    const oldLastCreated = state.lastCreated;
    const needHandle = false;
    const lastCreated = Object.assign({}, oldLastCreated, {
        needHandle
    });

    return Object.assign({}, state, {
        lastCreated
    });
}
