import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';

@Component({
    selector: 'kyc-information-audit-trail',
    templateUrl: './kyc-information-audit-trail.component.html',
    styleUrls: ['./kyc-information-audit-trail.component.scss'],
})
export class KycInformationAuditTrailComponent implements OnInit, OnDestroy {

    informationAuditItems = [];

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private kycService: OfiKycService,
    ) {

    }

    ngOnInit() {
        this.kycService.fetchInformationAuditByKycID(1)
            .then(((d) => {
                this.informationAuditItems = d[1].Data.map(item => ({
                    subsection: item.subsection,
                    modifiedField: item.modifiedField,
                    oldValue: item.oldValue,
                    newValue: item.newValue,
                    modifiedBy: item.modifiedByID,
                    dateEntered: item.dateEntered,
                }));
                this.changeDetectorRef.markForCheck();
            }));
    }

    ngOnDestroy() {

    }
}
