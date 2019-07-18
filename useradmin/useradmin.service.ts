import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper, LogService } from '@setl/utils';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
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
    UpdateMenuPermissionsBody,
    GetUserAdminPermissionsBody,

    /* Groups. */
    CreateNewGroupBody,
    UpdateGroupBody,
    DeleteGroupBody,

    /* Enttiy permission. */
    RequestAdminPermissionBody,
    RequestTxPermissionBody,
    RequestUserPermissionsBody,

    /* Wallet requests. */
    CreateNewWalletBody,
    UpdateWalletBody,
    DeleteWalletBody,
    CreateDefaultWalletBody,

    /* Wallet node list */
    RequestWalletNodeListBody,
    WalletNodeRequestBody,
    DeleteWalletNodeRequestBody,

    /* Chain list */
    RequestChainListBody,
    UpdateUserGroupsBody,

    /* Member chain access */
    RequestMemberChainAccessBody,
    UpdateMemberChainAccessBody,

    /* Account wallet permission */
    RequestUserAccountWalletPermission,
    UpdateUserAccountWalletPermissions,
    RequestMenuPermissionBody,
    RequestUserTypes,
} from './useradmin.service.model';
import {
    SET_WALLET_NODE_LIST,
    setRequestedWalletNodeList,
    clearRequestedWalletNodeList,
    setRequestedChainList,
    SET_CHAIN_LIST,
    SET_ADMIN_PERMISSIONS,
} from '@setl/core-store';
import { NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';

interface WalletNodeData {
    walletNodeId?: any;
    walletNodeName?: any;
    chainId?: any;
    nodeAddress?: any;
    nodePath?: any;
    nodePort?: any;
}

@Injectable()
export class AdminUsersService {

    constructor(private memberSocketService: MemberSocketService, private logService: LogService) {
        /* Stub. */
    }

    /**
     * Default static call to get wallet node list, and dispatch default actions, and other
     * default task.
     *
     * @param adminUserService
     * @param ngRedux
     */
    static defaultRequestWalletNodeList(adminUsersService: AdminUsersService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedWalletNodeList());

        // Request the list.
        const asyncTaskPipe = adminUsersService.requestWalletNodeList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_NODE_LIST],  // SET est en fait un GETLIST
            [],
            asyncTaskPipe,
            {},
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
            {},
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
                    },
                ),
            );
        });
    }

    /*
     User Functions.
     ===============
     */
    public requestMyUsersList(pageFrom: number = 0, pageSize: number = 0, search: string = '') {
        /* Setup the message body. */
        const messageBody: RequestAdminUsersMessageBody = {
            RequestName: 'um_lu',
            token: this.memberSocketService.token,
            pageFrom,
            pageSize,
            search,
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
            password: userData.password,
            userLocked: userData.userLocked,
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
            status: newData.status,
            username: newData.username
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public deleteUser(data: any): any {
        /* Setup the message body. */
        const messageBody: DeleteUserMessageBody = {
            RequestName: 'du',
            token: this.memberSocketService.token,
            userId: data.userId,
            account: data.account || 0,
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestUserWalletPermissions(data): any {

        /* Setup the message body. */
        const messageBody: RequestUserWalletPermissions = {
            RequestName: 'guwp',
            token: this.memberSocketService.token,
            userId: data.userId,
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public newUserWalletPermissions(data): any {
        /* Setup the message body. */
        const messageBody: NewUserWalletPermissions = {
            RequestName: 'nuwa',
            token: this.memberSocketService.token,
            userId: data.userId,
            walletAccess: data.walletAccess,
        };

        this.logService.log('SENDING nuwa: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public updateUserWalletPermissions(data): any {
        /* Setup the message body. */
        const messageBody: UpdateUserWalletPermissions = {
            RequestName: 'uduwp',
            token: this.memberSocketService.token,
            userId: data.userId,
            toAdd: data.toAdd,
            toUpdate: data.toUpdate,
            toDelete: data.toDelete,
        };

        this.logService.log('SENDING uduwp: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public updateUserChainAccess(data): any {
        /* Setup the message body. */
        const messageBody: UpdateUserChainAccessBody = {
            RequestName: 'uduca',
            token: this.memberSocketService.token,
            userId: data.userId,
            toAdd: data.toAdd,
            toDelete: data.toDelete,
        };

        this.logService.log('SENDING uduca: ', messageBody);

        /* Return the new member node saga requests. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestUserChainAccess(data): any {
        /* Setup the message body. */
        const messageBody: RequestUserChainAccessBody = {
            RequestName: 'guca',
            token: this.memberSocketService.token,
            userId: data.userId,
        };

        this.logService.log('SENDING guca: ', messageBody);

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
            token: this.memberSocketService.token,
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public getTxPermAreaList(): any {
        /* Setup the message body. */
        const messageBody: GetPermissionAreaListBody = {
            RequestName: 'gtpal',
            token: this.memberSocketService.token,
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public getMenuPermAreaList(): any {
        /* Setup the message body. */
        const messageBody: GetPermissionAreaListBody = {
            RequestName: 'gmpal',
            token: this.memberSocketService.token,
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
            groupType: data.type,
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
            groupType: data.type,
        };

        this.logService.log('SENDING UDG: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public deleteGroup(data): any {
        /* Setup the message body. */
        const messageBody: DeleteGroupBody = {
            RequestName: 'dpg',
            token: this.memberSocketService.token,
            groupId: data.groupId,
        };

        this.logService.log('SENDING UDG: ', messageBody);

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
            isAdmin: data.isAdmin,
        };

        this.logService.log('SENDING UDAP: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public updateTxPermissions(data): any {
        /* Setup the message body. */
        this.logService.log(data);
        const messageBody: UpdateTxPermissionsBody = {
            RequestName: 'udtp',
            token: this.memberSocketService.token,
            entityId: data.entityId,
            isGroup: data.isGroup,
            chainId: data.chainId,
            toAdd: data.toAdd,
            toUpdate: data.toUpdate,
            toDelete: data.toDelete,
            isAdmin: data.isAdmin,
        };

        this.logService.log('SENDING UDTP: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public updateMenuPermissions(data): any {
        /* Setup the message body. */
        this.logService.log(data);
        const messageBody: UpdateMenuPermissionsBody = {
            RequestName: 'udmp',
            token: this.memberSocketService.token,
            entityId: data.entityId,
            isGroup: data.isGroup,
            toAdd: data.toAdd,
            toUpdate: data.toUpdate,
            toDelete: data.toDelete,
            isAdmin: data.isAdmin,
        };

        this.logService.log('SENDING UDMP: ', messageBody);

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
            includeGroup: entity.includeGroup,
        };

        this.logService.log('SENDING GP: ', messageBody);

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
            includeGroup: entity.includeGroup,
        };

        this.logService.log('SENDING GTP: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestMenuPermissions(entity): any {
        /* Setup the message body. */
        const messageBody: RequestMenuPermissionBody = {
            RequestName: 'gmp',
            token: this.memberSocketService.token,
            entityId: entity.entityId,
            isGroup: entity.isGroup,
            permissionId: entity.permissionId,
            includeGroup: entity.includeGroup,
        };

        this.logService.log('SENDING GMP: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /*
     *
     */

    static setRequestedWalletNodes(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(clearRequestedWalletNodeList());
        } else {
            ngRedux.dispatch(setRequestedWalletNodeList());
        }
    }

    /**
     * Default static call to get wallet node list, and dispatch default actions, and other
     * default task.
     *
     * @param adminUserService
     * @param ngRedux
     */
    static defaultRequestWalletNodesList(adminUsersService: AdminUsersService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedWalletNodeList());

        // Request the list.
        const asyncTaskPipe = adminUsersService.requestWalletNodeList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_NODE_LIST],  // SET est en fait un GETLIST
            [],
            asyncTaskPipe,
            {},
        ));
    }

    public requestWalletNodeList(): any {
        /* Setup the message body. */
        const messageBody: RequestWalletNodeListBody = {
            RequestName: 'gwnl',
            token: this.memberSocketService.token,
        };

        // this.logService.log('REQUESTING WALLET NODE LIST');

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveWalletNode(wnData: WalletNodeData, ngRedux: NgRedux<any>): any {

        const messageBody: WalletNodeRequestBody = {
            RequestName: 'nwn',
            token: this.memberSocketService.token,
            nodeName: wnData.walletNodeName,
            nodeChain: wnData.chainId,
            nodeAddr: wnData.nodeAddress,
            nodePath: wnData.nodePath,
            nodePort: wnData.nodePort,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateWalletNode(wnData: WalletNodeData, ngRedux: NgRedux<any>): any {

        const messageBody: WalletNodeRequestBody = {
            RequestName: 'udwn',
            token: this.memberSocketService.token,
            nodeId: wnData.walletNodeId,
            nodeName: wnData.walletNodeName,
            nodeChain: wnData.chainId,
            nodeAddr: wnData.nodeAddress,
            nodePath: wnData.nodePath,
            nodePort: wnData.nodePort,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    deleteWalletNode(wnData: WalletNodeData, ngRedux: NgRedux<any>): any {

        const messageBody: DeleteWalletNodeRequestBody = {
            RequestName: 'dwn',
            token: this.memberSocketService.token,
            nodeId: wnData.walletNodeId,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestChainList(): any {
        /* Setup the message body. */
        const messageBody: RequestChainListBody = {
            RequestName: 'gmcl',
            token: this.memberSocketService.token,
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestMemberChainAccessList(requestData): any {
        /* Setup the message body. */
        const messageBody: RequestMemberChainAccessBody = {
            RequestName: 'gmca',
            token: this.memberSocketService.token,
            chainId: _.get(requestData, 'chainId', 0),
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
            isTx: entity.isTx,
        };

        this.logService.log('SENDING GUG: ', messageBody);

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
            chainId: entity.chainId,
        };

        this.logService.log('SENDING UDUG: ', messageBody);

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
            toDelete: _.get(requestData, 'toDelete', []),
        };

        /* Return the new member node saga requests. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public createNewWallet(newWallet): any {
        /* Setup the message body. */
        let messageBody: CreateNewWalletBody;

        if (newWallet.walletType === '1') {
            /* Legal wallet body. */
            messageBody = {
                RequestName: 'nw',
                token: this.memberSocketService.token,
                /* Core wallet stuff. */
                walletName: _.get(newWallet, 'walletName', ''),
                account: _.get(newWallet, 'walletAccount', ''),
                walletType: _.get(newWallet, 'walletType', ''),

                /* Legal basic. */
                uid: _.get(newWallet, 'walletUid', ''),
                lei: _.get(newWallet, 'walletLei', ''),
                websiteUrl: _.get(newWallet, 'walletWebUrl', ''),
                incorporationdate: _.get(newWallet, 'walletIncDate', ''),

                /* Legal corresondence. */
                country: _.get(newWallet, 'walletAddrCountry', ''),
                addressPrefix: _.get(newWallet, 'walletAddrPrefix', ''),
                address1: _.get(newWallet, 'walletAddr1', ''),
                address2: _.get(newWallet, 'walletAddr2', ''),
                address3: _.get(newWallet, 'walletAddr3', ''),
                address4: _.get(newWallet, 'walletAddr4', ''),
                postalCode: _.get(newWallet, 'walletAddrPostcode', ''),
            };
        } else if (newWallet.walletType === '2') {
            /* Inidivdual wallet body. */
            messageBody = {
                RequestName: 'nw',
                token: this.memberSocketService.token,
                walletName: _.get(newWallet, 'walletName', ''),
                account: _.get(newWallet, 'walletAccount', ''),
                walletType: _.get(newWallet, 'walletType', ''),

                /* Individual basic fields. */
                aliases: _.get(newWallet, 'aliases', ''),
                formerName: _.get(newWallet, 'formerName', ''),
                idCardNum: _.get(newWallet, 'idCardNum', ''),

                /* Individual residential address. */
                rdaCountry: _.get(newWallet, 'rdaAddrCountry', ''),
                rdaAddressPrefix: _.get(newWallet, 'rdaAddrPrefix', ''),
                rdaAddress1: _.get(newWallet, 'rdaAddr1', ''),
                rdaAddress2: _.get(newWallet, 'rdaAddr2', ''),
                rdaAddress3: _.get(newWallet, 'rdaAddr3', ''),
                rdaAddress4: _.get(newWallet, 'rdaAddr4', ''),
                rdaPostalCode: _.get(newWallet, 'rdaAddrPostcode', ''),

                /* Individual corresondence address. */
                caCountry: _.get(newWallet, 'caAddrCountry', ''),
                caAddressPrefix: _.get(newWallet, 'caAddrPrefix', ''),
                caAddress1: _.get(newWallet, 'caAddr1', ''),
                caAddress2: _.get(newWallet, 'caAddr2', ''),
                caAddress3: _.get(newWallet, 'caAddr3', ''),
                caAddress4: _.get(newWallet, 'caAddr4', ''),
                caPostalCode: _.get(newWallet, 'caAddrPostcode', ''),

                /* Individual settlement detail. */
                bankWalletID: _.get(newWallet, 'bankWalletId', ''),
                bankName: _.get(newWallet, 'bankName', ''),
                bankIBAN: _.get(newWallet, 'bankIBAN', ''),
                bankBICcode: _.get(newWallet, 'bankBICcode', ''),
                bankAccountName: _.get(newWallet, 'bankAccountName', ''),
                bankAccountNum: _.get(newWallet, 'bankAccountNum', ''),
                /* settlement address */
                bdCountry: _.get(newWallet, 'bdAddrCountry', ''),
                bdAddressPrefix: _.get(newWallet, 'bdAddrPrefix', ''),
                bdAddress1: _.get(newWallet, 'bdAddr1', ''),
                bdAddress2: _.get(newWallet, 'bdAddr2', ''),
                bdAddress3: _.get(newWallet, 'bdAddr3', ''),
                bdAddress4: _.get(newWallet, 'bdAddr4', ''),
                bdPostalCode: _.get(newWallet, 'bdAddrPostcode', ''),
            };
        } else {
            /* Other wallet body. */
            messageBody = {
                RequestName: 'nw',
                token: this.memberSocketService.token,
                walletName: _.get(newWallet, 'walletName', ''),
                account: _.get(newWallet, 'walletAccount', ''),
                walletType: _.get(newWallet, 'walletType', ''),
            };
        }

        this.logService.log('SENDING NW: ', messageBody);

        /* Return the new member node saga requests. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public updateWallet(editWallet): any {
        /* Setup the message body. */
        let messageBody: UpdateWalletBody;

        if (editWallet.walletType === '1') {
            /* Legal wallet body. */
            messageBody = {
                RequestName: 'udw',
                token: this.memberSocketService.token,
                /* Core wallet stuff. */
                walletId: _.get(editWallet, 'walletId', ''),
                walletName: _.get(editWallet, 'walletName', ''),
                account: _.get(editWallet, 'walletAccount', ''),
                walletType: _.get(editWallet, 'walletType', ''),
                walletLocked: _.get(editWallet, 'walletLocked', ''),

                /* Legal basic. */
                uid: _.get(editWallet, 'walletUid', ''),
                lei: _.get(editWallet, 'walletLei', ''),
                websiteUrl: _.get(editWallet, 'walletWebUrl', ''),
                incorporationdate: _.get(editWallet, 'walletIncDate', ''),

                /* Legal corresondence. */
                country: _.get(editWallet, 'walletAddrCountry', ''),
                addressPrefix: _.get(editWallet, 'walletAddrPrefix', ''),
                address1: _.get(editWallet, 'walletAddr1', ''),
                address2: _.get(editWallet, 'walletAddr2', ''),
                address3: _.get(editWallet, 'walletAddr3', ''),
                address4: _.get(editWallet, 'walletAddr4', ''),
                postalCode: _.get(editWallet, 'walletAddrPostcode', ''),
            };
        } else if (editWallet.walletType === '2') {
            /* Inidivdual wallet body. */
            messageBody = {
                RequestName: 'udw',
                token: this.memberSocketService.token,
                walletId: _.get(editWallet, 'walletId', ''),
                walletName: _.get(editWallet, 'walletName', ''),
                account: _.get(editWallet, 'walletAccount', ''),
                walletType: _.get(editWallet, 'walletType', ''),
                walletLocked: _.get(editWallet, 'walletLocked', ''),

                /* Individual basic fields. */
                aliases: _.get(editWallet, 'aliases', ''),
                formerName: _.get(editWallet, 'formerName', ''),
                idcardnum: _.get(editWallet, 'idCardNum', ''),

                /* Individual residential address. */
                rdaCountry: _.get(editWallet, 'rdaAddrCountry', ''),
                rdaAddressPrefix: _.get(editWallet, 'rdaAddrPrefix', ''),
                rdaAddress1: _.get(editWallet, 'rdaAddr1', ''),
                rdaAddress2: _.get(editWallet, 'rdaAddr2', ''),
                rdaAddress3: _.get(editWallet, 'rdaAddr3', ''),
                rdaAddress4: _.get(editWallet, 'rdaAddr4', ''),
                rdaPostalCode: _.get(editWallet, 'rdaAddrPostcode', ''),

                /* Individual corresondence address. */
                caCountry: _.get(editWallet, 'caAddrCountry', ''),
                caAddressPrefix: _.get(editWallet, 'caAddrPrefix', ''),
                caAddress1: _.get(editWallet, 'caAddr1', ''),
                caAddress2: _.get(editWallet, 'caAddr2', ''),
                caAddress3: _.get(editWallet, 'caAddr3', ''),
                caAddress4: _.get(editWallet, 'caAddr4', ''),
                caPostalCode: _.get(editWallet, 'caAddrPostcode', ''),

                /* Individual settlement detail. */
                bankWalletID: _.get(editWallet, 'bankWalletId', ''),
                bankName: _.get(editWallet, 'bankName', ''),
                bankIBAN: _.get(editWallet, 'bankIBAN', ''),
                bankBICcode: _.get(editWallet, 'bankBICcode', ''),
                bankaccountname: _.get(editWallet, 'bankAccountName', ''),
                bankaccountnum: _.get(editWallet, 'bankAccountNum', ''),
                /* settlement address */
                bdCountry: _.get(editWallet, 'bdAddrCountry', ''),
                bdAddressPrefix: _.get(editWallet, 'bdAddrPrefix', ''),
                bdAddress1: _.get(editWallet, 'bdAddr1', ''),
                bdAddress2: _.get(editWallet, 'bdAddr2', ''),
                bdAddress3: _.get(editWallet, 'bdAddr3', ''),
                bdAddress4: _.get(editWallet, 'bdAddr4', ''),
                bdPostalCode: _.get(editWallet, 'bdAddrPostcode', ''),
            };
        } else {
            /* Other wallet body. */
            messageBody = {
                RequestName: 'udw',
                token: this.memberSocketService.token,
                walletId: _.get(editWallet, 'walletId', ''),
                walletName: _.get(editWallet, 'walletName', ''),
                account: _.get(editWallet, 'walletAccount', ''),
                walletType: _.get(editWallet, 'walletType', ''),
                walletLocked: _.get(editWallet, 'walletLocked', ''),
            };
        }

        this.logService.log('SENDING UDW: ', messageBody);

        /* Return the new member node saga requests. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public deleteWallet(data): any {
        /* Setup the message body. */
        const messageBody: DeleteWalletBody = {
            RequestName: 'dw',
            token: this.memberSocketService.token,
            walletId: data.walletId,
        };

        this.logService.log('SENDING DW: ', messageBody);

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public createDefaultWallet(data): any {
        /* Setup the message body. */
        const messageBody: CreateDefaultWalletBody = {
            RequestName: 'createdefaultwallet',
            token: this.memberSocketService.token,
            userID: data.userID,
            account: data.accountID,
            walletType: data.walletType,
            walletName: data.walletName,
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestUserAccountWalletPermissions(data): any {
        /* Setup the message body. */
        const messageBody: RequestUserAccountWalletPermission = {
            RequestName: 'getuseraccountwalletpermission',
            token: this.memberSocketService.token,
            userId: data.userId,
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public updateUserAccountWalletPermissions(data): any {
        /* Setup the message body. */
        const messageBody: UpdateUserAccountWalletPermissions = {
            RequestName: 'updateuseraccountwalletpermission',
            token: this.memberSocketService.token,
            userId: data.userId,
            toAdd: data.toAdd,
            toUpdate: data.toUpdate,
            toDelete: data.toDelete,
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    public requestUserTypes(): any {
        /* Setup the message body. */
        const messageBody: RequestUserTypes = {
            RequestName: 'getusertypes',
            token: this.memberSocketService.token,
        };

        /* Return the new member node saga request. */
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
