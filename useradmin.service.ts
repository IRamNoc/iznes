import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SagaHelper } from '@setl/utils';
import { select, NgRedux } from '@angular-redux/store';

import {
    AdminUsersService,
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
    getMenuPermissionGroup,

    /* Permission areas. */
    SET_ADMIN_PERM_AREAS_LIST,
    SET_TX_PERM_AREAS_LIST,
    SET_MENU_PERM_AREAS_LIST,
    getAdminPermAreaList,
    getTxPermAreaList,
    getMenuPermAreaList,

    /* Entity Permissions */
    SET_ADMIN_PERMISSIONS,
    SET_TX_PERMISSIONS,
    SET_MENU_PERMISSIONS,
    getPermissions,
    getAdminPermissions,
    getTranPermissions,

    /* Group permissions */
    SET_USERS_ADMIN_PERMISSIONS,
    SET_USERS_TX_PERMISSIONS,
    SET_USERS_MENU_PERMISSIONS,
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
    public accountList: any = [];

    /* Wallet Types. */
    public walletTypes: any = [
        {
            id: '1',
            text: 'Legal Entity',
        },
        {
            id: '2',
            text: 'Individual',
        },
        {
            id: '3',
            text: 'Other',
        },
    ];

    /* User Types. */
    public userTypes: any = [
        {
            id: '15',
            text: 'System admin',
        },
        {
            id: '25',
            text: 'Chain admin',
        },
        {
            id: '26',
            text: 'SGP Admin',
        },
        {
            id: '27',
            text: 'Bank',
        },
        {
            id: '35',
            text: 'Member',
        },
        {
            id: '36',
            text: 'Asset manager',
        },
        {
            id: '45',
            text: 'Standard user',
        },
        {
            id: '46',
            text: 'Investor',
        },
        {
            id: '47',
            text: 'Valuer',
        },
        {
            id: '48',
            text: 'Custodian',
        },
        {
            id: '49',
            text: 'CAC',
        },
        {
            id: '50',
            text: 'Registrar',
        },
        {
            id: '60',
            text: 'T2S Admin',
        },
        {
            id: '65',
            text: 'Rooster Operator',
        },
        {
            id: '66',
            text: 'Rooster IPA',
        },
        {
            id: '67',
            text: 'Rooster Final Custodian',
        },
    ];

    /* Group Types. */
    public groupTypes: any = [
        {
            id: '0',
            text: 'Administrative',
        },
        {
            id: '1',
            text: 'Transactional',
        },
        {
            id: '2',
            text: 'Menu',
        },
    ];

    public usersList: {};
    @Output()
    public usersListSubject = new Subject<any>();

    public getUserListSubject() {
        return this.usersListSubject.asObservable();
    }

    public adminGroupList: {};
    public txGroupList: {};
    public menuGroupList: {};
    public allGroupsList: {};
    @Output()
    public allGroupListSubject = new Subject<any>();

    /* Admin, TX & Menu group list observable. */
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

    public menuPermAreaList: {};
    @Output()
    public menuPermAreaListSubject = new Subject<any>();

    public getMenuPermAreaListSubject() {
        return this.menuPermAreaListSubject.asObservable();
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

    public usersMenuAccess: {};
    @Output()
    public usersMenuAccessSubject = new Subject<any>();

    public getUsersMenuAccessSubject() {
        return this.usersMenuAccessSubject.asObservable();
    }

    private subscriptions = {};

    @select(['account', 'accountList', 'accountList']) accountListOb: any;

    /* Constructor. */
    constructor(private adminUsersService: AdminUsersService,
                private ngRedux: NgRedux<any>) {
        const state = this.ngRedux.getState();

        /* Let's request the user's list, this is the saga pipe function. */
        if (!Object.keys(getUsersList(state))[0]) {
            this.adminUsersService.buildRequest({
                ngRedux: this.ngRedux,
                taskPipe: this.adminUsersService.requestMyUsersList(),
                successActions: [SET_ADMIN_USERLIST],
            });
        }

        /* Let's request the admin perm area list, this is the saga pipe function. */
        if (!Object.keys(getAdminPermAreaList(state)).length) {
            this.adminUsersService.buildRequest({
                ngRedux: this.ngRedux,
                taskPipe: this.adminUsersService.getAdminPermAreaList(),
                successActions: [SET_ADMIN_PERM_AREAS_LIST],
            });
        }

        /* Let's request the tx perm area list, this is the saga pipe function. */
        if (!Object.keys(getTxPermAreaList(state)).length) {
            this.adminUsersService.buildRequest({
                ngRedux: this.ngRedux,
                taskPipe: this.adminUsersService.getTxPermAreaList(),
                successActions: [SET_TX_PERM_AREAS_LIST],
            });
        }

        /* Let's request the menu perm area list, this is the saga pipe function. */
        if (!Object.keys(getMenuPermAreaList(state)).length) {
            this.adminUsersService.buildRequest({
                ngRedux: this.ngRedux,
                taskPipe: this.adminUsersService.getMenuPermAreaList(),
                successActions: [SET_MENU_PERM_AREAS_LIST],
            });
        }

        /* Let's subscribe to the accounts list. */
        this.subscriptions['account-list'] = this.accountListOb.subscribe((accountList) => {
            /* Variables. */
            const newAccountList = [];

            /* Ok, let's loop over each account... */
            for (const key of Object.keys(accountList)) {
                /* ...and push a nice select object into the new array. */
                if (accountList[key]) {
                    newAccountList.push({
                        id: accountList[key].accountId,
                        text: accountList[key].accountName,
                    });
                }
            }

            /* Now set the current array. */
            this.accountList = newAccountList;
        });

        /* Assign a update handler to watch changes in redux, then trigger once manually. */
        ngRedux.subscribe(() => this.updateState());
        this.updateState();
    }

    public requestChainList(): void {
        AdminUsersService.defaultRequestChainList(this.adminUsersService, this.ngRedux);
    }

    /**
     * Updates objects on this service when redux is updated.
     *
     * @return {void}
     */
    public updateState() {
        /* Retrieve the redux store. */
        const state = this.ngRedux.getState();

        /* Get user list, and send a message to the users observable. */
        this.usersList = getUsersList(state);
        this.usersListSubject.next(this.usersList);

        /* Get adminGroupList groups list. */
        this.adminGroupList = getAdminPermissionGroup(state);
        /* Get adminGroupList groups list. */
        this.txGroupList = getTranPermissionGroup(state);
        /* Get adminGroupList groups list. */
        this.menuGroupList = getMenuPermissionGroup(state);

        /* Combine the groups and emit. */
        this.allGroupsList = Object.assign({}, this.txGroupList, this.adminGroupList, this.menuGroupList);
        this.allGroupListSubject.next(this.allGroupsList);

        /* Get admin perm area list and send message out. */
        this.adminPermAreaList = getAdminPermAreaList(state);
        this.adminPermAreaListSubject.next(this.adminPermAreaList);

        /* Get tx perm area list and send message out. */
        this.txPermAreaList = getTxPermAreaList(state);
        this.txPermAreaListSubject.next(this.txPermAreaList);

        /* Get menu perm area list and send message out. */
        this.menuPermAreaList = getMenuPermAreaList(state);
        this.menuPermAreaListSubject.next(this.menuPermAreaList);

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
     * Triggers an update of the user's list in redux.
     *
     * @return {void}
     */
    public updateUsersStore(pageFrom = 0, pageSize = 0): void {

        console.log('+++ pageFrom', pageFrom);
        console.log('+++ pageSize', pageSize);
        this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.requestMyUsersList(pageFrom, pageSize),
            successActions: [SET_ADMIN_USERLIST],
        });
    }

    /**
     * Creates a new user.
     *
     * @param {Object} data - The new user data.
     *
     * @return {Promise}
     */
    public createNewUser(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.createNewUser(data),
        });
    }

    /**
     * Edits a user.
     *
     * @param {Object} data - The new user data.
     *
     * @return {Promise}
     */
    public editUser(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.editUser(data),
        });
    }

    /**
     * Deletes a user.
     *
     * @param {Object} data - The new user data.
     *
     * @return {Promise}
     */
    public deleteUser(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.deleteUser(data),
        });
    }

    /**
     * Requests user wallet permissions.
     *
     * @param {Object} data - The entity data.
     *
     * @return {Promise}
     */
    requestUserWalletPermissions(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.requestUserWalletPermissions(data),
            successActions: [SET_USERS_WALLET_PERMISSIONS],
        });
    }

    /**
     * New user wallet permissions.
     *
     * @param {Object} data - The permissions data.
     *
     * @return {Promise}
     */
    newUserWalletPermissions(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.newUserWalletPermissions(data),
        });
    }

    /**
     * Updates a user's wallet permissions.
     *
     * @param {Object} data - The permissions data.
     *
     * @return {Promise}
     */
    updateUserWalletPermissions(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateUserWalletPermissions(data),
        });
    }

    /**
     * Requests a user's group wallet permissions.
     *
     * @param {Object} data - The entity data.
     *
     * @return {Promise}
     */
    requestUserGroupWalletPermissions(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.requestUserAccountWalletPermissions(data),
            successActions: [],
        });
    }

    /**
     * Updates a user's group wallet permissions.
     *
     * @param {Object} data - The permissions data.
     *
     * @return {Promise}
     */
    updateUserGroupWalletPermissions(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateUserAccountWalletPermissions(data),
        });
    }

    /**
     * Updates a user's chain access.
     *
     * @param {Object} data - The update data.
     *
     * @return {Promise}
     */
    updateUserChainAccess(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateUserChainAccess(data),
        });
    }

    /**
     * Request a user's chain access.
     *
     * @param {Object} data - The request data.
     *
     * @return {Promise}
     */
    requestUserChainAccess(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.requestUserChainAccess(data),
            successActions: [SET_USERS_CHAIN_ACCESS],
        });
    }

    /**
     * ===============
     * Group requests.
     * ===============
     */

    /**
     * Creates a new Group.
     *
     * @param {Object} data - The new group data.
     *
     * @return {Promise}
     */
    public createNewGroup(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.createNewGroup(data),
        });
    }

    /**
     * Updates a Group.
     *
     * @param {Object} data - The group's new data.
     *
     * @return {Promise}
     */
    public updateGroup(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateGroup(data),
        });
    }

    /**
     * Deletes a Group.
     *
     * @param {Object} data - The group data, only requires a groupId key.
     *
     * @return {Promise}
     */
    public deleteGroup(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.deleteGroup(data),
        });
    }

    /**
     * Updates an entity's permissions.
     *
     * @param {Object} data - The permission data.
     *
     * @return {Promise}
     */
    updateAdminPermissions(data): Promise<any> {
        /* Add isAdmin to data. */
        const state = this.ngRedux.getState();
        const myDetail = getMyDetail(state);
        data.isAdmin = myDetail.admin ? '1' : '0';

        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateAdminPermissions(data),
        });
    }

    /**
     * Updates an entity's permissions.
     *
     * @param {Object} data - The permission data.
     *
     * @return {Promise}
     */
    updateTxPermissions(data): Promise<any> {
        /* Get my detail to add is admin to the request. */
        const state = this.ngRedux.getState();
        const myDetail = getMyDetail(state);

        /* Figure the admin bit out. */
        data.isAdmin = myDetail.admin ? '1' : '0';

        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateTxPermissions(data),
        });
    }

    /**
     * Updates an entity's menu permissions.
     *
     * @param {Object} data - The permission data.
     *
     * @return {Promise}
     */
    updateMenuPermissions(data): Promise<any> {
        /* Get my detail to add is admin to the request. */
        const state = this.ngRedux.getState();
        const myDetail = getMyDetail(state);

        /* Figure the admin bit out. */
        data.isAdmin = myDetail.admin ? '1' : '0';

        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateMenuPermissions(data),
        });
    }

    /**
     * Requests an entity's permissions or all, used on click for editing a group.
     *
     * @param {Object} entity - The entity data.
     *
     * @return {Promise}
     */
    requestPermissions(entity): Promise<any> {
        let action;
        let asynTaskPipe;

        if (entity.isTx === 1) {
            asynTaskPipe = this.adminUsersService.requestTxPermissions(entity);
            action = SET_TX_PERMISSIONS;
        } else if (entity.isTx === 2) {
            asynTaskPipe = this.adminUsersService.requestMenuPermissions(entity);
            action = SET_MENU_PERMISSIONS;
        } else {
            asynTaskPipe = this.adminUsersService.requestAdminPermissions(entity);
            action = SET_ADMIN_PERMISSIONS;
        }

        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: asynTaskPipe,
            successActions: [action],
        });
    }

    /**
     * Requests a user's permissions or all, used on click for editing a user.
     *
     * @param {Object} entity - The entity data.
     *
     * @return {Promise}
     */
    requestUserPermissions(entity): Promise<any> {
        const action = (entity.isTx === 1 ?
            SET_USERS_TX_PERMISSIONS : (entity.isTx === 2 ?
                SET_USERS_MENU_PERMISSIONS : SET_USERS_ADMIN_PERMISSIONS));

        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.requestUserPermissions(entity),
            successActions: [action],
        });
    }

    /**
     * Updates a user's groups or all, used on click for editing a user.
     *
     * @param {Object} entity - The entity data.
     *
     * @return {Promise}
     */
    updateUserGroups(entity): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateUserGroups(entity),
        });
    }

    /**
     * =================
     * Wallet functions.
     * =================
     */

    /**
     * Creates a new wallet.
     *
     * @param {Object} data - The new wallet information.
     *
     * @return {Promise}
     */
    createNewWallet(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.createNewWallet(data),
        });
    }

    /**
     * Updates a wallet.
     *
     * @param {Object} data - The updated wallet information.
     *
     * @return {Promise}
     */
    updateWallet(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.updateWallet(data),
        });
    }

    /**
     * Deletes a Wallet.
     *
     * @param {Object} data - The group's new data.
     *
     * @return {Promise}
     */
    public deleteWallet(data): Promise<any> {
        return this.adminUsersService.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: this.adminUsersService.deleteWallet(data),
        });
    }

    /**
     * ===========================
     * Getters for hardcoded data.
     * ===========================
     */

    /**
     * Gets the account types array.
     *
     * @return {Array} accountList
     */
    public getAccountTypes(): any {
        return this.accountList;
    }

    /**
     * Gets the account type by Id.
     *
     * @param {number} id - The ID of a type.
     *
     * @return {Array} accountList.
     */
    public getAccountTypeById(id): any {
        for (const i in this.accountList) {
            if (Number(this.accountList[i].id) === id) {
                return [this.accountList[i]];
            }
        }
        return [];
    }

    /**
     * Gets the wallet types array.
     *
     * @return {Array} walletTypes.
     */
    public getWalletTypes(): any {
        return this.walletTypes;
    }

    /**
     * Gets the wallet type by an ID.
     *
     * @param {number} id - The ID of a type.
     *
     * @return {Array} walletType.
     */
    public getWalletTypeById(id): any {
        for (const i in this.walletTypes) {
            if (Number(this.walletTypes[i].id) === id) {
                return [this.walletTypes[i]];
            }
        }

        return [];
    }

    /**
     * Gets the user types array.
     *
     * @return {Array} userTypes.
     */
    public getUserTypes(): any {
        return this.userTypes;
    }

    /**
     * Gets the group types array.
     *
     * @return {Array} groupTypes.
     */
    public getGroupTypes(): any {
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
     * @param {Object} query - The incomplete object of the account type.
     *
     * @return {Array} accountType - The complete object of the account type.
     */
    public resolveAccountType(query): any {
        /* Let's first check which we have. */
        let identifier = '';
        if (query.id) identifier = 'id';
        if (query.text) identifier = 'text';

        /* If there was nothing, return. */
        if (identifier === '') {
            return [];
        }

        /* Check if we have the account type. */
        for (let i = 0; i < this.accountList.length; i += 1) {
            /* Loop over each and check if they have the same id. */
            if (query[identifier] === this.accountList[i][identifier]) {
                return [this.accountList[i]];
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
     * @param {Object} query - The incomplete object of the user type.
     *
     * @return {Array} userType - The complete object of the user type.
     */
    public resolveUserType(query): any {
        /* Let's first check which we have. */
        let identifier = '';
        if (query.id) identifier = 'id';
        if (query.text) identifier = 'text';

        /* If there was nothing, return. */
        if (identifier === '') {
            return [];
        }

        /* Ok, lets check if we have the account type. */
        let i;
        for (i = 0; i < this.userTypes.length; i += 1) {
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
     * -------------
     * Accepts an object that then is used to lookup the group and
     * return a full object of it, this is useful for when you need to set the
     * value of an ng2-select but only have the id or the text of what was
     * selected.
     *
     * @param {Object} query - The incomplete object of the group.
     *
     * @return {Array} groupType - The complete object of the group.
     */
    public resolveGroup(query): any {
        /* Let's first check which we have. */
        let identifier = '';
        if (query.groupId) identifier = 'groupId';
        if (query.groupName) identifier = 'groupName';

        /* If there was nothing, return. */
        if (identifier === '') {
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
     * ------------------------
     * Accepts an object that then is used to lookup the admin group type and
     * return a full object of it, this is useful for when you need to set the
     * value of an ng2-select but only have the id or the text of what was
     * selected.
     *
     * @param {Object} query - The incomplete object of the group type.
     *
     * @return {Array} groupType - The complete object of the group type.
     */
    public resolveGroupType(query): any {
        /* Let's first check which we have. */
        let identifier = '';
        if (query.id || query.id === 0) identifier = 'id';
        if (query.text) identifier = 'text';

        /* If there was nothing, return. */
        if (identifier === '') {
            return [];
        }

        /* Ok, lets check if we have the account type. */
        let i;
        for (i = 0; i < this.groupTypes.length; i += 1) {
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
     * Figures out what to send to update permissions, i.e., which to add, delete or update.
     *
     * @param {Object} oldPermissions - The old permissions object.
     * @param {Object} newPermissions - The new permissions object.
     *
     * @return {Object} diff
     */
    public getPermissionsDiff(oldPermissions, newPermissions, type) {
        const toAdd = {};
        const toUpdate = {};
        const toDelete = [];

        for (const i in newPermissions) {
            /* Add it if it didn't exist. */
            if (typeof oldPermissions[i] === 'undefined') {
                toAdd[i] = newPermissions[i];
                /* Else, if there's differences, add it to update. */
            } else {
                if (oldPermissions[i]['canDelegate'] !== newPermissions[i]['canDelegate'] ||
                    oldPermissions[i]['canDelete'] !== newPermissions[i]['canDelete'] ||
                    oldPermissions[i]['canInsert'] !== newPermissions[i]['canInsert'] ||
                    oldPermissions[i]['canRead'] !== newPermissions[i]['canRead'] ||
                    oldPermissions[i]['canUpdate'] !== newPermissions[i]['canUpdate'] ||
                    type === 2
                ) {
                    toUpdate[i] = newPermissions[i];
                }
            }
        }

        /* Figure out which are needed to be removed. */
        for (const i in oldPermissions) {
            if (typeof newPermissions[i] === 'undefined') {
                toDelete.push(i);
            }
        }

        return {
            toAdd,
            toUpdate,
            toDelete,
        };
    }

    /**
     * Get Wallet Access Differences.
     * ------------------------------
     * Returns a neat object of differences, toAdd, toUpdate and toDelete.
     *
     * @param {Object} oldAccess - An object of permissions.
     * @param {Object} newAccess - An object of permissions.
     *
     * @return {Object} differences - An object of differences.
     */
    public getWalletAccessDiff(oldAccess, newAccess): any {
        /* Variables. */
        let i;
        let j;
        let k;
        const differences = {
            toAdd: {},
            toUpdate: {},
            toDelete: {},
        };

        /* First, let's see what's new. */
        for (i in newAccess) {
            /* If it's not in the old one, the add it. */
            if (!oldAccess[i]) differences.toAdd[i] = newAccess[i];
        }

        /* Next, let's figure out what has been changed. */
        for (j in newAccess) {
            /* If it is in the old one and it is not the same value, it's different. */
            if (oldAccess[j] && oldAccess[j] !== newAccess[j]) differences.toUpdate[j] = newAccess[j];
        }

        /* Lastly, let's check if any were deleted. */
        for (k in oldAccess) {
            /* If it's not in the new access, it's been deleted. */
            if (!newAccess[k]) differences.toDelete[k] = oldAccess[k];
        }

        /* Now, just return the differences. */
        return differences;
    }

    ngOnDestroy() {
        /* Unsubscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }

    /**
     * Resolve Countries
     * -----------------
     * Incomplete array of objects in, complete array of objects out.
     *
     * @param {Array} incompleteArray - Array of incomplete objects.
     *
     * @return {Array} completeArray - Array of complete objects.
     */
    // public resolveCountries(incompleteArray): Array<{
    //     id: string;
    //     text: string;
    // }> {
    public resolveCountries(incompleteArray): { id: string; text: string; }[] {
        /* Variables. */
        let i;
        let j;
        let toResolve;
        let country;
        let identifier = '';
        const completeArray = [];

        /* Ok, let's loop over each of the objects to resolve. */
        for (i in incompleteArray) {
            /* Reference the incomplete object. */
            toResolve = incompleteArray[i];

            /* Set the identifier, used to compare to the list of countries. */
            if (toResolve.id) identifier = 'id';
            if (toResolve.text) identifier = 'text';

            /* Now, let's loop over the countries list and finc the one that is in here. */
            for (j in this.countries) {
                /* Reference. */
                country = this.countries[j];

                /* Check if we've found it. */
                if (country[identifier] === toResolve[identifier]) {
                    /* If we have, then let's push this country into the array... */
                    completeArray.push(country);

                    /* ...and break. */
                    break;
                }
            }

            /* Reset identifier. */
            identifier = '';
        }

        return completeArray;
    }

    /* List of countries, down here because it's fucking massive. */
    public countries = [
        {
            id: 'AD',
            text: 'Andorra',
        },
        {
            id: 'AE',
            text: 'United Arab Emirates',
        },
        {
            id: 'AF',
            text: 'Afghanistan',
        },
        {
            id: 'AG',
            text: 'Antigua And Barbuda',
        },
        {
            id: 'AI',
            text: 'Anguilla',
        },
        {
            id: 'AL',
            text: 'Albania',
        },
        {
            id: 'AM',
            text: 'Armenia',
        },
        {
            id: 'AN',
            text: 'Netherlands Antilles',
        },
        {
            id: 'AO',
            text: 'Angola',
        },
        {
            id: 'AQ',
            text: 'Antarctica',
        },
        {
            id: 'AR',
            text: 'Argentina',
        },
        {
            id: 'AS',
            text: 'American Samoa',
        },
        {
            id: 'AT',
            text: 'Austria',
        },
        {
            id: 'AU',
            text: 'Australia',
        },
        {
            id: 'AW',
            text: 'Aruba',
        },
        {
            id: 'AX',
            text: 'Aland Islands',
        },
        {
            id: 'AZ',
            text: 'Azerbaijan',
        },
        {
            id: 'BA',
            text: 'Bosnia And Herzegovina',
        },
        {
            id: 'BB',
            text: 'Barbados',
        },
        {
            id: 'BD',
            text: 'Bangladesh',
        },
        {
            id: 'BE',
            text: 'Belgium',
        },
        {
            id: 'BF',
            text: 'Burkina Faso',
        },
        {
            id: 'BG',
            text: 'Bulgaria',
        },
        {
            id: 'BH',
            text: 'Bahrain',
        },
        {
            id: 'BI',
            text: 'Burundi',
        },
        {
            id: 'BJ',
            text: 'Benin',
        },
        {
            id: 'BL',
            text: 'Saint Barthelemy',
        },
        {
            id: 'BM',
            text: 'Bermuda',
        },
        {
            id: 'BN',
            text: 'Brunei Darussalam',
        },
        {
            id: 'BO',
            text: 'Bolivia',
        },
        {
            id: 'BR',
            text: 'Brazil',
        },
        {
            id: 'BS',
            text: 'Bahamas',
        },
        {
            id: 'BT',
            text: 'Bhutan',
        },
        {
            id: 'BV',
            text: 'Bouvet Island',
        },
        {
            id: 'BW',
            text: 'Botswana',
        },
        {
            id: 'BY',
            text: 'Belarus',
        },
        {
            id: 'BZ',
            text: 'Belize',
        },
        {
            id: 'CA',
            text: 'Canada',
        },
        {
            id: 'CC',
            text: 'Cocos (Keeling) Islands',
        },
        {
            id: 'CD',
            text: 'Congo, Democratic Republic',
        },
        {
            id: 'CF',
            text: 'Central African Republic',
        },
        {
            id: 'CG',
            text: 'Congo',
        },
        {
            id: 'CH',
            text: 'Switzerland',
        },
        {
            id: 'CI',
            text: 'Cote D\'Ivoire',
        },
        {
            id: 'CK',
            text: 'Cook Islands',
        },
        {
            id: 'CL',
            text: 'Chile',
        },
        {
            id: 'CM',
            text: 'Cameroon',
        },
        {
            id: 'CN',
            text: 'China',
        },
        {
            id: 'CO',
            text: 'Colombia',
        },
        {
            id: 'CR',
            text: 'Costa Rica',
        },
        {
            id: 'CU',
            text: 'Cuba',
        },
        {
            id: 'CV',
            text: 'Cape Verde',
        },
        {
            id: 'CX',
            text: 'Christmas Island',
        },
        {
            id: 'CY',
            text: 'Cyprus',
        },
        {
            id: 'CZ',
            text: 'Czech Republic',
        },
        {
            id: 'DE',
            text: 'Germany',
        },
        {
            id: 'DJ',
            text: 'Djibouti',
        },
        {
            id: 'DK',
            text: 'Denmark',
        },
        {
            id: 'DM',
            text: 'Dominica',
        },
        {
            id: 'DO',
            text: 'Dominican Republic',
        },
        {
            id: 'DZ',
            text: 'Algeria',
        },
        {
            id: 'EC',
            text: 'Ecuador',
        },
        {
            id: 'EE',
            text: 'Estonia',
        },
        {
            id: 'EG',
            text: 'Egypt',
        },
        {
            id: 'EH',
            text: 'Western Sahara',
        },
        {
            id: 'ER',
            text: 'Eritrea',
        },
        {
            id: 'ES',
            text: 'Spain',
        },
        {
            id: 'ET',
            text: 'Ethiopia',
        },
        {
            id: 'FI',
            text: 'Finland',
        },
        {
            id: 'FJ',
            text: 'Fiji',
        },
        {
            id: 'FK',
            text: 'Falkland Islands (Malvinas)',
        },
        {
            id: 'FM',
            text: 'Micronesia, Federated States Of',
        },
        {
            id: 'FO',
            text: 'Faroe Islands',
        },
        {
            id: 'FR',
            text: 'France',
        },
        {
            id: 'GA',
            text: 'Gabon',
        },
        {
            id: 'GB',
            text: 'United Kingdom',
        },
        {
            id: 'GD',
            text: 'Grenada',
        },
        {
            id: 'GE',
            text: 'Georgia',
        },
        {
            id: 'GF',
            text: 'French Guiana',
        },
        {
            id: 'GG',
            text: 'Guernsey',
        },
        {
            id: 'GH',
            text: 'Ghana',
        },
        {
            id: 'GI',
            text: 'Gibraltar',
        },
        {
            id: 'GL',
            text: 'Greenland',
        },
        {
            id: 'GM',
            text: 'Gambia',
        },
        {
            id: 'GN',
            text: 'Guinea',
        },
        {
            id: 'GP',
            text: 'Guadeloupe',
        },
        {
            id: 'GQ',
            text: 'Equatorial Guinea',
        },
        {
            id: 'GR',
            text: 'Greece',
        },
        {
            id: 'GS',
            text: 'South Georgia And Sandwich Isl.',
        },
        {
            id: 'GT',
            text: 'Guatemala',
        },
        {
            id: 'GU',
            text: 'Guam',
        },
        {
            id: 'GW',
            text: 'Guinea-Bissau',
        },
        {
            id: 'GY',
            text: 'Guyana',
        },
        {
            id: 'HK',
            text: 'Hong Kong',
        },
        {
            id: 'HM',
            text: 'Heard Island & Mcdonald Islands',
        },
        {
            id: 'HN',
            text: 'Honduras',
        },
        {
            id: 'HR',
            text: 'Croatia',
        },
        {
            id: 'HT',
            text: 'Haiti',
        },
        {
            id: 'HU',
            text: 'Hungary',
        },
        {
            id: 'ID',
            text: 'Indonesia',
        },
        {
            id: 'IE',
            text: 'Ireland',
        },
        {
            id: 'IL',
            text: 'Israel',
        },
        {
            id: 'IM',
            text: 'Isle Of Man',
        },
        {
            id: 'IN',
            text: 'India',
        },
        {
            id: 'IO',
            text: 'British Indian Ocean Territory',
        },
        {
            id: 'IQ',
            text: 'Iraq',
        },
        {
            id: 'IR',
            text: 'Iran, Islamic Republic Of',
        },
        {
            id: 'IS',
            text: 'Iceland',
        },
        {
            id: 'IT',
            text: 'Italy',
        },
        {
            id: 'JE',
            text: 'Jersey',
        },
        {
            id: 'JM',
            text: 'Jamaica',
        },
        {
            id: 'JO',
            text: 'Jordan',
        },
        {
            id: 'JP',
            text: 'Japan',
        },
        {
            id: 'KE',
            text: 'Kenya',
        },
        {
            id: 'KG',
            text: 'Kyrgyzstan',
        },
        {
            id: 'KH',
            text: 'Cambodia',
        },
        {
            id: 'KI',
            text: 'Kiribati',
        },
        {
            id: 'KM',
            text: 'Comoros',
        },
        {
            id: 'KN',
            text: 'Saint Kitts And Nevis',
        },
        {
            id: 'KR',
            text: 'Korea',
        },
        {
            id: 'KW',
            text: 'Kuwait',
        },
        {
            id: 'KY',
            text: 'Cayman Islands',
        },
        {
            id: 'KZ',
            text: 'Kazakhstan',
        },
        {
            id: 'LA',
            text: 'Lao People\'s Democratic Republic',
        },
        {
            id: 'LB',
            text: 'Lebanon',
        },
        {
            id: 'LC',
            text: 'Saint Lucia',
        },
        {
            id: 'LI',
            text: 'Liechtenstein',
        },
        {
            id: 'LK',
            text: 'Sri Lanka',
        },
        {
            id: 'LR',
            text: 'Liberia',
        },
        {
            id: 'LS',
            text: 'Lesotho',
        },
        {
            id: 'LT',
            text: 'Lithuania',
        },
        {
            id: 'LU',
            text: 'Luxembourg',
        },
        {
            id: 'LV',
            text: 'Latvia',
        },
        {
            id: 'LY',
            text: 'Libyan Arab Jamahiriya',
        },
        {
            id: 'MA',
            text: 'Morocco',
        },
        {
            id: 'MC',
            text: 'Monaco',
        },
        {
            id: 'MD',
            text: 'Moldova',
        },
        {
            id: 'ME',
            text: 'Montenegro',
        },
        {
            id: 'MF',
            text: 'Saint Martin',
        },
        {
            id: 'MG',
            text: 'Madagascar',
        },
        {
            id: 'MH',
            text: 'Marshall Islands',
        },
        {
            id: 'MK',
            text: 'Macedonia',
        },
        {
            id: 'ML',
            text: 'Mali',
        },
        {
            id: 'MM',
            text: 'Myanmar',
        },
        {
            id: 'MN',
            text: 'Mongolia',
        },
        {
            id: 'MO',
            text: 'Macao',
        },
        {
            id: 'MP',
            text: 'Northern Mariana Islands',
        },
        {
            id: 'MQ',
            text: 'Martinique',
        },
        {
            id: 'MR',
            text: 'Mauritania',
        },
        {
            id: 'MS',
            text: 'Montserrat',
        },
        {
            id: 'MT',
            text: 'Malta',
        },
        {
            id: 'MU',
            text: 'Mauritius',
        },
        {
            id: 'MV',
            text: 'Maldives',
        },
        {
            id: 'MW',
            text: 'Malawi',
        },
        {
            id: 'MX',
            text: 'Mexico',
        },
        {
            id: 'MY',
            text: 'Malaysia',
        },
        {
            id: 'MZ',
            text: 'Mozambique',
        },
        {
            id: 'NA',
            text: 'Namibia',
        },
        {
            id: 'NC',
            text: 'New Caledonia',
        },
        {
            id: 'NE',
            text: 'Niger',
        },
        {
            id: 'NF',
            text: 'Norfolk Island',
        },
        {
            id: 'NG',
            text: 'Nigeria',
        },
        {
            id: 'NI',
            text: 'Nicaragua',
        },
        {
            id: 'NL',
            text: 'Netherlands',
        },
        {
            id: 'NO',
            text: 'Norway',
        },
        {
            id: 'NP',
            text: 'Nepal',
        },
        {
            id: 'NR',
            text: 'Nauru',
        },
        {
            id: 'NU',
            text: 'Niue',
        },
        {
            id: 'NZ',
            text: 'New Zealand',
        },
        {
            id: 'OM',
            text: 'Oman',
        },
        {
            id: 'PA',
            text: 'Panama',
        },
        {
            id: 'PE',
            text: 'Peru',
        },
        {
            id: 'PF',
            text: 'French Polynesia',
        },
        {
            id: 'PG',
            text: 'Papua New Guinea',
        },
        {
            id: 'PH',
            text: 'Philippines',
        },
        {
            id: 'PK',
            text: 'Pakistan',
        },
        {
            id: 'PL',
            text: 'Poland',
        },
        {
            id: 'PM',
            text: 'Saint Pierre And Miquelon',
        },
        {
            id: 'PN',
            text: 'Pitcairn',
        },
        {
            id: 'PR',
            text: 'Puerto Rico',
        },
        {
            id: 'PS',
            text: 'Palestinian Territory, Occupied',
        },
        {
            id: 'PT',
            text: 'Portugal',
        },
        {
            id: 'PW',
            text: 'Palau',
        },
        {
            id: 'PY',
            text: 'Paraguay',
        },
        {
            id: 'QA',
            text: 'Qatar',
        },
        {
            id: 'RE',
            text: 'Reunion',
        },
        {
            id: 'RO',
            text: 'Romania',
        },
        {
            id: 'RS',
            text: 'Serbia',
        },
        {
            id: 'RU',
            text: 'Russian Federation',
        },
        {
            id: 'RW',
            text: 'Rwanda',
        },
        {
            id: 'SA',
            text: 'Saudi Arabia',
        },
        {
            id: 'SB',
            text: 'Solomon Islands',
        },
        {
            id: 'SC',
            text: 'Seychelles',
        },
        {
            id: 'SD',
            text: 'Sudan',
        },
        {
            id: 'SE',
            text: 'Sweden',
        },
        {
            id: 'SG',
            text: 'Singapore',
        },
        {
            id: 'SH',
            text: 'Saint Helena',
        },
        {
            id: 'SI',
            text: 'Slovenia',
        },
        {
            id: 'SJ',
            text: 'Svalbard And Jan Mayen',
        },
        {
            id: 'SK',
            text: 'Slovakia',
        },
        {
            id: 'SL',
            text: 'Sierra Leone',
        },
        {
            id: 'SM',
            text: 'San Marino',
        },
        {
            id: 'SN',
            text: 'Senegal',
        },
        {
            id: 'SO',
            text: 'Somalia',
        },
        {
            id: 'SR',
            text: 'Suriname',
        },
        {
            id: 'ST',
            text: 'Sao Tome And Principe',
        },
        {
            id: 'SV',
            text: 'El Salvador',
        },
        {
            id: 'SY',
            text: 'Syrian Arab Republic',
        },
        {
            id: 'SZ',
            text: 'Swaziland',
        },
        {
            id: 'TC',
            text: 'Turks And Caicos Islands',
        },
        {
            id: 'TD',
            text: 'Chad',
        },
        {
            id: 'TF',
            text: 'French Southern Territories',
        },
        {
            id: 'TG',
            text: 'Togo',
        },
        {
            id: 'TH',
            text: 'Thailand',
        },
        {
            id: 'TJ',
            text: 'Tajikistan',
        },
        {
            id: 'TK',
            text: 'Tokelau',
        },
        {
            id: 'TL',
            text: 'Timor-Leste',
        },
        {
            id: 'TM',
            text: 'Turkmenistan',
        },
        {
            id: 'TN',
            text: 'Tunisia',
        },
        {
            id: 'TO',
            text: 'Tonga',
        },
        {
            id: 'TR',
            text: 'Turkey',
        },
        {
            id: 'TT',
            text: 'Trinidad And Tobago',
        },
        {
            id: 'TV',
            text: 'Tuvalu',
        },
        {
            id: 'TW',
            text: 'Taiwan',
        },
        {
            id: 'TZ',
            text: 'Tanzania',
        },
        {
            id: 'UA',
            text: 'Ukraine',
        },
        {
            id: 'UG',
            text: 'Uganda',
        },
        {
            id: 'UM',
            text: 'United States Outlying Islands',
        },
        {
            id: 'US',
            text: 'United States',
        },
        {
            id: 'UY',
            text: 'Uruguay',
        },
        {
            id: 'UZ',
            text: 'Uzbekistan',
        },
        {
            id: 'VA',
            text: 'Holy See (Vatican City State)',
        },
        {
            id: 'VC',
            text: 'Saint Vincent And Grenadines',
        },
        {
            id: 'VE',
            text: 'Venezuela',
        },
        {
            id: 'VG',
            text: 'Virgin Islands, British',
        },
        {
            id: 'VI',
            text: 'Virgin Islands, U.S.',
        },
        {
            id: 'VN',
            text: 'Viet Nam',
        },
        {
            id: 'VU',
            text: 'Vanuatu',
        },
        {
            id: 'WF',
            text: 'Wallis And Futuna',
        },
        {
            id: 'WS',
            text: 'Samoa',
        },
        {
            id: 'YE',
            text: 'Yemen',
        },
        {
            id: 'YT',
            text: 'Mayotte',
        },
        {
            id: 'ZA',
            text: 'South Africa',
        },
        {
            id: 'ZM',
            text: 'Zambia',
        },
        {
            id: 'ZW',
            text: 'Zimbabwe',
        },
    ];
}
