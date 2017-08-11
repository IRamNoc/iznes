import * as SagaHelper from './sagaHelper';
import {always as k} from 'ramda';

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
            thisConnection.sendRequest(request, (errorCode, data) => {
                // No error code -> success.
                if (errorCode == null) {
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
