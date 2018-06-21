import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgRedux } from '@angular-redux/store';

import * as Model from '../model';
import { AccountAdminCreateUpdateBase } from '../../base/create-update/component';

@Component({
    selector: 'app-core-admin-teams-crud',
    templateUrl: '../../base/create-update/component.html',
})
export class UserTeamsCreateUpdateComponent extends AccountAdminCreateUpdateBase implements OnInit, OnDestroy {

    form: Model.AccountAdminTeamForm = new Model.AccountAdminTeamForm();

    constructor(route: ActivatedRoute, redux: NgRedux<any>) {
        super('Team', route, redux);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
