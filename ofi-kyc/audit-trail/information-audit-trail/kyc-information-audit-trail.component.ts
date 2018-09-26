import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, Input, OnChanges } from '@angular/core';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { FormBuilder, FormGroup } from '@angular/forms';

import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { MultilingualService } from '@setl/multilingual';
import { FileDownloader } from '@setl/utils';
import { MemberSocketService } from '@setl/websocket-service';

@Component({
    selector: 'kyc-information-audit-trail',
    templateUrl: './kyc-information-audit-trail.component.html',
    styleUrls: ['./kyc-information-audit-trail.component.scss'],
})
export class KycInformationAuditTrailComponent implements OnInit, OnDestroy, OnChanges {

    informationAuditItems = [];
    filteredInformationAuditItems = [];
    subsectionEnums;
    informationEnums;
    myDetails;
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
    @Input('kycID') kycID;
    @select(['ofi', 'ofiKyc', 'informationAuditTrail', 'data']) informationAuditTrail$;
    @select(['user', 'myDetail']) myDetail$;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private kycService: OfiKycService,
        private fb: FormBuilder,
        public translate: MultilingualService,
        private fileDownloader: FileDownloader,
        private memberSocketService: MemberSocketService,
    ) {

        this.searchForm = this.fb.group({
            search: [
                '',
            ],
            startDate: [
                '',
            ],
            endDate: [
                '',
            ],
        });

        this.searchForm.valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                this.filterInformationAuditItems(d);
            });
    }

    filterInformationAuditItems(filters) {
        this.filteredInformationAuditItems =
            this.filterByEndDate(
                filters.endDate,
                this.filterByStartDate(
                    filters.startDate,
                    this.filterBySearch(
                        filters.search,
                        this.informationAuditItems,
                    ),
                ),
            );
    }

    filterBySearch(filterValue, list) {
        if (!list.length || !filterValue) {
            return list;
        }
        return list.filter((item) => {
            return item.section.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
                || item.subsection.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
        });
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
            return Date.parse(filterValue) >= Date.parse(item.dateModified);
        });
    }

    ngOnInit() {

        if (this.kycID) {
            this.kycService.fetchInformationAuditByKycID(this.kycID);
        }

        this.informationAuditTrail$
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (!this.kycID || !Object.keys(d).length) {
                    return;
                }

                this.informationAuditItems = d[this.kycID].map(item => ({
                    section: item.section,
                    subsection: item.subsection,
                    modifiedField: item.modifiedField,
                    oldValue: item.oldValue,
                    newValue: item.newValue,
                    modifiedBy: item.modifiedBy,
                    dateModified: item.dateModified,
                }));
                this.filterInformationAuditItems(this.searchForm.value);
                this.changeDetectorRef.markForCheck();
            });

        this.myDetail$
            .takeUntil(this.unSubscribe)
            .subscribe((myDetails) => {
                this.myDetails = myDetails;
            });

        this.changeDetectorRef.markForCheck();
    }

    ngOnChanges(changes) {
        if (changes.kycID.currentValue !== changes.kycID.previousValue && changes.kycID.currentValue) {
            this.kycService.fetchInformationAuditByKycID(changes.kycID.currentValue);
        }
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();
    }

    exportCsv() {
        const config = {
            method: 'getKycInformationAudit',
            token: this.memberSocketService.token,
            userId: this.myDetails.userId,
            kycID: this.kycID,
            timezoneoffset: new Date().getTimezoneOffset(),
            search: this.searchForm.value.search,
            dateFrom: this.searchForm.value.startDate,
            dateTo: this.searchForm.value.endDate,
        };

        this.fileDownloader.downLoaderFile(config);
    }

}
