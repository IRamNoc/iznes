import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import {
    SET_ACCOUNT_ADMIN_TEAMS,
    setRequestedAccountAdminTeams,
    SET_ACCOUNT_ADMIN_TEAMS_AUDIT,
    setRequestedAccountAdminTeamsAudit,
} from '@setl/core-store';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { MemberSocketService } from '@setl/websocket-service';

import { RequestCallback } from '../base/model';
import { AccountAdminBaseService } from '../base/service';

import {
    ReadUserTeamsRequest,
    CreateUserTeamRequest,
    UpdateUserTeamRequest,
    DeleteUserTeamRequest,
    ReadUserTeamsAuditRequest,
} from './model';

@Injectable()
export class UserTeamsService extends AccountAdminBaseService {
    constructor(redux: NgRedux<any>,
                private memberSocketService: MemberSocketService) {
        super(redux);
    }

    /**
     * Read User Teams
     *
     * @param userTeamId pass null to retrieve all teams
     * @param onSuccess
     * @param onError
     */
    readUserTeams(userTeamId: number,
                  textSearch: string,
                  onSuccess: RequestCallback,
                  onError: RequestCallback): void {

        const request: ReadUserTeamsRequest = {
            RequestName: 'readUserTeams',
            token: this.memberSocketService.token,
            userTeamID: userTeamId,
            textSearch,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 (userTeamId) ? undefined : setRequestedAccountAdminTeams,
                                 (userTeamId) ? undefined : SET_ACCOUNT_ADMIN_TEAMS,
                                 onSuccess,
                                 onError);
    }

    /**
     * Create User Team
     *
     * @param accountID
     * @param status
     * @param name
     * @param reference
     * @param description
     * @param onSuccess
     * @param onError
     */
    createUserTeam(accountID: number,
                   status: boolean,
                   name: string,
                   reference: string,
                   description: string,
                   onSuccess: RequestCallback,
                   onError: RequestCallback): void {

        const request: CreateUserTeamRequest = {
            RequestName: 'createUserTeam',
            token: this.memberSocketService.token,
            accountID,
            status,
            name,
            reference,
            description,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 undefined,
                                 undefined,
                                 onSuccess,
                                 onError);
    }

    /**
     * Update User Team
     *
     * @param userTeamID
     * @param status
     * @param name
     * @param reference
     * @param description
     * @param onSuccess
     * @param onError
     */
    updateUserTeam(userTeamID: number,
                   status: boolean,
                   name: string,
                   reference: string,
                   description: string,
                   onSuccess: RequestCallback,
                   onError: RequestCallback): void {

        const request: UpdateUserTeamRequest = {
            RequestName: 'updateUserTeam',
            token: this.memberSocketService.token,
            userTeamID,
            status,
            name,
            reference,
            description,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 undefined,
                                 undefined,
                                 onSuccess,
                                 onError);
    }

    /**
     * Delete User Team
     *
     * @param userTeamID
     * @param onSuccess
     * @param onError
     */
    deleteUserTeam(userTeamID: number,
                   onSuccess: RequestCallback,
                   onError: RequestCallback): void {

        const request: DeleteUserTeamRequest = {
            RequestName: 'deleteUserTeam',
            token: this.memberSocketService.token,
            userTeamID,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 undefined,
                                 undefined,
                                 onSuccess,
                                 onError);
    }

    /**
     * Read User Teams
     *
     * @param userTeamId pass null to retrieve all teams
     * @param onSuccess
     * @param onError
     */
    readUserTeamsAudit(search: string,
                       dateFrom: string,
                       dateTo: string,
                       onSuccess: RequestCallback,
                       onError: RequestCallback): void {

        const request: ReadUserTeamsAuditRequest = {
            RequestName: 'readUserTeamsAudit',
            token: this.memberSocketService.token,
            search,
            dateFrom,
            dateTo,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 setRequestedAccountAdminTeamsAudit,
                                 SET_ACCOUNT_ADMIN_TEAMS_AUDIT,
                                 onSuccess,
                                 onError);
    }

}
