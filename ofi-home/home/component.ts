/* Core/Angular imports. */
import {
    Component,
    AfterViewInit,
    OnDestroy,
    ChangeDetectorRef,
    ChangeDetectionStrategy
} from '@angular/core';
import {Router} from '@angular/router';

/* Redux */
import {select} from '@angular-redux/store';

/* Ofi orders request service. */
import {OfiOrdersService} from '../../ofi-req-services/ofi-orders/service';

@Component({
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiHomeComponent implements AfterViewInit, OnDestroy {

    /* Public properties. */
    public walletHoldingsByAddress: Array<any> = [];
    public myDetails: any = {};
    public connectedWalletName: string = '';
    public ordersList: Array<any> = [];

    /* Private properties. */
    private subscriptions: Array<any> = [];
    private myWallets: any = [];
    private connectedWalletId: any = 0;

    /* Observables. */
    @select(['wallet', 'myWallets', 'walletList']) myWalletsOb: any;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb: any;
    @select(['ofi', 'ofiOrders', 'homeOrders', 'orderList']) homeOrdersListOb: any;

    /* Constructor. */
    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private ofiOrdersService: OfiOrdersService,
                private _router: Router) {
        /* Stub. */
    }

    ngAfterViewInit() {
        /* Do observable subscriptions here. */

        /* Orders list. */
        this.subscriptions['home-orders-list'] = this.homeOrdersListOb.subscribe((orderList) => {
            /* Subscribe and set the orders list. */
            this.ordersList = orderList.map((order) => {
                /* Pointer. */
                let fixed = order;

                /* Fix dates. */
                fixed.cutoffDate = this.formatDate('YYYY-MM-DD', new Date(fixed.cutoffDate));
                fixed.deliveryDate = this.formatDate('YYYY-MM-DD', new Date(fixed.deliveryDate));

                /* Return. */
                return fixed;
            });

            /* Detect Changes. */
            this._changeDetectorRef.detectChanges();
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

        /* Now, let's fetch the precentralised orders list. */
        let request;
        if (this.myDetails.userType <= 26) {
            /* Is am. */
            request = {
                partyType: 2,
                pageNum: 0,
                pageSize: 123456789,
                asset: '',
                sortBy: 'deliveryDate',
                arrangementType: 0,
                status: 1,
                sortOrder: 'DESC'
            }
        } else {
            /* Is holder. */
            request = {
                partyType: 1,
                pageNum: 0,
                pageSize: 123456789,
                asset: '',
                sortBy: 'dateEntered',
                arrangementType: 0,
                status: 4,
                sortOrder: 'DESC'
            }
        }

        this.ofiOrdersService.getHomeOrdersList(request)
            .then(() => true)
            .catch((error) => {
                /* Handle error. */
                console.warn('Failed to fetch precentralised orders:', error);
            });
    }

    /**
     * handleViewOrder
     * @param orderId
     */
    public handleViewOrder(orderId: number): void {
        /* Set the buffer. */
        this.ofiOrdersService.setOrderBuffer(orderId);

        /* Send the user to their order page. */
        if ([46].indexOf(this.myDetails.userType) != -1) {
            /* Is holder. */
            this._router.navigateByUrl('/order-book/my-orders');
        } else {
            /* Is other. */
            this._router.navigateByUrl('/manage-orders');
        }
    }

    /**
     * beginOrderJourney
     * @param journey
     */
    public beginOrderJourney(journey: string): void {
        /* Dispatch the action to register the journey. */
        this.ofiOrdersService.setOrderFilter(journey);

        /* Send the user to their order page. */
        if ([46].indexOf(this.myDetails.userType) != -1) {
            /* Is holder. */
            this._router.navigateByUrl('/order-book/my-orders');
        } else {
            /* Is other. */
            this._router.navigateByUrl('/manage-orders');
        }

        /* Return. */
        return;
    }

    /**
     * beginListOfFundsJourney
     * @return {void}
     */
    public beginListOfFundsJourney(): void {
        /* Send the user to their order page. */
        if ([46].indexOf(this.myDetails.userType) != -1) {
            /* Is holder. */
            this._router.navigateByUrl('/list-of-funds');
        } else {
            /* Is other. */
            this._router.navigateByUrl('/product-module/fund');
        }

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
     * Pad Number Left
     * -------------
     * Pads a number left
     *
     * @param  {number} num - the orderId.
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
        this._changeDetectorRef.detectChanges();

        /* Return. */
        return;
    }

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (var key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }
}
