import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';
import * as MyIssuersActions from './actions';
import {MyIssuersState, IssuerDetail, NewIssuerRequest} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: MyIssuersState = {
    issuerList: [],
    newIssuerRequest: {
        issuerIdentifier: '',
        issuerAddress: '',
        txHash: '',
        status: false,
        needNotify: false
    }
};

export const MyIssuersReducer = function (state: MyIssuersState = initialState,
                                          action: AsyncTaskResponseAction) {
    let registerIssuerData;
    let issuerIdentifier;
    let issuerAddress;
    let txHash;
    let status;
    let needNotify;
    let newIssuerRequest;
    let newState;

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

        case MyIssuersActions.FINISH_REGISTER_ISSUER_NOTIFICATION:
            needNotify = false;

            newIssuerRequest = Object.assign({}, state.newIssuerRequest, {
                needNotify
            });
            newState = Object.assign({}, state, {
                newIssuerRequest
            });

            return newState;

        default:
            return state;
    }
};

