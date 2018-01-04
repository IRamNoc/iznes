import {Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {SagaHelper, Common} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import _ from 'lodash';
import {fromJS} from 'immutable';
import {Subscription} from 'rxjs/Subscription';
import {WalletNodeRequestService, InitialisationService} from '@setl/core-req-services';
import {WalletIssuerDetail, IssuerList} from '@setl/core-store/assets/my-issuers';

import {
    setRequestedWalletIssuer,
    SET_WALLET_ISSUER_LIST,
    SET_ISSUE_HOLDING,
    setRequestedWalletHolding
} from '@setl/core-store';

@Component({
    selector: 'setl-issue',
    templateUrl: './issue.component.html',
    styleUrls: ['./issue.component.css']
})
export class SetlIssueComponent implements OnInit, AfterViewInit {
    // Observable subscription array.
    subscriptionsArry: Array<Subscription> = [];

    // List of redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['wallet', 'myWalletHolding', 'requested']) walletHoldingRequestedStateOb;
    @select(['wallet', 'myWalletHolding']) walletHoldingByAssetOb;
    @select(['asset', 'myIssuers', 'requestedWalletIssuer']) requestedWalletIssuerOb;
    @select(['asset', 'myIssuers', 'walletIssuerDetail']) walletIssuerDetailsOb;
    @select(['asset', 'myIssuers', 'issuerList']) issuerListOb;

    @ViewChild('myDataGrid') myDataGrid;

    public issuers;
    public tabsControl: any;

    public issuerList: IssuerList;
    public currentWalletId: number;

    public currentTabIndex;
    public currentAsset;
    private myIssuers: Object;
    private walletIssuerDetails: WalletIssuerDetail;

    constructor(private ngRedux: NgRedux<any>,
                private walletNodeRequestService: WalletNodeRequestService,
                private changeDetectorRef: ChangeDetectorRef) {

        this.issuerList = {};
        this.currentWalletId = 0;

        /* Default tabs. */
        this.tabsControl = this.defaultTabControl();

        // List of observable subscriptions.
        this.subscriptionsArry.push(
            this.connectedWalletOb
                .distinctUntilChanged()
                .subscribe(connected => {
                        this.tabsControl = this.defaultTabControl();
                        this.currentWalletId = connected;
                        this.updateState();
                    }
                )
        );
        this.subscriptionsArry.push(
            this.walletHoldingRequestedStateOb.subscribe((requested) => this.requestWalletHolding(requested))
        );
        this.subscriptionsArry.push(
            this.walletHoldingByAssetOb
                .filter(holding => !_.isEmpty(holding.holdingByAsset))
                .subscribe((holding) => {
                    this.issuerList = holding.holdingByAsset;
                    this.updateState();
                })
        );
        this.subscriptionsArry.push(
            this.requestedWalletIssuerOb
                .filter(requested => !requested && this.currentWalletId !== 0)
                .subscribe(() => {
                    this.requestWalletIssuer();
                })
        );
        this.subscriptionsArry.push(
            this.walletIssuerDetailsOb
                .subscribe((details) => {
                    this.walletIssuerDetails = details;
                })
        );
        this.subscriptionsArry.push(
            this.issuerListOb.subscribe(() => this.updateState())
        );
    }

    /**
     * Current Redux State
     */
    updateState() {

        if (_.isEmpty(this.issuerList) || !this.walletIssuerDetails || !this.walletIssuerDetails.walletIssuer) {
            return;
        }

        this.issuers = this.convertToArray(this.formatIssuers(this.walletIssuerDetails));

        if (this.currentTabIndex > 0) {
            const index = this.currentTabIndex;
            const holders = this.issuerList[this.currentWalletId][this.currentAsset].holders;
            this.tabsControl[index].assetObject = this.formatHolders(holders);
        }

        this.changeDetectorRef.markForCheck();
    }

    /**
     * When the state is false we need to retrieve from the walletNode. Once requested, toggle the state.
     *
     * @param {boolean} requestedState
     */
    requestWalletHolding(requestedState: boolean) {

        if (!requestedState) {
            this.ngRedux.dispatch(setRequestedWalletHolding());
            InitialisationService.requestWalletHolding(this.ngRedux, this.walletNodeRequestService, this.currentWalletId);
        }
    }

    requestWalletIssuer() {
        const walletId = this.currentWalletId;

        // Set request wallet issuers flag to true, to indicate that we have already requested wallet issuer.
        this.ngRedux.dispatch(setRequestedWalletIssuer());

        // Create a saga pipe.
        const asyncTaskPipe = this.walletNodeRequestService.walletIssuerRequest({
            walletId
        });

        // Send a saga action.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_ISSUER_LIST],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    requestWalletIssueHolding(issuer, instrument) {
        const walletId = this.currentWalletId;

        // Set request wallet issuers flag to true, to indicate that we have already requested wallet issuer.
        this.ngRedux.dispatch(setRequestedWalletIssuer());

        // Create a saga pipe.
        const asyncTaskPipe = this.walletNodeRequestService.requestWalletIssueHolding({
            walletId,
            issuer,
            instrument,
        });

        // Send a saga action.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_ISSUE_HOLDING],
            [],
            asyncTaskPipe,
            {}
        ));

        this.currentAsset = issuer + '|' + instrument;
    }

    /**
     * Default Tab Control Array
     *
     * @returns {array} [{title: string; asset: number; active: boolean}]
     */
    defaultTabControl() {
        return [
            {
                title: '<i class="fa fa-money"></i> Issue Reports',
                asset: -1,
                active: true
            },
        ];
    }


    formatHolders(holders) {
        if (_.isEmpty(holders)) {
            return [];
        }

        const holdingListImu = fromJS(holders);
        const holdingList = holdingListImu.map(
            (thisHolding, thisHoldingKey) => {
                return {
                    address: thisHoldingKey,
                    total: thisHolding
                };
            }
        );

        return holdingList.toArray();
    }

    formatIssuers(issuerDetails: WalletIssuerDetail) {
        const issuers = this.issuerList[this.currentWalletId];

        if (_.isEmpty(issuers)) {
            return [];
        }

        const listImu = fromJS(issuers);
        return listImu.reduce(
            (data, item, key) => {
                if (key) {
                    const identifier = key.split('|')[0];
                    if (issuerDetails.walletIssuer === identifier) {
                        const breakdown = this.formatBreakdown(item.get('breakdown'));
                        data.push({
                            asset: key,
                            total: -breakdown[0].free,
                            encumbered: item.get('totalencumbered'),
                            free: item.get('total') - item.get('totalencumbered'),
                        });
                    }
                }
                return data;
            },
            []
        );
    }

    formatBreakdown(breakDown) {
        const breakDownImu = fromJS(breakDown);
        const breakDownList = breakDownImu.map(
            (thisBreakdown, thisBreakdownKey) => {
                return {
                    address: thisBreakdownKey,
                    total: thisBreakdown.get(0),
                    encumbered: thisBreakdown.get(1),
                    free: thisBreakdown.get(0) - thisBreakdown.get(1),
                };
            }
        );
        return breakDownList.toArray();
    }

    /**
     * Convert To Array
     * ---------------
     * Converts an object that holds objects in keys into an array of those same
     * objects.
     *
     * @param {object} obj - the object to be converted.
     *
     * @return {void}
     */
    public convertToArray(obj): Array<any> {
        let i = 0, key;
        const newArray = [];
        for (key in obj) {
            newArray.push(obj[key]);
            newArray[newArray.length - 1].index = i++;
        }
        return newArray;
    }

    ngAfterViewInit() {
        this.myDataGrid.resize();
    }

    /**
     * Handle View
     * -----------
     * Handles the editing of a wallet.
     *
     * @param {number} index - The index of a wallet to be edited.
     *
     * @return {void}
     */
    public handleView(index: number): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i++) {
            if (this.tabsControl[i].asset === this.issuers[index].asset) {
                /* Found the index for that tab, lets activate it... */
                this.setTabActive(i);
                /* And return. */
                return;
            }
        }

        /* Push the edit tab into the array. */
        const issuers = this.issuers[index];

        if (!issuers.asset) {
            return;
        }

        const asset = issuers.asset.split('|');

        const issuer = asset[0];
        const intruement = asset[1];

        this.requestWalletIssueHolding(issuer, intruement);

        /* And also prefill the form... let's sort some of the data out. */
        this.tabsControl.push({
            title: '<i class="fa fa-th-list"></i>' + this.issuers[index].asset,
            asset: issuers.asset,
            assetObject: [],
            active: false // this.editFormControls
        });

        /* Activate the new tab. */
        this.setTabActive(this.tabsControl.length - 1);

        this.currentTabIndex = this.tabsControl.length - 1;
    }

    /**
     * Close Tab
     * ---------
     * Removes a tab from the tabs control array, in effect, closing it.
     *
     * @param {number} index - the tab inded to close.
     *
     * @return {void}
     */
    public closeTab(index) {
        /* Validate that we have index. */
        if (!index && index !== 0) {
            return;
        }

        /* Remove the object from the tabsControl. */
        this.tabsControl = [
            ...this.tabsControl.slice(0, index),
            ...this.tabsControl.slice(index + 1, this.tabsControl.length)
        ];

        /* Reset tabs. */
        this.setTabActive(0);
    }

    /**
     * Set Tab Active
     * --------------
     * Sets all tabs to inactive other than the given index, this means the
     * view is switched to the wanted tab.
     *
     * @param {number} index - the tab inded to close.
     *
     * @return {void}
     */
    public setTabActive(index: number = 0) {
        /* Lets loop over all current tabs and switch them to not active. */
        this.tabsControl.map((i) => {
            i.active = false;
        });

        /* Override the changes. */
        this.changeDetectorRef.detectChanges();

        /* Set the list active. */
        this.tabsControl[index].active = true;

        /* Override the changes. */
        this.changeDetectorRef.detectChanges();
    }
}
