// Vendor
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';

import {fromJS} from 'immutable';

import {Subscription} from 'rxjs/Subscription';
import {NgRedux, select} from '@angular-redux/store';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
/* Services */
import {OfiUmbrellaFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
/* Alert service. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
/* Utils. */
import {NumberConverterService} from '@setl/utils';
import {OfiFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import {OfiFundShareService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import * as FundShareModels from '@ofi/ofi-main/ofi-product/fund-share/models';
import {OfiManagementCompanyService} from '../../ofi-req-services/ofi-product/management-company/management-company.service';

/* Models */

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-home',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductHomeComponent implements OnInit, OnDestroy {
    /* Public properties. */
    amManagementCompany: string;
    fundList = [];
    shareList = [];
    umbrellaFundList = [];
    filteredShareList = [];
    managementCompanyAccessList = [];
    showOnlyActive = true;

    fundCurrencyItems = [];
    countryItems = [];
    legalFormItems = [];

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
        'fFundName': {
            label: 'Fund name',
            dataSource: 'fundName',
            sortable: true
        },
        'isin': {
            label: 'ISIN',
            dataSource: 'isin',
            sortable: true,
        },
        'managementCompany': {
            label: 'Management company',
            dataSource: 'managementCompany',
            sortable: true,
        },
        'typeOfShare': {
            label: 'Type of share',
            dataSource: 'typeOfShare',
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
            dataSource: 'umbrellaFundName',
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
            sortable: true
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
                this.columns['typeOfShare'],
                this.columns['status'],
            ],
            action: {
                id: 'new-share-btn',
                title: 'Add new Share',
                icon: 'plus',
                type: 'share',
            },
            link: '/product-module/fund-share/',
            linkIdent: 'fundShareID',
            open: true,
            data: this.shareList,
            columnLink: 'shareName'
        },
        {
            title: 'Funds',
            columns: [
                this.columns['fFundName'],
                this.columns['lei'],
                this.columns['managementCompany'],
                this.columns['country'],
                this.columns['lawStatus'],
                this.columns['umbrellaFund'],
                this.columns['fundCurrency'],
            ],
            action: {
                id: 'new-fund-btn',
                title: 'Add new Fund',
                icon: 'plus',
                type: 'fund',
            },
            link: '/product-module/fund/',
            linkIdent: 'fundID',
            open: true,
            data: this.fundList,
            columnLink: 'fundName'
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
                id: 'new-umbrella-fund-btn',
                title: 'Add new Umbrella fund',
                icon: 'plus',
                type: 'ufund',
            },
            link: '/product-module/umbrella-fund/',
            linkIdent: 'umbrellaFundID',
            open: true,
            data: this.umbrellaFundList,
            columnLink: 'umbrellaFundName'
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

    /* Private properties. */
    subscriptions: Array<Subscription> = [];

    /* Redux observables. */
    @select(['user', 'myDetail']) userDetailObs;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'requestedIznesFund']) requestedFundListObs;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'requestedShare']) requestedShareListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) shareListObs;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'requested']) requestedOfiUmbrellaFundListOb;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaFundAccessListOb;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyAccessListOb;

    constructor(private _ngRedux: NgRedux<any>,
                private _changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private _route: ActivatedRoute,
                private _router: Router,
                private _numberConverterService: NumberConverterService,
                private _ofiFundService: OfiFundService,
                private _ofiFundShareService: OfiFundShareService,
                private _ofiUmbrellaFundService: OfiUmbrellaFundService,
                private ofiManagementCompanyService: OfiManagementCompanyService,
                @Inject('fund-items') fundItems) {
        this.fundCurrencyItems = fundItems.fundItems.fundCurrencyItems;
        this.countryItems = fundItems.fundItems.domicileItems;
        this.legalFormItems = fundItems.fundItems.fundLegalFormItems;
        this.amManagementCompany = '';
        OfiManagementCompanyService.defaultRequestManagementCompanyList(this.ofiManagementCompanyService, this._ngRedux);
    }

    ngOnInit() {
        this.subscriptions.push(this.userDetailObs.subscribe(userDetail => this.amManagementCompany = userDetail.companyName));
        this.subscriptions.push(this.requestedFundListObs.subscribe(requested => this.requestFundList(requested)));
        this.subscriptions.push(this.fundListObs.subscribe(funds => this.getFundList(funds)));
        this.subscriptions.push(this.requestedShareListObs.subscribe(requested => this.requestShareList(requested)));
        this.subscriptions.push(this.shareListObs.subscribe(shares => this.getShareList(shares)));
        this.subscriptions.push(this.requestedOfiUmbrellaFundListOb.subscribe((requested) => this.getUmbrellaFundRequested(requested)));
        this.subscriptions.push(this.umbrellaFundAccessListOb.subscribe((list) => this.getUmbrellaFundList(list)));
        this.subscriptions.push(this.managementCompanyAccessListOb.subscribe(d => this.managementCompanyAccessList = d));
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    requestFundList(requested): void {
        if (!requested) {
            OfiFundService.defaultRequestIznesFundList(this._ofiFundService, this._ngRedux);
        }
    }

    getFundList(funds: any): void {
        const fundList = [];
        if (_.values(funds).length > 0) {
            _.values(funds).map((fund) => {
                const domicile = _.find(this.countryItems, { id: fund.domicile }) || { text: '' };
                const lawStatus = _.find(this.legalFormItems, { id: fund.legalForm }) || { text: '' };
                const fundCurrency = _.find(this.fundCurrencyItems, { id: fund.fundCurrency }) || { text: '' };

                fundList.push({
                    fundID: fund.fundID,
                    fundName: fund.fundName,
                    legalEntityIdentifier: fund.legalEntityIdentifier,
                    managementCompany: _.get(this.managementCompanyAccessList, [fund.managementCompanyID, 'companyName'], ''),
                    domicile: domicile.text,
                    lawStatus: lawStatus.text,
                    umbrellaFundName: fund.umbrellaFundName,
                    fundCurrency: fundCurrency.text,
                });
            });
        }

        this.fundList = fundList;
        this.panelDefs[1].data = this.fundList;
        this._changeDetectorRef.markForCheck();
    }

    requestShareList(requested): void {
        if (!requested) {
            OfiFundShareService.defaultRequestIznesShareList(this._ofiFundShareService, this._ngRedux);
        }
    }

    getShareList(shares): void {
        const shareList = [];

        if ((shares != undefined) && shares.size > 0) {
            shares.map((share) => {
                const keyFactsModel = new FundShareModels.ShareKeyFactsMandatory();
                const status = _.find(keyFactsModel.shareClassInvestmentStatus.listItems, (item) => {
                    return item.id === share.shareClassInvestmentStatus;
                }).text;
                const typeOfShare = _.find(keyFactsModel.shareClassCode.listItems, (item) => {
                    return item.id === share.shareClassCode;
                }).text;

                shareList.push({
                    fundShareID: share.fundShareID,
                    shareName: share.fundShareName,
                    fundName: share.fundName,
                    isin: share.isin,
                    managementCompany: share.managementCompanyName,
                    typeOfShare: typeOfShare,
                    status: status
                });
            });
        }

        this.shareList = shareList;
        this.filteredShareList = shareList.filter((share) => {
            return share.status !== 5
        });
        this.panelDefs[0].data = this.filteredShareList;
        this._changeDetectorRef.markForCheck();
    }

    getUmbrellaFundRequested(requested): void {
        if (!requested) {
            OfiUmbrellaFundService.defaultRequestUmbrellaFundList(this._ofiUmbrellaFundService, this._ngRedux);
        }
    }

    getUmbrellaFundList(umbrellaFunds) {
        const data = fromJS(umbrellaFunds).toArray();
        const umbrellaFundList = [];

        if (data.length > 0) {
            data.map((item) => {
                const domicile = _.find(this.countryItems, { id: item.get('domicile') }) || { text: '' };

                umbrellaFundList.push({
                    umbrellaFundID: item.get('umbrellaFundID', 0),
                    umbrellaFundName: item.get('umbrellaFundName', ''),
                    registerOffice: item.get('registerOffice', ''),
                    registerOfficeAddress: item.get('registerOfficeAddress', ''),
                    legalEntityIdentifier: item.get('legalEntityIdentifier', 0),
                    domicile: domicile.text,
                    umbrellaFundCreationDate: item.get('umbrellaFundCreationDate', ''),
                    managementCompany: _.get(this.managementCompanyAccessList, [item.get('managementCompanyID', 0), 'companyName'], ''),
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
            });
        }

        this.umbrellaFundList = umbrellaFundList;
        this.panelDefs[2].data = this.umbrellaFundList;
        this._changeDetectorRef.markForCheck();
    }

    handleShareToggleClick() {
        this.showOnlyActive = !this.showOnlyActive;

        this.filteredShareList = this.shareList.filter((share) => {
            return (!this.showOnlyActive) ? share.status === 5 : share.status !== 5;
        });

        this.panelDefs[0].data = this.filteredShareList;
        this._changeDetectorRef.markForCheck();
    }

    addForm(type) {
        switch (type) {
            case 'share':
                this._router.navigateByUrl('/product-module/fund-share/new');
                break;
            case 'fund':
                this._router.navigateByUrl('/product-module/fund/new');
                break;
            case 'ufund':
                this._router.navigateByUrl('/product-module/umbrella-fund/0');
                break;
        }
    }

    goToView(url, id) {
        this._router.navigateByUrl(`${url}${id}`);
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
        if (!formatString || !dateObj) {
            return false;
        }

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

    /**
     * ===============
     * Alert Functions
     * ===============
     */

    /**
     * Num Pad
     *
     * @param num
     * @returns {string}
     */
    private numPad(num) {
        return num < 10 ? '0' + num : num;
    }

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

}
