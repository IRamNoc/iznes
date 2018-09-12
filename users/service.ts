import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import {
    SET_ACCOUNT_ADMIN_USERS,
    setRequestedAccountAdminUsers,
    SET_USER_TYPES,
    setRequestedUserTypes,
    setRequestedAccountAdminUsersAudit,
    SET_ACCOUNT_ADMIN_USERS_AUDIT,
} from '@setl/core-store';
import { AdminUsersService } from '@setl/core-req-services';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { MemberSocketService } from '@setl/websocket-service';

import { RequestCallback, AccountAdminResponse } from '../base/model';
import { AccountAdminBaseService } from '../base/service';

import {
    ReadUsersRequest,
    CreateUserRequest,
    PostCreateUserRequest,
    UpdateUserDetailsRequest,
    DeleteUserRequest,
    ReadUsersAuditRequest,
    UpdateUserStatusRequest,
    InviteUserRequest,
} from './model';

@Injectable()
export class UsersService extends AccountAdminBaseService {
    constructor(redux: NgRedux<any>,
                private memberSocketService: MemberSocketService,
                private usersService: AdminUsersService) {
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
              textSearch: string,
              onSuccess: RequestCallback,
              onError: RequestCallback): void {

        const request: ReadUsersRequest = {
            RequestName: 'readUsers',
            token: this.memberSocketService.token,
            userID: userId,
            accountID: accountId,
            textSearch,
            isCSVRequest: false,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 (userId) ? undefined : setRequestedAccountAdminUsers,
                                 (userId) ? undefined : SET_ACCOUNT_ADMIN_USERS,
                                 onSuccess,
                                 onError);
    }

    /**
     * Create User
     *
     * @param accountId
     * @param firstName
     * @param lastName
     * @param emailAddress
     * @param phoneNumber
     * @param userType
     * @param reference
     * @param onSuccess
     * @param onError
     */
    createUser(account: number,
               firstName: string,
               lastName: string,
               email: string,
               phoneNumber: string,
               userType: number,
               reference: string,
               onSuccess: RequestCallback,
               onError: RequestCallback): void {

        const request: CreateUserRequest = {
            RequestName: 'createuser',
            token: this.memberSocketService.token,
            account,
            email,
            username: email,
            userType,
            password: this.generatePassword(16),
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 undefined,
                                 undefined,
                                 (data: AccountAdminResponse) => {
                                     const userId: number = data[1].Data[0].userID;

                                     if (userId === undefined) {
                                         onError(data);

                                         return;
                                     }

                                     this.updateUserDetails(
                                        userId,
                                        account,
                                        firstName,
                                        lastName,
                                        email,
                                        phoneNumber,
                                        userType,
                                        reference,
                                        () => {
                                            this.postCreateUser(userId, onSuccess, onError);
                                        },
                                        onError,
                                    );
                                 },
                                 onError);
    }

    /**
     * Post User Creation
     *
     * @param userId
     * @param onSuccess
     * @param onError
     */
    private postCreateUser(userId: number,
                           onSuccess: RequestCallback,
                           onError: RequestCallback): void {
        const request: PostCreateUserRequest = {
            RequestName: 'postcreateuser',
            token: this.memberSocketService.token,
            userID: userId,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 undefined,
                                 undefined,
                                 (data: AccountAdminResponse) => {
                                     onSuccess(data);
                                 },
                                 onError);
    }

    /**
     * Update User
     *
     * @param userId
     * @param accountId
     * @param firstName
     * @param lastName
     * @param emailAddress
     * @param phoneNumber
     * @param userType
     * @param reference
     * @param onSuccess
     * @param onError
     */
    updateUser(userId: number,
               accountId: number,
               firstName: string,
               lastName: string,
               email: string,
               phoneNumber: string,
               userType: number,
               reference: string,
               onSuccess: RequestCallback,
               onError: RequestCallback): void {

        this.updateUserDetails(
            userId,
            accountId,
            firstName,
            lastName,
            email,
            phoneNumber,
            userType,
            reference,
            onSuccess,
            onError,
        );
    }

    /**
     * Update User Status
     *
     * @param userId
     * @param status
     * @param onSuccess
     * @param onError
     */
    updateUserStatus(userID: number,
                     status: number,
                     onSuccess: RequestCallback,
                     onError: RequestCallback): void {

        const request: UpdateUserStatusRequest = {
            RequestName: 'updateUserStatus',
            token: this.memberSocketService.token,
            userID,
            status,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 undefined,
                                 undefined,
                                 onSuccess,
                                 onError);
    }

    private updateUserDetails(userId: number,
                              accountId: number,
                              firstName: string,
                              lastName: string,
                              emailAddress: string,
                              phoneNumber: string,
                              userType: number,
                              reference: string,
                              onSuccess: RequestCallback,
                              onError: RequestCallback): void {

        const request: UpdateUserDetailsRequest = {
            RequestName: 'updateuserdetails',
            token: this.memberSocketService.token,
            accountID: accountId,
            userID: userId,
            displayName: emailAddress,
            firstName,
            lastName,
            emailAddress,
            phoneNumber,
            userType,
            reference,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 undefined,
                                 undefined,
                                 onSuccess,
                                 onError);
    }

    /**
     * Delete User
     *
     * @param userId request a specific user
     * @param onSuccess
     * @param onError
     */
    deleteUser(userId: number,
               onSuccess: RequestCallback,
               onError: RequestCallback): void {

        const request: DeleteUserRequest = {
            RequestName: 'deleteuser',
            token: this.memberSocketService.token,
            userID: userId,
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
    readUsersAudit(search: string,
                   dateFrom: string,
                   dateTo: string,
                   onSuccess: RequestCallback,
                   onError: RequestCallback): void {

        const request: ReadUsersAuditRequest = {
            RequestName: 'readUsersAudit',
            token: this.memberSocketService.token,
            search,
            dateFrom,
            dateTo,
            isCSVRequest: false,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 setRequestedAccountAdminUsersAudit,
                                 SET_ACCOUNT_ADMIN_USERS_AUDIT,
                                 onSuccess,
                                 onError);
    }

    /**
     * Invite User
     *
     * @param userId request a specific user
     * @param onSuccess
     * @param onError
     */
    inviteUser(userId: number,
               userFirstName: string,
               recipientEmailAddress: string,
               localeCode: string,
               assetManagerName: string,
               onSuccess: RequestCallback,
               onError: RequestCallback): void {

        const request: InviteUserRequest = {
            RequestName: 'inviteuser',
            token: this.memberSocketService.token,
            userId,
            userFirstName,
            recipientEmailAddress,
            localeCode,
            assetManagerName,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, request);

        this.callAccountAdminAPI(asyncTaskPipe,
                                 undefined,
                                 undefined,
                                 onSuccess,
                                 onError);
    }

    getUserTypes(): void {
        const asyncTaskPipe = this.usersService.requestUserTypes();

        this.callAccountAdminAPI(asyncTaskPipe,
                                 setRequestedUserTypes,
                                 SET_USER_TYPES,
                                 () => {},
                                 () => {});
    }

    private generatePassword(length: number) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

}
