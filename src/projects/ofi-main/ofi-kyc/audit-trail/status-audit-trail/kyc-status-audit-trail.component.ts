import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { FileDownloader } from '@setl/utils';
import { MemberSocketService } from '@setl/websocket-service';

@Component({
    selector: 'kyc-status-audit-trail',
    templateUrl: './kyc-status-audit-trail.component.html',
    styleUrls: ['./kyc-status-audit-trail.component.scss'],
})
export class KycStatusAuditTrailComponent implements OnInit, OnDestroy, OnChanges {
    statusAuditItems = [];
    myDetails;

    unSubscribe: Subject<any> = new Subject();
    @Input('kycID') kycID;
    @select(['ofi', 'ofiKyc', 'statusAuditTrail', 'data']) statusAuditTrail$;
    @select(['user', 'myDetail']) myDetail$;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private kycService: OfiKycService,
        private fileDownloader: FileDownloader,
        private memberSocketService: MemberSocketService,
    ) {
    }

    ngOnInit() {
        if (this.kycID) {
            this.kycService.getStatusAuditByKycID(this.kycID);
        }

        this.statusAuditTrail$
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (!this.kycID || !Object.keys(d).length) {
                    return;
                }

                this.statusAuditItems = d[this.kycID].map(item => ({
                    oldStatus: item.oldStatus,
                    newStatus: item.newStatus,
                    modifiedBy: item.modifiedBy,
                    dateEntered: item.dateEntered,
                    message: item.message,
                }));
                this.changeDetectorRef.markForCheck();
            });

        this.myDetail$
            .takeUntil(this.unSubscribe)
            .subscribe((myDetails) => {
                this.myDetails = myDetails;
            });
    }

    ngOnChanges(changes) {
        if (changes.kycID.currentValue !== changes.kycID.previousValue && changes.kycID.currentValue) {
            this.kycService.getStatusAuditByKycID(changes.kycID.currentValue);
        }
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();
    }

    exportCsv() {
        const config = {
            method: 'getKycStatusAudit',
            token: this.memberSocketService.token,
            userId: this.myDetails.userId,
            kycID: this.kycID,
            timezoneoffset: new Date().getTimezoneOffset(),
        };

        this.fileDownloader.downLoaderFile(config);
    }
}
