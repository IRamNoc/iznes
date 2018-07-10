import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';

import { MultilingualService } from '@setl/multilingual';
import { AccountAdminAuditBase } from '../../base/audit/component';

@Component({
    selector: 'app-core-admin-users-audit',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UsersAuditComponent extends AccountAdminAuditBase implements OnInit, OnDestroy {

    constructor(redux: NgRedux<any>,
                router: Router,
                translate: MultilingualService) {
        super(redux, router, translate);
    }

    ngOnInit() {}

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
