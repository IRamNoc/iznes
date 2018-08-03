import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';

import {OfiReportsService} from '../../ofi-req-services/ofi-reports/service';
import {APP_CONFIG, AppConfig, FileDownloader} from "@setl/utils/index";
import {Router} from '@angular/router';
import {MultilingualService} from '@setl/multilingual';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CentralisationSelectComponent implements OnInit, OnDestroy {

    centralisationReportsList: Array<any> = [];

    private appConfig: any = {};
    private subscriptions: Array<any> = [];

    shareList = [];

    /* Observables. */
    @select(['ofi', 'ofiReports', 'centralisationHistoryReports', 'requested']) requestedOfiCentralisationReportsObj;
    @select(['ofi', 'ofiReports', 'centralisationHistoryReports', 'centralisationHistoryReportsList']) OfiCentralisationReportsListObj;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private ofiReportsService: OfiReportsService,
                private router: Router,
                public _translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {
        this.appConfig = appConfig;

        /* Subscribe for this user's details. */
        this.subscriptions.push(this.requestedOfiCentralisationReportsObj.subscribe((requested) => this.getCentralisationReportsRequested(requested)));
        this.subscriptions.push(this.OfiCentralisationReportsListObj.subscribe((list) => this.getCentralisationReportsListFromRedux(list)));
    }

    public ngOnInit() {
    }

    getCentralisationReportsRequested(requested): void {
        if (!requested) {
            OfiReportsService.defaultRequestCentralisationReportsList(this.ofiReportsService, this.ngRedux);
        }
    }

    getCentralisationReportsListFromRedux(list) {
        this.shareList = [];
        Object.keys(list).forEach((key) => {
            this.shareList.push({
                id: list[key].fundShareID,
                text: list[key].fundShareName + ' | ' + list[key].isin
            });
        });
        this.changeDetectorRef.markForCheck();
    }

    loadHistory(e){
        if ('id' in e) this.router.navigateByUrl('/am-reports-section/centralisation-history/' + e.id);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
