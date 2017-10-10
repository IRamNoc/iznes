/* Core/Angular imports. */
import {Component, AfterViewInit, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Unsubscribe} from 'redux';
import {FormGroup, FormControl, Validators} from '@angular/forms';

/* Services. */
import {WalletNodeRequestService, InitialisationService} from '@setl/core-req-services';

/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ConfirmationService} from '@setl/utils';

/* Utils. */
import {MoneyValueOfiPipe} from '@setl/utils/pipes';

/* Ofi Corp Actions request service. */
import {OfiManageOrdersService} from '../../ofi-req-services/ofi-manage-orders/service';

/* Core store stuff. */
import {
    getConnectedWallet,
    setRequestedWalletHolding,
    getWalletHoldingByAsset
} from '@setl/core-store';

/* Ofi Store stuff. */
import {
    getOfiOrderList
} from '../../ofi-store';

/* Decorator. */
@Component({
    styleUrls: ['./manage-orders.component.css'],
    templateUrl: './manage-orders.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

/* Class. */
export class ManageOrdersComponent implements OnInit, AfterViewInit, OnDestroy {

    /* Tabs Control array */
    public tabsControl: Array<any> = [];

    /* Private Properties. */
    private subscriptions: Array<any> = [];
    private reduxUnsubscribe:Unsubscribe;
    private ordersList: Array<any> = [];

    /* Observables. */
    @select(['ofi', 'ofiManageOrders', 'manageOrders', 'orderList']) ordersListOb:any;

    constructor (
        private ofiManageOrdersService: OfiManageOrdersService,
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private walletNodeRequestService: WalletNodeRequestService,
        private _confirmationService: ConfirmationService,
    ) {
        /* Default tabs. */
        this.tabsControl = this.defaultTabControl();
    }

    ngOnInit () {
        /* State. */
        let state = this.ngRedux.getState();

        /* Ok, let's check that we have the orders list, if not... */
        if ( ! getOfiOrderList(state).length ) {
            /* ...build a simple request and... */
            let request = {
                status: "-3",
                sortOrder: "ASC",
                sortBy: "dateEntered",
                partyType: 2,
                pageSize: 20,
                pageNum: 0,
                asset: "",
                arrangementType: 0
            }

            /* ...request it. */
            this.ofiManageOrdersService.getOrdersList(request)
            .then(response => true) // no need to do anything here.
            .catch((error) => {
                console.warn('failed to fetch orders list: ', error);
                this.showError('Failed to fetch the latest orders.');
            });
        }
    }

    ngAfterViewInit () {
        /* Do observable subscriptions here. */

        /* Orders list. */
        this.subscriptions['orders-list'] = this.ordersListOb.subscribe((orderList) => {
            console.log('orderlist: ', orderList);
            /* Subscribe and set the orders list. */
            this.ordersList = orderList;

            /* Detect Changes. */
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     * Handle View Order
     * -----------------
     * Handles viewing a order.
     *
     * @return {void}
     */
    public handleViewOrder (orderId: number):void {
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
    private formatDate (formatString:string, dateObj:Date) {
        /* Return if we're missing a param. */
        if ( ! formatString || ! dateObj ) return false;

        /* Return the formatted string. */
        return formatString
        .replace('YYYY', dateObj.getFullYear().toString())
        .replace('YY', dateObj.getFullYear().toString().slice(2, 3))
        .replace('MM', this.numPad( dateObj.getMonth().toString() ))
        .replace('DD', this.numPad( dateObj.getDate().toString() ))
        .replace('hh', this.numPad( dateObj.getHours() ))
        .replace('hH', this.numPad( dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours() ))
        .replace('mm', this.numPad( dateObj.getMinutes() ))
        .replace('ss', this.numPad( dateObj.getSeconds() ))
    }
    private numPad (num) {
        return num < 10 ? "0"+num : num;
    }

    /**
     * =============
     * Tab Functions
     * =============
     */

    /**
     * Default Tab Controls.
     * ---------------------
     * Returns a default tab control object.
     *
     * @return {array} - tabsControl object.
     */
    private defaultTabControl():Array<any> {
        return [
            {
                "title": {
                    "icon": "fa-search",
                    "text": "Search"
                },
                "orderId": -1,
                "active": true
            }
        ];
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
