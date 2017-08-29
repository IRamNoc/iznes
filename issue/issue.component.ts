import {Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';


@Component({
    selector: 'setl-issue',
    templateUrl: './issue.component.html',
    styleUrls: ['./issue.component.css']
})
export class SetlIssueComponent implements OnInit, AfterViewInit {

    @ViewChild('myDataGrid') myDataGrid;

    public assets
    public singleAsset;
    public singleAssetHistory;

    public tabsControl: any;

    constructor(private changeDetectorRef: ChangeDetectorRef) {

        this.assets = [
            {
                id: '1',
                identifier: 'FR0001',
                asset: 'LEI0001|OFI RS Dynamique C D',
                total: '987,654,321',
                encumbered: '321',
                free: '987,654,000'
            },
            {
                id: '2',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '3',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
        ];

        this.singleAsset = [
            {
                id: '1',
                address: 'd332bad22159a6ea1122f032b57cfd92',
                total: '987,654,321',
                encumbered: '321',
                free: '987,654,000'
            },
            {
                id: '2',
                address: '2219a822bf8087aa5e82788ec2a87cc5',
                total: '100',
                encumbered: '1',
                free: '99'
            },
        ];

        this.singleAssetHistory = [
            {
                id: '1',
                txid: '037d8a00b9',
                asset: 'Payment_Bank1|EUR',
                amount: '987,654,321',
                time: '2017-04-18 10:24:16 UTC',
                type: 'Issue Asset'
            },
            {
                id: '2',
                txid: '16a91bd771',
                asset: 'Contract',
                amount: '987,654,321',
                time: '2017-04-18 10:24:16 UTC',
                type: 'Contract Commitment'
            },
            {
                id: '3',
                txid: '423336b76f',
                asset: 'Contract',
                amount: '987,654,321',
                time: '2017-04-18 10:24:16 UTC',
                type: 'Contract Commitment'
            }
        ];


        /* Default tabs. */
        this.tabsControl = [
            {
                "title": "<i class='fa fa-money'></i> Issue Reports",
                "active": true
            },
        ];
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.myDataGrid.resize();
    }

    /**
     * Handle View
     * -----------
     * Handles the editting of a wallet.
     *
     * @param {editWalletIndex} number - The index of a wallet to be editted.
     *
     * @return {void}
     */
    public handleView(viewIssueIndex): void {

        /* Push the edit tab into the array. */
        this.tabsControl.push({
            "title": "<i class='fa fa-user'></i> " + viewIssueIndex,
            "active": false // this.editFormControls
        });

        console.log(this.tabsControl[this.tabsControl.length - 1]);

        /* Activate the new tab. */
        this.setTabActive(this.tabsControl.length - 1);

        /* Return. */
        return;
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
        //this.changeDetectorRef.detectChanges();

        /* Set the list active. */
        this.tabsControl[index].active = true;

        /* Override the changes. */
        //this.changeDetectorRef.detectChanges();
    }

}

