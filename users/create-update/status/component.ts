import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';
import { ConfirmationService } from '@setl/utils';
import { AccountAdminStatusComponentBase } from '../../../base/create-update/status/component';
import { UsersService } from '../../service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-core-admin-users-status',
    templateUrl: '../../../base/create-update/status/component.html',
    styleUrls: ['../../../base/create-update/status/component.scss'],
})
export class UsersStatusComponent extends AccountAdminStatusComponentBase<null> implements OnInit, OnDestroy {

    constructor(toaster: ToasterService,
                translate: MultilingualService,
                confirmation: ConfirmationService,
                private service: UsersService,
                router: Router) {
        super(toaster, translate, confirmation, router);

        this.enableMessage = translate.translate('Are you sure you want to enable this user?');
        this.disableMessage = translate.translate(`Are you sure you want to disable this user?
            If you disable this user, then you will not be able to add this user in a team.
            You will need to activate the user in order to assign him to a team`);
    }

    onUpdateStatus(): void {
        this.service.updateUserStatus(
            this.entityId,
            this.status,
            () => this.onStatusUpdateSuccess(),
            () => this.onStatusUpdateError(),
        );
    }
}
