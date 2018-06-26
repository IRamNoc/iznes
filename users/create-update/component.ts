import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';

import * as Model from '../model';
import { AccountAdminCreateUpdateBase } from '../../base/create-update/component';

@Component({
    selector: 'app-core-admin-users-crud',
    templateUrl: '../../base/create-update/component.html',
})
export class UsersCreateUpdateComponent extends AccountAdminCreateUpdateBase implements OnInit, OnDestroy {

    form: Model.AccountAdminUserForm = new Model.AccountAdminUserForm();

    constructor(route: ActivatedRoute,
                router: Router,
                alerts: AlertsService,
                toaster: ToasterService) {
        super(route, router, alerts, toaster);
        this.noun = 'User';
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
