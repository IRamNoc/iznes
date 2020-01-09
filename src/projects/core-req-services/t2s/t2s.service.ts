import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common, LogService} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {
    BasicRequestBody,

    /* Messages */
    NewMessageBody,
    GetMessagesBody,
} from './t2s.service.model';
import {
    SET_WALLET_NODE_LIST,
    setRequestedWalletNodeList,
    setRequestedChainList,
    SET_CHAIN_LIST
} from '@setl/core-store';
import {NgRedux} from '@angular-redux/store';
import * as _ from 'lodash';

@Injectable()
export class T2sService {

    constructor(private memberSocketService: MemberSocketService, private logService: LogService) {
        /* Stub. */
    }

    public buildRequest(request): any {
        /* Check for request pipe. */
        if (!request.taskPipe) {
            return;
        }

        /* Build new promise. */
        return new Promise((resolve, reject) => {
            /* Dispatch. */
            request.ngRedux.dispatch(
                SagaHelper.runAsync(
                    request.successActions || [],
                    request.failActions || [],
                    request.taskPipe,
                    {},
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        reject(error);
                    }
                )
            );
        });
    }

    /*
     Message Functions
     =================
     */
    public requestMessageList() {
        /* Setup the message body. */
        const messageBody: BasicRequestBody = {
            RequestName: 't2sGet',
            token: this.memberSocketService.token
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public newMessage(messageData: any): any {
        /* Setup the message body. */
        this.logService.log(' | T2S sending: ', messageData.message ? messageData.message : messageData);
        const messageBody: NewMessageBody = {
            RequestName: 't2sNew',
            token: this.memberSocketService.token,
            message: messageData.message ? messageData.message : messageData,
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public pingRequest (): any {
        /* Setup the message body. */
        const messageBody: BasicRequestBody = {
            RequestName: 't2sPing',
            token: this.memberSocketService.token
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }


}
