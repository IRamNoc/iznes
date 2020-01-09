// Vendor
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { fromJS } from 'immutable';
import { Subscription } from 'rxjs';
import { select, NgRedux } from '@angular-redux/store';
import { FileService } from '@setl/core-req-services';
import * as _ from 'lodash';

// Internal
import {
    MyWalletsService,
    MemberService,
    WalletnodeTxService,
    WalletNodeRequestService,
    InitialisationService,
} from '@setl/core-req-services';
import {
    SET_WALLET_ADDRESSES,
    SET_WALLET_LABEL,
    setRequestedWalletLabel,
    clearRequestedWalletLabel,
    setRequestedWalletAddresses,
    clearRequestedWalletAddresses,
} from '@setl/core-store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import {
    SagaHelper,
    immutableHelper,
    mDateHelper,
    MoneyValuePipe,
    NumberConverterService,
    ConfirmationService,
} from '@setl/utils';

import { OfiCorpActionService } from '../../ofi-req-services/ofi-corp-actions/service';
import * as moment from 'moment';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-nav',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OfiManageCsvComponent implements OnInit, OnDestroy {
    // Date picker configuration
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'DD-MM-YYYY',
        closeOnSelect: true,
        opens: 'right',
        locale: 'en',
    };

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    tabDetail: any;

    connectedWalletId: number;
    socketToken: string;
    userId: number;

    // Search form
    searchForm: FormGroup;
    // navDate: FormControl;
    navDateTo: FormControl;
    navDateFrom: FormControl;

    // nav edit form ??
    navForm: FormGroup;
    navFormPrice: FormControl;

    // List of Redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['user', 'authentication', 'token']) tokenOb;
    @select(['user', 'myDetail', 'userId']) userOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private changeDetectorRef: ChangeDetectorRef,
                private moneyValuePipe: MoneyValuePipe,
                private confirmationService: ConfirmationService,
                private numberConverterService: NumberConverterService,
                private ofiCorpActionService: OfiCorpActionService,
                private fileService: FileService,
                public translate: MultilingualService,
    ) {
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    ngOnInit() {
        /* tab meta */
        this.tabDetail = {
            title: {
                text: this.translate.translate('Historical Orders'),
                icon: 'fa-history',
            },
        };

        // search formGroup
        const currentDate = mDateHelper.getCurrentUnixTimestampStr('DD/MM/YYYY');
        const pastDate = moment(currentDate, 'DD/MM/YYYY').subtract(1, 'days').format('DD/MM/YYYY');

        this.navDateTo = new FormControl(currentDate);
        this.navDateFrom = new FormControl(pastDate);

        this.searchForm = new FormGroup({
            navDateFrom: this.navDateFrom,
            navDateTo: this.navDateTo,
        });

        this.connectedWalletId = 0;
        this.socketToken = '';
        this.userId = 0;

        // nav form
        this.navFormPrice = new FormControl('');
        this.navForm = new FormGroup({
            nav: this.navFormPrice,
        });

        // Reduce observable subscription
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connected) => {
            this.connectedWalletId = connected;
        }));

        // Reduce observable subscription
        this.subscriptionsArray.push(this.tokenOb.subscribe((token) => {
            this.socketToken = token;
        }));

        // Reduce observable subscription
        this.subscriptionsArray.push(this.userOb.subscribe((userId) => {
            this.userId = userId;
        }));

        this.changeDetectorRef.markForCheck();
    }

    getCsvReport() {
        const data = this.searchForm.value;
        const fromSplit = data.navDateFrom.split(/[\/-]/g);
        const toSplit = data.navDateTo.split(/[\/-]/g);

        let dateFrom: any = this.formatDate('YYYY-MM-DD', new Date(fromSplit[2], fromSplit[1] - 1, fromSplit[0]));
        let dateTo: any = this.formatDate('YYYY-MM-DD', new Date(toSplit[2], toSplit[1] - 1, toSplit[0]));

        if (!dateTo) dateTo = this.formatDate('YYYY-MM-DD', new Date());
        if (!dateFrom) dateFrom = moment(dateTo).subtract(1, 'days');

        // production:
        // let url = 'https://' + window.location.hostname + '/mn/file?token=' + this.socketToken + '&method=historicalCsv&walletId=' + this.connectedWalletId + '&userId=' + this.userId + '&dateFrom=' + encodeURIComponent(dateFrom) + '&dateTo=' + encodeURIComponent(dateTo);

        // local:
        let url = 'http://' + window.location.hostname + ':9788/file?token=' + this.socketToken + '&method=historicalCsv&walletId=' + this.connectedWalletId + '&userId=' + this.userId + '&dateFrom=' + encodeURIComponent(dateFrom) + '&dateTo=' + encodeURIComponent(dateTo);

        window.open(url, '_blank');
    }

    showErrorResponse(response) {
        const message = _.get(response, '[1].Data[0].Message', '');

        this.alertsService.create('error', `
                    <table class="table grid">
                        <tbody>
                            <tr>
                                <td class="text-center text-danger">${this.translate.translate(message)}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

    showSuccessResponse(message) {
        this.alertsService.create('success', `
                    <table class="table grid">
                        <tbody>
                            <tr>
                                <td class="text-center text-success">${this.translate.translate(message)}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

    showInvalidForm(message) {
        this.alertsService.create('error', `
                    <table class="table grid">
                        <tbody>
                            <tr>
                                <td class="text-center text-danger">${this.translate.translate(message)}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
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
            .replace('ss', this.numPad(dateObj.getSeconds()));
    }

    private numPad (num) {
        return num < 10 ? '0' + num : num;
    }
}
