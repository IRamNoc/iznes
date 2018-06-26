import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';

import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { kycEnums } from '../../config';

@Component({
    selector: 'kyc-status-audit-trail',
    templateUrl: './kyc-status-audit-trail.component.html',
    styleUrls: ['./kyc-status-audit-trail.component.scss'],
})
export class KycStatusAuditTrailComponent implements OnInit, OnDestroy {

    statusAuditItems = [];
    statusEnum = {};

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private kycService: OfiKycService,
        @Inject('kycEnums') kycEnums,
    ) {
        this.statusEnum = kycEnums.status;
    }

    ngOnInit() {
        this.kycService.fetchStatusAuditByKycID(1)
            .then(((d) => {
                this.statusAuditItems = d[1].Data.map(item => ({
                    oldStatus: this.statusEnum[item.oldStatus],
                    newStatus: this.statusEnum[item.newStatus],
                    modifiedBy: item.modifiedBy,
                    dateEntered: item.dateEntered,
                    message: item.message,
                }));
                this.changeDetectorRef.markForCheck();
            }).bind(this));
    }

    ngOnDestroy() {

    }
}
