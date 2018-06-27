import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef, Input } from '@angular/core';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';

@Component({
    selector: 'kyc-status-audit-trail',
    templateUrl: './kyc-status-audit-trail.component.html',
    styleUrls: ['./kyc-status-audit-trail.component.scss'],
})
export class KycStatusAuditTrailComponent implements OnInit, OnDestroy {

    statusAuditItems = [];
    statusEnum = {};

    unSubscribe: Subject<any> = new Subject();
    @Input('kycID') kycID;
    @select(['ofi', 'ofiKyc', 'statusAuditTrail', 'data']) statusAuditTrail$;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private kycService: OfiKycService,
        @Inject('kycEnums') kycEnums,
    ) {
        this.statusEnum = kycEnums.status;
    }

    ngOnInit() {
        console.log('input: ', this.kycID);
        this.kycService.fetchStatusAuditByKycID(this.kycID);

        this.statusAuditTrail$
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                this.statusAuditItems = d.map(item => ({
                    oldStatus: this.statusEnum[item.oldStatus || 0],
                    newStatus: this.statusEnum[item.newStatus],
                    modifiedBy: item.modifiedBy,
                    dateEntered: item.dateEntered,
                    message: item.message,
                }));
                this.changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();
    }
}
