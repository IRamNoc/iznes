import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';
import { ConfirmationService } from '@setl/utils';

@Component({
    selector: 'app-core-admin-status',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class AccountAdminStatusComponentBase<Type> implements OnInit, OnDestroy {

    @Input() noun: string;
    @Input() entityId: number;
    @Input() status: number = 0;

    textEnable: string = '';
    textDisable: string = '';
    textPending: string = '';

    constructor(private toaster: ToasterService,
                private translate: MultilingualService,
                private confirmation: ConfirmationService) {

        this.textEnable = this.translate.translate('Enable');
        this.textDisable = this.translate.translate('Disable');
        this.textPending = this.translate.translate('Pending');
    }

    ngOnInit() {}

    updateStatus(): void {
        if (this.isStatusPending()) return;

        const title = `${this.status ? this.textDisable : this.textEnable} ${this.translate.translate(this.noun)}`;
        const message = this.translate.translate(`Are you sure you want to ### this ${this.noun}?<br />
            If you ${this.status ? this.textDisable : this.textEnable} this ${this.noun},
            then you will not be able to<br />assign them to other entities.`)
            .replace('###', this.status ? this.textDisable : this.textEnable);

        this.confirmation.create(title, message).subscribe((ans) => {
            if (ans.resolved) {
                this.status = this.status === 1 ? 0 : 1;

                this.onUpdateStatus();
            }
        });
    }

    onUpdateStatus(): void {
        console.error('method not implemented');
    }

    isStatusEnabled(): boolean {
        return this.status === 1;
    }

    isStatusDisabled(): boolean {
        return this.status === 0;
    }

    isStatusPending(): boolean {
        return this.status === 2;
    }

    getStatusText(): string {
        switch (this.status) {
        case 0:
            return this.textDisable;
        case 1:
            return this.textEnable;
        case 2:
            return this.textPending;
        default:
            return '';
        }
    }

    protected onStatusUpdateSuccess(): void {
        this.toaster.pop('success', this.translate.translate(
            `${this.noun} successfully ${this.status ? 'enabled' : 'disabled'}`,
        ));
    }

    protected onStatusUpdateError(): void {
        this.status = this.status === 1 ? 0 : 1; // reset the status to it's previous

        this.toaster.pop('error', this.translate.translate(
            `${this.noun} could not be ${this.status ? 'enabled' : 'disabled'}`,
        ));
    }

    ngOnDestroy() { }
}
