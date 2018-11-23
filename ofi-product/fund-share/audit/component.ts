
import { debounceTime, filter } from 'rxjs/operators';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { fromJS } from 'immutable';
import { Observable, Subscription } from 'rxjs';
import { FundShareAuditService } from './service';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';

import {
    FundShareAuditDetail,
    clearRequestedFundShareAudit,
    setRequestedFundShareAudit,
} from '@ofi/ofi-main/ofi-store/ofi-product/fund-share-audit';

import { MultilingualService } from '@setl/multilingual';
import { getOfiFundShareCurrentRequest } from '@ofi/ofi-main/ofi-store/ofi-product/fund-share';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-product-fund-share-audit',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundShareAuditComponent implements OnInit, OnDestroy {
    fundShare;
    private fundShareId: number;
    private subscriptionsArray: Subscription[] = [];
    private ignoreFormChange: boolean = true;
    fundShareAuditData: FundShareAuditDetail[];
    searchForm: FormGroup;
    dateConfig = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null,
    };

    @select(['ofi', 'ofiProduct', 'ofiFundShareAudit', 'requestedFundShareAudit']) fundShareAuditRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFundShareAudit', 'fundShareAudit']) fundShareAuditOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'requested']) fundShareRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) fundShareOb: Observable<any>;

    constructor(
        private redux: NgRedux<any>,
        private route: ActivatedRoute,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private service: FundShareAuditService,
        public translate: MultilingualService,
        private ofiFundShareService: OfiFundShareService,
    ) {
    }

    ngOnInit() {
        this.initSearchForm();
        this.initSubscriptions();
        this.redux.dispatch(clearRequestedFundShareAudit());
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.route.paramMap.subscribe((params) => {
            const fundShareId = params.get('shareId') as any;
            this.fundShareId = fundShareId ? parseInt(fundShareId, 10) : fundShareId;
        }));

        this.subscriptionsArray.push(this.fundShareAuditRequestedOb.subscribe((requested) => {
            this.requestFundShareAudit(requested);
        }));
        this.subscriptionsArray.push(this.fundShareAuditOb.subscribe((fundShareAudit) => {
            this.updateFundShareAudit(fundShareAudit);
        }));

        const fundShareRequestedSubscription = this.fundShareRequestedOb
            .pipe(
                filter(requested => !requested),
        ).subscribe(() => {
            this.ofiFundShareService.fetchFundShareByID(this.fundShareId);
        });

        this.subscriptionsArray.push(fundShareRequestedSubscription);

        const fundShareSubscription = this.fundShareOb.subscribe((fundShare) => {
            this.fundShare = fundShare;
            this.changeDetectorRef.markForCheck();
        });
        this.subscriptionsArray.push(fundShareSubscription);
    }

    private initSearchForm(): void {
        this.searchForm = new FormGroup({
            dateFrom: new FormControl(moment().add('-1', 'month').format('YYYY-MM-DD')),
            dateTo: new FormControl(moment().format('YYYY-MM-DD')),
        });

        this.subscriptionsArray.push(this.searchForm.valueChanges.pipe(debounceTime(1000)).subscribe((values) => {
            if (this.ignoreFormChange) {
                this.ignoreFormChange = false;
                return;
            }

            this.redux.dispatch(clearRequestedFundShareAudit());
        }));
    }

    private requestFundShareAudit(requested: boolean): void {
        if (requested) return;

        OfiFundShareService.defaultFundShareAudit(
            this.ofiFundShareService,
            this.redux,
            {
                fundShareID: this.fundShareId,
                dateFrom: this.searchForm.value.dateFrom ? this.searchForm.value.dateFrom : '',
                dateTo: this.searchForm.value.dateTo ? this.searchForm.value.dateTo : '',
            },
            () => { },
            () => { },
        );
    }

    private updateFundShareAudit(fundShareAudit): void {
        if (fundShareAudit && fundShareAudit[this.fundShareId]) {
            this.fundShareAuditData = this.service.processAuditData(fundShareAudit[this.fundShareId]);
        } else {
            this.fundShareAuditData = [];
        }

        this.redux.dispatch(setRequestedFundShareAudit());
        this.changeDetectorRef.markForCheck();
    }

    returnToShare(): void {
        this.router.navigateByUrl(`product-module/product/fund-share/${this.fundShareId}`);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
