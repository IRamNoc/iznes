// Vendor
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {fromJS} from 'immutable';
import {SagaHelper} from '@setl/utils';
import {Subscription} from 'rxjs/Subscription';
import {select, NgRedux} from '@angular-redux/store';

/* Selectors */
import {getOfiUserIssuedAssets} from '@ofi/ofi-main/ofi-store';

/* Core redux imports. */
import {
    SET_ISSUE_HOLDING,
    setRequestedWalletIssuer,
    setRequestedWalletHolding,
} from '@setl/core-store';

/* Ofi corp service. */
import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';
import {OfiAmDashboardService} from '../../ofi-req-services/ofi-am-dashboard/service';
import {OfiNavService} from '../../ofi-req-services/ofi-product/nav/service';

/* Alert service. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';

import {WalletNodeRequestService, InitialisationService} from '@setl/core-req-services';

/* Utils. */
import {
    NumberConverterService,
} from '@setl/utils';


@Component({
    selector: 'core-am-dashboard',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MyDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
    /* Public properties. */
    public connectedWalletName: string = '';
    public fundShareForm: FormGroup;
    public showStats: boolean = false;
    public fundStats: any = {};

    /* Private properties. */
    private subscriptions: any = {};
    private connectedWalletId: any = 0;
    private myWallets: any = [];
    private walletDirectoryList: any = [];
    private walletHoldingsByAddress: any = {};
    private myDetails: any = {};
    private userAssetList: Array<any> = [];
    private filteredUserAssetList: Array<{ id: string, text: string }> = [];

    /* Redux observables. */
    @select(['wallet', 'myWalletHolding', 'requested']) walletHoldingRequestedStateOb;
    @select(['ofi', 'ofiCorpActions', 'ofiUserAssets', 'ofiUserAssetList']) userAssetListOb: any;
    @select(['wallet', 'myWallets', 'walletList']) myWalletsOb: any;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb: any;
    @select(['wallet', 'walletDirectory', 'walletList']) walletDirectoryListOb: any;
    @select(['wallet', 'myWalletHolding', 'holdingByAsset']) walletHoldingsOb: any;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private ofiCorpActionService: OfiCorpActionService,
                private ofiAmDashboardService: OfiAmDashboardService,
                private ofiNavService: OfiNavService,
                private walletNodeRequestService: WalletNodeRequestService,
                private _numberConverterService: NumberConverterService,) {
        /* Assign the fund share form. */
        this.fundShareForm = new FormGroup({
            'selectFund': new FormControl(0)
        })

        /* Subscribe to wallet holdings. */
        this.subscriptions['wallet-holdings'] = this.walletHoldingRequestedStateOb.subscribe((requested) => this.requestWalletHolding(requested));
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
            this.walletHoldingsByAddress = holdingsList;
        });

        /* Subscribe for this user's connected info. */
        this.subscriptions['my-connected'] = this.connectedWalletOb.subscribe((connectedWalletId) => {
            /* Assign list to a property. */
            this.connectedWalletId = connectedWalletId;

            /* Update wallet name. */
            this.updateWalletConnection();
        });

        /* Subscribe for the user issued asset list. */
        this.subscriptions['user-issued-assets'] = this.userAssetListOb.subscribe((list) => {
            /* Assign list to a property. */
            this.userAssetList = list;

            /* Also map the array for ui elements. */
            this.filteredUserAssetList = list.map(asset => {
                return {
                    id: asset.asset,
                    text: asset.asset
                }
            })
        });
    }

    public ngAfterViewInit() {
        /* State. */
        let state = this.ngRedux.getState();

        /* Check if we need to request the user issued assets. */
        let userIssuedAssetsList = getOfiUserIssuedAssets(state);
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
    }

    /**
     * Handle Fund Selection
     * ---------------------
     * Handles the selection of a fund, rendering it's information.
     *
     * @return {void}
     */
    public handleFundSelection(): void {
        console.log(' |---- Handle Fund Selection');
        /* Ok... get the selected form. */
        let
            fund: any = false,
            fundShareFormValue = this.fundShareForm.value;

        /* Fail safely if nothing was select. */
        console.log(' | fundShareFormValue:', fundShareFormValue);
        if (!fundShareFormValue.selectFund.length) return;

        /* Ok, so let's get the fund information. */
        fund = this.getFundById(fundShareFormValue.selectFund[0].id);
        console.log(' | fund:', fund);

        /* Fail if we didn't find it. */
        if (!fund) return;

        /* Let's fetch the wallet holdings. */
        InitialisationService.requestWalletHolding(this.ngRedux, this.walletNodeRequestService, fund.walletId);

        /* Pre-fill the fund information we have, and show the data... */
        this.showStats = true;
        this.fundStats.isin = fund.isin;
        this.fundStats.company = fund.companyName;
        console.log(' | fundStats:', this.fundStats);

        /* Now, let's request all the other information needed. */
        this.getFundDashboardData(fund).then((data) => {
            console.log(' | dashboardData:', data);
            /* Now let's set the extras we asked for... */
            this.fundStats.navPrice = data.nav.price;
            this.fundStats.navDate = data.nav.navDate;
            this.fundStats.units = data.units;
            this.fundStats.netAsset = (data.nav.price / 5) * data.units;

            /* Now let's set the holders in this fund. */
            this.fundStats.holders = data.holders;
            this.fundStats.graphData = data.graphData;
            this.fundStats.graphLabels = data.graphLabels;

            /* Detect changes. */
            this.changeDetectorRef.detectChanges();
        }).catch((error) => {
            console.log(' | dashboardData Error:', error)
        });


        /* Detect changes. */
        this.changeDetectorRef.detectChanges();

        /* Return. */
        return;
    }

    /**
     * Get Fund Dashboard Data
     * ------------------
     * Get's all fund information for the dashboard.
     *
     * @param  {object} fund  - the fund information.
     *
     * @return {Promise<any>}
     */
    public getFundDashboardData(fund: any): Promise<any> {
        /* Return a promise. */
        return new Promise((resolve, reject) => {
            /* Ok, let's build the request to get the NAV list... */
            let navRequest = {
                fundname: fund.asset,
                navdate: null,
                status: 0,
                pagenum: 0,
                pagesize: 1
            };
            console.log(' |--- Get Fund Dash Data');

            /* Return data. */
            let oReturn: any = {};

            /* ...and send it. */
            this.ofiAmDashboardService.buildRequest({
                'taskPipe': this.ofiNavService.requestNavList(navRequest)
            }).then((response) => {
                console.log(' | success: ', response);
                /* Success, let's set the NAV. */
                oReturn.nav = response[1].Data[0];
                delete oReturn.nav.Status;
                oReturn.nav.navDate = oReturn.nav.navDate.split(' ')[0];

                console.log(' | fund: ', fund.asset);
                /* Split asset name... */
                let assetParts = fund.asset.split('|');

                /* Request holders of this fund. */
                this.requestWalletIssueHolding(assetParts[0], assetParts[1], fund.walletId).then((response) => {
                    /* Get the list of holders. */
                    let
                        holdersList = response[1].data['holders'],
                        key, addresses = [];

                    /* Push all the keys (addresses) into an array */
                    for (key in holdersList) addresses.push(key);

                    /* Request all the wallet IDs of these addresses. */
                    this.ofiAmDashboardService.getWalletIdsByAddresses(addresses).then((response) => {
                        console.log(' | > getWalletIdsByAddresses response: ', response);
                        let walletIdList = response[1].Data;

                        /* Now let's map the holders to wallets. */
                        console.log(' | ~ map: ', this.walletDirectoryList, walletIdList);
                        let
                            key,
                            id,
                            i: number,
                            finalHoldersList = [],
                            numberOfUnits = 0;

                        /* For each wallet, loop the directory list and find it... */
                        i = 0;
                        for (key in walletIdList) {
                            for (id in this.walletDirectoryList) {
                                /* ...check if we've found it... */
                                if (this.walletDirectoryList[id].commuPub === walletIdList[key].commuPub) {
                                    /* ...if we have, push a nice object into the array. */
                                    finalHoldersList.push({
                                        'walletName': this.walletDirectoryList[id].walletName,
                                        'amount': (this._numberConverterService.toFrontEnd(oReturn.nav.price) * this._numberConverterService.toFrontEnd(holdersList[Object.keys(holdersList)[i]])),
                                        'quantity': this._numberConverterService.toFrontEnd(holdersList[Object.keys(holdersList)[i]]),
                                    });
                                    /* Add to total number of units. */
                                    numberOfUnits += holdersList[Object.keys(holdersList)[i]];
                                }
                            }

                            /* Inc the position, keeps us inline with the original holders list array. */
                            i++;
                        }

                        /* Set he number of holdings. */
                        oReturn['units'] = this._numberConverterService.toFrontEnd(numberOfUnits);
                        oReturn.nav.price = this._numberConverterService.toFrontEnd(oReturn.nav.price);

                        /* For each holder, let's figure out  */
                        let finalHolder: any;
                        for (finalHolder in finalHoldersList) {
                            finalHoldersList[finalHolder]['ratio'] = (100 / oReturn['units']) * finalHoldersList[finalHolder]['quantity'];
                        }

                        /* Assign them to the return. */
                        oReturn['holders'] = finalHoldersList;

                        /* Workout the graph data. */
                        oReturn['graphData'] = [];
                        oReturn['graphLabels'] = [];
                        let returnHolder: any;
                        for (returnHolder in oReturn['holders']) {
                            oReturn['graphData'].push(oReturn['holders'][returnHolder]['ratio']);
                            oReturn['graphLabels'].push(oReturn['holders'][returnHolder]['walletName']);
                        }


                        /* Resolve the original promise. */
                        resolve(oReturn);
                    }).catch((error) => {
                        console.log(' | > getWalletIdsByAddresses error: ', error);
                    })
                    console.log(" | holdersList: ", holdersList);


                }).catch((error) => {
                    console.log(" | error: ", error);
                });
            }).catch((error) => {
                /* Handle error. */
                console.warn(' | error: ', error);
                reject(false);
            })

            /* Return. */
            return;
        });
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
        let request: any = {};
        request['walletId'] = walletId == 0 ? this.connectedWalletId : walletId;
        request['issuer'] = issuer;
        request['instrument'] = instrument;

        /* Send the request and return the promise. */
        return this.ofiAmDashboardService.buildRequest({
            'taskPipe': this.walletNodeRequestService.requestWalletIssueHolding(request),
            'successActions': SET_ISSUE_HOLDING,
        });
    }

    requestWalletHolding(requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletHolding());
            console.log(InitialisationService.requestWalletHolding);

            InitialisationService.requestWalletHolding(this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    /**
     * Get Fund By Id
     * --------------
     * Get's a fund by Id.
     *
     * @param {number} id - the fund ID.
     *
     * @return {object} - the fund wanted.
     */
    private getFundById(id): any {
        /* Variables. */
        let userAsset;

        /* Loop over each fund... */
        for (userAsset of this.userAssetList) {
            /* ...if this is the one, breaking will leave userAsset as it... */
            if (userAsset.asset == id) break;

            /* ... if not, set to false in case there are no more. */
            userAsset = false;
        }

        /* Return whatever we found. */
        return userAsset;
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
        return num < 10 ? "0" + num : num;
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (var key in this.subscriptions) {
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
