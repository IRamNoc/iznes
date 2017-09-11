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
} from '@setl/core-store';

@Injectable()
export class UserAdminService {

    /* Account types. */
    public accountTypes:any = [
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
    public walletTypes:any = [
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
    public userTypes:any = [
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
    public groupTypes:any = [
        {
            'id': '1',
            'text': 'Administrative',
        },
        {
            'id': '2',
            'text': 'Transactional',
        }
    ];

    public usersList:{};
    @Output()
    public usersListSubject = new Subject<any>();
    public getUserListSubject () {
        return this.usersListSubject.asObservable();
    }

    public adminGroupList:{};
    public txGroupList:{};
    @Output()
    public allGroupListSubject = new Subject<any>();
    /* Admin and TX group list observable. */
    public getGroupListSubject () {
        return this.allGroupListSubject.asObservable();
    }

    public adminPermAreaList:{};
    @Output()
    public adminPermAreaListSubject = new Subject<any>();
    public getAdminPermAreaListSubject () {
        return this.adminPermAreaListSubject.asObservable();
    }

    public txPermAreaList:{};
    @Output()
    public txPermAreaListSubject = new Subject<any>();
    public getTxPermAreaListSubject () {
        return this.txPermAreaListSubject.asObservable();
    }

    public permissionsList:{};
    @Output()
    public permissionsListSubject = new Subject<any>();
    public getPermissionsListSubject () {
        return this.permissionsListSubject.asObservable();
    }

    /* Constructor. */
    constructor (
        private adminUsersService:AdminUsersService,
        private ngRedux: NgRedux<any>,
    ) {
        let asyncTaskPipe;
        const state = this.ngRedux.getState();

        /* Let's request the user's list, this is the saga pipe function. */
        if ( ! Object.keys(getUsersList(state))[0] ) {
            asyncTaskPipe = this.adminUsersService.requestMyUsersList();

            // Send a saga action to save the users list.
            // Actions to dispatch, when request success:  SET_ADMIN_USERLIST.
            // Actions to dispatch, when request fail:  None.
            // Saga pipe function descriptor.
            // Saga pipe function arguments.
            this.ngRedux.dispatch(
                SagaHelper.runAsync(
                    [SET_ADMIN_USERLIST],
                    [],
                    asyncTaskPipe,
                    {}
                )
            );
        }

        /* Let's request the admin perm area list, this is the saga pipe function. */
        if ( ! getAdminPermAreaList(state).length ) {
            asyncTaskPipe = this.adminUsersService.getAdminPermAreaList();

            // Send a saga action to save the admin perm area list.
            // Actions to dispatch, when request success:  SET_ADMIN_PERM_AREAS_LIST.
            // Actions to dispatch, when request fail:  None.
            // Saga pipe function descriptor.
            // Saga pipe function arguments.
            this.ngRedux.dispatch(
                SagaHelper.runAsync(
                    [SET_ADMIN_PERM_AREAS_LIST],
                    [],
                    asyncTaskPipe,
                    {}
                )
            );
        }

        /* Let's request the tx perm area list, this is the saga pipe function. */
        if ( ! getTxPermAreaList(state).length ) {
            asyncTaskPipe = this.adminUsersService.getTxPermAreaList();

            // Send a saga action to save the tx perm area list.
            // Actions to dispatch, when request success:  SET_TX_PERM_AREAS_LIST.
            // Actions to dispatch, when request fail:  None.
            // Saga pipe function descriptor.
            // Saga pipe function arguments.
            this.ngRedux.dispatch(
                SagaHelper.runAsync(
                    [SET_TX_PERM_AREAS_LIST],
                    [],
                    asyncTaskPipe,
                    {}
                )
            );
        }

        /* TODO - pull in the arrays on this object dynamically. */

        /* Assign a update handler to watch changes in redux, then trigger once
           manually. */
        ngRedux.subscribe(() => this.updateState());
        this.updateState();
    }

    /**
     * Update State
     * ------------
     * Handles the updating of objects on this service when redux has data
     * updated.
     *
     * @return {void}
     */
    public updateState () {
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
        for (key in this.adminGroupList) this.adminGroupList[key].type = 1;
        for (key in this.txGroupList) this.txGroupList[key].type = 2;
        this.allGroupListSubject.next( Object.assign({}, this.txGroupList, this.adminGroupList) );

        /* Get admin perm area list and send message out. */
        this.adminPermAreaList = getAdminPermAreaList(state);
        this.adminPermAreaListSubject.next(this.adminPermAreaList);

        /* Get tx perm area list and send message out. */
        this.txPermAreaList = getTxPermAreaList(state);
        this.txPermAreaListSubject.next(this.txPermAreaList);

        /* Get permissions list by entities. */
        this.permissionsList = getPermissions(state);
        this.permissionsListSubject.next(this.permissionsList);
    }

    /**
     * Create New User
     * ----------------
     * Creates a new User.
     *
     * @param {data} - the new user data.
     *
     * @return {void}
     */
    public createNewUser (data):Promise<any> {
        return new Promise((resolve, reject) => {
            // Create a saga pipe.
            const asyncTaskPipe = this.adminUsersService.createNewUser(
                data
            );

            // Get response from set active wallet
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                function (response) {
                    resolve(response);
                },
                function (error) {
                    reject(error);
                })
            );
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
    public editUser (data):Promise<any> {
        return new Promise((resolve, reject) => {
            // Create a saga pipe.
            const asyncTaskPipe = this.adminUsersService.editUser(
                data
            );

            // Get response from set active wallet
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                function (response) {
                    resolve(response);
                },
                function (error) {
                    reject(error);
                })
            );
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
    public deleteUser (data):Promise<any> {
        return new Promise((resolve, reject) => {
            // Create a saga pipe.
            const asyncTaskPipe = this.adminUsersService.deleteUser(
                data
            );

            // Get response from set active wallet
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                function (response) {
                    resolve(response);
                },
                function (error) {
                    reject(error);
                })
            );
        });
    }

    /**
     * Create New Group
     * ----------------
     * Creates a new Group.
     *
     * @param {data} - the new group data.
     *
     * @return {void}
     */
    public createNewGroup (data):Promise<any> {
        return new Promise((resolve, reject) => {
            // Create a saga pipe.
            const asyncTaskPipe = this.adminUsersService.createNewGroup(
                data
            );

            // Get response from set active wallet
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                function (data) {
                    if ( data[1].Data[0] ) {
                        resolve( data[1].Data[0] ); // success
                    } else {
                        reject(data); // no data
                    }
                },
                function (data) {
                    reject(data); // error
                })
            );
        });
    }

    /**
     * Update Group
     * ----------------
     * Updates a Group.
     *
     * @param {data} - the new group data.
     *
     * @return {void}
     */
    public updateGroup (data):Promise<any> {
        return new Promise((resolve, reject) => {
            // Create a saga pipe.
            const asyncTaskPipe = this.adminUsersService.updateGroup(
                data
            );

            // Get response from set active wallet
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                function (data) {
                    if ( data[1].Data[0] ) {
                        resolve( data[1].Data[0] ); // success
                    } else {
                        reject(data); // no data
                    }
                },
                function (data) {
                    reject(data); // error
                })
            );
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
    public deleteGroup (data):Promise<any> {
        return new Promise((resolve, reject) => {
            // Create a saga pipe.
            const asyncTaskPipe = this.adminUsersService.deleteGroup(
                data
            );

            // Get response from set active wallet
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                function (data) {
                    if ( data[1].Data[0] ) {
                        resolve( data[1].Data[0] ); // success
                    } else {
                        reject(data); // no data
                    }
                },
                function (data) {
                    reject(data); // error
                })
            );
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
    updateAdminPermissions (data):Promise<any> {
        return new Promise((resolve, reject) => {
            // Get my detail to add is admin to the request.
            const
            state = this.ngRedux.getState(),
            myDetail = getMyDetail(state);
            data.isAdmin = myDetail.admin ? "1": "0";

            // Create a saga pipe.
            const asyncTaskPipe = this.adminUsersService.updateAdminPermissions(
                data
            );

            // Get response from set active wallet
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                function (data) {
                    resolve(data);
                },
                function (error) {
                    reject(error);
                })
            );
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
    updateTxPermissions (data):Promise<any> {
        return new Promise((resolve, reject) => {
            /* Get my detail to add is admin to the request. */
            const
            state = this.ngRedux.getState(),
            myDetail = getMyDetail(state);

            /* Figure the admin bit out. */
            data.isAdmin = myDetail.admin ? "1": "0";

            /* Create a saga pipe. */
            const asyncTaskPipe = this.adminUsersService.updateTxPermissions(
                data
            );

            /* Get response from set active wallet. */
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                function (data) {
                    resolve(data);
                },
                function (error) {
                    reject(error);
                })
            );
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
    requestPermissions (entity):Promise<any> {
        return new Promise((resolve, reject) => {
            /* Ok, so we need to get the permissions for this group and if asked,
               the specific permission by ID.
               Let's start by checking if we already have this in the store...
            */
            let
            state = this.ngRedux.getState(),
            currentPermissions = getPermissions(state),

            /* Check if we're looking in admin or tx. */
            location:string = entity.isTx ? "transPermissions" : "adminPermissions";

            /* Ok, so we didn't have it... now let's just request it. */
            let
            asyncTaskPipe;
            if ( entity.isTx ) {
                asyncTaskPipe = this.adminUsersService.requestTxPermissions(
                    entity
                );
            } else {
                asyncTaskPipe = this.adminUsersService.requestAdminPermissions(
                    entity
                );
            }


            /* Save response from the request, but first check if we're getting an
               admin entity or a tx one. */
            let action = entity.isTx ? SET_TX_PERMISSIONS : SET_ADMIN_PERMISSIONS;
            this.ngRedux.dispatch(
                SagaHelper.runAsync(
                    [ action ],
                    [],
                    asyncTaskPipe,
                    {},
                    (data) => {
                        resolve(data);
                    },
                    (error) => {
                        reject(error);
                    }
                )
            );

            /* Return. */
        });
    }

    /**
     * Get Account Types
     * -----------------
     * Returns the account types array.
     *
     * @return {accountTypes} - array.
     */
    public getAccountTypes():any {
        /* Return the array. */
        return this.accountTypes;
    }

    /**
     * Get Wallet Types
     * ----------------
     * Returns the wallet types array.
     *
     * @return {walletTypes} - array.
     */
    public getWalletTypes():any {
        /* Return the array. */
        return this.walletTypes;
    }

    /**
     * Get User Types
     * --------------
     * Returns the user types array.
     *
     * @return {userTypes} - array.
     */
    public getUserTypes():any {
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
    public getGroupTypes():any {
        /* Return the array. */
        return this.groupTypes;
    }

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
    public resolveAccountType ( query ):any {
        /* Let's first check which we have. */
        let identifier = "";
        if ( query.id ) identifier = "id";
        if ( query.text ) identifier = "text";

        /* If there was nothing, return. */
        if ( identifier === "" ) {
            return [];
        }

        /* Ok, lets check if we have the account type. */
        let i;
        for ( i = 0; i < this.accountTypes.length; i++ ) {
            /* Loop over each and check if they have the same id. */
            if ( query[identifier] === this.accountTypes[i][identifier] ) {
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
    public resolveUserType ( query ):any {
        /* Let's first check which we have. */
        let identifier = "";
        if ( query.id ) identifier = "id";
        if ( query.text ) identifier = "text";

        /* If there was nothing, return. */
        if ( identifier === "" ) {
            return [];
        }

        /* Ok, lets check if we have the account type. */
        let i;
        for ( i = 0; i < this.userTypes.length; i++ ) {
            /* Loop over each and check if they have the same id. */
            if ( query[identifier].toString() === this.userTypes[i][identifier] ) {
                return [this.userTypes[i]];
            }
        }

        /* If nothing matched, just return nothing. */
        return [];
    }

    /**
     * Resolve Admin Group
     * -----------------
     * Accepts an object that then is used to lookup the admin group and
     * return a full object of it, this is useful for when you need to set the
     * value of an ng2-select but only have the id or the text of what was
     * selected.
     *
     * @param {query} - the incomplete object of the group.
     *
     * @return {groupType} - the complete object of the group.
     */
    public resolveAdminGroup ( query ):any {
        /* Let's first check which we have. */
        let identifier = "";
        if ( query.groupId ) identifier = "groupId";
        if ( query.groupName ) identifier = "groupName";

        /* If there was nothing, return. */
        if ( identifier === "" ) {
            return [];
        }

        /* Ok, lets check if we have the account type. */
        let key;
        for ( key in this.adminGroupList ) {
            /* Loop over each one and check the identifier. */
            if ( this.adminGroupList[key][identifier].toString() === query[identifier] ) {
                return [ this.adminGroupList[key] ];
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
    public resolveGroupType ( query ):any {
        /* Let's first check which we have. */
        let identifier = "";
        if ( query.id ) identifier = "id";
        if ( query.text ) identifier = "text";

        /* If there was nothing, return. */
        if ( identifier === "" ) {
            return [];
        }

        /* Ok, lets check if we have the account type. */
        let i;
        for ( i = 0; i < this.groupTypes.length; i++ ) {
            /* Loop over each one and check the identifier. */
            if ( this.groupTypes[i][identifier] === query[identifier].toString() ) {
                return [ this.groupTypes[i] ];
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
        console.log("Old Permissions: ", oldPermissions);
        console.log("New Permissions: ", newPermissions);
        var differences = {};
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

}
