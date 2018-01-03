import {Component, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import _ from 'lodash';
import {fromJS} from 'immutable';
import {Subscription} from 'rxjs/Subscription';
import {HoldingByAsset} from '@setl/core-store/wallet/my-wallet-holding';

import {
    setRequestedWalletHolding
} from '@setl/core-store';
import {InitialisationService, WalletNodeRequestService} from '@setl/core-req-services';

@Component({
    selector: 'setl-balances',
    templateUrl: './balances.component.html',
    styleUrls: ['./balances.component.css']
})
export class SetlBalancesComponent implements AfterViewInit, OnDestroy {

    // Observable subscription array.
    subscriptions: Array<Subscription> = [];

    // List of redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['wallet', 'myWalletHolding', 'requested']) walletHoldingRequestedStateOb;
    @select(['wallet', 'myWalletHolding']) walletHoldingByAssetOb;

    @ViewChild('myDataGrid') myDataGrid;

    public assets = [];
    public currentWalletId: number;
    public holdingByAsset: HoldingByAsset;

    public tabsControl: any;

    // Flag to mark if first load.
    firstLoad = true;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private walletNodeRequestService: WalletNodeRequestService) {

        this.currentWalletId = 0;

        /* Default tabs. */
        this.tabsControl = this.defaultTabControl();

        // List of observable subscriptions.
        this.subscriptions.push(
            this.connectedWalletOb
                .distinctUntilChanged()
                .subscribe((connected) => {
                        this.tabsControl = this.defaultTabControl();
                        this.currentWalletId = connected;
                        this.updateState();
                    }
                )
        );
        this.subscriptions.push(
            this.walletHoldingByAssetOb
                .filter(wallets => !_.isEmpty(wallets.holdingByAsset))
                .subscribe((wallets) => {
                        this.holdingByAsset = wallets.holdingByAsset;
                        this.updateState();
                    }
                )
        );
        this.subscriptions.push(
            this.walletHoldingRequestedStateOb.subscribe((requested) => this.requestWalletHolding(requested))
        );
    }

    /**
     * Current Redux State
     */
    updateState() {
        if (this.currentWalletId === 0 || _.isEmpty(this.holdingByAsset)) {
            return;
        }

        const formattedHoldingArr = this.convertToArray(this.formatHolding());
        this.assets = this.markUpdatedAssetBalanceData(formattedHoldingArr);
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Default Tab Control Array
     *
     * @returns {array} [{title: string; asset: number; active: boolean}]
     */
    defaultTabControl() {
        return [
            {
                title: '<i class="fa fa-th-list"></i> Balances',
                asset: -1,
                active: true
            },
        ];
    }

    ngAfterViewInit() {
        this.myDataGrid.resize();
    }

    requestWalletHolding(requestedState: boolean) {

        // If the state is false, that means we need to request the list.
        if (!requestedState && this.currentWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletHolding());

            InitialisationService.requestWalletHolding(this.ngRedux, this.walletNodeRequestService, this.currentWalletId);
        }
    }

    formatHolding() {
        const holdingForWallet = this.holdingByAsset[this.currentWalletId];

        if (_.isEmpty(holdingForWallet)) {
            return [];
        }

        const holdingListImu = fromJS(holdingForWallet);
        const holdingList = holdingListImu.map(
            (thisHolding, thisHoldingKey) => {
                const identifier = thisHoldingKey.split('|')[1];
                return {
                    asset: thisHoldingKey,
                    identifier: identifier,
                    total: thisHolding.get('total'),
                    encumbered: thisHolding.get('totalencumbered'),
                    free: thisHolding.get('total') - thisHolding.get('totalencumbered'),
                    breakdown: this.formatBreakdown(thisHolding.get('breakdown'))
                };
            }
        );

        return holdingList.toArray();
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
     * Handle View
     *
     * @param {number} index - The index of a wallet to be edited.
     *
     * @return {void}
     */
    public handleView(index: number): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i++) {
            if (this.tabsControl[i].asset === this.assets[index].asset) {
                /* Found the index for that tab, lets activate it... */
                this.setTabActive(i);
                return;
            }
        }

        /* Push the edit tab into the array. */
        const asset = this.assets[index];

        /* And also prefill the form... let's sort some of the data out. */
        this.tabsControl.push({
            title: '<i class="fa fa-th-list"></i> ' + this.assets[index].identifier,
            asset: asset.asset,
            assetObject: asset,
            active: false // this.editFormControls
        });

        /* Activate the new tab. */
        this.setTabActive(this.tabsControl.length - 1);
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

        /* Yes, we have to call this again to get it to work, trust me... */
        this.changeDetectorRef.detectChanges();
    }

    public markUpdatedAssetBalanceData(newAssetData) {
        const markUpdatedNewAssetData = newAssetData.slice();
        let i = 0;
        for (i; i < markUpdatedNewAssetData.length; i++) {
            const thisAsset = _.get(markUpdatedNewAssetData, [i], {});
            const thisAssetName = _.get(thisAsset, ['asset'], '');
            const currentAsset = this.assets.filter(asset => _.get(asset, 'asset', '') === thisAssetName);

            markUpdatedNewAssetData[i]['isNew'] = false;
            markUpdatedNewAssetData[i]['encumberChange'] = false;
            markUpdatedNewAssetData[i]['freeChange'] = false;
            markUpdatedNewAssetData[i]['totalChange'] = false;

            // If first load, not bother to mark them to true;
            if (this.firstLoad) {
                continue;
            }

            // If new asset mark as new.
            if (currentAsset.length === 0) {
                markUpdatedNewAssetData[i]['isNew'] = true;
            } else {
                if (thisAsset.free !== currentAsset[0].free) {
                    markUpdatedNewAssetData[i]['freeChange'] = true;
                }

                if (thisAsset.encumbered !== currentAsset[0].encumbered) {
                    markUpdatedNewAssetData[i]['encumberChange'] = true;
                }

                if (thisAsset.total !== currentAsset[0].total) {
                    markUpdatedNewAssetData[i]['totalChange'] = true;
                }
            }

        }

        if (markUpdatedNewAssetData.length > 0) {
            this.firstLoad = false;
        }

        return markUpdatedNewAssetData;
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}

