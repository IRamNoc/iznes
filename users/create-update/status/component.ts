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
