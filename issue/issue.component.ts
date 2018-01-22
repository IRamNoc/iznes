import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { WalletNodeRequestService } from '@setl/core-req-services';
import { ReportingService } from '../reporting.service';
import { Observable } from 'rxjs/Observable';
import { TabControl, Tab } from '../tabs';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'setl-issue',
    templateUrl: './issue.component.html',
    styleUrls: ['./issue.component.css']
})
export class SetlIssueComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('myDataGrid') myDataGrid;

    private issuers$: Observable<any>;
    private tabControl: TabControl;
    private subscriptions: Array<Subscription> = [];
    public tabs: Tab[] = [];

    constructor(private walletNodeRequestService: WalletNodeRequestService,
                private changeDetector: ChangeDetectorRef,
                private reportingService: ReportingService) { }

    ngOnInit() {
        this.issuers$ = this.reportingService.getIssuers();

        this.tabControl =  new TabControl({
            title: 'Issue Reports',
            icon: 'money',
            active: true,
            data: {
                asset: -1
            }
        });

        this.subscriptions.push(
            this.tabControl.getTabs().subscribe((tabs) => {
                this.tabs = tabs;
                this.changeDetector.markForCheck();
            })
        );
    }

    ngAfterViewInit() {
        this.myDataGrid.resize();
    }

    public handleViewBreakdown(asset): void {
        if (this.tabControl.activate(tab => tab.data.asset === asset.asset)) {
            return;
        }

        this.reportingService.getHoldings(asset.asset).then((holdings) => {
            this.tabControl.new({
                title: asset.asset,
                icon: 'th-list',
                active: false,
                data: {
                    asset: asset.asset,
                    assetObject: asset,
                    hash: asset.hash,
                    holdings: holdings,
                }
            });
        });
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
