/* Core/Angular imports. */
import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { select, NgRedux } from '@angular-redux/store';
import { Unsubscribe } from 'redux';
import { FormGroup, FormControl, Validators } from '@angular/forms';

/* Services. */
import { WalletNodeRequestService, InitialisationService } from '@setl/core-req-services';

/* Alerts and confirms. */
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConfirmationService, immutableHelper, LogService } from '@setl/utils';

/* Utils. */
import { MoneyValuePipe } from '@setl/utils/pipes';

/* Ofi Corp Actions request service. */
import { OfiCorpActionService } from '../../ofi-req-services/ofi-corp-actions/service';

/* Core store stuff. */
import {
    getConnectedWallet,
    setRequestedWalletHolding,
    getWalletHoldingByAsset,
} from '@setl/core-store';

/* Ofi Store stuff. */
import {
    getOfiCouponList,
    getOfiUserIssuedAssets,
} from '../../ofi-store';

import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'lodash';
import { ofiCouponActions } from '@ofi/ofi-main/ofi-store';
import { MultilingualService } from '@setl/multilingual';

/* Decorator. */
@Component({
    templateUrl: './coupon-payment.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

/* Class. */
export class CouponPaymentComponent implements OnInit, AfterViewInit, OnDestroy {
    /* Select the coupon list. */
    @select(['ofi', 'ofiCorpActions', 'ofiCoupon', 'ofiCouponList'])
    couponListOb: any;
    public couponList: Array<any> = [];

    /* Select the user issued assets list. */
    @select(['ofi', 'ofiCorpActions', 'ofiUserAssets', 'ofiUserAssetList'])
    userAssetListOb: any;
    public userAssetList: Array<any> = [];
    public filteredUserAssetList: Array<{ id: string, text: string }> = [];

    /* Wallet holdings by address. */
    @select(['wallet', 'myWalletHolding', 'holdingByAddress'])
    walletHoldingsByAddressOb: any;
    public walletHoldingsByAddress: Array<any> = [];

    /* Select the user's details. */
    @select(['user', 'myDetail'])
    myDetailOb: any;
    public myDetails: any = {};

    /* Tabs Control array */
    public tabsControl: Array<any> = [];

    /* Private Properties. */
    private subscriptions: Array<any> = [];
    private reduxUnsubscribe: Unsubscribe;

    constructor(private ofiCorpActionService: OfiCorpActionService,
                private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private route: ActivatedRoute,
                private router: Router,
                private walletNodeRequestService: WalletNodeRequestService,
                private logService: LogService,
                public translate: MultilingualService,
                private confirmationService: ConfirmationService,) {
    }

    ngOnInit() {
        this.setInitialTabs();

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
            this.filteredUserAssetList = list.map((asset) => {
                return {
                    id: asset.asset,
                    text: asset.asset,
                };
            });
        });

        /* Subscribe for wallet holdings by address. */
        this.subscriptions['wallet-holdings-by-address'] = this.walletHoldingsByAddressOb.subscribe((holdingByAddress) => {
            this.logService.log('holdingByAddress: ', holdingByAddress);
            /* Assign list to a property. */
            this.walletHoldingsByAddress = holdingByAddress;
        });

        /* Subscribe for this user's details. */
        this.subscriptions['my-details'] = this.myDetailOb.subscribe((myDetails) => {
            /* Assign list to a property. */
            this.myDetails = myDetails;

            /* Update the create coupon form to hold my details. */
            this.clearNewCouponForm();
        });

        this.subscriptions['routeParam'] = this.route.params.subscribe((params: Params) => {
            const tabId = _.get(params, 'tabid', 0);
            this.setTabActive(tabId);
        });
    }

    setInitialTabs() {
        // Get opened tabs from redux store.
        const openedTabs = immutableHelper.get(this.ngRedux.getState(), ['ofi', 'ofiCorpActions', 'ofiCoupon', 'openedTabs']);

        if (_.isEmpty(openedTabs)) {
            /* Default tabs. */
            this.tabsControl = [
                {
                    title: {
                        icon: 'fa fa-th-list',
                        text: this.translate.translate('List'),
                    },
                    couponId: -1,
                    active: true,
                },
                {
                    title: {
                        icon: 'fa-user',
                        text: this.translate.translate('Create New Coupon'),
                    },
                    couponId: -1,
                    formControl: this.newCouponFormGroup(),
                    active: false,
                },
            ];
            return true;
        }

        this.tabsControl = openedTabs;
    }

    ngAfterViewInit() {
        /* State. */
        const state = this.ngRedux.getState();

        /* Check if we need to request the coupon list. */
        const couponList = getOfiCouponList(state);
        if (!couponList.length) {
            /* If the list is empty, request it. */
            this.ofiCorpActionService.getCouponList().then(() => {
                /* Redux subscription handles setting the property. */
                this.changeDetectorRef.detectChanges();
            }).catch((error) => {
                /* Handle error. */
                this.showError('Failed to get the coupon payment list.');
                console.warn('Failed to get the coupon payment list: ', error);
            });
        }

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
    }

    /**
     * Handle New Coupon
     * -----------------
     * Handles creating a new coupon.
     *
     * @return {void}
     */
    public handleNewCoupon(): void {
        /* Varibales. */
        const thisTab = this.tabsControl[1];
        const formData = thisTab.formControl.value;
        let setFundShare: any = false;
        const newCoupon = {};

        /* Let's check if the form is valid first... */
        if (!thisTab.formControl.valid || !formData.couponFundShareName.length) {
            /* ...tell the user if it isn't valid. */
            this.showError('Please ensure this form is complete.');

            /* Then return. */
            return;
        }

        /* Get other data. */
        setFundShare = this.getFundById(formData.couponFundShareName[0].id)

        /* Ok, let's now start building the new coupon request. */
        newCoupon['userCreated'] = this.myDetails.username;
        newCoupon['status'] = 1;

        /* Fund stuff. */
        newCoupon['fundIsin'] = setFundShare.isin;
        newCoupon['fund'] = setFundShare.asset;
        newCoupon['amount'] = Number(formData.couponAmountByShare);
        newCoupon['amountGross'] = Number(thisTab.couponGrossAmount);

        /* Comment. */
        newCoupon['accountId'] = this.myDetails.accountId;
        newCoupon['comment'] = formData.couponComments;

        /* Date validation. */
        if (new Date(formData.couponSettlementDate + ' ' + formData.couponSettlementTime) <= new Date()) {
            /* ...let the user know. */
            this.showError(this.translate.translate('Please ensure all dates are set to a point in the future.'));
            return;
        }

        if (new Date(formData.couponValuationDate + ' ' + formData.couponValuationTime) <= new Date()) {
            /* ...let the user know. */
            this.showError(this.translate.translate(
                'Please ensure all dates are set to a point in the future.'));
            return;
        }

        /* Dates. */
        newCoupon['dateLastUpdated'] = this.formatDate('YYYY-MM-DD hh:mm:ss', new Date());
        newCoupon['dateSettlement'] = this.formatDate(
            'YYYY-MM-DD hh:mm:ss',
            new Date(formData.couponSettlementDate + ' ' + formData.couponSettlementTime),
        );
        newCoupon['dateValuation'] = this.formatDate(
            'YYYY-MM-DD hh:mm:ss',
            new Date(formData.couponValuationDate + ' ' + formData.couponValuationTime),
        );

        /* Now send the request. */
        this.ofiCorpActionService.setNewCoupon(newCoupon).then((response) => {
            /* Ok, let's clear the form... */
            thisTab.formControl = this.newCouponFormGroup();

            /* ...and move the user back to the table... */
            this.router.navigateByUrl('/corporate-actions/coupon-payment/0');

            /* ...and then let the user know it went well. */
            this.showSuccess(this.translate.translate('Successfully created the new coupon payment.'));
        }).catch((error) => {
            /* Tell the user it went wrong. */
            this.showError(this.translate.translate('Failed to create a new coupon payment.'));
            console.warn(error);
        });

        return;
    }

    /**
     * Handle View Coupon
     * -----------------
     * Handles viewing a coupon.
     *
     * @return {void}
     */
    public handleViewCoupon(couponId: number): void {
        /* Let's firstly find the coupon in the list. */
        let coupon;
        let foundActive = false;
        for (coupon of this.couponList) {
            if (coupon.couponID == couponId) {
                /* Breaking here leaves coupon set
                   to the correct coupon object. */
                break;
            }
            coupon = false;
        }

        /* Check if we found the coupon. */
        if (!coupon) {
            this.showError(this.translate.translate('Could not show that coupon.'));
            return;
        }

        /* Now, let's check if we already have a tab open for this coupon. */
        this.tabsControl.map((tab, i) => {
            if (tab.couponId == coupon.couponID) {
                /* Set flag... */
                foundActive = true;

                /* ...set tab active... */
                this.router.navigateByUrl(`/corporate-actions/coupon-payment/${i}`);

                /* ...and gotta call this again. */
                this.changeDetectorRef.detectChanges();
            }
        });

        /* If we found an active tab, no need to do anymore... */
        if (foundActive) {
            return;
        }

        /* Workout some data before setting it. */
        const fixedValudation = this.formatDate('YYYY-MM-DD hh:mm:ss', new Date(coupon.dateValuation));
        const fixedSettlement = this.formatDate('YYYY-MM-DD hh:mm:ss', new Date(coupon.dateSettlement));
        let couponValuationDate = '';
        let couponValuationTime = '';
        let couponSettlementDate = '';
        let couponSettlementTime = '';

        /* If the dates are valid, set them. */
        if (fixedValudation) {
            couponValuationDate = fixedValudation.split(' ')[0]
            couponValuationTime = fixedValudation.split(' ')[1]
        }
        if (fixedSettlement) {
            couponSettlementDate = fixedSettlement.split(' ')[0]
            couponSettlementTime = fixedSettlement.split(' ')[1]
        }

        /* Push a new tab object into tabsControl. */
        this.tabsControl.push({
            title: {
                icon: 'fa-search',
                text: coupon.fund,
            },
            couponId: coupon.couponID,
            formControl: new FormGroup({
                couponNature: new FormControl({ value: 'Coupon Payment', disabled: true }),
                couponDrafter: new FormControl({ value: this.myDetails.username, disabled: true }),
                couponFundShareName: new FormControl({ value: [{ id: 0, text: coupon.fund }], disabled: true }),
                couponIsin: new FormControl({ value: coupon.fundIsin, disabled: true }),
                couponAmountByShare: new FormControl({ value: coupon.amount, disabled: true }),
                couponFundShareUnits: new FormControl({ value: (coupon.amountGross / coupon.amount), disabled: true }),
                couponGrossAmount: new FormControl({ value: coupon.amountGross, disabled: true }),
                couponValuationDate: new FormControl({ value: couponValuationDate, disabled: true }),
                couponValuationTime: new FormControl({ value: couponValuationTime, disabled: true }),
                couponSettlementDate: new FormControl({ value: couponSettlementDate, disabled: true }),
                couponSettlementTime: new FormControl({ value: couponSettlementTime, disabled: true }),
                couponComments: new FormControl({ value: coupon.comment, disabled: true }),
            }),
            couponStatus: coupon.status,
            active: false,
        });

        /* Now make this tab active. */
        this.router.navigateByUrl(`/corporate-actions/coupon-payment${this.tabsControl.length - 1}`);

        /* Gotta call this again... */
        this.changeDetectorRef.detectChanges();

        return;
    }

    /**
     * Handle Update Coupon
     * --------------------
     * Updates a coupon status.
     *
     * @param {number} tabid - the tab that the call came from.
     * @param {string} action - the action that was clicked.
     *
     * @return {void}
     */
    public handleUpdateCoupon(tabid: number, action: string) {
        /* Validation. */
        if (!tabid || !action) {
            this.showError(this.translate.translate('Something went wrong, please try again.'));
            return;
        }

        /* Pointers. */
        const thisTab = this.tabsControl[tabid];

        /* Let's start building the request. */
        const thisCoupon = this.getCouponById(thisTab.couponId);
        let successMessage = '';
        let errorMessage = '';
        const updateCoupon = {
            couponId: thisTab.couponId,
            accountId: this.myDetails.accountId,
            amount: thisCoupon.amount,
            amountGross: thisCoupon.amountGross,
            status: 0, // -1 is settled, 0 is canceled.
        };

        /* Let's update the status to the correct value. */
        switch (action) {
            case 'approve':
                updateCoupon.status = 2;
                successMessage = this.translate.translate('Successfully approved this coupon payment.');
                errorMessage = this.translate.translate('Failed to approve this coupon payment. Try again later.');
                break;

            case 'cancel':
                updateCoupon.status = 0;
                successMessage = this.translate.translate('Successfully cancelled this coupon payment.');
                errorMessage = this.translate.translate('Failed to cancel this coupon payment. Try again later.');
                break;

            case 'confirm-payment':
                updateCoupon.status = 6;
                successMessage = this.translate.translate('Successfully confirmed off platform payment for this coupon payment.');
                errorMessage = this.translate.translate('Failed to confirm off platform payment for this coupon payment. Try again later.');
                break;
        }

        /* Ok, let's send the request now. */
        this.ofiCorpActionService.updateCoupon(updateCoupon).then((response) => {
            /* Ok, so things went well, let's change the status on this tab to hide or show buttons... */
            thisTab.couponStatus = updateCoupon.status;

            /* ...and let the user know. */
            this.showSuccess(successMessage);
        }).catch((error) => {
            /* Tell the user that it wans't successfully complete. */
            this.showError(errorMessage);
        });

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
    public selectedFundShare(selected): void {
        /* Variables. */
        const userAsset = this.getFundById(selected.id);
        const newCouponControls = this.tabsControl[1].formControl;

        /* Check if we found it. */
        if (!userAsset) {
            /* Set other fields to empty. */
            newCouponControls.controls['couponIsin'].patchValue('');
        } else {
            /* Set other fields to their values. */
            newCouponControls.controls['couponIsin'].patchValue(userAsset.isin);
        }

        /* Now find the fund in the wallets list, then set it's value in the form. */
        var issuedUnit: number = 0;
        /* Try access the value and invert it. */
        this.getFundShareHoldings(userAsset).then((holdings) => {
            /* Get the issued amount, and invert it's polarity. */
            issuedUnit = -holdings[0];

            /* Set the value. */
            newCouponControls.controls['couponFundShareUnits'].patchValue(issuedUnit);

            /* Calc the gross amount. */
            this.calculateGrossAmount();
        }).catch((e) => {
            /* Set the value. */
            newCouponControls.controls['couponFundShareUnits'].patchValue(0);

            /* Calc the gross amount. */
            this.calculateGrossAmount();
        });

        /* Detect changes */
        this.changeDetectorRef.detectChanges();

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
    public getFundById(id): any {
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
     * Get Coupon By Id
     * ----------------
     * Gets a coupong by it's id.
     *
     * @param {number} id - the id of the coupon being requested.
     * @return {object|false} - the coupon object if it's found, else false.
     */
    private getCouponById(id: number): boolean | any {
        /* Variabes. */
        let coupon;

        /* Now, let's loop the coupon list... */
        for (coupon of this.couponList) {
            /* ...check if we've found the coupon... */
            if (coupon.couponID == id) {
                /* Breaking here leaves coupon set
                   to the correct coupon object. */
                break;
            }

            /* Reset the coupon, incase this is the end. */
            coupon = false;
        }

        return coupon;
    }

    /**
     * Calculate Gross Amount
     * ----------------------
     * Calculates the gross amount for a new coupon payment.
     *
     * @return {void}
     */
    public calculateGrossAmount(): void {
        /* Ok, so let's get the variables. */
        const newCouponControls = this.tabsControl[1].formControl;
        const amount = Number(newCouponControls.controls['couponAmountByShare']._value);
        const price = Number(newCouponControls.controls['couponFundShareUnits']._value);

        /* Now let's check that the user has entered something usable. */
        if (amount && amount >= 0 && !isNaN(amount)) {
            /* Patch the value. */
            newCouponControls.controls['couponGrossAmount'].patchValue(amount * price);
            this.tabsControl[1]['couponGrossAmount'] = amount * price;
        } else {
            newCouponControls.controls['couponGrossAmount'].patchValue(0);
            this.tabsControl[1]['couponGrossAmount'] = 0;
        }
    }

    /**
     * Clear New Coupon Form
     * ---------------------
     * Clears the new coupon form.
     *
     * @return {void}
     */
    public clearNewCouponForm(): void {
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
    public formatCouponDate(dateString) {
        /* Validation. */
        if (!dateString) return '';

        /* Variables. */
        const date = new Date(dateString);
        let returnString = '';

        /* Build the date. */
        returnString += date.getFullYear() + '-' + this.padNumberLeft(date.getMonth()) + '-' + this.padNumberLeft(date.getDate()) + ' ';

        /* Build the time. */
        returnString += this.padNumberLeft(date.getHours()) + ':' + this.padNumberLeft(date.getMinutes()) + ':' + this.padNumberLeft(date.getSeconds());

        return returnString;
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

    private numPad(num) {
        return num < 10 ? '0' + num : num;
    }

    /**
     * Get Fund Share Holdings
     * -----------------------
     * Get's a fund share holding or if not requested, it requests it.
     *
     * @param {object} userIssuedAsset - the user issued asset, contains the relivant info for the share.
     *
     * @return {void}
     */
    getFundShareHoldings(userIssuedAsset): Promise<any> {
        return new Promise((resolve, reject) => {
            /* If we don't have a walletID... */
            if (!userIssuedAsset.walletID) {
                /* ...then giveup. */
                reject();
                return;
            }

            /* Ok, let's check if we have it. */
            if (!this.walletHoldingsByAddress[userIssuedAsset.walletID]) {
                /* If we don't, let's get it. */
                InitialisationService.requestWalletHolding(this.ngRedux, this.walletNodeRequestService, userIssuedAsset.walletID);
            }

            /* Now let's wait for it, and resolve with it. */
            let timesToTry = 10;
            const waitInterval = setInterval(
                () => {
                    if (this.walletHoldingsByAddress[userIssuedAsset.walletID] &&
                        this.walletHoldingsByAddress[userIssuedAsset.walletID][userIssuedAsset.addr] &&
                        this.walletHoldingsByAddress[userIssuedAsset.walletID][userIssuedAsset.addr][userIssuedAsset.asset]) {
                        /* Clear the interval. */
                        clearInterval(waitInterval);
                        /* Resolve. */
                        resolve(this.walletHoldingsByAddress[userIssuedAsset.walletID][userIssuedAsset.addr][userIssuedAsset.asset]);
                    } else if (!timesToTry) {
                        /* If we've tried too many times, we probably don't have access... so clear the interval. */
                        clearInterval(waitInterval);

                        /* then reject. */
                        reject();
                    } else {
                        /* Decrement if we're still looping. */
                        timesToTry--;
                    }
                },
                100,
            );
        });
    }

    /**
     * Pad Number Left
     * -------------
     * Pads a number left
     *
     * @param  {number} num - the couponId.
     * @return {string}
     */
    public padNumberLeft(num: number | string, zeros?: number): string {
        /* Validation. */
        if (!num && num != 0) return '';
        zeros = zeros || 2;

        /* Variables. */
        num = num.toString();
        // 11 is the total required string length.
        let requiredZeros = zeros - num.length;
        let returnString = '';

        /* Now add the zeros. */
        while (requiredZeros--) {
            returnString += '0';
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
    private newCouponFormGroup(): FormGroup {
        return new FormGroup({
            couponNature: new FormControl(
                { value: 'Coupon Payment', disabled: true },
            ),
            couponDrafter: new FormControl(
                { value: this.myDetails.username, disabled: true },
            ),
            couponFundShareName: new FormControl(
                [],
                Validators.required,
            ),
            couponIsin: new FormControl(
                { value: '', disabled: true },
            ),
            couponAmountByShare: new FormControl(
                '',
                Validators.required,
            ),
            couponFundShareUnits: new FormControl(
                { value: '', disabled: true },
            ),
            couponGrossAmount: new FormControl(
                { value: '', disabled: true }, 
            ),
            couponValuationDate: new FormControl(
                '',
                Validators.required,
            ),
            couponValuationTime: new FormControl(
                '',
                [Validators.required],
            ),
            couponSettlementDate: new FormControl(
                '',
                Validators.required,
            ),
            couponSettlementTime: new FormControl(
                '',
                Validators.required,
            ),
            couponComments: new FormControl(
                '',
            ),
        });
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
        this.router.navigateByUrl('/corporate-actions/coupon-payment/0');

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
        this.tabsControl = immutableHelper.map(this.tabsControl, (item, thisIndex) => {
            return item.set('active', thisIndex === Number(index));
        });
        this.changeDetectorRef.markForCheck();
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
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }

        this.ngRedux.dispatch(ofiCouponActions.setAllTabs(this.tabsControl));
    }

}
