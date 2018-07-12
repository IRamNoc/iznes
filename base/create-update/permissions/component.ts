import { Component, OnInit, OnDestroy } from '@angular/core';

import * as PermissionsModel from './model';

@Component({
    selector: 'app-core-admin-permissions',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UserTeamsPermissionsComponentBase<Type> implements OnInit, OnDestroy {

    permissions: PermissionsModel.UserTeamsPermission[] = [
        {
            permissionID: 1,
            name: 'Home',
            description: 'Users will have access to the asset management dashboard',
        },
        {
            permissionID: 2,
            name: 'Order Book',
            description: 'Users will be able to access the order book',
        },
        {
            permissionID: 3,
            name: 'My Reports - Recordkeeping',
            description: 'Users will have access to record keeping reports',
        },
        {
            permissionID: 4,
            name: 'My Reports - Precentralisation',
            description: 'Users will have access to precentralisation reports',
        },
        {
            permissionID: 5,
            name: 'My Reports - Centralisation',
            description: 'Users will have access to centralisation reports',
        },
        {
            permissionID: 6,
            name: 'My Clients - On-boarding Management',
            description: 'Users will have access to on-boarding management',
        },
        {
            permissionID: 7,
            name: 'My Clients - Referential',
            description: 'Users will have access to referential',
        },
    ];

    constructor() { }

    ngOnInit() {}

    isProcessing(): boolean {
        return false;
    }

    updateState(value: boolean, permission: any): void {

    }

    ngOnDestroy() { }
}
