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
    @Input() status: boolean = false;

    private textEnable: string = '';
    private textDisable: string = '';

    constructor(private toaster: ToasterService,
                private translate: MultilingualService,
                private confirmation: ConfirmationService) {

        this.textEnable = this.translate.translate('Enable');
        this.textDisable = this.translate.translate('Disable');
    }

    ngOnInit() {}

    updateStatus(): void {
        const title = `${this.status ? this.textDisable : this.textEnable} ${this.translate.translate(this.noun)}`;
        const message = this.translate.translate(`Are you sure you wish to ### this ${this.noun}?`)
            .replace('###', this.status ? this.textDisable : this.textEnable);

        this.confirmation.create(title, message).subscribe((ans) => {
            if (ans.resolved) {
                this.status = !this.status;

                this.onUpdateStatus();
            }
        });
    }

    onUpdateStatus(): void {
        console.error('method not implemented');
    }

    protected onStatusUpdateSuccess(): void {
        this.toaster.pop('success', this.translate.translate(
            `${this.noun} successfully ${this.status ? 'enabled' : 'disabled'}`,
        ));
    }

    protected onStatusUpdateError(): void {
        this.status = !this.status; // reset the status to it's previous

        this.toaster.pop('error', this.translate.translate(
            `${this.noun} could not be ${this.status ? 'enabled' : 'disabled'}`,
        ));
    }

    ngOnDestroy() { }
}
