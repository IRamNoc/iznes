import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgRedux, select} from '@angular-redux/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import {fromJS} from 'immutable';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {NumberConverterService, MoneyValuePipe, NavHelperService} from '@setl/utils';

import {OfiNavAuditService} from './service';
import {OfiNavService} from '@ofi/ofi-main/ofi-req-services/ofi-product/nav/service';
import {
    NavAuditDetail,
    clearRequestedNavAudit,
    setRequestedNavAudit
} from '@ofi/ofi-main/ofi-store/ofi-product/nav-audit';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-product-nav-audit',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiNavAuditComponent implements OnInit, OnDestroy {

    private fundShareId: number;
    private subscriptionsArray: Subscription[] = [];
    private ignoreFormChange: boolean = true;
    navAuditData: NavAuditDetail[];
    searchForm: FormGroup;
    dateConfig = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null
    };

    @select(['ofi', 'ofiProduct', 'ofiNavAudit', 'requestedNavAudit']) navAuditRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiNavAudit', 'navAudit']) navAuditOb: Observable<any>;

    constructor(private redux: NgRedux<any>,
        private route: ActivatedRoute,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private service: OfiNavAuditService,
        private numberConverterService: NumberConverterService,
        private moneyPipe: MoneyValuePipe,
        private ofiNavService: OfiNavService) { }
        
    ngOnInit() {
        this.initSearchForm();
        this.initSubscriptions();
        this.redux.dispatch(clearRequestedNavAudit());
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.route.paramMap.subscribe(params => {
            const fundShareId = params.get('shareId') as any;
            this.fundShareId = fundShareId ? parseInt(fundShareId) : fundShareId;
        }));

        this.subscriptionsArray.push(this.navAuditRequestedOb.subscribe(requested => {
            this.requestNavAudit(requested);
        }));
        this.subscriptionsArray.push(this.navAuditOb.subscribe(navAudit => {
            this.updateNavAudit(navAudit);
        }));
    }

    private initSearchForm(): void {
        this.searchForm = new FormGroup({
            dateFrom: new FormControl(moment().add('-1', 'month').format('YYYY-MM-DD')),
            dateTo: new FormControl(moment().format('YYYY-MM-DD'))
        });

        this.subscriptionsArray.push(this.searchForm.valueChanges.debounceTime(1000).subscribe((values) => {
            this.redux.dispatch(clearRequestedNavAudit());
        }));
    }

    private requestNavAudit(requested: boolean): void {
        if (requested) return;

        OfiNavService.defaultRequestNavAuditTrail(this.ofiNavService,
            this.redux,
            {
                fundShareId: this.fundShareId,
                dateFrom: this.searchForm.value.dateFrom ? this.searchForm.value.dateFrom : '',
                dateTo: this.searchForm.value.dateTo ? this.searchForm.value.dateTo : ''
            },
            () => {},
            () => {});
    }

    private updateNavAudit(navAudit): void {
        if(navAudit && navAudit[this.fundShareId]) {
            this.navAuditData = navAudit[this.fundShareId];
        } else {
            this.navAuditData = [];
        }

        this.redux.dispatch(setRequestedNavAudit());
        this.changeDetectorRef.markForCheck();
    }

    navToFrontEndString(nav: number): string {
        return this.moneyPipe.transform(this.numberConverterService.toFrontEnd(nav));
    }

    isPriceHigherThanPrevious(item: NavAuditDetail): boolean {
        return item.price > item.previousPrice;
    }

    getPriceClass(item: NavAuditDetail): string {
        return this.isPriceHigherThanPrevious(item) ? ' price-higher' : ' price-lower';
    }

    getNextValuationDate(item: NavAuditDetail): string {
        return NavHelperService.getNextValuationDate(item.valuationFrequency, item.navDate);
    }

    returnToNav(): void {
        this.router.navigateByUrl(`product-module/nav-fund-view`);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}