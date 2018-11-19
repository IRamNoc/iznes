// Vendor
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { fromJS } from 'immutable';
import { Subscription } from 'rxjs';
import { select, NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';

/* Selectors */
import { getOfiUserIssuedAssets } from '@ofi/ofi-main/ofi-store';

/* Core redux imports. */
import {
    SET_ISSUE_HOLDING,
    setRequestedWalletIssuer,
    setRequestedWalletHolding,
    setRequestedWalletAddresses,
} from '@setl/core-store';

/* Ofi corp service. */
import { OfiCorpActionService } from '../../ofi-req-services/ofi-corp-actions/service';
import { OfiAmDashboardService } from '../../ofi-req-services/ofi-am-dashboard/service';
import { OfiNavService } from '../../ofi-req-services/ofi-product/nav/service';

/* Alert service. */
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { WalletNodeRequestService, MyWalletsService, InitialisationService } from '@setl/core-req-services';

/* Utils. */
import {
    NumberConverterService,
    immutableHelper,
    commonHelper,
    LogService,
} from '@setl/utils';
import * as math from 'mathjs';

@Component({
    selector: 'core-am-dashboard',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MyDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
    /* Public properties. */
    public connectedWalletName: string = '';
    public fundShareForm: FormGroup;
    public showStats: boolean = false;
    public fundStats: any = {};
    public requestedWalletAddress: boolean;
    public addressList: Array<any>;
    public addressSelected: any;

    /* Private properties. */
    private subscriptions: any = {};
    private connectedWalletId: any = 0;
    private myWallets: any = [];
    private walletDirectoryList: any = [];
    private walletHoldingsByAsset: any = {};
    private myDetails: any = {};
    private fundAssetList: any = [];
    private filteredFundAssetList: any = [];

    /* Redux observables. */
    @select(['wallet', 'myWalletHolding', 'requested']) walletHoldingRequestedStateOb;
    @select(['wallet', 'myWallets', 'walletList']) myWalletsOb: any;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['wallet', 'walletDirectory', 'walletList']) walletDirectoryListOb: any;
    @select(['wallet', 'myWalletHolding', 'holdingByAsset']) walletHoldingsOb: any;

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb: any;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private ofiCorpActionService: OfiCorpActionService,
                private ofiAmDashboardService: OfiAmDashboardService,
                private walletNodeRequestService: WalletNodeRequestService,
                private numberConverterService: NumberConverterService,
                private logService: LogService,
                private myWalletService: MyWalletsService) {
        /* Assign the fund share form. */
        this.fundShareForm = new FormGroup({
            selectFund: new FormControl(0),
        });

        /* Subscribe to wallet holdings. */
        this.subscriptions['wallet-holdings'] = this.walletHoldingRequestedStateOb.subscribe(requested => this.requestWalletHolding(requested));
    }

    public ngOnInit() {
        /* Subscribe for this user's details. */
        this.subscriptions['my-details'] = this.myDetailOb.subscribe((myDetails) => {
            /* Assign list to a property. */
            this.myDetails = myDetails;
        });

        /* Subscribe for this user's wallets. */
        this.subscriptions['my-wallets'] = this.myWalletsOb.subscribe((walletsList) => {
            /* Assign list to a property. */
            this.myWallets = walletsList;

            /* Update wallet name. */
            this.updateWalletConnection();
        });

        /* Subscribe for wallet dir list. */
        this.subscriptions['wallet-dir-list'] = this.walletDirectoryListOb.subscribe((walletsList) => {
            /* Assign list to a property. */
            this.walletDirectoryList = walletsList;
        });

        /* Subscribe for wallet holdings by address. */
        this.subscriptions['wallet-holdings-by-address'] = this.walletHoldingsOb.subscribe((holdingsList) => {
            /* Assign list to a property. */
            this.walletHoldingsByAsset = holdingsList;
        });

        /* Subscribe for this user's connected info. */
        this.subscriptions['my-connected'] = this.connectedWalletOb.subscribe((connectedWalletId) => {
            /* Assign list to a property. */
            this.connectedWalletId = connectedWalletId;

            /* Update wallet name. */
            this.updateWalletConnection();
        });

        /* TODO - Store this data in redux and subscribe for it. */
        this.ofiAmDashboardService.getFundManagerAssets().then((response) => {
            /* Ok, let's save and filter the list. */
            this.logService.log(' |--- getFundManagerAssets: ', response);
            const fundAssetList = response[1].Data;
            const sortedByCompany = {};

            /* Check it's there.... */
            if (fundAssetList) {
                this.logService.log(' | fundAssetList: ', fundAssetList);
                /* Let's sort the data by company name. */
                for (const asset of fundAssetList) {
                    /* Check the company has a object. */
                    if (!sortedByCompany[asset.companyName]) sortedByCompany[asset.companyName] = {};

                    /* Build the new structure. */
                    sortedByCompany[asset.companyName][asset.asset] = {
                        price: asset.price,
                        navDate: asset.navDate,
                        companyId: asset.managementCompanyID,
                        companyName: asset.companyName,
                    };
                }

                this.fundAssetList = sortedByCompany;

                /* Default the array with the any selection. */
                this.filteredFundAssetList = [{
                    id: '0',
                    text: 'All',
                }];

                /* Now let's also push a UI object into the filtered list for each company. */
                for (const company in sortedByCompany) {
                    /* If the company name isn't null and it has assets... */
                    if (company !== 'null' && Object.keys(sortedByCompany[company]).length > 0) {
                        /* ...push into the filtered list. */
                        this.filteredFundAssetList.push({
                            id: sortedByCompany[company][Object.keys(sortedByCompany[company])[0]].companyId,
                            text: company,
                        });
                    }
                }

                this.logService.log(' | sortedByCompany: ', sortedByCompany);
            }
        }).catch((error) => {
            /* Handle error */
            this.logService.log('failed to getFundManagerAssets: ', error);
        });

        this.subscriptions['requested-address-list'] = this.requestedAddressListOb.subscribe((requested) => {
            this.requestAddressList(requested);
        });

        this.subscriptions['address-list'] = this.addressListOb.subscribe(addressList => this.updateAddressList(addressList));

        this.subscriptions['requested-label-list'] = this.requestedLabelListOb.subscribe(requested => this.requestWalletLabel(requested));
    }

    public ngAfterViewInit() {
        /* State. */
        const state = this.ngRedux.getState();

        /* Check if we need to request the user issued assets. */
        const userIssuedAssetsList = getOfiUserIssuedAssets(state);
        if (!userIssuedAssetsList.length) {
            /* If the list is empty, request it. */
            this.ofiCorpActionService.getUserIssuedAssets().then(() => {
                /* Redux subscription handles setting the property. */
                this.changeDetectorRef.detectChanges();
            }).catch((error) => {
                /* Handle error. */
                this.showError('Failed to get your issued assets.');
                console.warn('Failed to get your issued assets: ', error);
            });
        }

        this.requestWalletHolding(false);
    }

    requestWalletLabel(requestedState) {
        this.logService.log('checking requested', this.requestedWalletAddress);
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {

            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
        }
    }

    updateAddressList(addressList) {
        this.logService.log(' | UPDATED ADDRESSES: ', addressList);
        this.addressList = addressList;

        // Update the lable in fundStat in there is any.
        this.fundStats = this.fillAddressLabel(this.fundStats, addressList);
    }

    requestAddressList(requestedState) {
        this.requestedWalletAddress = requestedState;
        this.logService.log('requested wallet address', this.requestedWalletAddress);

        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            // Request the list.
            InitialisationService.requestWalletAddresses(this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    /**
     * Handle Fund Selection
     * ---------------------
     * Handles the selection of a fund, rendering it's information.
     *
     * @return {void}
     */
    public handleCompanySelection(): void {
        this.logService.log(' |---- Handle Fund Selection');
        /* Ok... get the selected form. */
        const fundShareFormValue = this.fundShareForm.value;

        /* Fail safely if nothing was select. */
        if (!fundShareFormValue.selectFund.length) return;
        this.logService.log(' | fundShareFormValue:', fundShareFormValue);

        /* Ok, let's get shares under this company. */
        this.logService.log(' | id: ', fundShareFormValue.selectFund[0].text);
        const
            assets: any = this.getAssetsByCompanyName(fundShareFormValue.selectFund[0].text);

        /* Now let's sort the assets. */
        this.fundStats.assets = [];
        let
            totalHoldings = 0;
        for (const asset in assets) {
            /* Continue if we don't have the holdings for this wallet. */
            if (!this.walletHoldingsByAsset[this.connectedWalletId]) {
                continue;
            }
            /*  Get holdings. */
            const holdings = this.walletHoldingsByAsset[this.connectedWalletId][asset];
            this.logService.log(' | holdings: ', holdings);
            this.logService.log(' | asset: ', assets[asset]);

            if (holdings) {
                this.logService.log(' | holdings.breakdown: ', holdings.breakdown);
                this.logService.log(' | this.addressList: ', this.addressList);
                for (const address of Object.keys(holdings.breakdown)) {
                    const thisAddressBalance = holdings.breakdown[address][0];

                    this.fundStats.assets.push({
                        asset,
                        address,
                        walletName: '',
                        assetManager: assets[asset].companyName,
                        estimatedAmount: math.round((this.numberConverterService.toFrontEnd(thisAddressBalance) * this.numberConverterService.toFrontEnd(assets[asset].price)), 2),
                        quantity: this.numberConverterService.toFrontEnd(thisAddressBalance),
                        ratio: 0, // Get's set just below (total needs to be calculated first).
                    });

                    totalHoldings += this.numberConverterService.toFrontEnd(thisAddressBalance);
                }
            }
        }

        // Generate data for chat.
        this.fundStats = this.parseToChatData(this.fundStats, totalHoldings);

        // Fill address label, if we have the data.
        this.fundStats = this.fillAddressLabel(this.fundStats, this.addressList);

        /* Show the stats. */
        this.showStats = true;

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();
        /* Return. */
        return;
    }

    /**
     * Parse fundStats data, so we can use it to paint the chat.
     * @param fundStats
     * @param totalHoldings
     * @return {any}
     */
    parseToChatData(fundStats, totalHoldings) {
        const newFundStats = immutableHelper.copy(fundStats);

        /* Now let's use the total to work out the ratio,
		 and whilst we're at it, build the data arrays for the graph. */
        newFundStats.graphData = [];
        newFundStats.graphLabels = [];
        let row = 0;
        for (row; row < newFundStats.assets.length; row++) {
            newFundStats.assets[row].ratio = Math.floor(((newFundStats.assets[row].quantity / totalHoldings) * 100) * 100) / 100;
            newFundStats.graphLabels.push(newFundStats.assets[row].address);
            newFundStats.graphData.push(newFundStats.assets[row].ratio);
        }

        return newFundStats;
    }

    fillAddressLabel(fundStats, addressList) {
        const newFundStats = immutableHelper.copy(fundStats);

        if (newFundStats.graphLabels) {
            const graphLabels = immutableHelper.map(newFundStats.graphLabels, (item) => {
                return _.get(addressList, [item, 'label'], item);
            });

            newFundStats.graphLabels = graphLabels;
        }

        if (newFundStats.assets) {
            const assets = immutableHelper.map(newFundStats.assets, (item) => {
                const address = item.get('address', '');
                const label = _.get(addressList, [address, 'label'], address);
                return item.set('walletName', label);
            });

            newFundStats.assets = assets;
        }

        return newFundStats;
    }

    /**
     * Get Company name
     * @param {string} name
     */
    getAssetsByCompanyName(name: string): any {
        /* Variables. */
        const load = {};

        /* If no name. */
        if (!name) return load;

        /* Check if all. */
        if (name === 'All') {
            for (const cname in this.fundAssetList) {
                if (cname === 'null') continue;
                for (const asset in this.fundAssetList[cname]) {
                    load[asset] = this.fundAssetList[cname][asset];
                }
            }
        }
        /* ...else individual. */
        else {
            for (const cname in this.fundAssetList) {
                if (cname === 'null') continue;
                if (cname === name) {
                    for (const asset in this.fundAssetList[cname]) {
                        load[asset] = this.fundAssetList[cname][asset];
                    }
                }
            }
        }

        /* Load. */
        return load;
    }

    /**
     * Request Wallet Issue Holding
     * ----------------------------
     *
     * @param issuer
     * @param instrument
     */
    private requestWalletIssueHolding(issuer, instrument, walletId = 0) {
        /* Ok, let's build a nice request object. */
        const request: any = {};
        request['walletId'] = walletId == 0 ? this.connectedWalletId : walletId;
        request['issuer'] = issuer;
        request['instrument'] = instrument;

        /* Send the request and return the promise. */
        return this.ofiAmDashboardService.buildRequest({
            taskPipe: this.walletNodeRequestService.requestWalletIssueHolding(request),
            successActions: SET_ISSUE_HOLDING,
        });
    }

    requestWalletHolding(requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletHolding());
            this.logService.log('this.connectedWalletId', this.connectedWalletId);
            InitialisationService.requestWalletHolding(this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    /**
     * Update Wallet Connection
     * ------------------------
     * Updates the view depending on what wallet we're using.
     *
     * @return {void}
     */
    private updateWalletConnection(): void {
        /* Loop over my wallets, and find the one we're connected to. */
        let wallet;
        if (this.connectedWalletId && Object.keys(this.myWallets).length) {
            for (wallet in this.myWallets) {
                if (wallet == this.connectedWalletId) {
                    this.connectedWalletName = this.myWallets[wallet].walletName;
                    break;
                }
            }
        }

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();

        /* Return. */
        return;
    }

    /**
     * Format Date
     * -----------
     * Formats a date to a string.
     * YYYY - 4 character year
     * YY - 2 character year
     * MM - 2 character month
     * DD - 2 character date
     * hh - 2 character hour (24 hour)
     * hH - 2 character hour (12 hour)
     * mm - 2 character minute
     * ss - 2 character seconds
     * @param  {string} formatString [description]
     * @param  {Date}   dateObj      [description]
     * @return {[type]}              [description]
     */
    private formatDate(formatString: string, dateObj: Date) {
        /* Return if we're missing a param. */
        if (!formatString || !dateObj) return false;

        /* Return the formatted string. */
        return formatString
            .replace('YYYY', dateObj.getFullYear().toString())
            .replace('YY', dateObj.getFullYear().toString().slice(2, 3))
            .replace('MM', this.numPad((dateObj.getMonth() + 1).toString()))
            .replace('DD', this.numPad(dateObj.getDate().toString()))
            .replace('hh', this.numPad(dateObj.getHours()))
            .replace('hH', this.numPad(dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours()))
            .replace('mm', this.numPad(dateObj.getMinutes()))
            .replace('ss', this.numPad(dateObj.getSeconds()))
    }

    /**
     * Num Pad
     *
     * @param num
     * @returns {string}
     */
    private numPad(num) {
        return num < 10 ? '0' + num : num;
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }

    /**
     * ===============
     * Alert Functions
     * ===============
     */

    /**
     * Show Error Message
     * ------------------
     * Shows an error popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    private showError(message) {
        /* Show the error. */
        this.alertsService.create('error', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-danger">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    /**
     * Show Warning Message
     * ------------------
     * Shows a warning popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    private showWarning(message) {
        /* Show the error. */
        this.alertsService.create('warning', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-warning">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    /**
     * Show Success Message
     * ------------------
     * Shows an success popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    showSuccess(message) {
        /* Show the message. */
        this.alertsService.create('success', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-success">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }
}
