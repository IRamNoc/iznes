/* Core/Angular imports. */
import {Component, AfterViewInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {FormGroup, FormControl, Validators} from '@angular/forms';

/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ConfirmationService} from '@setl/utils';

/* Ofi Corp Actions request service. */
import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';

/* Ofi Store stuff. */
import {getOfiCouponList} from '../../ofi-store';

/* Decorator. */
@Component({
    styleUrls: ['./coupon-payment.component.css'],
    templateUrl: './coupon-payment.component.html',
})

/* Class. */
export class CouponPaymentComponent implements AfterViewInit, OnDestroy {

    /* Select the coupon list. */
    @select(['ofi', 'ofiCorpActions', 'ofiCouponList', 'couponList'])
    couponListOb:any;
    private couponsList: Array<any> = [];

    /* Private Properties. */
    private tabsControl: Array<any> = [];
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
            console.log(list);
            this.couponsList = list;
        });
    }

    ngAfterViewInit () {
        /* State. */
        let state = this.ngRedux.getState();

        /* Check if we need to request the coupon list. */
        let couponList = getOfiCouponList(state);
        console.log('Coupon list: ', couponList);

        this.ofiCorpActionService.getCouponList().then((response) => {
            console.log('got coupon list: ', response);
        }).catch((error) => {
            console.log('failed to get coupon list: ', error);
        })
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
            'couponName': new FormControl(''),
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
