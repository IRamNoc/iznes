import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';

@Component({
    selector: 'umbrella-audit-datagrid',
    templateUrl: './umbrella-audit-datagrid.component.html',
    styleUrls: ['./umbrella-audit-datagrid.component.scss'],
})
export class UmbrellaAuditDatagridComponent implements OnInit, OnDestroy, OnChanges {

    umbrellaAuditItems = [];
    umbrellaAuditList = [];

    unSubscribe: Subject<any> = new Subject();
    @Input('umbrellaID') umbrellaID;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'audit']) umbrellaAuditList$;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private umbrellaService: OfiUmbrellaFundService,
        @Inject('product-config') productConfig,
    ) {

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
        this.changeDetectorRef.markForCheck();
    }
}
