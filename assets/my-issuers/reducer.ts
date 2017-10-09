import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';
import * as MyIssuersActions from './actions';
import {MyIssuersState, IssuerDetail, NewIssuerRequest} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

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
