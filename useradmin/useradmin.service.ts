import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {RequestAdminUsersMessageBody, CreateUserMessageBody} from './useradmin.service.model';

@Injectable()
export class AdminUsersService {

    constructor(
        private memberSocketService: MemberSocketService
    ) {
        /* Stub. */
    }

    public requestMyUsersList () {

        console.log('Token: ', this.memberSocketService.token);

        const messageBody: RequestAdminUsersMessageBody = {
            RequestName: 'um_lu',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public createNewUser (userData:any): any {

        const messageBody: CreateUserMessageBody = {
            RequestName: 'nu',
            token: this.memberSocketService.token,
            username: userData.username,
            email: userData.email,
            account: userData.accountType,
            userType: userData.userType,
            password: userData.password
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
