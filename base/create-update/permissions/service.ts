import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { MemberSocketService } from '@setl/websocket-service';

import {
    SET_ACCOUNT_ADMIN_PERMISSION_AREAS,
    setRequestedAccountAdminPermissionAreas,
    SET_ACCOUNT_ADMIN_USER_PERMISSION_AREAS,
    setRequestedAccountAdminUserPermissionAreas,
} from '@setl/core-store';

import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { AccountAdminBaseService } from '../../../base/service';
import { RequestCallback } from '../../../base/model';
import {
    ReadUserPermissionAreasRequest,
    ReadTeamPermissionAreasRequest,
    UpdateTeamPermissionRequest,
} from './model';

@Injectable()
export class AccountAdminPermissionsServiceBase extends AccountAdminBaseService {
    constructor(redux: NgRedux<any>,
                private memberSocketService: MemberSocketService) {
        super(redux);
    }

    /**
     * Read Team Permission Areas
     *
     * @param state
     * @param userTeamId pass null to retrieve all teams
     * @param onSuccess
     * @param onError
     */
    readTeamPermissionAreas(userTeamID: number): void {

        const request: ReadTeamPermissionAreasRequest = {
            RequestName: 'readteampermissionareas',
            token: this.memberSocketService.token,
            userTeamID,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 setRequestedAccountAdminPermissionAreas,
                                 SET_ACCOUNT_ADMIN_PERMISSION_AREAS,
                                 () => {},
                                 () => {});
    }

    /**
     * Read User Permission Areas
     *
     * @param userId
     * @param onSuccess
     * @param onError
     */
    readUserPermissionAreas(userID: number, userTeamID?: number): void {
        const request: ReadUserPermissionAreasRequest = {
            RequestName: 'readuserpermissionareas',
            token: this.memberSocketService.token,
            userID,
            userTeamID,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 setRequestedAccountAdminUserPermissionAreas,
                                 SET_ACCOUNT_ADMIN_USER_PERMISSION_AREAS,
                                 () => {},
                                 () => {});
    }

    /**
    * Update Team Permission
    *
    * @param state
    * @param userTeamId pass null to retrieve all teams
    * @param permissionAreaID
    * @param onSuccess
    * @param onError
    */
    updateTeamPermission(state: boolean,
                         userTeamID: number,
                         permissionAreaID: number,
                         onSuccess: RequestCallback,
                         onError: RequestCallback): void {

        const request: UpdateTeamPermissionRequest = {
            RequestName: 'updateteampermission',
            token: this.memberSocketService.token,
            state,
            userTeamID,
            permissionAreaID,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 undefined,
                                 undefined,
                                 onSuccess,
                                 onError);
    }
}
