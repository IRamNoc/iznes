import { take } from 'rxjs/operators';
import { select } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { PermissionsRequestService } from '@setl/core-req-services/permissions/permissions-request.service';

@Injectable({
    providedIn: 'root',
})
export class PermissionsService {
    @select(['user', 'permissions', 'permissions']) public permissionsObservable: any;
    @select(['user', 'myDetail', 'userId']) public userIdObservable: any;
    public permissions: any = null;
    public permissionTimeout = 10000; // 10 seconds

    /**
     * Constructor
     */
    public constructor(private permissionsRequestsService: PermissionsRequestService) {
        this.userIdObservable.subscribe((userId) => {
            if (userId === 0) {
                // throw 'User is not logged in whilst trying to use the Permissions Service.';
                return;
            }
            if (!this.havePermissionsLoaded()) {
                this.permissionsRequestsService.getUserAdminPermissions({ userID: userId });
            }
        });
        this.permissionsObservable.subscribe((permissions) => {
            this.permissions = permissions;
        });
    }

    /**
     * Has Permission
     *
     * @param {string} permissionName Permission Name (e.g. Users, Accounts etc)
     * @param {string} permissionType Permission Type (e.g. canDelegate, canRead etc)
     *
     * @return {Promise<boolean>} true if all permissions are true, else false
     */
    public async hasPermission(permissionName: string, permissionType: string) {
        // Deny access if permissions are not available
        if (!this.havePermissionsLoaded()) {
            await this.waitUntilPermissionsLoaded();
        }
        if (this.permissionExists(permissionName, permissionType)) {
            if (this.permissions[permissionName][permissionType]) {
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(false);
    }

    /**
     * Has Permissions
     *
     * @param {any} permissions Array contaning 'permissionName' and 'permissionType' tuples.
     *                          e.g. [
     *                              { permissionName: 'Accounts', permissionType: 'canRead' },
     *                              { permissionName: 'Accounts', permissionType: 'canDelete' },
     *                          ]
     *
     * @return {Promise<boolean>} true if all permissions are true, else false
     */
    public async hasPermissions(permissions: any) {
        if (!this.havePermissionsLoaded()) {
            await this.waitUntilPermissionsLoaded();
        }
        let permissionsOk = null;
        permissions.forEach((permission) => {
            const permissionName = permission.permissionName;
            const permissionType = permission.permissionType;
            if (permissionsOk === null) {
                if (this.permissionExists(permissionName, permissionType)) {
                    if (this.permissions[permissionName][permissionType]) {
                        permissionsOk = true;
                    }
                }
            }
            if (this.permissionExists(permissionName, permissionType)) {
                if (!this.permissions[permissionName][permissionType]) {
                    permissionsOk = false;
                }
            }
        });
        return Promise.resolve(permissionsOk !== false && permissionsOk !== null);
    }

    /**
     * Wait until permissions have been loaded
     *
     * @return {Promise<any>}
     */
    public waitUntilPermissionsLoaded() {
        return new Promise((resolve, reject) => {
            let timeElapsed = 0;
            const loadCheck = () => {
                if (this.havePermissionsLoaded()) {
                    resolve();
                    return;
                }
                if (timeElapsed > this.permissionTimeout) {
                    reject('Permissions failed to be found in time!');
                    return;
                }
                timeElapsed = timeElapsed + 100;
                setTimeout(loadCheck, 100);
            };
            loadCheck();
        });
    }

    /**
     * Have Permissions Loaded?
     *
     * @return {boolean}
     */
    public havePermissionsLoaded() {
        return !(
            typeof(this.permissions) === 'undefined' ||
            this.permissions === null ||
            Object.keys(this.permissions).length === 0
        );
    }

    /**
     * Permission Exists
     *
     * @return {boolean}
     */
    public permissionExists(permissionName, permissionType) {
        return typeof(this.permissions[permissionName]) !== 'undefined' &&
        typeof(this.permissions[permissionName][permissionType]) !== 'undefined';
    }
}
