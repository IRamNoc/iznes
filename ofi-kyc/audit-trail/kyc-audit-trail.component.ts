import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    templateUrl: './kyc-audit-trail.component.html',
    styleUrls: ['./kyc-audit-trail.component.scss'],
})
export class KycAuditTrailComponent implements OnInit, OnDestroy {

    kycID;
    unSubscribe: Subject<any> = new Subject();

    constructor(
        private activatedRoute: ActivatedRoute,
    ) {

    }

    ngOnInit() {
        this.activatedRoute.params
            .takeUntil(this.unSubscribe)
            .subscribe((params) => {
                this.kycID = params.kycID;
            });

    }

    ngOnDestroy() {

    }
}
