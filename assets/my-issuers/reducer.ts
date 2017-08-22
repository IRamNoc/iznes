import {AsyncTaskResponseAction} from '@setl/utils/SagaHelper/actions';
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
    switch (action.type) {
        case MyIssuersActions.REGISTER_ISSUER_SUCCESS:
            const registerIssuerData = _.get(action, 'payload[1].data', []);

            const issuerIdentifier = _.get(registerIssuerData, 'namespace', '');
            const issuerAddress = _.get(registerIssuerData, 'fromaddr', '');
            const txHash = _.get(registerIssuerData, 'hash', '');
            const status = true;
            const needNotify = true;

            const newIssuerRequest = {
                issuerIdentifier,
                issuerAddress,
                txHash,
                status,
                needNotify
            };

            const newState = Object.assign({}, state, {
                newIssuerRequest
            });

            return newState;

        case MyIssuersActions.FINISH_REGISTER_ISSUER_NOTIFICATION:
            const needNotify = false;

            const newIssuerRequest = Object.assign({}, state.newIssuerRequest, {
                needNotify
            });
            const newState = Object.assign({}, state, {
                newIssuerRequest
            });

            return newState;

        default:
            return state;
    }
};

