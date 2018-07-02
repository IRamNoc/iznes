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

@Component({
    selector: 'app-core-admin-users-list',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UsersListComponent extends AccountAdminListBase implements OnInit, OnDestroy {

    users: Model.AccountAdminUser[];

    @select(['accountAdmin', 'users', 'requested']) usersRequestedOb;
    @select(['accountAdmin', 'users', 'users']) usersOb;

    constructor(private service: UsersService,
                router: Router,
                redux: NgRedux<any>,
                fileDownloader: FileDownloader) {

        super(router, redux, fileDownloader);
        this.noun = 'User';
    }

    ngOnInit() {
        super.ngOnInit();

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

        this.service.readUsers(null, null, () => {}, () => {});
    }

    ngOnDestroy() {}
}
