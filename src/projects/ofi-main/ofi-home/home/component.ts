/* Core/Angular imports. */
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    OnDestroy,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
/* Redux */
import { NgRedux, select } from '@angular-redux/store';
import { MultilingualService } from '@setl/multilingual';
import { APP_CONFIG, AppConfig, MoneyValuePipe, NumberConverterService, LogService } from '@setl/utils';
/* Ofi orders request service. */
import { OfiOrdersService } from '@ofi/ofi-main/ofi-req-services/ofi-orders/service';
import { PermissionsService } from '@setl/utils/services/permissions';

// recordkeeping
import { MemberSocketService } from '@setl/websocket-service';
import { OfiReportsService } from '../../ofi-req-services/ofi-reports/service';

import { combineLatest as observableCombineLatest } from 'rxjs';

// Internal
import {
    MyWalletsService,
    MemberService,
    WalletnodeTxService,
    WalletNodeRequestService,
} from '@setl/core-req-services';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})
export class OfiHomeComponent implements AfterViewInit, OnInit, OnDestroy {
    appConfig: AppConfig;

    /* Public properties. */
    public myDetails: any = {};
    public connectedWalletName = '';
    public hasPermissionManageOrders: boolean = false;
    public hasPermissionViewRecordkeeping: boolean = false;
    public hasPermissionViewPrecentralisation: boolean = false;
    public hasPermissionViewUmbrellaFund: boolean = false;
    public hasPermissionViewNav: boolean = false;
    public hasPermissionviewAllOrder: boolean = false;

    /* Private properties. */
    private subscriptions: any[] = [];
    private myWallets: any = [];
    private connectedWalletId: number = 0;
    userType: number;

    nbUnreadMessages = 0;

    language = 'en';

    /* Observables. */
    @select(['wallet', 'myWallets', 'walletList']) myWalletsOb: any;
    @select(['user', 'siteSettings', 'language']) readonly requestedLanguage$;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb: any;
    @select(['message', 'myMessages', 'counts', 'inboxUnread']) nbMessagesObj: any;

    /* Constructor. */
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private numberConverterService: NumberConverterService,
        private ngRedux: NgRedux<any>,
        private moneyValuePipe: MoneyValuePipe,
        private fb: FormBuilder,
        private router: Router,
        public translate: MultilingualService,
        private logService: LogService,
        private myWalletService: MyWalletsService,
        private memberService: MemberService,
        private memberSocketService: MemberSocketService,
        private walletnodeTxService: WalletnodeTxService,
        private walletNodeRequestService: WalletNodeRequestService,
        private ofiOrdersService: OfiOrdersService,
        private ofiReportsService: OfiReportsService,
        public permissionsService: PermissionsService,
        @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
    }

    ngOnInit() {
        const combined$ = observableCombineLatest(this.connectedWalletOb, this.myDetailOb);

        const combinedSubscription = combined$.subscribe(([connectedWalletId, details]) => {
            this.connectedWalletId = connectedWalletId;
            this.userType = details.userType;

            this.updateWalletConnection();
            this.callServices();

            this.changeDetectorRef.detectChanges();
        });

        this.subscriptions.push(combinedSubscription);

        /* Do observable subscriptions here. */
        this.subscriptions['message'] = this.nbMessagesObj.subscribe((nb) => {
            /* Assign list to a property. */
            this.nbUnreadMessages = (nb) ? nb : 0;
            this.changeDetectorRef.detectChanges();
        });

        this.subscriptions['language'] = this.requestedLanguage$.subscribe((language) => {
            this.language = language;
            this.changeDetectorRef.detectChanges();
        });

        this.permissionsService.hasPermission('manageOrder', 'canRead').then(
            (hasPermission) => {
                this.hasPermissionManageOrders = hasPermission;
            },
        );

        this.permissionsService.hasPermission('viewRecordkeeping', 'canRead').then(
            (hasPermission) => {
                this.hasPermissionViewRecordkeeping = hasPermission;
            },
        );

        this.permissionsService.hasPermission('viewPrecentralisation', 'canRead').then(
            (hasPermission) => {
                this.hasPermissionViewPrecentralisation = hasPermission;
            },
        );

        this.permissionsService.hasPermission('manageUmbrellaFund', 'canRead').then(
            (hasPermission) => {
                this.hasPermissionViewUmbrellaFund = hasPermission;
            },
        );

        this.permissionsService.hasPermission('manageNav', 'canRead').then(
            (hasPermission) => {
                this.hasPermissionViewNav = hasPermission;
            },
        );

        this.permissionsService.hasPermission('viewAllOrder', 'canRead').then(
            (hasPermission) => {
                this.hasPermissionviewAllOrder = hasPermission;
            },
        );

        this.changeDetectorRef.detectChanges();

    }

    ngAfterViewInit() {
    }

    callServices() {
        if (this.userType !== 0 && this.connectedWalletId !== 0) {
            if (this.userType === 36) {
                /* Subscribe for this user's wallets. */
                this.subscriptions['my-wallets'] = this.myWalletsOb.subscribe((walletsList) => {
                    /* Assign list to a property. */
                    this.myWallets = walletsList;

                    /* Update wallet name. */
                    this.updateWalletConnection();
                });
            }
        }
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
        .replace('ss', this.numPad(dateObj.getSeconds()));
    }

    private numPad(num) {
        return num < 10 ? '0' + num : num;
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
                if (Number(wallet) === this.connectedWalletId) {
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

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }
}
