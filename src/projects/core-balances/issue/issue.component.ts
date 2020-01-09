import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ReportingService } from '../reporting.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TabControl, Tab } from '../tabs';
import { select } from '@angular-redux/store';
import { isEmpty } from 'lodash';
import { MultilingualService } from '@setl/multilingual';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { issueListFields, issueListActions, issueFilters, exportOptions,
    detailFieldsModel, detailFilters } from './issue.model';

@Component({
    selector: 'setl-issue',
    templateUrl: './issue.component.html',
    styleUrls: ['./issue.component.css'],
})
export class SetlIssueComponent implements OnInit, OnDestroy {
    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['wallet', 'addressDirectory']) addressDirectory;
    @select(['wallet', 'myWallets', 'walletList']) walletListOb;

    private issuers$: Observable<any>;
    private tabControl: TabControl;
    private subscriptions: Subscription[] = [];
    public tabs: Tab[] = [];
    public connectedWalletId;
    /* Datagrid properties */
    public issueListFields = issueListFields;
    public issueListActions = issueListActions;
    public issueFilters = issueFilters;
    public exportOptions: any = exportOptions;
    public detailFieldsModel = detailFieldsModel;
    public detailFilters = detailFilters;
    public pageCurrent: number = 1;
    private editTab: boolean = false;
    public exportFileHash: string = '';
    public exportModalDisplay: string = '';
    public viewingAddress: string = '';

    constructor(private changeDetector: ChangeDetectorRef,
                private reportingService: ReportingService,
                public translate: MultilingualService) {

        this.subscriptions.push(
            combineLatest(this.getConnectedWallet, this.walletListOb).subscribe(([connectedWalletId, walletList]) => {
                this.connectedWalletId = connectedWalletId;
                this.closeTabs();

                // Set walletname for PDF export
                this.exportOptions.pdfOptions.walletName = (walletList[connectedWalletId] || {}).walletName;
            },
        ));
    }

    ngOnInit() {
        this.issuers$ = this.reportingService.getIssuers();

        this.tabControl = new TabControl({
            title: this.translate.translate('Issue Reports'),
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

    /**
     * Handles clicks on datagrid action buttons
     * @param asset
     */
    onAction(action) {
        if (action.type === 'viewBreakdown') this.handleViewBreakdown(action.data);
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
    public setCurrentPage(page) {
        if (!this.editTab) this.pageCurrent = page;
        this.editTab = false;
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
