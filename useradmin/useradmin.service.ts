import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {
    RequestAdminUsersMessageBody,

    /* Users */
    CreateUserMessageBody,
    EditUserMessageBody,
    DeleteUserMessageBody,

    /* Permissions. */
    GetPermissionAreaListBody,
    UpdateAdminPermissionsBody,
    UpdateTxPermissionsBody,

    /* Groups. */
    CreateNewGroupBody,
    UpdateGroupBody,
    DeleteGroupBody,

    /* Enttiy permission. */
    RequestAdminPermissionBody,
    RequestTxPermissionBody,
    RequestUserPermissionsBody
} from './useradmin.service.model';

@Injectable()
export class AdminUsersService {

    constructor(
        private memberSocketService: MemberSocketService
    ) {
        /* Stub. */
    }

    /*
        User Functions.
        ===============
    */
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

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public deleteUser (data:any): any {
        console.log(data);
        /* Setup the message body. */
        const messageBody: DeleteUserMessageBody = {
            RequestName: 'du',
            token: this.memberSocketService.token,
            'userId': data.userId
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /*
        Permission Meta.
        ================
    */
    public getAdminPermAreaList (): any {
        /* Setup the message body. */
        const messageBody: GetPermissionAreaListBody = {
            RequestName: 'gpal',
            token: this.memberSocketService.token
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public getTxPermAreaList (): any {
        /* Setup the message body. */
        const messageBody: GetPermissionAreaListBody = {
            RequestName: 'gtpal',
            token: this.memberSocketService.token
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /*
        Permission Groups.
        ==================
    */
    public createNewGroup ( data ):any {
        /* Setup the message body. */
        const messageBody: CreateNewGroupBody = {
            RequestName: 'ng',
            token: this.memberSocketService.token,
            groupName: data.name,
            groupDescription: data.description,
            groupType: data.type
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public updateGroup ( data ):any {
        /* Setup the message body. */
        const messageBody: UpdateGroupBody = {
            RequestName: 'udg',
            token: this.memberSocketService.token,
            groupId: data.groupId,
            groupName: data.name,
            groupDescription: data.description,
            groupType: data.type
        };

        console.log('SENDING UDG: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public deleteGroup ( data ):any {
        /* Setup the message body. */
        const messageBody: DeleteGroupBody = {
            RequestName: 'dpg',
            token: this.memberSocketService.token,
            groupId: data.groupId
        };

        console.log('SENDING UDG: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public updateAdminPermissions ( data ):any {
        /* Setup the message body. */
        const messageBody: UpdateAdminPermissionsBody = {
            RequestName: 'udap',
            token: this.memberSocketService.token,
            entityId: data.entityId,
            isGroup: data.isGroup,
            toAdd: data.toAdd,
            toUpdate: data.toUpdate,
            toDelete: data.toDelete,
            isAdmin: data.isAdmin
        };

        console.log('SENDING UDAP: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public updateTxPermissions ( data ):any {
        /* Setup the message body. */
        console.log(data);
        const messageBody: UpdateTxPermissionsBody = {
            RequestName: 'udtp',
            token: this.memberSocketService.token,
            entityId: data.entityId,
            isGroup: data.isGroup,
            chainId: data.chainId,
            toAdd: data.toAdd,
            toUpdate: data.toUpdate,
            toDelete: data.toDelete,
            isAdmin: data.isAdmin

        };

        console.log('SENDING UDTP: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /*
        Entity Permissions
        ==================
    */
    public requestAdminPermissions ( entity ):any {
        /* Setup the message body. */
        const messageBody: RequestAdminPermissionBody = {
            RequestName: 'gp',
            token: this.memberSocketService.token,
            entityId: entity.entityId,
            isGroup: entity.isGroup,
            permissionId: entity.permissionId,
            includeGroup: entity.includeGroup
        };

        console.log('SENDING GP: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestTxPermissions ( entity ):any {
        /* Setup the message body. */
        const messageBody: RequestTxPermissionBody = {
            RequestName: 'gtp',
            token: this.memberSocketService.token,
            entityId: entity.entityId,
            chainId: entity.chainId,
            isGroup: entity.isGroup,
            permissionId: entity.permissionId,
            includeGroup: entity.includeGroup
        };

        console.log('SENDING GTP: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestUserPermissions ( entity ):any {
        /* Setup the message body. */
        const messageBody: RequestUserPermissionsBody = {
            RequestName: 'gug',
            token: this.memberSocketService.token,
            entityId: entity.entityId,
            isTx: entity.isTx ? 2 : 1,
        };

        console.log('SENDING GUG: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
