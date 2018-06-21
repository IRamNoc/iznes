import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import {
    SET_ACCOUNT_ADMIN_TEAMS,
    setRequestedAccountAdminTeams,
} from '@setl/core-store';
import { SagaHelper } from '@setl/utils';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { MemberSocketService } from '@setl/websocket-service';

import {
    RequestCallback,
    ReadUserTeamsRequest,
    CreateUserTeamRequest,
    UpdateUserTeamRequest,
    DeleteUserTeamRequest,
} from './model';

@Injectable()
export class UserTeamsService {
    constructor(private redux: NgRedux<any>,
                private memberSocketService: MemberSocketService) {}

    /**
     * Read User Teams
     *
     * @param userTeamId pass null to retrieve all teams
     * @param onSuccess
     * @param onError
     */
    readUserTeams(userTeamId: number,
                  onSuccess: RequestCallback,
                  onError: RequestCallback): void {

        const request: ReadUserTeamsRequest = {
            RequestName: 'readUserTeams',
            token: this.memberSocketService.token,
            userTeamID: userTeamId,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 setRequestedAccountAdminTeams,
                                 SET_ACCOUNT_ADMIN_TEAMS,
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
                                 setRequestedAccountAdminTeams,
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
                                 setRequestedAccountAdminTeams,
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
                                 setRequestedAccountAdminTeams,
                                 undefined,
                                 onSuccess,
                                 onError);
    }

    /**
     * Make API Call
     *
     * @param asyncTaskPipe
     * @param setRequestedMethod
     * @param successType
     * @param successCallback
     * @param errorCallback
     */
    private callAccountAdminAPI(asyncTaskPipe: { [key: string]: any },
                                setRequestedMethod: () => any,
                                successType: any,
                                successCallback: (data) => void,
                                errorCallback: (e) => void): void {
        this.redux.dispatch(setRequestedMethod());

        this.redux.dispatch(SagaHelper.runAsync(
            [successType],
            [],
            asyncTaskPipe,
            {},
            successCallback,
            errorCallback,
        ));
    }

}
