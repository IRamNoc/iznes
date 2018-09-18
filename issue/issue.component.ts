import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { WalletNodeRequestService } from '@setl/core-req-services';
import { ReportingService } from '../reporting.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TabControl, Tab } from '../tabs';
import { select } from '@angular-redux/store';
import { isEmpty } from 'lodash';

@Component({
    selector: 'setl-issue',
    templateUrl: './issue.component.html',
    styleUrls: ['./issue.component.css'],
})
export class SetlIssueComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('myDataGrid') myDataGrid;
    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['wallet', 'addressDirectory']) addressDirectory;

    private issuers$: Observable<any>;
    private tabControl: TabControl;
    private subscriptions: Subscription[] = [];
    public tabs: Tab[] = [];
    public connectedWalletId;
    /* Datagrid properties */
    public pageSize: number;
    public pageCurrent: number;
    private editTab: boolean = false;

    constructor(private walletNodeRequestService: WalletNodeRequestService,
                private changeDetector: ChangeDetectorRef,
                private reportingService: ReportingService) {

        this.subscriptions.push(this.getConnectedWallet.subscribe((connectedWalletId) => {
                this.connectedWalletId = connectedWalletId;
                this.closeTabs();
            },
        ));
    }

    ngOnInit() {
        this.issuers$ = this.reportingService.getIssuers();

        this.tabControl = new TabControl({
            title: 'Issue Reports',
            icon: 'money',
            active: true,
            data: {
                asset: -1,
            },
        });

        this.subscriptions.push(
            this.tabControl.getTabs().subscribe((tabs) => {
                this.tabs = tabs;
                this.changeDetector.markForCheck();
            }),
        );
    }

    ngAfterViewInit() {
        this.myDataGrid.resize();
    }

    public handleViewBreakdown(asset): void {
        this.editTab = true;
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
                    holdings,
                },
            });

            /* Subscribe to get holdings wallet details and then map the holding */
            this.subscriptions.push(this.addressDirectory.subscribe((addresses) => {
                if (!isEmpty(addresses)) {
                    this.tabControl.tabs[1].data.holdings =
                        this.reportingService.mapHolding(this.tabControl.tabs[1].data.holdings, addresses);
                    this.changeDetector.detectChanges();
                }
            }));
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
                tabIndex = tabIndex - 1;
            }
        }
    }

    /**
     * Sets Currently Viewed Page of Datagrid
     *
     * Note: When the datagrid is destroyed, the emitted value (1) is ignored when the View/Edit btn is clicked
     *
     * @param page - page number value emitted from datagrid
     */
    public

    setCurrentPage(page) {
        if (!this.editTab) this.pageCurrent = page;
        this.editTab = false;
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
