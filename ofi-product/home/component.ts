// Vendor
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, Inject} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {fromJS} from 'immutable';
import {Subscription} from 'rxjs/Subscription';
import {select, NgRedux} from '@angular-redux/store';
import {ActivatedRoute, Router, Params} from '@angular/router';

/* Services */
import {OfiUmbrellaFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';

/* Alert service. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ToasterService} from 'angular2-toaster';

/* Models */

/* Utils. */
import {APP_CONFIG, AppConfig, SagaHelper, NumberConverterService, commonHelper} from '@setl/utils';
import {Observable} from 'rxjs/Observable';
import * as math from 'mathjs';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-home',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductHomeComponent implements OnInit, AfterViewInit, OnDestroy {

    /* Public properties. */

    umbrellaFundList = [];
    fundList = [];
    shareList = [];

    columns = {
        'shareName': {
            label: 'Share name',
            dataSource: 'shareName',
            sortable: true,
        },
        'fundName': {
            label: 'Fund name',
            dataSource: 'fundName',
            sortable: true,
        },
        'isin': {
            label: 'ISIN',
            dataSource: 'isin',
            sortable: true,
        },
        'managementCompany': {
            label: 'Management company',
            dataSource: 'managementCompanyID',
            sortable: true,
        },
        'typeOfshare': {
            label: 'Type of share',
            dataSource: 'typeOfshare',
            sortable: true,
        },
        'status': {
            label: 'Status (close or open?)',
            dataSource: 'status',
            sortable: true,
        },
        'lei': {
            label: 'LEI',
            dataSource: 'legalEntityIdentifier',
            sortable: true,
        },
        'country': {
            label: 'Country',
            dataSource: 'domicile',
            sortable: true,
        },
        'lawStatus': {
            label: 'Law status',
            dataSource: 'lawStatus',
            sortable: true,
        },
        'umbrellaFund': {
            label: 'Umbrella fund (to which the fund belongs)',
            dataSource: 'umbrellaFund',
            sortable: true,
        },
        'fundCurrency': {
            label: 'Currency of the fund',
            dataSource: 'fundCurrency',
            sortable: true,
        },
        'uFundName': {
            label: 'Umbrella fund name',
            dataSource: 'umbrellaFundName',
            sortable: true,
            link: '/product-module/umbrella-fund/:umbrellaFundID',
        },
        'uFundCurrency': {
            label: 'Currency of the Umbrella fund',
            dataSource: 'uFundCurrency',
            sortable: true,
        },
        'waitingStatus': {
            label: 'Status',
            dataSource: 'waitingStatus',
            sortable: true,
        },
        'waitingType': {
            label: 'Type',
            dataSource: 'waitingType',
            sortable: true,
        },
        'productName': {
            label: 'Product name',
            dataSource: 'productName',
            sortable: true,
        },
        'dateModification': {
            label: 'Date of modification',
            dataSource: 'dateModification',
            sortable: true,
        },
        'validateFor': {
            label: 'To be validate for (date)',
            dataSource: 'validateFor',
            sortable: true,
        },
        'modifiedBy': {
            label: 'Modified by',
            dataSource: 'modifiedBy',
            sortable: true,
        },
    };
    panelDefs = [
        {
            title: 'Shares',
            columns: [
                this.columns['shareName'],
                this.columns['fundName'],
                this.columns['isin'],
                this.columns['managementCompany'],
                this.columns['typeOfshare'],
                this.columns['status'],
            ],
            action: {
                title: 'Add new Share',
                icon: 'plus',
                type: 'share',
            },
            open: true,
            data: this.shareList,
        },
        {
            title: 'Funds',
            columns: [
                this.columns['fundName'],
                this.columns['lei'],
                this.columns['managementCompany'],
                this.columns['country'],
                this.columns['lawStatus'],
                this.columns['umbrellaFund'],
                this.columns['fundCurrency'],
            ],
            action: {
                title: 'Add new Fund',
                icon: 'plus',
                type: 'fund',
            },
            open: true,
            data: this.fundList,
        },
        {
            title: 'Umbrella funds',
            columns: [
                this.columns['uFundName'],
                this.columns['lei'],
                this.columns['managementCompany'],
                this.columns['country'],
                // this.columns['uFundCurrency'],
            ],
            action: {
                title: 'Add new Umbrella fund',
                icon: 'plus',
                type: 'ufund',
            },
            open: true,
            data: this.umbrellaFundList,
        },
        // {
        //     title: 'Shares, Funds & Umbrella funds waiting for your validation (modification not yet published to Investors on Iznes)',
        //     columns: [
        //         this.columns['waitingStatus'],
        //         this.columns['waitingType'],
        //         this.columns['productName'],
        //         this.columns['dateModification'],
        //         this.columns['validateFor'],
        //         this.columns['modifiedBy'],
        //     ],
        //     open: false,
        // },
    ];

    showOnlyActive = true;

    /* Private properties. */
    subscriptions: Array<Subscription> = [];

    /* Redux observables. */
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'requested']) requestedOfiUmbrellaFundListOb;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaFundAccessListOb;

    constructor(
        private _ngRedux: NgRedux<any>,
        private _changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _numberConverterService: NumberConverterService,
        private _ofiUmbrellaFundService: OfiUmbrellaFundService,
    ) {
        this.subscriptions.push(this.requestedOfiUmbrellaFundListOb.subscribe((requested) => this.getUmbrellaFundRequested(requested)));
        this.subscriptions.push(this.umbrellaFundAccessListOb.subscribe((list) => this.getUmbrellaFundList(list)));
    }

    public ngOnInit() {

    }

    public ngAfterViewInit() {

    }

    getUmbrellaFundRequested(requested): void {
        if (!requested) {
            OfiUmbrellaFundService.defaultRequestUmbrellaFundList(this._ofiUmbrellaFundService, this._ngRedux);
        }
    }

    getUmbrellaFundList(list) {
        const listImu = fromJS(list);

        this.umbrellaFundList = listImu.reduce((result, item) => {

            result.push({
                umbrellaFundID: item.get('umbrellaFundID', 0),
                umbrellaFundName: item.get('umbrellaFundName', ''),
                registerOffice: item.get('registerOffice', ''),
                registerOfficeAddress: item.get('registerOfficeAddress', ''),
                legalEntityIdentifier: item.get('legalEntityIdentifier', 0),
                domicile: item.get('domicile', 0),
                umbrellaFundCreationDate: item.get('umbrellaFundCreationDate', ''),
                managementCompanyID: item.get('managementCompanyID', 0),
                fundAdministratorID: item.get('fundAdministratorID', 0),
                custodianBankID: item.get('custodianBankID', 0),
                investmentManagerID: item.get('investmentManagerID', 0),
                investmentAdvisorID: item.get('investmentAdvisorID', 0),
                payingAgentID: item.get('payingAgentID', 0),
                transferAgentID: item.get('transferAgentID', 0),
                centralisingAgentID: item.get('centralisingAgentID', 0),
                giin: item.get('giin', 0),
                delegateManagementCompanyID: item.get('delegateManagementCompanyID', 0),
                auditorID: item.get('auditorID', 0),
                taxAuditorID: item.get('taxAuditorID', 0),
                principlePromoterID: item.get('principlePromoterID', 0),
                legalAdvisorID: item.get('legalAdvisorID', 0),
                directors: item.get('directors', ''),
            });

            return result;
        }, []);

        this.panelDefs[2].data = this.umbrellaFundList;

        this._changeDetectorRef.markForCheck();
    }

    addForm(type) {
        switch (type) {
            case 'share':
                this._router.navigateByUrl('/product-module/share');
                break;
            case 'fund':
                this._router.navigateByUrl('/product-module/fund/create');
                break;
            case 'ufund':
                this._router.navigateByUrl('/product-module/umbrella-fund/0');
                break;
        }
    }

    buildLink(column, row) {
        let dest = column.link;
        column.link.match(/:\w+/g).forEach((match) => {
            const key = match.substring(1);
            const regex = new RegExp(match);
            dest = dest.replace(regex, row[key]);
        });
        this._router.navigateByUrl(dest);
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

    /**
     * Num Pad
     *
     * @param num
     * @returns {string}
     */
    private numPad(num) {
        return num < 10 ? '0' + num : num;
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
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
