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

/* Types. */
interface SelectedItem {
    id: number|string;
    text: number|string;
}

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

    /* Ui Lists. */
    public orderStatuses: Array<SelectedItem> = [
        {id: -3, text: 'All'},
        {id:  4, text: 'Precentralised'},
        {id:  5, text: 'Centralised'},
        {id:  1, text: 'Initiated'},
        {id:  2, text: 'Waiting for NAV'},
        {id:  3, text: 'Waiting for Settlement'},
        {id: -1, text: 'Order settled'},
        {id:  "0", text: 'Cancelled'},
    ];
    public orderTypes: Array<SelectedItem> = [
        {id: "0", text: 'All'},
        {id: 3, text: 'Subscription'},
        {id: 4, text: 'Redemption'},
    ];

    /* Private Properties. */
    private subscriptions: Array<any> = [];
    private reduxUnsubscribe:Unsubscribe;
    private ordersList: Array<any> = [];
    private myDetails: any = {};
    private requestedSearch:any;
    private sort:{name: string, direction: string} = { name: 'dateEntered', direction: 'ASC' };

    /* Observables. */
    @select(['ofi', 'ofiManageOrders', 'manageOrders', 'orderList']) ordersListOb:any;
    /* Select the user's details. */
    @select(['user', 'myDetail']) myDetailOb:any;

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
            /* ...request using the defaults in the form. */
            this.getOrdersBySearch();
        }
    }

    ngAfterViewInit () {
        /* Do observable subscriptions here. */

        /* Orders list. */
        this.subscriptions['orders-list'] = this.ordersListOb.subscribe((orderList) => {
            console.log('orderlist: ', orderList);
            /* Subscribe and set the orders list. */
            this.ordersList = orderList.map((order) => {
                /* Pointer. */
                let fixed = order;

                /* Fix dates. */
                fixed.cutoffDate = this.formatDate('YYYY-MM-DD hh:mm:ss', new Date(fixed.cutoffDate));
                fixed.deliveryDate = this.formatDate('YYYY-MM-DD hh:mm:ss', new Date(fixed.deliveryDate));

                /* Return. */
                return fixed;
            });

            /* Fix parts of each order. */

            /* Detect Changes. */
            this.changeDetectorRef.detectChanges();
        });

        /* Subscribe for this user's details. */
        this.subscriptions['my-details'] = this.myDetailOb.subscribe((myDetails) => {
            /* Assign list to a property. */
            this.myDetails = myDetails;
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
     * Request Search
     * --------------
     * This is a buffer function that stops button mashing!
     * A request comes in, and after 500ms it's actually processed.
     * If another comes in, in that time, the timeout is reset.
     *
     * @return {void}
     */
    private requestSearch ():void {
        /* Let's check if we've got a request already... */
        if ( this.requestedSearch ) {
            /* ...if we do, cancel it. */
            clearTimeout(this.requestedSearch);
        }

        /* Now let's set a new timeout. */
        let timeToWait = 500; // milliseconds
        this.requestedSearch = setTimeout(() => {
            this.getOrdersBySearch();
        }, timeToWait);

        /* Return. */
        return;
    }

    /**
     * Get Orders By Search
     * --------------------------
     * Simply reads the search form, and requests data based on what has been entered,
     * or by defualts. Also, refreshes the order list.
     *
     * @return {void}
     */
    private getOrdersBySearch ():void {
        /* Ok, let's get the search form information... */
        let
        searchForm = this.tabsControl[0].searchForm.value,
        request = {};

        /* Check if we have search parameters. */
        console.log('searchForm', searchForm);
        if (! searchForm.status[0] || ! searchForm.type[0]) {
            return;
        }

        /* Build the rest of it. */
        request['status'] = searchForm.status[0].id;
        request['sortOrder'] = this.sort.direction;
        request['sortBy'] = this.sort.name;
        request['partyType'] = 2;
        request['pageSize'] = 123456789; // we're just getting all.
        request['pageNum'] = 0; // no need for this.
        request['asset'] = searchForm.name;
        request['arrangementType'] = searchForm.type[0].id;

        console.log(request);

        /* ...then request the new list. */
        this.ofiManageOrdersService.getOrdersList(request)
        .then(response => true) // no need to do anything here.
        .catch((error) => {
            console.warn('failed to fetch orders list: ', error);
            this.showError('Failed to fetch the latest orders.');
        });
    }

    /**
     * Switch Sort
     * -----------
     * Switches a sort and registers which we're using.
     *
     * @param {any} event - the click event.
     * @param {string} name - the sort name.
     */
    switchSort (event: any, name: string):void {
        console.log(event, name);
        /* Find the header's caret. */
        let elms = event.target.getElementsByTagName('i'), caret;
        if (elms.length && elms[0].classList) {
            caret = elms[0];
        }

        console.log(' |--- Switch Sort');
        console.log(' | event: ', event);
        console.log(' | name: ', name);

        /* If we've clicked the one we're sorting by, reverse sort. */
        if ( name === this.sort.name && caret ) {
            console.log(" | >> flip flop");
            /* Reverse. */
            if ( this.sort.direction === "ASC" ) {
                this.sort.direction = "DESC";
                caret.classList.remove('fa-caret-up');
                caret.classList.add('fa-caret-down');
            } else {
                this.sort.direction = "ASC";
                caret.classList.remove('fa-caret-down');
                caret.classList.add('fa-caret-up');
            }
        }

        /* If not, then set this as the one we're sorting by. */
        else if ( name !== this.sort.name ) {
            console.log(" | >> change");
            this.sort.name = name;
            this.sort.direction = "ASC";
        }

        /* Send for a search. */
        this.getOrdersBySearch();

        /* Return. */
        return;
    }

    /**
     * New Search FormGroup
     * --------------------
     * Instantiates a new FormGroup for the search form.
     *
     * @return {FormGroup} - the new FormGroup.
     */
    private newSearchFormGroup ():FormGroup {
        return new FormGroup({
            'name': new FormControl(''),
            'status': new FormControl([ this.orderStatuses[0] ]),
            'type': new FormControl([ this.orderTypes[0] ]),
        });
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
     * @return {string}              [description]
     */
    private formatDate (formatString:string, dateObj:Date):string {
        /* Return if we're missing a param. */
        if ( ! formatString || ! dateObj ) return '';

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
                "searchForm": this.newSearchFormGroup(),
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
