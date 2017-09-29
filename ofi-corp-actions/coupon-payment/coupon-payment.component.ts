/* Core/Angular imports. */
import {Component, AfterViewInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {FormGroup, FormControl, Validators} from '@angular/forms';

/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ConfirmationService} from '@setl/utils';

/* Utils. */
import {MoneyValueOfiPipe} from '@setl/utils/pipes';

/* Ofi Corp Actions request service. */
import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';

/* Ofi Store stuff. */
import {
    getOfiCouponList,
    getOfiUserIssuedAssets
} from '../../ofi-store';

/* Decorator. */
@Component({
    styleUrls: ['./coupon-payment.component.css'],
    templateUrl: './coupon-payment.component.html',
})

/* Class. */
export class CouponPaymentComponent implements AfterViewInit, OnDestroy {

    /* Select the coupon list. */
    @select(['ofi', 'ofiCorpActions', 'ofiCoupon', 'ofiCouponList'])
    couponListOb:any;
    public couponList: Array<any> = [];

    /* Select the user issued assets list. */
    @select(['ofi', 'ofiCorpActions', 'ofiUserAssets', 'ofiUserAssetList'])
    userAssetListOb:any;
    public userAssetList: Array<any> = [];
    public filteredUserAssetList: Array<{id: string, text:string}> = [];

    /* Select the user's details. */
    @select(['user', 'myDetail'])
    myDetailOb:any;
    public myDetails: any = {};

    /* Tabs Control array */
    public tabsControl: Array<any> = [];

    /* Private Properties. */
    private subscriptions: Array<any> = [];

    constructor (
        private ofiCorpActionService: OfiCorpActionService,
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private _confirmationService: ConfirmationService,
    ) {
        /* Default tabs. */
        this.tabsControl = [
            {
                "title": {
                    "icon": "fa-search",
                    "text": "Search"
                },
                "couponId": -1,
                "active": true
            },
            {
                "title": {
                    "icon": "fa-user",
                    "text": "Create New Coupon"
                },
                "couponId": -1,
                "formControl": this.newCouponFormGroup(),
                "active": false
            }
        ];

        /* Subscribe for the coupon payments list. */
        this.subscriptions['coupon-payments'] = this.couponListOb.subscribe((list) => {
            /* Assign list to a property. */
            this.couponList = list;
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

        /* Subscribe for this user's details. */
        this.subscriptions['my-details'] = this.myDetailOb.subscribe((myDetails) => {
            /* Assign list to a property. */
            this.myDetails = myDetails;

            /* Update the create coupon form to hold my details. */
            this.clearNewCouponForm();
        });
    }

    ngAfterViewInit () {
        /* State. */
        let state = this.ngRedux.getState();

        /* Check if we need to request the coupon list. */
        let couponList = getOfiCouponList(state);
        if ( ! couponList.length ) {
            /* If the list is empty, request it. */
            this.ofiCorpActionService.getCouponList().then(() => {
                /* Redux subscription handles setting the property. */
            }).catch((error) => {
                /* Handle error. */
                this.showError('Failed to get the coupon payment list.');
                console.warn('Failed to get the coupon payment list: ', error);
            });
        }

        /* Check if we need to request the user issued assets. */
        let userIssuedAssetsList = getOfiUserIssuedAssets(state);
        if ( ! userIssuedAssetsList.length ) {
            /* If the list is empty, request it. */
            this.ofiCorpActionService.getUserIssuedAssets().then(() => {
                /* Redux subscription handles setting the property. */
            }).catch((error) => {
                /* Handle error. */
                this.showError('Failed to get your issued assets.');
                console.warn('Failed to get your issued assets: ', error);
            });
        }
    }

    /**
     * Handle New Coupon
     * -----------------
     * Handles creating a new coupon.
     *
     * @return {void}
     */
    public handleNewCoupon ():void {

    }

    /**
     * Handle View Coupon
     * -----------------
     * Handles viewing a coupon.
     *
     * @return {void}
     */
    public handleViewCoupon (couponId: number):void {
        /* Let's firstly find the coupon in the list. */
        let coupon;
        for (coupon of this.couponList) {
            if (coupon.couponID == couponId) {
                /* Breaking here leaves coupon set
                   to the correct coupon object. */
                break;
            }
            coupon = false;
        }

        /* Check if we found the coupon. */
        if ( ! coupon ) {
            this.showError('Could not show that coupon.');
            return;
        }

        console.log(' | coupon: ', coupon);



        /* Return. */
        return;
    }

    /**
     * Selected Fund Share
     * -------------------
     * Handles updating the new coupon form to reflect a newly selected fund share.
     *
     * @param {object} selected - an array of the selected fund.
     * @return {void}
     */
    public selectedFundShare (selected): void {
        /* Variables. */
        let userAsset, newCouponControls = this.tabsControl[1].formControl;

        /* Fund the userAsset selected by it's fund name. */
        for (userAsset of this.userAssetList) {
            if (userAsset.asset == selected.id) break;
            userAsset = false;
        }

        console.log('Selected a user asset: ', userAsset);
        /* Check if we found it. */
        if (! userAsset) {
            /* Set other fields to empty. */
            newCouponControls.controls['couponIsin'].patchValue('');
        } else {
            /* Set other fields to their values. */
            newCouponControls.controls['couponIsin'].patchValue(userAsset.isin);
        }

        /* Detect changes */
        this.changeDetectorRef.detectChanges();

        /* Return */
        return;
    }

    /**
     * Clear New Coupon Form
     * ---------------------
     * Clears the new coupon form.
     *
     * @return {void}
     */
    public clearNewCouponForm (): void {
        /* Set the form control to a new form group. */
        this.tabsControl[1].formControl = this.newCouponFormGroup();
    }

    /**
     * Format Coupon Date
     * -------------
     * Formats a coupon date.
     *
     * @param  {string} dateString  - the date in a string.
     * @return {string}
     */
    public formatCouponDate (dateString) {
        /* Validation. */
        if ( ! dateString ) return "";

        /* Variables. */
        let
        date = new Date(dateString),
        returnString = "";

        /* Build the date. */
        returnString += date.getFullYear() +"-"+ this.padNumberLeft( date.getMonth() ) +"-"+ this.padNumberLeft( date.getDate() ) +" ";

        /* Build the time. */
        returnString += this.padNumberLeft( date.getHours() ) +":"+ this.padNumberLeft( date.getMinutes() ) +":"+ this.padNumberLeft( date.getSeconds() );

        return returnString;
    }

    /**
     * Pad Number Left
     * -------------
     * Pads a number left
     *
     * @param  {number} num - the couponId.
     * @return {string}
     */
    public padNumberLeft (num: number|string, zeros?: number):string {
        /* Validation. */
        if ( ! num && num != 0) return "";
        zeros = zeros || 2;

        /* Variables. */
        num = num.toString();
        let // 11 is the total required string length.
        requiredZeros = zeros - num.length,
        returnString = "";

        /* Now add the zeros. */
        while (requiredZeros--) {
            returnString += "0";
        }

        return returnString + num;
    }

    /**
     * New Coupon FormGroup
     * --------------------
     * Builds and returns a new coupon FormGroup.
     *
     * @return {FormGroup}
     */
    private newCouponFormGroup ():FormGroup {
        return new FormGroup({
            'couponNature': new FormControl({value: 'Coupon Payment', disabled: true}),
            'couponDrafter': new FormControl({value: this.myDetails.username, disabled: true}),

            'couponFundShareName': new FormControl([]),
            'couponIsin': new FormControl({value: '', disabled: true}),

            'couponAmountByShare': new FormControl(''),
            'couponFundShareUnits': new FormControl({value: '', disabled: true}),
            'couponGrossAmount': new FormControl({value: '', disabled: true}),

            'couponValuationDate': new FormControl(''),
            'couponValuationTime': new FormControl(''),
            'couponSettlementDate': new FormControl(''),
            'couponSettlementTime': new FormControl(''),

            'couponComments': new FormControl(''),
        });
    }

    /**
     * =============
     * Tab Functions
     * =============
     */

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

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (var key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }

}
