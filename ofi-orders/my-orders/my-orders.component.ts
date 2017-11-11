/* Core/Angular imports. */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {NgRedux, select} from "@angular-redux/store";
import {Unsubscribe} from "redux";
import {FormControl, FormGroup} from "@angular/forms";
/* Services. */
import {WalletNodeRequestService} from "@setl/core-req-services";
/* Alerts and confirms. */
import {AlertsService} from "@setl/jaspero-ng2-alerts";
import {ConfirmationService, immutableHelper, NumberConverterService} from "@setl/utils";
/* Utils. */
/* Ofi Corp Actions request service. */
import {OfiOrdersService} from "../../ofi-req-services/ofi-orders/service";
/* Core store stuff. */
/* Ofi Store stuff. */
import {getOfiMyOrderList, ofiSetRequestedMyOrder} from "../../ofi-store";


/* Types. */
interface SelectedItem {
    id: any;
    text: number | string;
}

/* Decorator. */
@Component({
    styleUrls: ['./my-orders.component.css'],
    templateUrl: './my-orders.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

/* Class. */
export class MyOrdersComponent implements OnInit, AfterViewInit, OnDestroy {

    /* Tabs Control array */
    public tabsControl: Array<any> = [];

    /* Ui Lists. */
    public orderStatuses: Array<SelectedItem> = [
        {id: -3, text: 'All'},
        {id: 4, text: 'Precentralised'},
        {id: 5, text: 'Centralised'},
        {id: 1, text: 'Initiated'},
        {id: 2, text: 'Waiting for NAV'},
        {id: 3, text: 'Waiting for Settlement'},
        {id: -1, text: 'Order settled'},
        {id: "0", text: 'Cancelled'},
    ];
    public orderTypes: Array<SelectedItem> = [
        {id: "0", text: 'All'},
        {id: 3, text: 'Subscription'},
        {id: 4, text: 'Redemption'},
    ];

    /* Public Properties */
    public connectedWalletName: string = '';

    /* Private Properties. */
    private subscriptions: Array<any> = [];
    private reduxUnsubscribe: Unsubscribe;
    private ordersList: Array<any> = [];
    private myDetails: any = {};
    private myWallets: any = [];
    private connectedWalletId: any = 0;
    private requestedSearch: any;
    private sort: { name: string, direction: string } = {name: 'dateEntered', direction: 'ASC'}; // default search.

    /* Observables. */
    @select(['ofi', 'ofiOrders', 'myOrders', 'orderList']) ordersListOb: any;
    @select(['ofi', 'ofiOrders', 'myOrders', 'requested']) requestedOb: any;
    @select(['ofi', 'ofiOrders', 'homeOrders', 'orderBuffer']) orderBufferOb: any;
    @select(['ofi', 'ofiOrders', 'homeOrders', 'orderFilter']) orderFilterOb: any;
    @select(['wallet', 'myWallets', 'walletList']) myWalletsOb: any;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb: any;

    constructor(private ofiOrdersService: OfiOrdersService,
                private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private _confirmationService: ConfirmationService,
                public _numberConverterService: NumberConverterService) {
        /* Default tabs. */
        this.tabsControl = this.defaultTabControl();
    }

    ngOnInit() {
        /* State. */
        let state = this.ngRedux.getState();

        /* Ok, let's check that we have the orders list, if not... */
        if (!getOfiMyOrderList(state).length) {
            /* ...request using the defaults in the form. */
            this.getOrdersBySearch();
        }
    }

    ngAfterViewInit() {
        /* Do observable subscriptions here. */

        /* Orders list. */
        this.subscriptions['orders-list'] = this.ordersListOb.subscribe((orderList) => {
            /* Subscribe and set the orders list. */
            this.ordersList = orderList.map((order) => {
                /* Pointer. */
                let fixed = order;

                /* Fix dates. */
                fixed.cutoffDate = this.formatDate('YYYY-MM-DD', new Date(fixed.cutoffDate));
                fixed.deliveryDate = this.formatDate('YYYY-MM-DD', new Date(fixed.deliveryDate));

                fixed.price = this._numberConverterService.toFrontEnd(fixed.price);

                let metaData = immutableHelper.copy(order.metaData);

                metaData.price = this._numberConverterService.toFrontEnd(metaData.price);
                metaData.units = this._numberConverterService.toFrontEnd(metaData.units);

                metaData.total = metaData.units * fixed.price;

                fixed.metaData = metaData;

                /* Return. */
                return fixed;
            });

            /* Detect Changes. */
            this.changeDetectorRef.detectChanges();
        });

        this.subscriptions['order-list-requested'] = this.requestedOb.subscribe((requested) => {
            this.getOrdersBySearch(requested);
        });

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

        /* Subscribe for the order buffer. */
        this.subscriptions['order-buffer'] = this.orderBufferOb.subscribe((orderId) => {
            /* Check if we have an Id. */
            setTimeout(() => {
                if (orderId !== -1 && this.ordersList.length) {
                    /* If we do, then handle the viewing of it. */
                    this.handleViewOrder(orderId);

                    this.ofiOrdersService.resetOrderBuffer();
                }
            }, 100);
        });

        /* Subscribe for the order filter. */
        this.subscriptions['order-filter'] = this.orderFilterOb.subscribe((filter) => {
            /* Check if we have a filter set. */
            console.log(' | preset filter: ', filter);
            setTimeout(() => {
                if (filter != '' && this.ordersList.length) {
                    /* If we do, then let's patch the form value... */
                    console.log(' | preset filter: ', filter);
                    this.tabsControl[0].searchForm.controls.status.patchValue(
                        this.getStatusByName(filter) // resolve the status
                    );

                    /* ...also, reset the filter... */
                    this.ofiOrdersService.resetOrderFilter();

                    /* ...and update the view. */
                    this.getOrdersBySearch();

                    /* Detect changes. */
                    this.changeDetectorRef.detectChanges();
                }
            }, 100);
        });
    }

    /**
     * getStatusByName
     * @param requestedName
     */
    public getStatusByName(requestedName: string): Array<SelectedItem> {
        /* Variables. */
        let finds = [];

        /* Let's see if we can find the status. */
        let status: any;
        for (status of this.orderStatuses) {
            if (status.text.toLowerCase() == requestedName) {
                finds.push(status);
                break;
            }
        }

        /* Return. */
        console.log(finds);
        return finds;
    }

    /**
     * Handle View Order
     * -----------------
     * Handles viewing a order.
     *
     * @return {void}
     */
    public handleViewOrder(orderId: number): void {
        /* Find the order. */
        let
            i = 0,
            foundActive = false,
            order = this.getOrderById(orderId);
        if (!order) return;

        /* Check if the tab is already open. */
        this.tabsControl.map((tab) => {
            if (tab.orderId == orderId) {
                /* Set flag... */
                foundActive = true;

                /* ...set tab active... */
                this.setTabActive(i);

                /* ...and gotta call this again. */
                this.changeDetectorRef.detectChanges();
            }

            /* Inc. */
            i++;
        })

        /* If we found an active tab, no need to do anymore... */
        if (foundActive) {
            return;
        }

        /* Push a new tab into the tabs control... */
        this.tabsControl.push(
            {
                "title": {
                    "icon": "fa-pencil",
                    "text": this.padNumberLeft(order.arrangementID, 5)
                },
                "orderId": orderId,
                "active": false,
                "orderData": order
            }
        );

        /* Detect the changes. */
        this.changeDetectorRef.detectChanges();

        /* ...then set it active. */
        this.setTabActive(this.tabsControl.length - 1);

        /* Detect the changes. */
        this.changeDetectorRef.detectChanges();

        /* Return. */
        return;
    }

    /**
     * Handle Cancel Order
     * -----------------
     * Handles canceling an order.
     *
     * @return {void}
     */
    public handleCancelOrder(orderId: number): void {
        /* Let's first find the order... */
        let
            request = {},
            order = this.getOrderById(orderId);

        /* ...or return if we couldn't find it. */
        if (!order) return;

        /* Now let's build the request that we'll send... */
        request['arrangementId'] = order.arrangementID;
        request['walletId'] = this.connectedWalletId;
        request['status'] = 0;
        request['price'] = order.price;

        /* Let's ask the user if they're sure... */
        this._confirmationService.create(
            '<span>Cancelling an Order</span>',
            '<span>Are you sure you want to cancel this order?</span>'
        ).subscribe((ans) => {
            /* ...if they are... */
            if (ans.resolved) {
                /* Send the request. */
                this.ofiOrdersService.updateOrder(request).then((response) => {
                    /* Handle success. */
                    this.showSuccess('Successfully cancelled this order.');
                }).catch((error) => {
                    /* Handle error. */
                    this.showError('Failed to cancel this order.');
                    console.warn(error);
                });
            }
        });

        /* Return. */
        return;
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
     * Get Order By ID
     * ---------------
     * Get an order by it's ID.
     *
     * @param  {number} orderId - an order id.
     * @return {any|boolean} - the order, if found or just false.
     */
    private getOrderById(orderId: number): any | boolean {
        /* Ok, let's loop over the orders list... */
        let order;
        for (order of this.ordersList) {
            /* ..if this is the order, break, to return it... */
            if (order.arrangementID === orderId) break;

            /* ...else set order to false, incase this is last loop. */
            order = false;
        }

        /* Return. */
        return order;
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
    private requestSearch(): void {
        /* Let's check if we've got a request already... */
        if (this.requestedSearch) {
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
     * @param {boolean} requested
     * @return {void}
     */
    private getOrdersBySearch(requested = false): void {
        if (requested) {
            return;
        }

        this.ngRedux.dispatch(ofiSetRequestedMyOrder());

        /* Ok, let's get the search form information... */
        let
            searchForm = this.tabsControl[0].searchForm.value,
            request = {};

        /* Check if we have search parameters. */
        if (!searchForm.status[0] || !searchForm.type[0]) {
            return;
        }

        /* Build the rest of it. */
        request['status'] = searchForm.status[0].id;
        request['sortOrder'] = this.sort.direction;
        request['sortBy'] = this.sort.name;
        request['partyType'] = 1;
        request['pageSize'] = 123456789; // we're just getting all.
        request['pageNum'] = 0; // no need for this.
        request['asset'] = searchForm.name;
        request['arrangementType'] = searchForm.type[0].id;


        /* ...then request the new list. */
        this.ofiOrdersService.getMyOrdersList(request)
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
    switchSort(event: any, name: string): void {
        /* Find the header's caret. */
        let elms = event.target.getElementsByTagName('i'), caret;
        if (elms.length && elms[0].classList) {
            caret = elms[0];
        }

        /* If we've clicked the one we're sorting by, reverse sort. */
        if (name === this.sort.name && caret) {
            /* Reverse. */
            if (this.sort.direction === "ASC") {
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
        else if (name !== this.sort.name) {
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
    private newSearchFormGroup(): FormGroup {
        return new FormGroup({
            'name': new FormControl(''),
            'status': new FormControl([this.orderStatuses[0]]),
            'type': new FormControl([this.orderTypes[0]]),
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
     *
     * @param  {string} formatString [description]
     * @param  {Date}   dateObj      [description]
     * @return {string}              [description]
     */
    private formatDate(formatString: string, dateObj: Date): string {
        /* Return if we're missing a param. */
        if (!formatString || !dateObj) return '';

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
        return num < 10 ? "0" + num : num;
    }

    /**
     * Calc Entry Fee
     * --------------
     * Calculates the entry fee from the grossAmount.
     *
     * @param  {number} grossAmount - the grossAmount.
     * @return {number}             - the entry fee.
     */
    private calcEntryFee(grossAmount: number): number {
        return 0; // for OFI test this is 0
        // TODO: Real example
        // return Math.round(grossAmount * .0375);
    }

    /**
     * Get Order Date
     *
     * @param  {string} dateString - the order's date string.
     * @return {string}            - the formatted date or empty string.
     */
    private getOrderDate(dateString): string {
        return this.formatDate('YYYY-MM-DD', new Date(dateString)) || '';
    }

    /**
     * Get Order Time
     *
     * @param  {string} dateString - the order's date string.
     * @return {string}            - the formatted time or empty string.
     */
    private getOrderTime(dateString): string {
        return this.formatDate('hh:mm:ss', new Date(dateString));
    }

    /**
     * Pad Number Left
     * -------------
     * Pads a number left
     *
     * @param  {number} num - the couponId.
     * @return {string}
     */
    private padNumberLeft(num: number | string, zeros?: number): string {
        /* Validation. */
        if (!num && num != 0) return "";
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
    private defaultTabControl(): Array<any> {
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

        /* Detect the changes. */
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
