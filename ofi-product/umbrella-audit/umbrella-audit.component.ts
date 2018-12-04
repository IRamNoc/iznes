import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { select } from '@angular-redux/store';
import * as _ from 'lodash';
import { Location } from '@angular/common';
import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';

@Component({
    templateUrl: './umbrella-audit.component.html',
    styleUrls: ['./umbrella-audit.component.scss'],
})
export class UmbrellaAuditComponent implements OnInit, OnDestroy {
    umbrellaID: number;
    umbrellaName: string;
    unSubscribe: Subject<any> = new Subject();

    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaList$;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'requested']) requestedUmbrellaList$;

    constructor(
        private activatedRoute: ActivatedRoute,
        private umbrellaService: OfiUmbrellaFundService,
        private location: Location,
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((params) => {
                this.umbrellaID = Number(params.umbrellaID);
            });

        this.requestedUmbrellaList$
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((isFetched) => {
                if (!isFetched) {
                    this.umbrellaService.fetchUmbrellaList();
                }
            });

        combineLatest(
            this.activatedRoute.params,
            this.umbrellaList$,
            )
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(([params, umbrellaList]) => {
                if (!params.umbrellaID) {
                    return;
                }

                this.umbrellaName = _.get(umbrellaList[params.umbrellaID], ['umbrellaFundName']);
            });
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

    navigateToPreviousLocation() {
        this.location.back();
    }
}
