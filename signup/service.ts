import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { MemberSocketService } from '@setl/websocket-service';

import { ReadInvitationRequest, CompleteUserSignupRequest } from './model';
import { RequestCallback } from '../base/model';
import { AccountAdminBaseService } from '../base/service';

@Injectable()
export class AccountSignupService extends AccountAdminBaseService {
    constructor(redux: NgRedux<any>,
                private memberSocketService: MemberSocketService) {
        super(redux);
    }

    /**
     * Read User Invitation
     *
     * @param invitationToken
     * @param onSuccess
     * @param onError
     */
    readUserInvitation(invitationToken: string,
                       onSuccess: RequestCallback,
                       onError: RequestCallback): void {

        const request: ReadInvitationRequest = {
            RequestName: 'readuserinvitation',
            invitationToken,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 undefined,
                                 undefined,
                                 onSuccess,
                                 onError);
    }

    /**
     * Complete user signup process
     *
     * @param token
     * @param username
     */
    completeUserSignup(invitationToken: string,
                       password: string,
                       onSuccess: () => void,
                       onError: () => void): void {

        const request: CompleteUserSignupRequest = {
            RequestName: 'completeusersignup',
            invitationToken,
            password,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 undefined,
                                 undefined,
                                 onSuccess,
                                 onError);
    }
}
