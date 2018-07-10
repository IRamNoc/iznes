import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';

import * as Model from '../model';
import { UserTeamsService } from '../service';
import { AccountAdminCreateUpdateBase } from '../../base/create-update/component';
import { AccountAdminErrorResponse, AccountAdminNouns } from '../../base/model';

@Component({
    selector: 'app-core-admin-teams-crud',
    templateUrl: '../../base/create-update/component.html',
})
export class UserTeamsCreateUpdateComponent extends AccountAdminCreateUpdateBase implements OnInit, OnDestroy {

    form: Model.AccountAdminTeamForm = new Model.AccountAdminTeamForm();

    constructor(private service: UserTeamsService,
                route: ActivatedRoute,
                router: Router,
                alerts: AlertsService,
                toaster: ToasterService) {
        super(route, router, alerts, toaster);
        this.noun = AccountAdminNouns.Team;
    }

    ngOnInit() {
        super.ngOnInit();

        if (this.isUpdateMode()) {
            this.service.readUserTeams(this.entityId,
                                       (data: any) => this.onReadTeamSuccess(data),
                                       (e: any) => this.onReadEntityError());
        }
    }

    private onReadTeamSuccess(data): void {
        const team: Model.AccountAdminTeam = data[1].Data[0];

        this.form.description.control.setValue(team.description);
        this.form.name.control.setValue(team.name);
        this.form.reference.control.setValue(team.reference);
        this.form.status.control.setValue(team.status);
    }

    save(): void {
        if (this.isCreateMode()) {
            this.createTeam();
        } else if (this.isUpdateMode()) {
            this.updateTeam();
        }
    }

    delete(): void {
        if (this.isUpdateMode()) this.deleteTeam();
    }

    private createTeam(): void {
        this.service.createUserTeam(
            this.accountId,
            this.form.status.value(),
            this.form.name.value(),
            this.form.reference.value(),
            this.form.description.value(),
            () => this.onSaveSuccess(this.form.name.value()),
            (e: AccountAdminErrorResponse) => this.onSaveError(this.form.name.value(), e),
        );
    }

    private updateTeam(): void {
        this.service.updateUserTeam(
            this.entityId,
            this.form.status.value(),
            this.form.name.value(),
            this.form.reference.value(),
            this.form.description.value(),
            () => this.onSaveSuccess(this.form.name.value()),
            (e: AccountAdminErrorResponse) => this.onSaveError(this.form.name.value(), e),
        );
    }

    private deleteTeam(): void {
        this.service.deleteUserTeam(
            this.entityId,
            () => this.onSaveSuccess(this.form.name.value()),
            (e: AccountAdminErrorResponse) => this.onSaveError(this.form.name.value(), e),
        );
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
