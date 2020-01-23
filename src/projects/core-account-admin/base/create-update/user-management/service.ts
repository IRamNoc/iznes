import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { MemberSocketService } from '@setl/websocket-service';

import { UpdateTeamUserMapRequest, ReadTeamUserMapRequest } from './model';
import { RequestCallback } from '../../../base/model';
import { AccountAdminBaseService } from '../../../base/service';

@Injectable()
export class UserManagementServiceBase extends AccountAdminBaseService {
    constructor(redux: NgRedux<any>,
                private memberSocketService: MemberSocketService) {
        super(redux);
    }

    /**
     * Read Team User Map
     *
     * @param state
     * @param userId
     * @param userTeamId
     * @param onSuccess
     * @param onError
     */
    readTeamUserMap(userId: number,
                    userTeamId: number,
                    onSuccess: RequestCallback,
                    onError: RequestCallback): void {

        const request: ReadTeamUserMapRequest = {
            RequestName: 'readuserteamusermap',
            token: this.memberSocketService.token,
            userID: userId,
            userTeamID: userTeamId,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 undefined,
                                 undefined,
                                 onSuccess,
                                 onError);
    }

    /**
     * Update Team User Map
     *
     * @param state
     * @param userId
     * @param userTeamId
     * @param onSuccess
     * @param onError
     */
    updateTeamUserMap(state: boolean,
                      userId: number,
                      userTeamId: number,
                      onSuccess: RequestCallback,
                      onError: RequestCallback): void {

        const request: UpdateTeamUserMapRequest = {
            RequestName: 'updateuserteamusermap',
            token: this.memberSocketService.token,
            state,
            userID: userId,
            userTeamID: userTeamId,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 undefined,
                                 undefined,
                                 onSuccess,
                                 onError);
    }
}
