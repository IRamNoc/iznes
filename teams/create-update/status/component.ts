import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';
import { ConfirmationService } from '@setl/utils';

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
                confirmation: ConfirmationService,
                private service: UserTeamsService) {
        super(toaster, translate, confirmation);
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
