import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { WalletNodeRequestService } from '@setl/core-req-services';
import { ReportingService } from '../reporting.service';
import { Observable ,  Subscription } from 'rxjs';
import { TabControl, Tab } from '../tabs';
import { select } from '@angular-redux/store';

@Component({
    selector: 'setl-issue',
    templateUrl: './issue.component.html',
    styleUrls: ['./issue.component.css']
})
export class SetlIssueComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('myDataGrid') myDataGrid;
    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;

    private issuers$: Observable<any>;
    private tabControl: TabControl;
    private subscriptions: Array<Subscription> = [];
    public tabs: Tab[] = [];
    public connectedWalletId;

    constructor(private walletNodeRequestService: WalletNodeRequestService,
                private changeDetector: ChangeDetectorRef,
                private reportingService: ReportingService) {

            this.subscriptions.push(this.getConnectedWallet.subscribe((connectedWalletId) => {
                this.connectedWalletId = connectedWalletId;
                this.closeTabs();
            }
        ));
    }

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

    /**
     * Close tabs.
     *
     * @return void
     */
    closeTabs() {
        if (this.tabControl) {
            let tabIndex = this.tabControl.tabs.length;

            while (tabIndex) {
                this.tabControl.close(tabIndex);
                this.changeDetector.markForCheck();
                tabIndex--;
            }
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
