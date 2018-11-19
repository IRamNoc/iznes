import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'fund-audit-datagrid',
    templateUrl: './fund-audit-datagrid.component.html',
    styleUrls: ['./fund-audit-datagrid.component.scss'],
})
export class FundAuditDatagridComponent implements OnInit, OnDestroy, OnChanges {

    fundAuditItems = [];
    fundAuditList = [];
    filteredAuditItems = [];

    searchForm: FormGroup;
    // Locale
    language = 'en';
    // Datepicker config
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
    };

    unSubscribe: Subject<any> = new Subject();
    @Input('fundID') fundID;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'audit']) fundAuditList$;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private fundService: OfiFundService,
        private fb: FormBuilder,
        public translate: MultilingualService,
    ) {
        this.searchForm = this.fb.group({
            startDate: [
                '',
            ],
            endDate: [
                '',
            ],
        });
    }

    ngOnInit() {
        if (this.fundID) {
            this.fundService.fetchFundAuditByFundID(this.fundID);
        }

        this.fundAuditList$
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((d) => {
                this.fundAuditList = d;
                this.updateFundAuditItems();
            });

        this.searchForm.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((d) => {
                this.filterAuditItems(d);
            });
    }

    ngOnChanges(changes) {
        if (changes.fundID.currentValue !== changes.fundID.previousValue && changes.fundID.currentValue) {
            this.fundService.fetchFundAuditByFundID(changes.fundID.currentValue);
            this.updateFundAuditItems();
        }
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();
    }

    updateFundAuditItems() {
        if (
            !this.fundID
            || !Object.keys(this.fundAuditList).length
            || !this.fundAuditList[this.fundID]
            || !this.fundAuditList[this.fundID].length
        ) {
            this.fundAuditItems = [];
            return;
        }

        this.fundAuditItems = this.fundAuditList[this.fundID].map(item => ({
            fundName: item.fundName,
            field: item.field,
            oldValue: item.oldValue,
            newValue: item.newValue,
            modifiedBy: item.modifiedBy,
            dateModified: item.dateModified,
        }));
        this.filterAuditItems(this.searchForm.value);
        this.changeDetectorRef.markForCheck();
    }

    filterAuditItems(filters) {
        this.filteredAuditItems =
            this.filterByEndDate(
                filters.endDate,
                this.filterByStartDate(
                    filters.startDate,
                    this.fundAuditItems,
                ),
            );
    }

    filterByStartDate(filterValue, list) {
        if (!list.length || !filterValue) {
            return list;
        }
        return list.filter((item) => {
            return Date.parse(filterValue) <= Date.parse(item.dateModified);
        });
    }

    filterByEndDate(filterValue, list) {
        if (!list.length || !filterValue) {
            return list;
        }
        return list.filter((item) => {
            console.log('endDate', filterValue, item.dateModified);
            return Date.parse(filterValue + ' 23:59:59') >= Date.parse(item.dateModified);
        });
    }
}
