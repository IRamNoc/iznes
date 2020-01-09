import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { select } from '@angular-redux/store';
import { combineLatest } from 'rxjs';

@Component({
    templateUrl: './kyc-audit-trail.component.html',
    styleUrls: ['./kyc-audit-trail.component.scss'],
})
export class KycAuditTrailComponent implements OnInit, OnDestroy {
    kycID;
    amCompanyName: string = '';
    unSubscribe: Subject<any> = new Subject();

    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) kycListOb;

    constructor(
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        combineLatest(
            this.activatedRoute.params,
            this.kycListOb,
        )
            .takeUntil(
                this.unSubscribe,
        )
            .subscribe(([params, kycList]) => {
                if (!params.kycID || !kycList.length) {
                    return;
                }
                this.kycID = Number(params.kycID);
                const kycIdx = kycList.findIndex(x => x.kycID === this.kycID);
                this.amCompanyName = kycList[kycIdx]['companyName'];
            });
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }
}
