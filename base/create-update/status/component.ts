import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';
import { ConfirmationService } from '@setl/utils';
import { Router } from '@angular/router';

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

    protected enableMessage: string;
    protected disableMessage: string;

    constructor(private toaster: ToasterService,
                private translate: MultilingualService,
                private confirmation: ConfirmationService,
                private router: Router) {

        this.textEnable = this.translate.translate('Enable');
        this.textDisable = this.translate.translate('Disable');
        this.textPending = this.translate.translate('Pending');
    }

    ngOnInit() {}

    updateStatus(): void {
        if (this.isStatusPending()) return;

        const title = `${this.status ? this.textDisable : this.textEnable} ${this.translate.translate(this.noun)}`;
        const message = this.status ? this.disableMessage : this.enableMessage;

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
            (this.status)
                ? this.translate.translate(`${this.noun} successfully enabled`)
                : this.translate.translate(`${this.noun} successfully disabled`),
        ));

        this.router.navigateByUrl(this.getBackURL());
    }

    protected onStatusUpdateError(): void {
        this.status = this.status === 1 ? 0 : 1; // reset the status to it's previous

        this.toaster.pop('error', this.translate.translate(
            (this.status)
                ? this.translate.translate(`${this.noun} could not be enabled`)
                : this.translate.translate(`${this.noun} could not be disabled`),
        ));
    }

    private getBackURL(): string {
        return `/account-admin/${this.noun.toLowerCase()}s`;
    }

    ngOnDestroy() {}
}
