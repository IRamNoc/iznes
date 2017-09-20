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
    RequestUserWalletPermissions,
    NewUserWalletPermissions,
    UpdateUserWalletPermissions,
    RequestUserChainAccessBody,
    UpdateUserChainAccessBody,

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
    RequestUserPermissionsBody,

    /* Wallet node list */
    RequestWalletNodeListBody,

    /* Chain list */
    RequestChainListBody,
    UpdateUserGroupsBody,

    /* Member chain access */
    RequestMemberChainAccessBody,
    UpdateMemberChainAccessBody
} from './useradmin.service.model';
import {
    SET_WALLET_NODE_LIST,
    setRequestedWalletNodeList,
    setRequestedChainList,
    SET_CHAIN_LIST
} from '@setl/core-store';
import {NgRedux} from '@angular-redux/store';
import _ from 'lodash';

@Injectable()
export class AdminUsersService {

    constructor(private memberSocketService: MemberSocketService) {
        /* Stub. */
    }

    /**
     * Default static call to get wallet node list, and dispatch default actions, and other
     * default task.
     *
     * @param adminUserService
     * @param ngRedux
     */
    static defaultRequestWalletNodeList(adminUserService: AdminUsersService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedWalletNodeList());

        // Request the list.
        const asyncTaskPipe = adminUserService.requestWalletNodeList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_NODE_LIST],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    /**
     * Default static call to get chain list.
     * @param adminUserService
     * @param ngRedux
     */
    static defaultRequestChainList(adminUserService: AdminUsersService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedChainList());

        // Request the list.
        const asyncTaskPipe = adminUserService.requestChainList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_CHAIN_LIST],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    public buildRequest(request) {
        /* Check for request pipe. */
        if (!request.taskPipe) {
            return;
        }

        /* Build new promise. */
        return new Promise((resolve, reject) => {
            /* Dispatch. */
            request.ngRedux.dispatch(
                SagaHelper.runAsync(
                    request.successActions || [],
                    request.failActions || [],
                    request.taskPipe,
                    {},
                    (response) => {
                        resolve(response);
                    },
                    (error) => {
                        reject(error);
                    }
                )
            );
        });
    }

    /*
     User Functions.
     ===============
     */
    public requestMyUsersList() {
        /* Setup the message body. */
        const messageBody: RequestAdminUsersMessageBody = {
            RequestName: 'um_lu',
            token: this.memberSocketService.token
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public createNewUser(userData: any): any {
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

    public editUser(newData: any): any {
        /* Setup the message body. */
        const messageBody: EditUserMessageBody = {
            RequestName: 'udu',
            token: this.memberSocketService.token,
            userId: newData.userId,
            email: newData.email,
            account: newData.account,
            userType: newData.userType,
            status: newData.status
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public deleteUser(data: any): any {
        /* Setup the message body. */
        const messageBody: DeleteUserMessageBody = {
            RequestName: 'du',
            token: this.memberSocketService.token,
            userId: data.userId
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestUserWalletPermissions (data):any {

        /* Setup the message body. */
        const messageBody: RequestUserWalletPermissions = {
            RequestName: 'guwp',
            token: this.memberSocketService.token,
            userId: data.userId
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public newUserWalletPermissions (data):any {
        /* Setup the message body. */
        const messageBody: NewUserWalletPermissions = {
            RequestName: 'nuwa',
            token: this.memberSocketService.token,
            userId: data.userId,
            walletAccess: data.walletAccess
        };

        console.log("SENDING nuwa: ", messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public updateUserWalletPermissions (data):any {
        /* Setup the message body. */
        const messageBody: UpdateUserWalletPermissions = {
            RequestName: 'uduwp',
            token: this.memberSocketService.token,
            userId: data.userId,
            toAdd: data.toAdd,
            toUpdate: data.toUpdate,
            toDelete: data.toDelete,
        };

        console.log("SENDING uduwp: ", messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public updateUserChainAccess (data): any {
        /* Setup the message body. */
        const messageBody: UpdateUserChainAccessBody = {
            RequestName: 'uduca',
            token: this.memberSocketService.token,
            userId: data.userId,
            toAdd: data.toAdd,
            toDelete: data.toDelete
        };

        console.log("SENDING uduca: ", messageBody);

        /* Return the new member node saga requests. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestUserChainAccess (data): any {
        /* Setup the message body. */
        const messageBody: RequestUserChainAccessBody = {
            RequestName: 'guca',
            token: this.memberSocketService.token,
            userId: data.userId
        };

        console.log("SENDING guca: ", messageBody);

        /* Return the new member node saga requests. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /*
     Permission Meta.
     ================
     */
    public getAdminPermAreaList(): any {
        /* Setup the message body. */
        const messageBody: GetPermissionAreaListBody = {
            RequestName: 'gpal',
            token: this.memberSocketService.token
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public getTxPermAreaList(): any {
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
    public createNewGroup(data): any {
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

    public updateGroup(data): any {
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

    public deleteGroup(data): any {
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

    public updateAdminPermissions(data): any {
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

    public updateTxPermissions(data): any {
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
    public requestAdminPermissions(entity): any {
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

    public requestTxPermissions(entity): any {
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

    public requestWalletNodeList(): any {
        /* Setup the message body. */
        const messageBody: RequestWalletNodeListBody = {
            RequestName: 'gwnl',
            token: this.memberSocketService.token
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestChainList(): any {
        /* Setup the message body. */
        const messageBody: RequestChainListBody = {
            RequestName: 'gmcl',
            token: this.memberSocketService.token
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestMemberChainAccessList(requestData): any {
        /* Setup the message body. */
        const messageBody: RequestMemberChainAccessBody = {
            RequestName: 'gmca',
            token: this.memberSocketService.token,
            chainId: _.get(requestData, 'chainId', 0)
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestUserPermissions(entity): any {
        /* Setup the message body. */
        const messageBody: RequestUserPermissionsBody = {
            RequestName: 'gug',
            token: this.memberSocketService.token,
            entityId: entity.entityId,
            isTx: entity.isTx ? 1 : 0,
        };

        console.log('SENDING GUG: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public updateUserGroups(entity): any {
        /* Setup the message body. */
        const messageBody: UpdateUserGroupsBody = {
            RequestName: 'udug',
            token: this.memberSocketService.token,
            userId: entity.userId,
            toAdd: entity.toAdd,
            toDelete: entity.toDelete,
            chainId: entity.chainId
        };

        console.log('SENDING UDUG: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public updateMemberChainAccess(requestData): any {
        /* Setup the message body. */
        const messageBody: UpdateMemberChainAccessBody = {
            RequestName: 'umca',
            token: this.memberSocketService.token,
            chainId: _.get(requestData, 'chainId', 0),
            toUpdate: _.get(requestData, 'toUpdate', {}),
            toAdd: _.get(requestData, 'toAdd', {}),
            toDelete: _.get(requestData, 'toDelete', [])
        };

        /* Return the new member node saga requests. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
