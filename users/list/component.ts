import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';

import { FileDownloader } from '@setl/utils'
;
import * as Model from '../model';
import { AccountAdminListBase } from '../../base/list/component';

@Component({
    selector: 'app-core-admin-users-list',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UsersListComponent extends AccountAdminListBase implements OnInit, OnDestroy {

    users: Model.AccountAdminUser[];

    constructor(router: Router, redux: NgRedux<any>, fileDownloader: FileDownloader) {
        super(router, redux, fileDownloader);
        this.noun = 'User';
    }

    ngOnInit() {}

    ngOnDestroy() {}
}
