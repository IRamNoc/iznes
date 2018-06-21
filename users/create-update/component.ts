import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgRedux } from '@angular-redux/store';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConfirmationService } from '@setl/utils';
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
                redux: NgRedux<any>,
                alerts: AlertsService,
                toaster: ToasterService,
                confirmationService: ConfirmationService) {
        super('User', route, redux, alerts, toaster, confirmationService);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
