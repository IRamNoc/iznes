import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { select } from '@angular-redux/store';
import * as _ from 'lodash';
import { Location } from '@angular/common';
import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';

const ADMIN_USER_URL = '/admin-product-module/';

@Component({
    templateUrl: './fund-audit.component.html',
    styleUrls: ['./fund-audit.component.scss'],
})
export class FundAuditComponent implements OnInit, OnDestroy {
    fundID: number;
    fundName: string;
    unSubscribe: Subject<any> = new Subject();

    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundList$;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'requested']) requestedFundList$;

    constructor(
        private activatedRoute: ActivatedRoute,
        private fundService: OfiFundService,
        private location: Location,
        private router: Router,
    ) {
    }

    ngOnInit() {

        this.activatedRoute.params
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((params) => {
                this.fundID = Number(params.fundID);
            });

        this.requestedFundList$
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((isFetched) => {
                if (!isFetched) {
                    if (!this.isAdmin()) {
                        this.fundService.fetchFundList();
                    } else {
                        /* For IZNES Admins */
                        this.fundService.fetchAdminFundList();
                    }
                }
            });

        combineLatest(
            this.activatedRoute.params,
            this.fundList$,
            )
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(([params, fundList]) => {
                if (!params.fundID) {
                    return;
                }

                this.fundName = _.get(fundList[params.fundID], ['fundName']);
            });
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

    navigateToPreviousLocation() {
        this.location.back();
    }

    /**
     * Check whether the userType is an IZNES Admin User
     *
     * @return {boolean}
     */
    isAdmin(): boolean {
        return this.router.url.startsWith(ADMIN_USER_URL);
    }
}
