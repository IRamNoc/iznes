import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgRedux } from '@angular-redux/store';

import * as Model from '../model';
import { AccountAdminCreateUpdateBase } from '../../base/create-update/component';

@Component({
    selector: 'app-core-admin-users-crud',
    templateUrl: '../../base/create-update/component.html',
})
export class UsersCreateUpdateComponent extends AccountAdminCreateUpdateBase implements OnInit, OnDestroy {

    form: Model.AccountAdminUserForm = new Model.AccountAdminUserForm();

    constructor(route: ActivatedRoute, redux: NgRedux<any>) {
        super('User', route, redux);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
