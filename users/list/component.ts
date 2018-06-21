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
        super('User', router, redux, fileDownloader);

        this.users = [
            {
                firstName: 'User',
                lastName: 'One',
                email: 'user_one@email.com',
                phone: '01234 567890',
                type: 'Type',
                reference: 'USERONE1',
            },
            {
                firstName: 'User',
                lastName: 'Two',
                email: 'user_two@email.com',
                phone: '01234 567890',
                type: 'Type',
                reference: 'USERTWO2',
            },
            {
                firstName: 'User',
                lastName: 'Three',
                email: 'user_three@email.com',
                phone: '01234 567890',
                type: 'Type',
                reference: 'USERTHREE3',
            },
        ];
    }

    ngOnInit() {}

    ngOnDestroy() {}
}
