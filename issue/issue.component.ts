import {Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {SagaHelper, Common} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import _ from 'lodash';
import {fromJS} from 'immutable';
import {Subscription} from 'rxjs/Subscription';
import {WalletNodeRequestService, InitialisationService} from '@setl/core-req-services';

import {
    getWalletHoldingByAsset,
    getConnectedWallet,
    getWalletIssuerDetail,
    getRequestedIssuerState,
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
    public singleAsset;
    public singleAssetHistory;

    public tabsControl: any;

    public issuerList: Object;
    public currentWalletId: Number;

    public currentTabIndex;
    public currentAsset;
    private walletIssuerDetails: Object;

    constructor(private ngRedux: NgRedux<any>,
                private walletNodeRequestService: WalletNodeRequestService,
                private changeDetectorRef: ChangeDetectorRef) {

        this.issuerList = {};
        this.currentWalletId = 0;

        /*
         function requestIssuedAssetBalance(issuer, instrument, callBack, userData, walletID) {
         var deferred = $.Deferred();

         if (document.SetlWalletNodeSocket) { // Websocket

         var messageID = document.SetlWalletNodeSocketCallback.getUniqueID();

         document.SetlWalletNodeSocketCallback.addHandler(messageID,
         function (ID, message, UserData) {
         deferred.resolve(message.data);
         if (message.status == "OK") {
         var issuedAssetBalance = message.data;
         callBack(userData, issuedAssetBalance);
         } else {
         showWarning(
         getTranslation('txt_getissuerfail', 'Get Issuer Fail'),
         message.data.status
         );
         }
         }, {});

         var Request =
         {
         messageType: 'request',
         messageHeader: '',
         requestID: messageID,
         messageBody: {
         topic: 'holders',
         walletid: walletID || parseInt(document.dataCache.inUseWallet),
         // address : '',
         namespace: issuer,
         classid: instrument
         }
         };

         document.SetlWalletNodeSocket.sendRequest(Request);

         }
         else {
         showError('Socket Error', 1001);
         }

         return deferred.promise();
         }
         */

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
        this.subscriptionsArry.push(this.walletHoldingRequestedStateOb.subscribe((requested) => this.requestWalletHolding(requested)));
        this.subscriptionsArry.push(
            this.requestedWalletIssuerOb
                .filter(requested => !requested && this.currentWalletId !== 0)
                .subscribe(() => {
                    console.log('request');
                    this.requestWalletIssuer();
                })
        );
        this.subscriptionsArry.push(
            this.walletIssuerDetailsOb
                .subscribe((details) => {
                    console.log('walletIssuerDetails', details);
                    this.walletIssuerDetails = details;
                })
        );
        this.subscriptionsArry.push(
            this.issuerListOb.subscribe((list) => {
                console.log('set list', list);
                this.issuerList = list;
                this.updateState();
            })
        );
    }

    /**
     * Current Redux State
     */
    updateState() {
        //const newState = this.ngRedux.getState();
        //const newWalletId = getConnectedWallet(newState);

        // If my issuer list is not yet requested,
        // Request wallet issuers
        //const requestedIssuerState = getRequestedIssuerState(newState);

        //if (!requestedIssuerState) {
            //this.requestWalletIssuer();
        //}

        /*
        const walletIssuerDetails = getWalletIssuerDetail(newState);

        this.issuerList = getWalletHoldingByAsset(newState);
        */

        if (_.isEmpty(this.issuerList)) {
            console.log("Bail out");
            return;
        }

        console.log('walletIssuerDetails', this.walletIssuerDetails);

        this.issuers = this.formatIssuers(this.walletIssuerDetails);
        this.issuers = this.convertToArray(this.issuers);

        console.log('issuers', this.issuers);

        if (this.currentTabIndex > 0) {
            const index = this.currentTabIndex;
            const holders = this.issuerList[this.currentWalletId][this.currentAsset].holders;
            this.tabsControl[index].assetObject = this.formatHolders(holders);
        }
    }

    requestWalletHolding(requestedState: boolean) {

        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletHolding());
            console.log(InitialisationService.requestWalletHolding);

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

        console.log('caling ngRedux dispatch');

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
     * @returns {[{title: string; asset: number; active: boolean}]}
     */
    defaultTabControl() {
        return [
            {
                "title": "<i class='fa fa-money'></i> Issue Reports",
                "asset": -1,
                "active": true
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


    formatIssuers(issuerDetails) {
        let issuers = this.issuerList;
        const walletId = this.currentWalletId;
        issuers = issuers[walletId];

        if (_.isEmpty(issuers)) {
            console.log('bail empty arr');
            return [];
        }

        const myIssuer = issuerDetails.walletIssuer;
        const listImu = fromJS(issuers);
        console.log('issuers', issuers);
        const list = listImu.reduce(
            (data, item, key) => {
                if (key) {
                    const identifier = key.split('|')[0];
                    if (myIssuer == identifier) {
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
        console.log('list--- ', list);
        return list;
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
    public handleView(index): void {
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

        let asset = issuers.asset.split('|');

        let issuer = asset[0];
        let intruement = asset[1];

        console.log('----- issuers');
        console.log(issuers);

        this.requestWalletIssueHolding(issuer, intruement);

        /* And also prefill the form... let's sort some of the data out. */
        this.tabsControl.push({
            "title": "<i class='fa fa-th-list'></i> " + this.issuers[index].asset,
            "asset": issuers.asset,
            "assetObject": [],
            "active": false // this.editFormControls
        });

        /* Activate the new tab. */
        this.setTabActive(this.tabsControl.length - 1);

        this.currentTabIndex = this.tabsControl.length - 1;

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
        this.changeDetectorRef.detectChanges();

        /* Set the list active. */
        this.tabsControl[index].active = true;

        /* Override the changes. */
        this.changeDetectorRef.detectChanges();
    }

}

