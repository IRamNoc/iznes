import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { AccountAdminAuditBase } from '../../base/audit/component';

@Component({
    selector: 'app-core-admin-users-audit',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UsersAuditComponent extends AccountAdminAuditBase implements OnInit, OnDestroy {

    constructor(redux: NgRedux<any>) {
        super(redux);
    }

    ngOnInit() {}

    ngOnDestroy() {}
}
