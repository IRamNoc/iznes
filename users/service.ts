import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import {
    SET_ACCOUNT_ADMIN_USERS,
    setRequestedAccountAdminUsers,
    SET_USER_TYPES,
    setRequestedUserTypes,
} from '@setl/core-store';
import { AdminUsersService } from '@setl/core-req-services';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { MemberSocketService } from '@setl/websocket-service';

import { RequestCallback, AccountAdminResponse } from '../base/model';
import { AccountAdminBaseService } from '../base/service';

import {
    ReadUsersRequest,
    CreateUserRequest,
    UpdateUserDetailsRequest,
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
            RequestName: 'nu',
            token: this.memberSocketService.token,
            account,
            email,
            username: email,
            userType,
            password: this.generatePassword(),
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
                                         onSuccess,
                                         onError,
                                    );
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

    private generatePassword(): string {
        // TODO: to be changed to a randon string generator
        return 'changeme';
    }

    getUserTypes(): void {
        const asyncTaskPipe = this.usersService.requestUserTypes();

        this.callAccountAdminAPI(asyncTaskPipe,
                                 setRequestedUserTypes,
                                 SET_USER_TYPES,
                                 () => {},
                                 () => {});
    }

}
