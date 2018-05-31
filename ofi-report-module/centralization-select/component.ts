import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import 'rxjs/add/operator/takeUntil';
import {OfiReportsService} from '../../ofi-req-services/ofi-reports/service';
import {APP_CONFIG, AppConfig, FileDownloader} from "@setl/utils/index";
import {Router} from '@angular/router';
import {MultilingualService} from '@setl/multilingual';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CentralizationSelectComponent implements OnInit, OnDestroy {

    centralizationReportsList: Array<any> = [];

    private appConfig: any = {};
    private subscriptions: Array<any> = [];

    shareList = [];

    /* Observables. */
    @select(['ofi', 'ofiReports', 'centralizationReports', 'requested']) requestedOfiCentralizationReportsObj;
    @select(['ofi', 'ofiReports', 'centralizationReports', 'centralizationReportsList']) OfiCentralizationReportsListObj;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private ofiReportsService: OfiReportsService,
                private router: Router,
                private _translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {
        this.appConfig = appConfig;

        /* Subscribe for this user's details. */
        this.subscriptions.push(this.requestedOfiCentralizationReportsObj.subscribe((requested) => this.getCentralizationReportsRequested(requested)));
        this.subscriptions.push(this.OfiCentralizationReportsListObj.subscribe((list) => this.getCentralizationReportsListFromRedux(list)));
    }

    public ngOnInit() {
    }

    getCentralizationReportsRequested(requested): void {
        if (!requested) {
            OfiReportsService.defaultRequestCentralizationReportsList(this.ofiReportsService, this.ngRedux);
        }
    }

    getCentralizationReportsListFromRedux(list) {
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
        if ('id' in e) this.router.navigateByUrl('/am-reports-section/centralization-history/' + e.id);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
