import {Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {SagaHelper, Common} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';
import _ from 'lodash';
import {fromJS} from "immutable";

import {
    getWalletHoldingByAsset,
    getConnectedWallet
} from '@setl/core-store';


@Component({
    selector: 'setl-balances',
    templateUrl: './balances.component.html',
    styleUrls: ['./balances.component.css']
})
export class SetlBalancesComponent implements OnInit, AfterViewInit {

    @ViewChild('myDataGrid') myDataGrid;

    public assets
    public singleAsset;
    public singleAssetHistory;

    public holdingByAsset;
    public currentWalletId;

    public tabsControl: any;

    constructor(private ngRedux: NgRedux<any>, private changeDetectorRef: ChangeDetectorRef) {

        ngRedux.subscribe(() => this.updateState());
        this.updateState();

        // this.singleAssetHistory = [
        //     {
        //         id: '1',
        //         txid: '037d8a00b9',
        //         asset: 'Payment_Bank1|EUR',
        //         amount: '987,654,321',
        //         time: '2017-04-18 10:24:16 UTC',
        //         type: 'Issue Asset'
        //     },
        //     {
        //         id: '2',
        //         txid: '16a91bd771',
        //         asset: 'Contract',
        //         amount: '987,654,321',
        //         time: '2017-04-18 10:24:16 UTC',
        //         type: 'Contract Commitment'
        //     },
        //     {
        //         id: '3',
        //         txid: '423336b76f',
        //         asset: 'Contract',
        //         amount: '987,654,321',
        //         time: '2017-04-18 10:24:16 UTC',
        //         type: 'Contract Commitment'
        //     }
        // ];

        /* Default tabs. */
        this.tabsControl = this.defaultTabControl();
    }

    /**
     * Current Redux State
     */
    updateState() {
        const newState = this.ngRedux.getState();

        const newWalletId = getConnectedWallet(newState);

        if (newWalletId !== this.currentWalletId) {
            this.tabsControl = this.defaultTabControl();
        }

        this.currentWalletId = newWalletId;
        this.holdingByAsset = getWalletHoldingByAsset(newState);

        this.assets = this.formatHolding();
        this.assets = this.convertToArray(this.assets);
    }

    /**
     * Default Tab Control Array
     *
     * @returns {[{title: string; asset: number; active: boolean}]}
     */
    defaultTabControl() {
        return [
            {
                'title': "<i class='fa fa-th-list'></i> Balances",
                'asset': -1,
                'active': true
            },
        ];
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.myDataGrid.resize();
    }

    formatHolding() {
        let walletId = this.currentWalletId;
        let holding = this.holdingByAsset;

        console.log(holding);
        console.log(walletId);

        let holdingForWallet = holding[walletId];

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
     * @param {index} number - The index of a wallet to be editted.
     *
     * @return {void}
     */
    public handleView(index): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i++) {
            if (this.tabsControl[i].asset === this.assets[index].asset) {
                /* Found the index for that tab, lets activate it... */
                this.setTabActive(i);

                /* And return. */
                return;
            }
        }

        /* Push the edit tab into the array. */
        let asset = this.assets[index];

        /* And also prefill the form... let's sort some of the data out. */
        this.tabsControl.push({
            "title": "<i class='fa fa-th-list'></i> " + this.assets[index].identifier,
            "asset": asset.asset,
            "assetObject": asset,
            "active": false // this.editFormControls
        });

        /* Activate the new tab. */
        this.setTabActive(this.tabsControl.length - 1);

        /* Return. */
        return;
    }

    /**
     * Convert To Array
     * ---------------
     * Converts an object that holds objects in keys into an array of those same
     * objects.
     *
     * @param {obj} object - the object to be converted.
     *
     * @return {void}
     */
    public convertToArray(obj): Array<any> {
        let i = 0, key, newArray = [];
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
     * @param {index} number - the tab inded to close.
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

        /* Return */
        return;
    }

    /**
     * Set Tab Active
     * --------------
     * Sets all tabs to inactive other than the given index, this means the
     * view is switched to the wanted tab.
     *
     * @param {index} number - the tab inded to close.
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

}

