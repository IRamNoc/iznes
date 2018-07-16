import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-core-admin-status',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class AccountAdminStatusComponentBase<Type> implements OnInit, OnDestroy {

    @Input() noun: string;
    @Input() entityId: number;
    @Input() status: boolean = false;

    constructor(private toaster: ToasterService,
                private translate: MultilingualService) { }

    ngOnInit() {}

    updateStatus(): void {
        this.status = !this.status;

        this.onUpdateStatus();
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
