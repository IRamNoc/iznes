import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { select } from "@angular-redux/store";
import { combineLatest as observableCombineLatest } from 'rxjs';

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
        this.kycListOb
        .takeUntil(
            observableCombineLatest(
                this.activatedRoute.params,
                this.kycListOb,
            )
            .subscribe(([params, kycList]) => {
                this.kycID = Number(params.kycID);
                this.amCompanyName = kycList[kycList.findIndex((x) => x.kycID == this.kycID)]['companyName'];
            }),
        );
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }
}
