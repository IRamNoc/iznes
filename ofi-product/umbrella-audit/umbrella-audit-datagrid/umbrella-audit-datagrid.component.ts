import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'umbrella-audit-datagrid',
    templateUrl: './umbrella-audit-datagrid.component.html',
    styleUrls: ['./umbrella-audit-datagrid.component.scss'],
})
export class UmbrellaAuditDatagridComponent implements OnInit, OnDestroy, OnChanges {
    umbrellaAuditItems = [];
    umbrellaAuditList = [];
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
    @Input('umbrellaID') umbrellaID;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'audit']) umbrellaAuditList$;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private umbrellaService: OfiUmbrellaFundService,
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
        if (this.umbrellaID) {
            this.umbrellaService.fetchUmbrellaAuditByUmbrellaID(this.umbrellaID);
        }

        this.umbrellaAuditList$
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                this.umbrellaAuditList = d;
                this.updateUmbrellaAuditItems();
            });

        this.searchForm.valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                this.filterAuditItems(d);
            });
    }

    ngOnChanges(changes) {
        if (changes.umbrellaID.currentValue !== changes.umbrellaID.previousValue && changes.umbrellaID.currentValue) {
            this.umbrellaService.fetchUmbrellaAuditByUmbrellaID(changes.umbrellaID.currentValue);
            this.updateUmbrellaAuditItems();
        }
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();
    }

    updateUmbrellaAuditItems() {
        if (
            !this.umbrellaID
            || !Object.keys(this.umbrellaAuditList).length
            || !this.umbrellaAuditList[this.umbrellaID]
            || !this.umbrellaAuditList[this.umbrellaID].length
        ) {
            this.umbrellaAuditItems = [];
            return;
        }
        this.umbrellaAuditItems = this.umbrellaAuditList[this.umbrellaID].map(item => ({
            umbrellaName: item.umbrellaName,
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
                    this.umbrellaAuditItems,
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
            return Date.parse(filterValue + ' 23:59:59') >= Date.parse(item.dateModified);
        });
    }
}
