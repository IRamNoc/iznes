import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';

import { AccountAdminStatusComponentBase } from '../../../base/create-update/status/component';
import { UserTeamsService } from '../../service';

@Component({
    selector: 'app-core-admin-user-teams-status',
    templateUrl: '../../../base/create-update/status/component.html',
    styleUrls: ['../../../base/create-update/status/component.scss'],
})
export class UserTeamsStatusComponent extends AccountAdminStatusComponentBase<null> {

    constructor(toaster: ToasterService,
                translate: MultilingualService,
                private service: UserTeamsService) {
        super(toaster, translate);
    }

    onUpdateStatus(): void {
        this.service.updateUserTeamStatus(
            this.entityId,
            this.status,
            () => this.onStatusUpdateSuccess(),
            () => this.onStatusUpdateError(),
        );
    }
}
