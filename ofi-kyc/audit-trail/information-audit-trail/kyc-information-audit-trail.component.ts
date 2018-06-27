import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, Input, OnChanges } from '@angular/core';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';

@Component({
    selector: 'kyc-information-audit-trail',
    templateUrl: './kyc-information-audit-trail.component.html',
    styleUrls: ['./kyc-information-audit-trail.component.scss'],
})
export class KycInformationAuditTrailComponent implements OnInit, OnDestroy, OnChanges {

    informationAuditItems = [];
    subsectionEnums;

    unSubscribe: Subject<any> = new Subject();
    @Input('kycID') kycID;
    @select(['ofi', 'ofiKyc', 'informationAuditTrail', 'data']) informationAuditTrail$;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private kycService: OfiKycService,
        @Inject('kycEnums') kycEnums,
    ) {
        this.subsectionEnums = kycEnums.subsection;
    }

    ngOnInit() {
        this.kycService.fetchInformationAuditByKycID(this.kycID);

        this.informationAuditTrail$
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                this.informationAuditItems = d.map(item => ({
                    section: this.subsectionEnums[item.subsection],
                    subsection: item.subsection,
                    modifiedField: item.modifiedField,
                    oldValue: item.oldValue,
                    newValue: item.newValue,
                    modifiedBy: item.modifiedBy,
                    dateModified: item.dateModified,
                }));
                this.changeDetectorRef.markForCheck();
            });
    }

    ngOnChanges(changes) {
        if (changes.kycID.currentValue !== changes.kycID.previousValue) {
            this.kycService.fetchInformationAuditByKycID(changes.kycID.currentValue);
        }
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();
    }
}
