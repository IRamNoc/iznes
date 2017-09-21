import {Injectable, Output, EventEmitter} from '@angular/core';

import {Observable} from 'rxjs/Observable'
import {Subject} from 'rxjs/Subject'

import {SagaHelper} from '@setl/utils';

import {NgRedux} from '@angular-redux/store';

import {
    AdminUsersService
} from '@setl/core-req-services';

import {
    /* User data */
    getMyDetail,

    /* Users list. */
    SET_ADMIN_USERLIST,
    getUsersList,

    /* Permission groups - (fetched on init) */
    getAdminPermissionGroup,
    getTranPermissionGroup,

    /* Permission areas. */
    SET_ADMIN_PERM_AREAS_LIST,
    SET_TX_PERM_AREAS_LIST,
    getAdminPermAreaList,
    getTxPermAreaList,

    /* Entity Permissions */
    SET_ADMIN_PERMISSIONS,
    SET_TX_PERMISSIONS,
    getPermissions,
    getAdminPermissions,
    getTranPermissions,

    /* Group permissions */
    SET_USERS_ADMIN_PERMISSIONS,
    SET_USERS_TX_PERMISSIONS,
    getUsersPermissions,
    getUsersAdminPermissions,
    getUsersTxPermissions,

    /* Group permissions */
    SET_USERS_WALLET_PERMISSIONS,
    getUsersWalletPermissions,

    /* Group permissions */
    SET_USERS_CHAIN_ACCESS,
    getUsersChainAccess,
} from '@setl/core-store';

@Injectable()
export class UserAdminService {

    /* Account types. */
    public accountTypes: any = [
        {
            'id': '1',
            'text': 'SETL Private Admin',
        },
        {
            'id': '2',
            'text': 'Developement_Admin_Account',
        },
        {
            'id': '8',
            'text': 'HKEX_Admin_Account',
        },
    ];

    /* Wallet Types. */
    public walletTypes: any = [
        {
            'id': '1',
            'text': 'Legal Entity',
        },
        {
            'id': '2',
            'text': 'Individual',
        },
        {
            'id': '3',
            'text': 'Other',
        },
    ];

    /* User Types. */
    public userTypes: any = [
        {
            'id': '15',
            'text': 'System Admin',
        },
        {
            'id': '25',
            'text': 'Chain Admin',
        },
        {
            'id': '26',
            'text': 'SGP Admin',
        },
        {
            'id': '27',
            'text': 'Bank',
        },
        {
            'id': '36',
            'text': 'Investor Admin',
        },
        {
            'id': '46',
            'text': 'Investor with KYC',
        },
        {
            'id': '47',
            'text': 'Investor without KYC',
        },
    ];

    /* Group Types. */
    public groupTypes: any = [
        {
            'id': '0',
            'text': 'Administrative',
        },
        {
            'id': '1',
            'text': 'Transactional',
        }
    ];

    public usersList: {};
    @Output()
    public usersListSubject = new Subject<any>();

    public getUserListSubject() {
        return this.usersListSubject.asObservable();
    }

    public adminGroupList: {};
    public txGroupList: {};
    public allGroupsList: {};
    @Output()
    public allGroupListSubject = new Subject<any>();
    /* Admin and TX group list observable. */
    public getGroupListSubject() {
        return this.allGroupListSubject.asObservable();
    }

    public adminPermAreaList: {};
    @Output()
    public adminPermAreaListSubject = new Subject<any>();

    public getAdminPermAreaListSubject() {
        return this.adminPermAreaListSubject.asObservable();
    }

    public txPermAreaList: {};
    @Output()
    public txPermAreaListSubject = new Subject<any>();

    public getTxPermAreaListSubject() {
        return this.txPermAreaListSubject.asObservable();
    }

    public permissionsList: {};
    @Output()
    public permissionsListSubject = new Subject<any>();

    public getPermissionsListSubject() {
        return this.permissionsListSubject.asObservable();
    }

    public usersPermissionsList: {};
    @Output()
    public usersPermissionsListSubject = new Subject<any>();

    public getUsersPermissionsListSubject() {
        return this.usersPermissionsListSubject.asObservable();
    }

    public usersWalletPermissions: {};
    @Output()
    public usersWalletPermissionsSubject = new Subject<any>();

    public getUsersWalletPermissionsSubject() {
        return this.usersWalletPermissionsSubject.asObservable();
    }

    public usersChainAccess: {};
    @Output()
    public usersChainAccessSubject = new Subject<any>();

    public getUsersChainAccessSubject() {
        return this.usersChainAccessSubject.asObservable();
    }

    /* Constructor. */
    constructor(private adminUsersService: AdminUsersService,
                private ngRedux: NgRedux<any>,) {
        let asyncTaskPipe;
        const state = this.ngRedux.getState();

        /* Let's request the user's list, this is the saga pipe function. */
        if (!Object.keys(getUsersList(state))[0]) {
            this.adminUsersService.buildRequest({
                ngRedux: this.ngRedux,
                taskPipe: this.adminUsersService.requestMyUsersList(),
                successActions: [SET_ADMIN_USERLIST]
            });
        }

        /* Let's request the admin perm area list, this is the saga pipe function. */
        if (!getAdminPermAreaList(state).length) {
            this.adminUsersService.buildRequest({
                ngRedux: this.ngRedux,
                taskPipe: this.adminUsersService.getAdminPermAreaList(),
                successActions: [SET_ADMIN_PERM_AREAS_LIST]
            });
        }

        /* Let's request the tx perm area list, this is the saga pipe function. */
        if (!getTxPermAreaList(state).length) {
            this.adminUsersService.buildRequest({
                ngRedux: this.ngRedux,
                taskPipe: this.adminUsersService.getTxPermAreaList(),
                successActions: [SET_TX_PERM_AREAS_LIST]
            });
        }

        /* TODO - pull in the arrays on this object dynamically. */

        /* Assign a update handler to watch changes in redux, then trigger once
         manually. */
        ngRedux.subscribe(() => this.updateState());
        this.updateState();
    }

    public requestChainList(): void {
        AdminUsersService.defaultRequestChainList(this.adminUsersService, this.ngRedux);
    }

    /**
     * Update State
     * ------------
     * Handles the updating of objects on this service when redux has data
     * updated.
     *
     * @return {void}
     */
    public updateState() {
        /* Retrieve the redux store. */
        const state = this.ngRedux.getState();
        let key;

        /* Get user list, and send a message to the users observable. */
        this.usersList = getUsersList(state);
        this.usersListSubject.next(this.usersList);

        /* Get adminGroupList groups list. */
        this.adminGroupList = getAdminPermissionGroup(state);
        /* Get adminGroupList groups list. */
        this.txGroupList = getTranPermissionGroup(state);

        /* Combine the groups and emit. */
        this.allGroupsList = Object.assign({}, this.txGroupList, this.adminGroupList);
        this.allGroupListSubject.next(this.allGroupsList);

        /* Get admin perm area list and send message out. */
        this.adminPermAreaList = getAdminPermAreaList(state);
        this.adminPermAreaListSubject.next(this.adminPermAreaList);

        /* Get tx perm area list and send message out. */
        this.txPermAreaList = getTxPermAreaList(state);
        this.txPermAreaListSubject.next(this.txPermAreaList);

        /* Get permissions list by groupId. */
        this.permissionsList = getPermissions(state);
        this.permissionsListSubject.next(this.permissionsList);

        /* Get permissions list by userId. */
        this.usersPermissionsList = getUsersPermissions(state);
        this.usersPermissionsListSubject.next(this.usersPermissionsList);

        /* Get wallet permissions list by userId. */
        this.usersWalletPermissions = getUsersWalletPermissions(state);
        this.usersWalletPermissionsSubject.next(this.usersWalletPermissions);

        /* Get chain access list by userId. */
        this.usersChainAccess = getUsersChainAccess(state);
        this.usersChainAccessSubject.next(this.usersChainAccess);
    }

    /**
     * ===============
     * Users requests.
     * ===============
     */

    /**
     * Create New User
     * ----------------
     * Creates a new User.
     *
     * @param {data} - the new user data.
     *
     * @return {void}
     */
    public createNewUser(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.createNewUser(data)
        });
    }

    /**
     * Edit User
     * ----------------
     * Creates a new User.
     *
     * @param {data} - the new user data.
     *
     * @return {void}
     */
    public editUser(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.editUser(data)
        });
    }

    /**
     * Delete User
     * ----------------
     * Creates a new User.
     *
     * @param {data} - the new user data.
     *
     * @return {void}
     */
    public deleteUser(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.deleteUser(data)
        });
    }

    /**
     * Request Permissions
     * ----------------
     * Request user wallet permissions.
     *
     * @param {entity} - the entity data.
     *
     * @return {any} - returns
     */
    requestUserWalletPermissions(data): Promise<any> {
        /* Return the request. */
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.requestUserWalletPermissions(data),
            successActions: [ SET_USERS_WALLET_PERMISSIONS ]
        });
    }

    /**
     * New User Wallet Permissions
     * ----------------
     * New user wallet permissions.
     *
     * @param {entity} - the permissions data.
     *
     * @return {any} - returns
     */
    newUserWalletPermissions(data): Promise<any> {
        /* Return the request. */
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.newUserWalletPermissions(data)
        });
    }

    /**
     * Update User Wallet Permissions
     * ----------------
     * Update user wallet permissions.
     *
     * @param {entity} - the permissions data.
     *
     * @return {any} - returns
     */
    updateUserWalletPermissions(data): Promise<any> {
        /* Return the request. */
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateUserWalletPermissions(data)
        });
    }

    /**
     * Update User Chain Access
     * ----------------
     * Updates a user's chain access.
     *
     * @param {data} - the update data.
     *
     * @return {any} - returns
     */
    updateUserChainAccess(data): Promise<any> {
        /* Return. */
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateUserChainAccess(data)
        });
    }

    /**
     * Request User Chain Access
     * ----------------
     * Request a user's chain access.
     *
     * @param {data} - the request data.
     *
     * @return {any} - returns
     */
    requestUserChainAccess(data): Promise<any> {
        /* Return. */
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.requestUserChainAccess(data),
            successActions: [ SET_USERS_CHAIN_ACCESS ]
        });
    }

    /**
     * ===============
     * Group requests.
     * ===============
     */

    /**
     * Create New Group
     * ----------------
     * Creates a new Group.
     *
     * @param {data} - the new group data.
     *
     * @return {void}
     */
    public createNewGroup(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.createNewGroup(data)
        });
    }

    /**
     * Update Group
     * ----------------
     * Updates a Group.
     *
     * @param {data} - the group's new data.
     *
     * @return {void}
     */
    public updateGroup(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateGroup(data)
        });
    }

    /**
     * Delete Group
     * ----------------
     * Deletes a Group.
     *
     * @param {data} - the group data, only requires a groupId key.
     *
     * @return {void}
     */
    public deleteGroup(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.deleteGroup(data)
        });
    }

    /**
     * Update AdminPermissions
     * ----------------
     * Updates an entity's permissions.
     *
     * @param {data} - the permission data.
     *
     * @return {void}
     */
    updateAdminPermissions(data): Promise<any> {
        /* Add isAdmin to data. */
        const
            state = this.ngRedux.getState(),
            myDetail = getMyDetail(state);
        data.isAdmin = myDetail.admin ? "1" : "0";

        /* Return. */
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateAdminPermissions(data)
        });
    }

    /**
     * Update Tx Permissions
     * ----------------
     * Updates an entity's permissions.
     *
     * @param {data} - the permission data.
     *
     * @return {void}
     */
    updateTxPermissions(data): Promise<any> {
        /* Get my detail to add is admin to the request. */
        const
            state = this.ngRedux.getState(),
            myDetail = getMyDetail(state);

        /* Figure the admin bit out. */
        data.isAdmin = myDetail.admin ? "1" : "0";

        /* Return. */
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateTxPermissions(data)
        });
    }

    /**
     * Request Permissions
     * ----------------
     * Requests an entity's permissions or all, used on click for editing a group.
     *
     * @param {entity} - the entity data.
     *
     * @return {any} - returns
     */
    requestPermissions(entity): Promise<any> {
        /* Return. */
        let
            action,
            asynTaskPipe;

        if (entity.isTx) {
            asynTaskPipe = this.adminUsersService.requestTxPermissions(entity);
            action = SET_TX_PERMISSIONS;
        } else {
            asynTaskPipe = this.adminUsersService.requestAdminPermissions(entity);
            action = SET_ADMIN_PERMISSIONS;
        }

        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: asynTaskPipe,
            successActions: [action]
        });
    }

    /**
     * Request User Permissions
     * ----------------
     * Requests a user's permissions or all, used on click for editing a user.
     *
     * @param {entity} - the entity data.
     *
     * @return {any} - returns
     */
    requestUserPermissions(entity): Promise<any> {
        let action = entity.isTx ? SET_USERS_TX_PERMISSIONS : SET_USERS_ADMIN_PERMISSIONS;
        /* Return. */
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.requestUserPermissions(entity),
            successActions: [action]
        });
    }

    /**
     * Update User Permissions
     * -----------------------
     * Update a user's groups or all, used on click for editing a user.
     *
     * @param {entity} - the entity data.
     *
     * @return {any} - returns
     */
    updateUserGroups(entity): Promise<any> {
        /* Return. */
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateUserGroups(entity)
        });
    }

    /**
     * ===========================
     * Getters for hardcoded data.
     * ===========================
     */

    /**
     * Get Account Types
     * -----------------
     * Returns the account types array.
     *
     * @return {accountTypes} - array.
     */
    public getAccountTypes(): any {
        /* Return the array. */
        return this.accountTypes;
    }

    /**
     * Get Account Type by Id
     * -----------------
     * Returns the account type by Id.
     *
     * @param {id} number - the ID of a type.
     * @return {accountTypes} - array.
     */
    public getAccountTypeById(id): any {
        /* Return the match. */
        let i;
        for ( i in this.accountTypes ) {
            if ( this.accountTypes[i].id == id ) {
                return [ this.accountTypes[i] ];
            }
        }

        /* ...else empty. */
        return [];
    }

    /**
     * Get Wallet Types
     * ----------------
     * Returns the wallet types array.
     *
     * @return {walletTypes} - array.
     */
    public getWalletTypes(): any {
        /* Return the array. */
        return this.walletTypes;
    }

    /**
     * Get Wallet Type By Id
     * ----------------
     * Returns the wallet type by an Id.
     *
     * @param {id} number - the ID of a type.
     * @return {walletType} - array.
     */
    public getWalletTypeById(id): any {
        /* Return the match. */
        let i;
        for ( i in this.walletTypes ) {
            if ( this.walletTypes[i].id == id ) {
                return [ this.walletTypes[i] ];
            }
        }

        /* ...else empty. */
        return [];
    }

    /**
     * Get User Types
     * --------------
     * Returns the user types array.
     *
     * @return {userTypes} - array.
     */
    public getUserTypes(): any {
        /* Return the array. */
        return this.userTypes;
    }

    /**
     * Get Group Types
     * ---------------
     * Returns the group types array.
     *
     * @return {groupTypes} - array.
     */
    public getGroupTypes(): any {
        /* Return the array. */
        return this.groupTypes;
    }

    /**
     * ==========================================
     * Helper functions, and resolving functions.
     * ==========================================
     */

    /**
     * Resolve Account Type
     * --------------------
     * Accepts an object that then is used to lookup the account type and return
     * a full object of it, this is useful for when you need to set the value of
     * an ng2-select but only have the id or the text of what was selected.
     *
     * @param {query} - the incomplete object of the account type.
     *
     * @return {accountType} - the complete object of the account type.
     */
    public resolveAccountType(query): any {
        /* Let's first check which we have. */
        let identifier = "";
        if (query.id) identifier = "id";
        if (query.text) identifier = "text";

        /* If there was nothing, return. */
        if (identifier === "") {
            return [];
        }

        /* Ok, lets check if we have the account type. */
        let i;
        for (i = 0; i < this.accountTypes.length; i++) {
            /* Loop over each and check if they have the same id. */
            if (query[identifier] === this.accountTypes[i][identifier]) {
                return [this.accountTypes[i]];
            }
        }

        /* If nothing matched, just return nothing. */
        return [];
    }

    /**
     * Resolve User Type
     * -----------------
     * Accepts an object that then is used to lookup the user type and return
     * a full object of it, this is useful for when you need to set the value of
     * an ng2-select but only have the id or the text of what was selected.
     *
     * @param {query} - the incomplete object of the user type.
     *
     * @return {userType} - the complete object of the user type.
     */
    public resolveUserType(query): any {
        /* Let's first check which we have. */
        let identifier = "";
        if (query.id) identifier = "id";
        if (query.text) identifier = "text";

        /* If there was nothing, return. */
        if (identifier === "") {
            return [];
        }

        /* Ok, lets check if we have the account type. */
        let i;
        for (i = 0; i < this.userTypes.length; i++) {
            /* Loop over each and check if they have the same id. */
            if (query[identifier].toString() === this.userTypes[i][identifier]) {
                return [this.userTypes[i]];
            }
        }

        /* If nothing matched, just return nothing. */
        return [];
    }

    /**
     * Resolve Group
     * -----------------
     * Accepts an object that then is used to lookup the group and
     * return a full object of it, this is useful for when you need to set the
     * value of an ng2-select but only have the id or the text of what was
     * selected.
     *
     * @param {query} - the incomplete object of the group.
     *
     * @return {groupType} - the complete object of the group.
     */
    public resolveGroup(query): any {
        /* Let's first check which we have. */
        let identifier = "";
        if (query.groupId) identifier = "groupId";
        if (query.groupName) identifier = "groupName";

        /* If there was nothing, return. */
        if (identifier === "") {
            return [];
        }

        /* Ok, lets check if we have the account type. */
        let key;
        for (key in this.allGroupsList) {
            /* Loop over each one and check the identifier. */
            if (this.allGroupsList[key][identifier].toString() === query[identifier].toString()) {
                return [this.allGroupsList[key]];
            }
        }

        /* If nothing matched, just return nothing. */
        return [];
    }

    /**
     * Resolve Admin Group Type
     * -----------------
     * Accepts an object that then is used to lookup the admin group type and
     * return a full object of it, this is useful for when you need to set the
     * value of an ng2-select but only have the id or the text of what was
     * selected.
     *
     * @param {query} - the incomplete object of the group type.
     *
     * @return {groupType} - the complete object of the group type.
     */
    public resolveGroupType(query): any {
        /* Let's first check which we have. */
        let identifier = "";
        if (query.id || query.id === 0) identifier = "id";
        if (query.text) identifier = "text";

        /* If there was nothing, return. */
        if (identifier === "") {
            return [];
        }

        /* Ok, lets check if we have the account type. */
        let i;
        for (i = 0; i < this.groupTypes.length; i++) {
            /* Loop over each one and check the identifier. */
            if (this.groupTypes[i][identifier] === query[identifier].toString()) {
                return [this.groupTypes[i]];
            }
        }

        /* If nothing matched, just return nothing. */
        return [];
    }

    /**
     * Get Permissions Difference.
     * ---------------------------
     * Figures out what to send to update permissions, i.e which to add,
     * delete or update.
     *
     * @param {oldPermissions} - the old permissions object.
     * @param {newPermissions} - the new permissions object.
     *
     * @return {diff}
     */
    public getPermissionsDiff(oldPermissions, newPermissions) {
        var toAdd = {};
        var toUpdate = {};
        var toDelete = [];


        for (var i in newPermissions) {
            /* Add it if it didn't exist. */
            if (typeof oldPermissions[i] == 'undefined') {
                toAdd[i] = newPermissions[i];
            }
            /* Else, if there's differences, add it to update. */
            else {
                if (oldPermissions[i]['canDelegate'] != newPermissions[i]['canDelegate'] ||
                    oldPermissions[i]['canDelete'] != newPermissions[i]['canDelete'] ||
                    oldPermissions[i]['canInsert'] != newPermissions[i]['canInsert'] ||
                    oldPermissions[i]['canRead'] != newPermissions[i]['canRead'] ||
                    oldPermissions[i]['canUpdate'] != newPermissions[i]['canUpdate']
                ) {
                    toUpdate[i] = newPermissions[i];
                }
            }
        }

        /* Figure out which are needed to be removed. */
        for (var i in oldPermissions) {
            if (typeof newPermissions[i] == 'undefined') {
                toDelete.push(i);
            }
        }

        return {
            'toAdd': toAdd,
            'toUpdate': toUpdate,
            'toDelete': toDelete
        };
    }

    /**
     * Get Wallet Access Differences.
     * ------------------------------
     * Returns a neat object of differences, toAdd, toUpdate and toDelete.
     *
     * @param {oldAccess} object - an object of permissions.
     * @param {newAccess} object - an object of permissions.
     *
     * @return {differences} object - an object of differences.
     */
    public getWalletAccessDiff (oldAccess, newAccess):any {
        /* Variables. */
        let
        i, j, k,
        differences = {
            'toAdd': {},
            'toUpdate': {},
            'toDelete': {}
        };

        /* First, let's see what's new. */
        for (i in newAccess) {
            /* If it's not in the old one, the add it. */
            if ( ! oldAccess[i] ) differences.toAdd[i] = newAccess[i];
        }

        /* Next, let's figure out what has been changed. */
        for (j in newAccess) {
            /* If it is in the old one and it is not the same value, it's different. */
            if ( oldAccess[j] && oldAccess[j] != newAccess[j] ) differences.toUpdate[j] = newAccess[j];
        }

        /* Lastly, let's check if any were deleted. */
        for (k in oldAccess) {
            /* If it's not in the new access, it's been deleted. */
            if ( ! newAccess[k] ) differences.toDelete[k] = oldAccess[k];
        }

        /* Now, just return the differences. */
        return differences;
    }

}
