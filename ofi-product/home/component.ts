// Vendor
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';

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
import { MultilingualService } from '@setl/multilingual';

const AM_USERTYPE = 36;

/* Models */

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-home',
    templateUrl: './component.html',
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

    columns = {};
    panelDefs = [];

    /* Private properties. */
    subscriptions: Array<Subscription> = [];
    private usertype: number;

    /* Redux observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageOb;
    @select(['user', 'myDetail']) userDetailObs;
    @select(['user', 'myDetail', 'userType']) usertype$;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'requestedIznesShare']) requestedShareListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) shareListObs;

    /* For IZNES Admins */
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'requested']) requestedFundShareObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) fundShareObs;

    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaFundAccessListOb;
    @select([
        'ofi',
        'ofiProduct',
        'ofiManagementCompany',
        'managementCompanyList',
        'managementCompanyList',
    ]) managementCompanyAccessListOb;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currenciesObs;

    constructor(private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private route: ActivatedRoute,
                private router: Router,
                private numberConverterService: NumberConverterService,
                private ofiFundService: OfiFundService,
                private ofiFundShareService: OfiFundShareService,
                private ofiUmbrellaFundService: OfiUmbrellaFundService,
                private ofiManagementCompanyService: OfiManagementCompanyService,
                private confirmationService: ConfirmationService,
                @Inject('product-config') productConfig,
                private ofiCurrenciesService: OfiCurrenciesService,
                public translate: MultilingualService,
    ) {
        this.countryItems = productConfig.fundItems.domicileItems;
        this.legalFormItems = productConfig.fundItems.fundLegalFormItems;
        this.showOnlyActive = !this.showOnlyActive;
    }

    ngOnInit() {
        this.initColumns();
        this.initPanelDefs();

        this.subscriptions.push(this.usertype$.subscribe((usertype) => {
            this.usertype = usertype;
        }));
        this.subscriptions.push(this.currenciesObs.subscribe(c => this.getCurrencyList(c)));
        this.subscriptions.push(this.managementCompanyAccessListOb
        .subscribe(d => this.managementCompanyAccessList = d));
        this.subscriptions.push(this.userDetailObs
        .subscribe(userDetail => this.amManagementCompany = userDetail.companyName));
        this.subscriptions.push(this.fundListObs.subscribe(funds => this.getFundList(funds)));
        this.subscriptions.push(this.requestedShareListObs.subscribe(requested => this.requestShareList(requested)));
        this.subscriptions.push(this.shareListObs.subscribe(shares => this.getShareList(shares)));

        this.subscriptions.push(this.umbrellaFundAccessListOb.subscribe((list: any) => this.getUmbrellaFundList(list)));
        this.subscriptions.push(this.requestLanguageOb.subscribe(() => {
            this.initColumns();
            this.initPanelDefs();
        }));

        /* For IZNES Admins */
        if (!this.isAssetManager()) {
            this.subscriptions.push(this.requestedFundShareObs.subscribe(requested => this.requestShareList(requested)));
            this.subscriptions.push(this.fundShareObs.subscribe(shares => this.getShareList(shares)));
        } else {
            // Drafts
            this.subscriptions.push(
                observableCombineLatest(this.fundListObs, this.shareListObs, this.umbrellaFundAccessListOb).subscribe(([fundList, shareList, umbrellaList]) => {
                    this.getDrafts(fundList, shareList, umbrellaList);
                }),
            );
        }

        this.ofiCurrenciesService.getCurrencyList();

        /* For IZNES Admins */
        if (!this.isAssetManager()) {
            this.ofiUmbrellaFundService.getAdminUmbrellaList();
            this.ofiFundService.getAdminFundList();
        } else {
            OfiFundShareService.defaultRequestIznesShareList(this.ofiFundShareService, this.ngRedux);
            this.ofiManagementCompanyService.getManagementCompanyList();
            this.ofiUmbrellaFundService.fetchUmbrellaList();
            this.ofiFundService.getFundList();
        }
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    /**
     * Check if the user is an IZNES Admin
     *
     * @return {boolean}
     */
    isAssetManager(): boolean {
        return this.usertype === AM_USERTYPE;
    }

    /**
     * Populate the Fund list
     *
     * @param {object} funds
     * @return {void}
     */
    getFundList(funds: any): void {
        const fundList = [];

        if (_.values(funds).length > 0) {
            _.values(funds).map((fund) => {
                if (Number(fund.draft) === 0) {
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
                            fund.companyName,
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
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Request the Share list
     *
     * @return {void}
     */
    requestShareList(requested): void {
        if (!requested) {
            if (this.isAssetManager()) {
                OfiFundShareService.defaultRequestIznesShareList(this.ofiFundShareService, this.ngRedux);
            } else {
                this.ofiFundShareService.fetchIznesAdminShareList();
            }
        }
    }

    /**
     * Populate the Share list
     *
     * @param {object} shares
     * @return {void}
     */
    getShareList(shares): void {
        const shareList = [];

        if ((shares !== undefined) && Object.keys(shares).length > 0) {
            Object.keys(shares).map((key) => {
                if (Number(shares[key].draft) === 0) {
                    const share = shares[key];
                    const keyFactsStatus = new FundShareModels.ShareKeyFactsStatus();
                    const status = _.find(keyFactsStatus.shareClassInvestmentStatus.listItems, (item) => {
                        return item.id === share.shareClassInvestmentStatus;
                    }).text;

                    const shareCurrency = this.fundCurrencyItems.find(p => p.id === share.shareClassCurrency);

                    if (Number(share.draft) === 0) {
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
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Populate the Umbrella Fund list
     *
     * @param {object} umbrellaList
     * @return {void}
     */
    getUmbrellaFundList(umbrellaFunds): void {
        const data = fromJS(umbrellaFunds).toArray();
        const umbrellaFundList = [];

        if (data.length > 0) {
            data.map((item) => {
                if (Number(item.get('draft')) === 0) {
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
                            item.get('companyName', ''),
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
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Get drafts for Umbrella Funds, Funds, and Shares
     *
     * @param {object} fundList
     * @param {object} shareList
     * @param {object} umbrellaList
     * @return {void}
     */
    getDrafts(fundList, shareList, umbrellaList): void {
        this.draftList = [];

        const data1 = fromJS(umbrellaList).toArray();
        if (data1.length > 0) {
            data1.map((item) => {
                if (Number(item.get('draft')) === 1) {
                    const name = item.get('umbrellaFundName', '');
                    this.draftList.push({
                        draftID: item.get('umbrellaFundID', 0),
                        draftType: 'Umbrella Fund',
                        draftName: (name !== '' ? name : '[unnamed umbrella fund]'),
                        draftCreated: item.get('draftUser', ''),
                        draftDate: item.get('draftDate', ''),
                    });
                }
            });
        }

        const data2 = fromJS(fundList).toArray();
        if (data2.length > 0) {
            data2.map((item) => {
                if (Number(item.get('draft')) === 1) {
                    const name = item.get('fundName', '');
                    this.draftList.push({
                        draftID: item.get('fundID', 0),
                        draftType: 'Fund',
                        draftName: (name !== '' ? name : '[unnamed fund]'),
                        draftCreated: item.get('draftUser', ''),
                        draftDate: item.get('draftDate', ''),
                    });
                }
            });
        }

        const data3 = fromJS(shareList).toArray();
        if (data3.length > 0) {
            data3.map((item) => {
                if (Number(item.get('draft')) === 1) {
                    const name = item.get('fundShareName', '');
                    this.draftList.push({
                        draftID: item.get('fundShareID', 0),
                        draftType: 'Share',
                        draftName: (name !== '' ? name : '[unnamed share]'),
                        draftCreated: item.get('draftUser', ''),
                        draftDate: item.get('draftDate', ''),
                    });
                }
            });
        }

        this.panelDefs[3].data = this.draftList;
        this.panelDefs[3].count = this.draftList.length;

        this.changeDetectorRef.markForCheck();
    }

    /**
     * Handle Edit and Delete button clicks
     *
     * @param {string} btnType - edit or delete
     * @param {string} dataType - Umbrella Fund, Fund or Share
     * @param {string} id - id of the Umbrella Fund, Fund or Share
     * @return {void}
     */
    varBtn(btnType, dataType, id): void {
        const temp = {
            'Umbrella Fund': 'umbrella-fund',
            Fund: 'fund',
            Share: 'fund-share',
        };

        if (String(btnType) === 'edit') {
            this.router.navigateByUrl('/product-module/product/' + temp[dataType] + '/' + id);
        } else if (String(btnType) === 'delete') {

            this.confirmationService.create(
                'Draft Delete',
                this.translate.translate('Are you sure you want to delete this @dataType@ draft?', { 'dataType': dataType }),
                {
                    confirmText: this.translate.translate('Confirm Delete'),
                    declineText: this.translate.translate('Cancel'),
                    btnClass: 'error',
                },
            ).subscribe((ans) => {
                if (ans.resolved) {
                    this.draftList.splice(this.draftList.findIndex(draft => draft.draftID === id && draft.draftType === dataType), 1);
                    if (String(dataType) === 'Umbrella Fund') {
                        this.ofiUmbrellaFundService.deleteUmbrellaDraft(id).then(this.ofiUmbrellaFundService.fetchUmbrellaList.bind(this.ofiUmbrellaFundService));
                    }
                    if (String(dataType) === 'Fund') {
                        this.ofiFundService.deleteFundDraft(id).then(this.ofiFundService.fetchFundList.bind(this.ofiFundService));
                    }
                    if (String(dataType) === 'Share') {
                        this.ofiFundShareService.deleteShareDraft(id).then(() => OfiFundShareService.defaultRequestIznesShareList(this.ofiFundShareService, this.ngRedux));
                    }
                }
            });
        }
    }

    /**
     * Get the currencies list
     *
     * @param {object} data - the raw data to convert
     * @return {void}
     */
    getCurrencyList(data): void {
        if (data) {
            this.fundCurrencyItems = data.toJS();
        }
    }

    /**
     * Toggle the display of only active shares
     *
     * @return {void}
     */
    handleShareToggleClick(): void {
        this.showOnlyActive = !this.showOnlyActive;
        this.filteredShareList = this.shareList.filter((share) => {
            return (this.showOnlyActive) ? share.status !== 'Closed for subscription and redemption' : share.status;
        });

        this.panelDefs[2].data = this.filteredShareList;
        this.panelDefs[2].count = this.filteredShareList.length;
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Redirect to an add new Umbrella Fund, Fund or Share page
     *
     * @param {string} type - Umbrella Fund, Fund or Share
     * @return {void}
     */
    addForm(type): void {
        switch (type) {
            case 'share':
                this.router.navigateByUrl('/product-module/product/fund-share/new');
                break;
            case 'fund':
                this.router.navigateByUrl('/product-module/product/fund/new');
                break;
            case 'ufund':
                this.router.navigateByUrl('/product-module/product/umbrella-fund/new');
                break;
        }
    }

    /**
     * Get an Umbrella Fund name
     *
     * @param {number} id
     * @return {string}
     */
    getUmbrellaFundName(id): string {
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

    /**
     * Redirect to the given URL
     *
     * @param {string} url
     * @param {string} id
     * @return {void}
     */
    goToView(url, id): void {
        this.router.navigateByUrl(`${url}${id}`);
    }

    /**
     * Intialise datagrid columns
     *
     * @return {void}
     */
    initColumns(): void {
        this.columns = {
            shareName: {
                label: this.translate.translate('Share Name'),
                dataSource: 'shareName',
                sortable: true,
            },
            shareCurrency: {
                label: this.translate.translate('Share Currency'),
                dataSource: 'shareCurrency',
                sortable: true,
            },
            fundName: {
                label: this.translate.translate('Fund Name'),
                dataSource: 'fundName',
                sortable: true,
            },
            fFundName: {
                label: this.translate.translate('Fund Name'),
                dataSource: 'fundName',
                sortable: true,
            },
            isin: {
                label: this.translate.translate('ISIN'),
                dataSource: 'isin',
                sortable: true,
            },
            managementCompany: {
                label: this.translate.translate('Management Company'),
                dataSource: 'managementCompany',
                sortable: true,
            },
            shareClass: {
                label: this.translate.translate('Share Class'),
                dataSource: 'shareClass',
                sortable: true,
            },
            status: {
                label: this.translate.translate('Status (Close or Open?)'),
                dataSource: 'status',
                sortable: true,
            },
            lei: {
                label: this.translate.translate('LEI'),
                dataSource: 'legalEntityIdentifier',
                sortable: true,
            },
            country: {
                label: this.translate.translate('Domicile'),
                dataSource: 'domicile',
                sortable: true,
            },
            lawStatus: {
                label: this.translate.translate('Legal Form'),
                dataSource: 'lawStatus',
                sortable: true,
            },
            umbrellaFund: {
                label: this.translate.translate('Umbrella Fund'),
                dataSource: 'umbrellaFundName',
                sortable: true,
            },
            fundCurrency: {
                label: this.translate.translate('Fund Currency'),
                dataSource: 'fundCurrency',
                sortable: true,
            },
            uFundName: {
                label: this.translate.translate('Umbrella Fund Name'),
                dataSource: 'umbrellaFundName',
                sortable: true,
            },
            waitingStatus: {
                label: this.translate.translate('Status'),
                dataSource: 'waitingStatus',
                sortable: true,
            },
            waitingType: {
                label: this.translate.translate('Type'),
                dataSource: 'waitingType',
                sortable: true,
            },
            productName: {
                label: this.translate.translate('Product Name'),
                dataSource: 'productName',
                sortable: true,
            },
            dateModification: {
                label: this.translate.translate('Date of Modification'),
                dataSource: 'dateModification',
                sortable: true,
            },
            validateFor: {
                label: this.translate.translate('To be validate for (date)'),
                dataSource: 'validateFor',
                sortable: true,
            },
            modifiedBy: {
                label: this.translate.translate('Modified By'),
                dataSource: 'modifiedBy',
                sortable: true,
            },
            draftType: {
                label: this.translate.translate('Product Type'),
                dataSource: 'draftType',
                sortable: true,
            },
            draftName: {
                label: this.translate.translate('Product Name'),
                dataSource: 'draftName',
                sortable: true,
            },
            draftCreated: {
                label: this.translate.translate('Created By'),
                dataSource: 'draftCreated',
                sortable: true,
            },
            draftDate: {
                label: this.translate.translate('Created Date'),
                dataSource: 'draftDate',
                sortable: true,
            },
        };
    }

    /**
     * Define panels and their datagrid columns
     *
     * @return {void}
     */
    initPanelDefs(): void {
        if (this.isAssetManager()) {
            this.panelDefs = [
                {
                    title: this.translate.translate('Umbrella Funds'),
                    columns: [
                        this.columns['uFundName'],
                        this.columns['lei'],
                        this.columns['managementCompany'],
                        this.columns['country'],
                    ],
                    action: {
                        id: 'new-umbrella-fund-btn',
                        title: this.translate.translate('Add New Umbrella Fund'),
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
                    title: this.translate.translate('Funds/Subfunds'),
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
                        title: this.translate.translate('Add New Fund'),
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
                    title: this.translate.translate('Shares'),
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
                        title: this.translate.translate('Add New Share'),
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
                    title: this.translate.translate('Drafts'),
                    columns: [
                        this.columns['draftType'],
                        this.columns['draftName'],
                        this.columns['draftCreated'],
                        this.columns['draftDate'],
                    ],
                    open: true,
                    data: this.draftList,
                    count: this.draftList.length,
                    columnLink: '',
                    buttons: [
                        {
                            text: this.translate.translate('Edit Draft'),
                            class: 'btn btn-success btn-sm no-margin',
                            click: 'edit',
                            iconClass: 'fa fa-edit',
                        },
                        {
                            text: this.translate.translate('Delete Draft'),
                            class: 'btn btn-danger btn-sm',
                            click: 'delete',
                            iconClass: 'fa fa-remove',
                        },
                    ],
                },
            ];
        }

        /* For IZNES Admins */
        if (!this.isAssetManager()) {
            this.panelDefs = [
                {
                    title: this.translate.translate('Umbrella Funds'),
                    columns: [
                        this.columns['managementCompany'],
                        this.columns['uFundName'],
                        this.columns['lei'],
                        this.columns['country'],
                    ],
                    action: {
                        id: 'new-umbrella-fund-btn',
                        title: this.translate.translate('Add New Umbrella Fund'),
                        icon: 'plus',
                        type: 'ufund',
                    },
                    link: '/admin-product-module/product/umbrella-fund/',
                    linkIdent: 'umbrellaFundID',
                    open: true,
                    data: this.umbrellaFundList,
                    count: this.umbrellaFundList.length,
                    columnLink: 'umbrellaFundName',
                },
                {
                    title: this.translate.translate('Funds/Subfunds'),
                    columns: [
                        this.columns['managementCompany'],
                        this.columns['fFundName'],
                        this.columns['lei'],
                        this.columns['fundCurrency'],
                        this.columns['country'],
                        this.columns['lawStatus'],
                        this.columns['umbrellaFund'],
                    ],
                    action: {
                        id: 'new-fund-btn',
                        title: this.translate.translate('Add New Fund'),
                        icon: 'plus',
                        type: 'fund',
                    },
                    link: '/admin-product-module/product/fund/',
                    linkIdent: 'fundID',
                    open: true,
                    data: this.fundList,
                    count: this.fundList.length,
                    columnLink: 'fundName',
                },
                {
                    title: this.translate.translate('Shares'),
                    columns: [
                        this.columns['managementCompany'],
                        this.columns['shareName'],
                        this.columns['isin'],
                        this.columns['fundName'],
                        this.columns['shareCurrency'],
                        // this.columns['uFundName'],
                        this.columns['shareClass'],
                        this.columns['status'],
                    ],
                    action: {
                        id: 'new-share-btn',
                        title: this.translate.translate('Add New Share'),
                        icon: 'plus',
                        type: 'share',
                    },
                    link: '/admin-product-module/product/fund-share/',
                    linkIdent: 'fundShareID',
                    open: true,
                    data: this.filteredShareList,
                    count: this.filteredShareList.length,
                    columnLink: 'shareName',
                },
            ];
        }
    }

    /**
     * Show a success popup
     *
     * @param {message} string - the string to be shown in the message.
     * @return {void}
     */
    showSuccess(message): void {
        /* Show the message. */
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
    private formatDate(formatString: string, dateObj: Date): string|boolean {
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
    private numPad(num): string {
        return num < 10 ? '0' + num : num;
    }

    /**
     * Show an error popup
     *
     * @param {message} string - the string to be shown in the message.
     * @return {void}
     */
    private showError(message): void {
        /* Show the error. */
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
     * Show a warning popup
     *
     * @param {message} string - the string to be shown in the message.
     * @return {void}
     */
    private showWarning(message): void {
        /* Show the error. */
        this.alertsService.create('warning', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-warning">${this.translate.translate(message)}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }
}
