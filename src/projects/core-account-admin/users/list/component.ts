import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';

import {
    clearRequestedAccountAdminUsers,
} from '@setl/core-store';

import { FileDownloader } from '@setl/utils';
import * as Model from '../model';
import { UsersService } from '../service';
import { AccountAdminListBase } from '../../base/list/component';
import { AccountAdminBaseService } from '../../base/service';
import { PermissionsService } from '@setl/utils/services/permissions';

@Component({
    selector: 'app-core-admin-users-list',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UsersListComponent extends AccountAdminListBase implements OnInit, OnDestroy {
    users: Model.AccountAdminUser[];
    accountId: number;

    @select(['user', 'myDetail', 'accountId']) accountIdOb;
    @select(['accountAdmin', 'users', 'requested']) usersRequestedOb;
    @select(['accountAdmin', 'users', 'users']) usersOb;

    public hasPermissionViewUsers: boolean = false;
    public hasPermissionCreateUsers: boolean = false;
    public hasPermissionUpdateUsers: boolean = false;

    constructor(private service: UsersService,
                router: Router,
                redux: NgRedux<any>,
                fileDownloader: FileDownloader,
                public permissionsService: PermissionsService,
                baseService: AccountAdminBaseService) {

        super(router, redux, fileDownloader, baseService);
        this.noun = 'User';
    }

    ngOnInit() {
        super.ngOnInit();

        this.permissionsService.hasPermission('accountAdminUsers', 'canRead').then(
            (hasPermission) => {
                this.hasPermissionViewUsers = hasPermission;
            });

        this.permissionsService.hasPermission('accountAdminUsers', 'canInsert').then(
            (hasPermission) => {
                this.hasPermissionCreateUsers = hasPermission;
            });

        this.permissionsService.hasPermission('accountAdminUsers', 'canUpdate').then(
            (hasPermission) => {
                this.hasPermissionUpdateUsers = hasPermission;
            });

        this.subscriptions.push(this.accountIdOb.subscribe((accountId: number) => {
            this.accountId = accountId;

            this.csvRequest = {
                accountID: this.accountId,
                textSearch: null,
                isCSVRequest: true,
            };
        }));

        this.subscriptions.push(this.usersRequestedOb.subscribe((requested: boolean) => {
            this.requestUsers(requested);
        }));

        this.subscriptions.push(this.usersOb.subscribe((users: Model.AccountAdminUser[]) => {
            this.users = users;
        }));

        this.redux.dispatch(clearRequestedAccountAdminUsers());
    }

    private requestUsers(requested: boolean): void {
        if (requested) return;

        this.service.readUsers(null, this.accountId, '', () => {}, () => {});
    }

    protected exportEntitiesAsCSV(): void {
        this.baseService.getCSVExport(
            this.fileDownloader,
            this.csvRequest,
            'exportUsersCSV',
            this.token,
            this.userId,
            this.username,
            this.noun,
        );
    }

    ngOnDestroy() {
        super.ngOnDestroy();

        this.users = undefined;
    }
}
