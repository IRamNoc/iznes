import * as SagaHelper from './sagaHelper';
import {always as k} from 'ramda';
import _ from 'lodash';

export const kAction = type => k({type});


/******************************************************************************************************************
 *
 * Request interface definitions
 *
 *****************************************************************************************************************/

/**
 * member node request
 */
export interface MemberNodeMessageBody {
    RequestName: string;
}

export interface MemberNodeRequest {
    MessageType: string;
    MessageHeader: string;
    RequestID: number;
    MessageBody: MemberNodeMessageBody;
}

/**
 * Create our RUN_ASYNC_TASK descriptor, for our saga asynchronous task middleware.
 *
 * @param thisConnection
 * @param messageBody
 * @return {{pipe: any[]}}
 */
export function createMemberNodeSagaRequest(thisConnection, messageBody: MemberNodeMessageBody): any {
    const request: MemberNodeRequest = {
        MessageType: 'DataRequest',
        MessageHeader: '',
        RequestID: 0, // RequestID in here is just legacy support. that is why the RequestID is 0.
        MessageBody: messageBody
    };

    return SagaHelper.create(async () => {
        const response = await new Promise((resolve, reject) => {
            thisConnection.sendRequest(request, (messageId, data, userData) => {
                const status = _.get(data, 'Data[0].Status', 'Fail');
                // status is ok -> success.
                if (status === 'OK') {
                    // success
                    resolve([messageId, data, userData]);
                } else {
                    // fail
                    reject([messageId, data, userData]);
                }
            });
        });

        const result = await response;

        return result;
    });
}

/**
 * Wallet node request
 */
export interface WalletNodeMessageBody {
    topic: string;
}

export interface WalletNodeRequest {
    messageType: string;
    messageHeader: string;
    requestID: number;
    messageBody: WalletNodeMessageBody;
}


/**
 * Create our RUN_ASYNC_TASK descriptor, for our saga asynchronous task middleware.
 *
 * @param thisConnection
 * @param messageType
 * @param messageBody
 * @return {{pipe: any[]}}
 */
export function createWalletNodeSagaRequest(thisConnection, messageType: string, messageBody: WalletNodeMessageBody): any {
    const request: WalletNodeRequest = {
        messageType: messageType,
        messageHeader: '',
        requestID: 0, // requestID in here will be set later in sendRequest method.
        messageBody: messageBody
    };

    return SagaHelper.create(async () => {
        const response = await new Promise((resolve, reject) => {
            thisConnection.sendRequest(request, (errorCode, data) => {
                const status = _.get(data, 'status', 'Fail');
                // No error code and status is ok -> success.
                if (status === 'OK') {
                    // success
                    resolve([errorCode, data]);
                } else {
                    // fail
                    reject([errorCode, data]);
                }
            });
        });

        const result = await response;

        return result;
    });
}