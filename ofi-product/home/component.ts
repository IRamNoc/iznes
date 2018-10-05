// Vendor
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { fromJS } from 'immutable';

import { NgRedux, select } from '@angular-redux/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
/* Services */
import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
/* Alert service. */
import { AlertsService } from '@setl/jaspero-ng2-alerts';
/* Utils. */
import { NumberConverterService, ConfirmationService } from '@setl/utils';
import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import * as FundShareModels from '@ofi/ofi-main/ofi-product/fund-share/models';
import {
    OfiManagementCompanyService,
} from '../../ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiCurrenciesService } from '../../ofi-req-services/ofi-currencies/service';
import { Observable, Subscription, combineLatest as observableCombineLatest } from 'rxjs';

/* Models */

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-home',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductHomeComponent implements OnInit, OnDestroy {
    /* Public properties. */
    amManagementCompany = '';
    fundList = [];
    shareList = [];
    umbrellaFundList = [];
    filteredShareList = [];
    managementCompanyAccessList = [];
    draftList = [];
    showOnlyActive = true;

    fundCurrencyItems = [];
    countryItems = [];
    legalFormItems = [];

    columns = {
        shareName: {
            label: 'Share name',
            dataSource: 'shareName',
            sortable: true,
        },
        shareCurrency: {
            label: 'Share currency',
            dataSource: 'shareCurrency',
            sortable: true,
        },
        fundName: {
            label: 'Fund name',
            dataSource: 'fundName',
            sortable: true,
        },
        fFundName: {
            label: 'Fund name',
            dataSource: 'fundName',
            sortable: true,
        },
        isin: {
            label: 'ISIN',
            dataSource: 'isin',
            sortable: true,
        },
        managementCompany: {
            label: 'Management company',
            dataSource: 'managementCompany',
            sortable: true,
        },
        shareClass: {
            label: 'Share Class',
            dataSource: 'shareClass',
            sortable: true,
        },
        status: {
            label: 'Status (close or open?)',
            dataSource: 'status',
            sortable: true,
        },
        lei: {
            label: 'LEI',
            dataSource: 'legalEntityIdentifier',
            sortable: true,
        },
        country: {
            label: 'Domicile',
            dataSource: 'domicile',
            sortable: true,
        },
        lawStatus: {
            label: 'Legal Form',
            dataSource: 'lawStatus',
            sortable: true,
        },
        umbrellaFund: {
            label: 'Umbrella fund',
            dataSource: 'umbrellaFundName',
            sortable: true,
        },
        fundCurrency: {
            label: 'Fund currency',
            dataSource: 'fundCurrency',
            sortable: true,
        },
        uFundName: {
            label: 'Umbrella fund name',
            dataSource: 'umbrellaFundName',
            sortable: true,
        },
        waitingStatus: {
            label: 'Status',
            dataSource: 'waitingStatus',
            sortable: true,
        },
        waitingType: {
            label: 'Type',
            dataSource: 'waitingType',
            sortable: true,
        },
        productName: {
            label: 'Product name',
            dataSource: 'productName',
            sortable: true,
        },
        dateModification: {
            label: 'Date of modification',
            dataSource: 'dateModification',
            sortable: true,
        },
        validateFor: {
            label: 'To be validate for (date)',
            dataSource: 'validateFor',
            sortable: true,
        },
        modifiedBy: {
            label: 'Modified by',
            dataSource: 'modifiedBy',
            sortable: true,
        },
        draftType: {
            label: 'Product Type',
            dataSource: 'draftType',
            sortable: true,
        },
        draftName: {
            label: 'Product Name',
            dataSource: 'draftName',
            sortable: true,
        },
        draftCreated: {
            label: 'Created By',
            dataSource: 'draftCreated',
            sortable: true,
        },
        draftDate: {
            label: 'Created Date',
            dataSource: 'draftDate',
            sortable: true,
        },
    };
    panelDefs = [
        {
            title: 'Umbrella funds',
            columns: [
                this.columns['uFundName'],
                this.columns['lei'],
                this.columns['managementCompany'],
                this.columns['country'],
            ],
            action: {
                id: 'new-umbrella-fund-btn',
                title: 'Add new Umbrella fund',
                icon: 'plus',
                type: 'ufund',
            },
            link: '/product-module/product/umbrella-fund/',
            linkIdent: 'umbrellaFundID',
            open: true,
            data: this.umbrellaFundList,
            count: this.umbrellaFundList.length,
            columnLink: 'umbrellaFundName',
        },
        {
            title: 'Funds/Subfunds',
            columns: [
                this.columns['fFundName'],
                this.columns['lei'],
                this.columns['fundCurrency'],
                this.columns['managementCompany'],
                this.columns['country'],
                this.columns['lawStatus'],
                this.columns['umbrellaFund'],
            ],
            action: {
                id: 'new-fund-btn',
                title: 'Add new Fund',
                icon: 'plus',
                type: 'fund',
            },
            link: '/product-module/product/fund/',
            linkIdent: 'fundID',
            open: true,
            data: this.fundList,
            count: this.fundList.length,
            columnLink: 'fundName',
        },
        {
            title: 'Shares',
            columns: [
                this.columns['shareName'],
                this.columns['isin'],
                this.columns['fundName'],
                this.columns['shareCurrency'],
                this.columns['managementCompany'],
                // this.columns['uFundName'],
                this.columns['shareClass'],
                this.columns['status'],
            ],
            action: {
                id: 'new-share-btn',
                title: 'Add new Share',
                icon: 'plus',
                type: 'share',
            },
            link: '/product-module/product/fund-share/',
            linkIdent: 'fundShareID',
            open: true,
            data: this.filteredShareList,
            count: this.filteredShareList.length,
            columnLink: 'shareName',
        },
        {
            title: 'Drafts',
            columns: [
                this.columns['draftType'],
                this.columns['draftName'],
                this.columns['draftCreated'],
                this.columns['draftDate']
            ],
            open: true,
            data: this.draftList,
            count: this.draftList.length,
            columnLink: '',
            buttons: [
                {
                    text: 'Edit Draft',
                    class: 'btn btn-success btn-sm no-margin',
                    click: 'edit',
                    iconClass: 'fa fa-edit',
                },
                {
                    text: 'Delete Draft',
                    class: 'btn btn-danger btn-sm',
                    click: 'delete',
                    iconClass: 'fa fa-remove',
                },
            ],
        },
    ];

    /* Private properties. */
    subscriptions: Array<Subscription> = [];

    /* Redux observables. */
    @select(['user', 'myDetail']) userDetailObs;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'requestedIznesShare']) requestedShareListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) shareListObs;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaFundAccessListOb;
    @select([
        'ofi',
        'ofiProduct',
        'ofiManagementCompany',
        'managementCompanyList',
        'managementCompanyList',
    ]) managementCompanyAccessListOb;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currenciesObs;

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
                private _confirmationService: ConfirmationService,
                @Inject('product-config') productConfig,
                private ofiCurrenciesService: OfiCurrenciesService) {

        this.countryItems = productConfig.fundItems.domicileItems;
        this.legalFormItems = productConfig.fundItems.fundLegalFormItems;

        this.showOnlyActive = !this.showOnlyActive;
    }

    ngOnInit() {
        this.ofiCurrenciesService.getCurrencyList();
        this.ofiManagementCompanyService.getManagementCompanyList();
        this._ofiUmbrellaFundService.fetchUmbrellaList();
        this._ofiFundService.getFundList();

        this.subscriptions.push(this.currenciesObs.subscribe(c => this.getCurrencyList(c)));
        this.subscriptions.push(this.managementCompanyAccessListOb
        .subscribe(d => this.managementCompanyAccessList = d));
        this.subscriptions.push(this.userDetailObs
        .subscribe(userDetail => this.amManagementCompany = userDetail.companyName));
        this.subscriptions.push(this.fundListObs.subscribe(funds => this.getFundList(funds)));
        this.subscriptions.push(this.requestedShareListObs.subscribe(requested => this.requestShareList(requested)));
        this.subscriptions.push(this.shareListObs.subscribe(shares => this.getShareList(shares)));
        this.subscriptions.push(this.umbrellaFundAccessListOb.subscribe((list: any) => this.getUmbrellaFundList(list)));

        //drafts
        this.subscriptions.push(
            observableCombineLatest(this.fundListObs, this.shareListObs, this.umbrellaFundAccessListOb).subscribe(([fundList, shareList, umbrellaList]) => {
                this.getDrafts(fundList, shareList, umbrellaList);
            })
        );

        OfiFundShareService.defaultRequestIznesShareList(this._ofiFundShareService, this._ngRedux);
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    getFundList(funds: any): void {
        const fundList = [];
        if (_.values(funds).length > 0) {
            _.values(funds).map((fund) => {
                if (fund.draft == 0) {

                    const domicile = _.find(this.countryItems, { id: fund.domicile }) || { text: '' };
                    const lawStatus = _.find(this.legalFormItems, { id: fund.legalForm }) || { text: '' };
                    const fundCurrency = this.fundCurrencyItems.find(p => p.id === Number(fund.fundCurrency));

                    fundList.push({
                        fundID: fund.fundID,
                        fundName: fund.fundName,
                        legalEntityIdentifier: fund.legalEntityIdentifier || 'N/A',
                        managementCompany: _.get(
                            this.managementCompanyAccessList,
                            [fund.managementCompanyID, 'companyName'],
                            '',
                        ),
                        domicile: domicile.text,
                        lawStatus: lawStatus.text,
                        umbrellaFundName: fund.umbrellaFundName,
                        fundCurrency: (fundCurrency) ? fundCurrency.text : '',
                    });
                }

            });

        }

        this.fundList = _.orderBy(fundList, ['fundID'], ['desc']);
        this.panelDefs[1].data = this.fundList;
        this.panelDefs[1].count = this.fundList.length;
        this._changeDetectorRef.markForCheck();
    }

    requestShareList(requested): void {
        if (!requested) {
            OfiFundShareService.defaultRequestIznesShareList(this._ofiFundShareService, this._ngRedux);
        }
    }

    getShareList(shares): void {
        const shareList = [];

        if ((shares !== undefined) && Object.keys(shares).length > 0) {
            Object.keys(shares).map((key) => {
                if (shares[key].draft == 0) {
                    const share = shares[key];
                    const keyFactsStatus = new FundShareModels.ShareKeyFactsStatus();
                    const status = _.find(keyFactsStatus.shareClassInvestmentStatus.listItems, (item) => {
                        return item.id === share.shareClassInvestmentStatus;
                    }).text;

                    const shareCurrency = this.fundCurrencyItems.find(p => p.id === share.shareClassCurrency);

                    if (share.draft == 0) {
                        shareList.push({
                            fundShareID: share.fundShareID,
                            shareName: share.fundShareName,
                            fundName: share.fundName,
                            isin: share.isin,
                            managementCompany: share.managementCompanyName,
                            shareClass: share.shareClassCode,
                            status,
                            shareCurrency: (shareCurrency) ? shareCurrency.text : '',
                            umbrellaFundName: this.getUmbrellaFundName(share.umbrellaFundID),
                        });
                    }
                }
            });
        }

        this.shareList = shareList;
        this.filteredShareList = this.shareList;

        this.panelDefs[2].data = this.filteredShareList;
        this.panelDefs[2].count = this.filteredShareList.length;
        this._changeDetectorRef.markForCheck();
    }

    getUmbrellaFundList(umbrellaFunds) {
        const data = fromJS(umbrellaFunds).toArray();
        const umbrellaFundList = [];

        if (data.length > 0) {
            data.map((item) => {
                if (item.get('draft') == 0) {
                    const domicile = _.find(this.countryItems, { id: item.get('domicile') }) || { text: '' };

                    umbrellaFundList.push({
                        umbrellaFundID: item.get('umbrellaFundID', 0),
                        umbrellaFundName: item.get('umbrellaFundName', ''),
                        registerOffice: item.get('registerOffice', ''),
                        registerOfficeAddress: item.get('registerOfficeAddress', ''),
                        registerOfficeAddress2: item.get('registerOfficeAddress2', ''),
                        legalEntityIdentifier: item.get('legalEntityIdentifier', 0) || 'N/A',
                        domicile: domicile.text,
                        umbrellaFundCreationDate: item.get('umbrellaFundCreationDate', ''),
                        managementCompany: _.get(
                            this.managementCompanyAccessList,
                            [item.get('managementCompanyID', 0), 'companyName'],
                            '',
                        ),
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
                }
            });
        }

        this.umbrellaFundList = _.orderBy(umbrellaFundList, ['umbrellaFundID'], ['desc']);
        this.panelDefs[0].data = this.umbrellaFundList;
        this.panelDefs[0].count = this.umbrellaFundList.length;
        this._changeDetectorRef.markForCheck();
    }

    getDrafts(fundList, shareList, umbrellaList) {
        this.draftList = [];

        let data1 = fromJS(umbrellaList).toArray();
        if (data1.length > 0) {
            data1.map((item) => {
                if (item.get('draft') == 1) {
                    let name = item.get('umbrellaFundName', '');
                    this.draftList.push({
                        draftID: item.get('umbrellaFundID', 0),
                        draftType: 'Umbrella Fund',
                        draftName: (name != '' ? name : '[unnamed umbrella fund]'),
                        draftCreated: item.get('draftUser', ''),
                        draftDate: item.get('draftDate', '')
                    });
                }
            });
        }

        let data2 = fromJS(fundList).toArray();
        if (data2.length > 0) {
            data2.map((item) => {
                if (item.get('draft') == 1) {
                    let name = item.get('fundName', '');
                    this.draftList.push({
                        draftID: item.get('fundID', 0),
                        draftType: 'Fund',
                        draftName: (name != '' ? name : '[unnamed fund]'),
                        draftCreated: item.get('draftUser', ''),
                        draftDate: item.get('draftDate', '')
                    });
                }
            });
        }

        let data3 = fromJS(shareList).toArray();
        if (data3.length > 0) {
            data3.map((item) => {
                if (item.get('draft') == 1) {
                    let name = item.get('fundShareName', '');
                    this.draftList.push({
                        draftID: item.get('fundShareID', 0),
                        draftType: 'Share',
                        draftName: (name != '' ? name : '[unnamed share]'),
                        draftCreated: item.get('draftUser', ''),
                        draftDate: item.get('draftDate', '')
                    });
                }
            });
        }

        this.panelDefs[3].data = this.draftList;
        this.panelDefs[3].count = this.draftList.length;
        this._changeDetectorRef.markForCheck();
    }

    varBtn(btnType, dataType, id) {
        let temp = {
            'Umbrella Fund': 'umbrella-fund',
            'Fund': 'fund',
            'Share': 'fund-share',
        };

        if (btnType == 'edit') {
            this._router.navigateByUrl('/product-module/product/' + temp[dataType] + '/' + id);
        } else if (btnType == 'delete') {

            this._confirmationService.create('Draft Delete', 'Are you sure you want to delete this ' + dataType + ' draft?', {
                confirmText: 'Confirm Delete',
                declineText: 'Cancel',
                btnClass: 'error'
            }).subscribe((ans) => {
                if (ans.resolved) {
                    this.draftList.splice(this.draftList.findIndex((draft) => draft.draftID == id && draft.draftType == dataType), 1);
                    if (dataType == 'Umbrella Fund') {
                        this._ofiUmbrellaFundService.iznDeleteUmbrellaDraft(this._ofiUmbrellaFundService, this._ngRedux, id);
                        this._ofiUmbrellaFundService.fetchUmbrellaList();
                    }
                    if (dataType == 'Fund') {
                        this._ofiFundService.iznDeleteFundDraft(this._ofiFundService, this._ngRedux, id);
                        this._ofiFundService.fetchFundList();
                    }
                    if (dataType == 'Share') {
                        this._ofiFundShareService.iznDeleteShareDraft(this._ofiFundShareService, this._ngRedux, id);
                        OfiFundShareService.defaultRequestIznesShareList(this._ofiFundShareService, this._ngRedux);
                    }
                }
            });
        }
    }

    getCurrencyList(data) {
        if (data) {
            this.fundCurrencyItems = data.toJS();
        }
    }

    handleShareToggleClick() {
        this.showOnlyActive = !this.showOnlyActive;
        this.filteredShareList = this.shareList.filter((share) => {
            return (this.showOnlyActive) ? share.status !== 'Closed for subscription and redemption' : share.status;
        });

        this.panelDefs[2].data = this.filteredShareList;
        this.panelDefs[2].count = this.filteredShareList.length;
        this._changeDetectorRef.markForCheck();
    }

    addForm(type) {
        switch (type) {
        case 'share':
            this._router.navigateByUrl('/product-module/product/fund-share/new');
            break;
        case 'fund':
            this._router.navigateByUrl('/product-module/product/fund/new');
            break;
        case 'ufund':
            this._router.navigateByUrl('/product-module/product/umbrella-fund/new');
            break;
        }
    }

    getUmbrellaFundName(id) {
        if (id && id !== 0 && id !== null) {
            if (this.umbrellaFundList.length > 0) {
                const obj = this.umbrellaFundList.find(o => o.umbrellaFundID === id);
                if (obj !== undefined) {
                    return obj.umbrellaFundName;
                }
                return '';
            }
        } else {
            return '';
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
