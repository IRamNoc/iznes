import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {
    RequestAdminUsersMessageBody,
    CreateUserMessageBody,
    EditUserMessageBody,
    GetPermissionAreaListBody
} from './useradmin.service.model';

@Injectable()
export class AdminUsersService {

    constructor(
        private memberSocketService: MemberSocketService
    ) {
        /* Stub. */
    }

    public requestMyUsersList () {
        /* Setup the message body. */
        const messageBody: RequestAdminUsersMessageBody = {
            RequestName: 'um_lu',
            token: this.memberSocketService.token
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public createNewUser (userData:any): any {
        /* Setup the message body. */
        const messageBody: CreateUserMessageBody = {
            RequestName: 'nu',
            token: this.memberSocketService.token,
            username: userData.username,
            email: userData.email,
            account: userData.accountType,
            userType: userData.userType,
            password: userData.password
        };

        console.log( "SENDING TO NEW USER: ", messageBody );
        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public editUser (newData:any): any {
        /* Setup the message body. */
        const messageBody: EditUserMessageBody = {
            RequestName: 'udu',
            token: this.memberSocketService.token,
            'userId': newData.userId,
            'email': newData.email,
            'account': newData.account,
            'userType': newData.userType,
            'status': newData.status
        };

        console.log( "SENDING TO EDIT USER: ", messageBody );

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public getPermissionAreaList (): any {
        /* Setup the message body. */
        const messageBody: GetPermissionAreaListBody = {
            RequestName: 'gpal',
            token: this.memberSocketService.token
        };

        console.log( "SENDING TO GET PERMISSION AREA LIST: ", messageBody );

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
