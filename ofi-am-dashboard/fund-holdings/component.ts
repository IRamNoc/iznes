// Vendor
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {fromJS} from 'immutable';
import {Subscription} from 'rxjs/Subscription';
import {select, NgRedux} from '@angular-redux/store';

/* Selectors */
import {getOfiUserIssuedAssets} from '@ofi/ofi-main/ofi-store';

/* Ofi corp service. */
import {OfiCorpActionService} from '@ofi/ofi-main';

/* Alert service. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';

@Component({
    selector: 'core-am-dashboard',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FundHoldingsComponent implements OnInit, AfterViewInit, OnDestroy {
    /* Public properties. */
    public connectedWalletName: string = '';
    public fundShareForm:FormGroup;
    public showStats:boolean = false;
    public fundStats:any = {};

    /* Private properties. */
    private subscriptions: any = {};
    private connectedWalletId: any = 0;
    private myWallets: any = [];
    private myDetails: any = {};
    private userAssetList: Array<any> = [];
    private filteredUserAssetList: Array<{id: string, text:string}> = [];

    /* Redux observables. */
    @select(['ofi', 'ofiCorpActions', 'ofiUserAssets', 'ofiUserAssetList']) userAssetListOb:any;
    @select(['wallet', 'myWallets', 'walletList']) myWalletsOb: any;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb: any;

    constructor(
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private ofiCorpActionService:OfiCorpActionService,
    ) {
        /* Assign the fund share form. */
        this.fundShareForm = new FormGroup({
            'selectFund': new FormControl(0)
        })
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
        if ( ! userIssuedAssetsList.length ) {
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
    public handleFundSelection ():void {
        console.log(' |---- Handle Fund Selection');
        /* Ok... get the selected form. */
        let
            fund:any = false,
            fundShareFormValue = this.fundShareForm.value;

        /* Fail safely if nothing was select. */
        console.log(' | fundShareFormValue:', fundShareFormValue);
        if (!fundShareFormValue.selectFund.length) return;

        /* Ok, so let's get the fund information. */
        fund = this.getFundById(fundShareFormValue.selectFund[0].id);
        console.log(' | fund:', fund);

        /* Fail if we didn't find it. */
        if (!fund) return;

        /* Prefill the fund information we have, and show the data... */
        this.showStats = true;
        this.fundStats.isin = fund.isin;
        this.fundStats.company = fund.companyName;
        console.log(' | fundStats:', this.fundStats);

        var navRequest = {
            fundname: fund.asset,
            navdate: '',
            status: 0,
            pagenum: 0,
            pagesize: 1
        };
        console.log(' | navRequest:', navRequest);

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();

        /* Return. */
        return;
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
    private getFundById(id):any {
        /* Varibales. */
        let userAsset;

        /* Loop over each fund... */
        for (userAsset of this.userAssetList) {
            /* ...if this is the one, breaking will leave userAsset as it... */
            if (userAsset.asset == id) break;

            /* ... if not, set to false incase there are no more. */
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
