import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import {
    SET_ACCOUNT_ADMIN_USERS,
    setRequestedAccountAdminUsers,
} from '@setl/core-store';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { MemberSocketService } from '@setl/websocket-service';

import { RequestCallback } from '../base/model';
import { AccountAdminBaseService } from '../base/service';

import {
    ReadUsersRequest,
} from './model';

@Injectable()
export class UsersService extends AccountAdminBaseService {
    constructor(redux: NgRedux<any>,
                private memberSocketService: MemberSocketService) {
        super(redux);
    }

    /**
     * Read Users
     *
     * @param userId request a specific user
     * @param accountId gets the users for the am using accountId
     * @param onSuccess
     * @param onError
     */
    readUsers(userId: number,
              accountId: number,
              onSuccess: RequestCallback,
              onError: RequestCallback): void {

        const request: ReadUsersRequest = {
            RequestName: 'readUsers',
            token: this.memberSocketService.token,
            userID: userId,
            accountID: accountId,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 setRequestedAccountAdminUsers,
                                 SET_ACCOUNT_ADMIN_USERS,
                                 onSuccess,
                                 onError);
    }

}
