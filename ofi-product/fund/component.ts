import {Component, Inject, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as _ from 'lodash';
import { NgRedux, select } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import {ConfirmationService} from '@setl/utils';

import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import { Fund } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service.model';
import { UmbrellaFundDetail } from '@ofi/ofi-main/ofi-store/ofi-product/umbrella-fund/umbrella-fund-list/model';
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import {MultilingualService} from '@setl/multilingual';

interface UmbrellaList {
    [key: string]: UmbrellaFundDetail;
}

interface FundList {
    [key: string]: any;
}

@Component({
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class FundComponent implements OnInit, OnDestroy {

    panels = {
        0: {
            open: false,
            0: {
                open: true,
            },
            1: {
                open: false,
            },
            2: {
                open: false,
            },
        },
        1: {
            open: true,
            0: {
                open: true,
            },
            1: {
                open: false,
            },
        },
    };

    viewMode = 'UMBRELLA';
    selectedUmbrella: number;
    param: string;

    // local copy of config
    fundItems: any;
    enums: any;
    validators: any;

    // local copy of the state
    umbrellaList: UmbrellaList;
    fundList: FundList;

    // select items
    domicileItems = [];
    umbrellaItems = [];
    typeOfEuDirectiveItems = [];
    UcitsVersionItems = [];
    legalFormItems = [];
    nationalNomenclatureOfLegalFormItems = [];
    homeCountryLegalTypeItems = [];
    fundCurrencyItems = [];
    portfolioCurrencyHedgeItems = [];
    investmentAdvisorItems = [];
    auditorItems = [];
    taxAuditorItems = [];
    legalAdvisorItems = [];
    capitalPreservationPeriodItems = [];
    fundAdministratorItems = [];
    custodianBankItems = [];
    investmentManagerItems = [];
    principalPromoterItems = [];
    payingAgentItems = [];
    managementCompanyItems = [];
    transferAgentItems = [];
    centralizingAgentItems = [];

    // Locale
    language = 'en';

    // forms
    umbrellaForm: FormGroup;
    umbrellaEditForm: FormGroup;
    fundForm: FormGroup;

    umbrellaControl: FormControl = new FormControl(null, Validators.required);

    // Datepicker config
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language
    };

    configMonth = {
        format: 'YYYY-MM',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language
    };

    @select(['user', 'siteSettings', 'language']) language$;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaFundList$;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyAccessList$;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currencyList$;

    unSubscribe: Subject<any> = new Subject();

    currentRoute: {
        fromShare? : boolean
    } = {};

    constructor(
        private router: Router,
        private location: Location,
        private fb: FormBuilder,
        private fundService: OfiFundService,
        private umbrellaService: OfiUmbrellaFundService,
        private ofiManagementCompanyService: OfiManagementCompanyService,
        private ofiCurrenciesService: OfiCurrenciesService,
        private ngRedux: NgRedux<any>,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private changeDetectorRef : ChangeDetectorRef,
        private confirmationService : ConfirmationService,
        public _translate: MultilingualService,
        @Inject('product-config') productConfig,
    ) {


        OfiUmbrellaFundService.defaultRequestUmbrellaFundList(umbrellaService, ngRedux);
        OfiManagementCompanyService.defaultRequestManagementCompanyList(this.ofiManagementCompanyService, this.ngRedux);
        this.ofiCurrenciesService.getCurrencyList();

        this.fundItems = productConfig.fundItems;
        this.enums = productConfig.enums;
        this.validators = productConfig.validators;

        this.domicileItems = this.fundItems.domicileItems;
        this.umbrellaItems = this.fundItems.umbrellaItems;
        this.typeOfEuDirectiveItems = this.fundItems.typeOfEuDirectiveItems;
        this.UcitsVersionItems = this.fundItems.UCITSVersionItems;
        this.legalFormItems = this.fundItems.fundLegalFormItems;
        this.portfolioCurrencyHedgeItems = this.fundItems.portfolioCurrencyHedgeItems;
        this.investmentAdvisorItems = this.fundItems.investmentAdvisorItems;
        this.auditorItems = this.fundItems.auditorItems;
        this.taxAuditorItems = this.fundItems.taxAuditorItems;
        this.legalAdvisorItems = this.fundItems.legalAdvisorItems;
        this.capitalPreservationPeriodItems = this.fundItems.capitalPreservationPeriodItems;
        this.fundAdministratorItems = this.fundItems.fundAdministratorItems;
        this.custodianBankItems = this.fundItems.custodianBankItems;
        this.investmentManagerItems = this.fundItems.investmentManagerItems;
        this.principalPromoterItems = this.fundItems.principalPromoterItems;
        this.payingAgentItems = this.fundItems.payingAgentItems;
        this.transferAgentItems = this.fundItems.transferAgentItems;
        this.centralizingAgentItems = this.fundItems.centralizingAgentItems;

        this.language$
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                this.language = d.substr(0, 2);
                this.configDate = {
                    ...this.configDate,
                    locale: this.language,
                };
                this.configMonth = {
                    ...this.configMonth,
                    locale: this.language,
                };
            });

        this.umbrellaForm = fb.group({
            'umbrellaFundName': { value: 'nem', disabled: true },
            'umbrellaLei': { value: 'lei', disabled: true },
            'umbrellaFundDomicile': { value: 'dom', disabled: true },
        });

        this.umbrellaEditForm = fb.group({
            'umbrellaEditLei': { value: '', disabled: true },
            'umbrellaEditFundDomicile': { value: '', disabled: true },
            'auditorID': { value: '', disabled: true },
            'centralisingAgentID': { value: '', disabled: true },
            'custodianBankID': { value: '', disabled: true },
            'delegatedManagementCompanyID': { value: '', disabled: true },
            'directors': { value: '', disabled: true },
            'domicile': { value: '', disabled: true },
            'fundAdministratorID': { value: '', disabled: true },
            'giin': { value: '', disabled: true },
            'investmentAdvisorID': { value: '', disabled: true },
            'legalAdvisorID': { value: '', disabled: true },
            'legalEntityIdentifier': { value: '', disabled: true },
            'managementCompanyID': { value: '', disabled: true },
            'payingAgentID': { value: '', disabled: true },
            'principlePromoterID': { value: '', disabled: true },
            'registerOffice': { value: '', disabled: true },
            'registerOfficeAddress': { value: '', disabled: true },
            'taxAuditorID': { value: '', disabled: true },
            'transferAgentID': { value: '', disabled: true },
            'umbrellaFundCreationDate': { value: '', disabled: true },
            'umbrellaFundID': { value: '', disabled: true },
            'umbrellaFundName': { value: '', disabled: true },
            'internalReference': { value: '', disabled: true },
            'additionnalNotes': { value: '', disabled: true },

        });

        this.fundForm = fb.group({
            'isFundStructure': { value: '', disabled: true },
            'fundName': [null, Validators.compose([Validators.required, this.validators.alphanumeric])],
            'legalEntityIdentifier': [null, this.validators.lei],
            'registerOffice': [null, Validators.compose([this.validators.alphanumeric])],
            'registerOfficeAddress': [null, Validators.compose([this.validators.alphanumeric])],
            'domicile': [[], Validators.required],
            'isEuDirective': [null, Validators.required],
            'typeOfEuDirective': [[]],
            'UcitsVersion': [[]],
            'legalForm': [[], Validators.required],
            'nationalNomenclatureOfLegalForm': [[], Validators.required],
            'homeCountryLegalType': [[]],
            'fundCreationDate': [null, this.validators.date.day],
            'fundLaunchate': [null, this.validators.date.day],
            'fundCurrency': [[], Validators.required],
            'openOrCloseEnded': [null, Validators.required],
            'fiscalYearEnd': [null, Validators.compose([Validators.required, this.validators.date.month])],
            'isFundOfFund': [null, Validators.required],
            'managementCompanyID': [[], Validators.required],
            'fundAdministrator': [[], Validators.required],
            'custodianBank': [[], Validators.required],
            'investmentManager': [[]],
            'principalPromoter': [[]],
            'payingAgent': [[]],
            'fundManagers': [null, Validators.compose([this.validators.alphanumeric])],
            'transferAgent': [[]],
            'centralizingAgent': [[]],
            'isDedicatedFund': [null, Validators.required],
            'portfolioCurrencyHedge': [[], Validators.required],

            'globalItermediaryIdentification': [null, this.validators.giin],
            'delegatedManagementCompany': [[]],
            'investmentAdvisor': [[]],
            'auditor': [[]],
            'taxAuditor': [[]],
            'legalAdvisor': [[]],
            'directors': [null],
            'hasEmbeddedDirective': [null],
            'hasCapitalPreservation': [null],
            'capitalPreservationLevel': [null, Validators.compose([
                Validators.min(0),
                Validators.max(100),
            ])],
            'capitalPreservationPeriod': [null],
            'hasCppi': [null],
            'cppiMultiplier': [null],
            'hasHedgeFundStrategy': [null],
            'isLeveraged': [null],
            'has130Or30Strategy': [null],
            'isFundTargetingEos': [null],
            'isFundTargetingSri': [null],
            'isPassiveFund': [null],
            'hasSecurityiesLending': [null],
            'hasSwap': [null],
            'hasDurationHedge': [null],
            'investmentObjective': [null],
            'internalReference': ['', this.validators.internalReference],
            'additionnalNotes': ['', this.validators.additionnalNotes],
        });

        this.umbrellaForm.addControl('umbrellaFund', this.umbrellaControl);
        this.umbrellaEditForm.addControl('umbrellaFund', this.umbrellaControl);
        this.umbrellaForm.addControl('umbrellaFundID', this.umbrellaControl);

        this.umbrellaControl.valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (!d.length) {
                    this.selectedUmbrella = null;
                    return;
                } else if (d[0].id === '0') {
                    this.umbrellaForm.controls['umbrellaFundName'].setValue('');
                    this.umbrellaForm.controls['umbrellaLei'].setValue('');
                    this.umbrellaForm.controls['umbrellaFundDomicile'].setValue('');

                    this.umbrellaEditForm.controls['umbrellaEditLei'].setValue('');
                    this.umbrellaEditForm.controls['umbrellaEditFundDomicile'].setValue('');

                    this.fundForm.controls['isFundStructure'].setValue(this.enums.isFundStructure.FUND.toString());
                } else {
                    const newUmbrella = this.umbrellaList[d[0].id];
                    this.umbrellaForm.controls['umbrellaFundName'].setValue(newUmbrella.umbrellaFundName);
                    this.umbrellaForm.controls['umbrellaLei'].setValue(newUmbrella.legalEntityIdentifier);
                    this.umbrellaForm.controls['umbrellaFundDomicile'].setValue(FundComponent.getListItemText(newUmbrella.domicile, this.domicileItems));

                    this.umbrellaEditForm.controls['umbrellaEditLei'].setValue(newUmbrella.legalEntityIdentifier);
                    this.umbrellaEditForm.controls['umbrellaEditFundDomicile'].setValue(FundComponent.getListItemText(newUmbrella.domicile, this.domicileItems));
                    this.umbrellaEditForm.controls['auditorID'].setValue(FundComponent.getListItemText(newUmbrella.auditorID, this.auditorItems));
                    this.umbrellaEditForm.controls['centralisingAgentID'].setValue(FundComponent.getListItemText(newUmbrella.centralisingAgentID, this.centralizingAgentItems));
                    this.umbrellaEditForm.controls['custodianBankID'].setValue(FundComponent.getListItemText(newUmbrella.custodianBankID, this.custodianBankItems));
                    this.umbrellaEditForm.controls['delegatedManagementCompanyID'].setValue(FundComponent.getListItemText(newUmbrella.delegatedManagementCompanyID, this.managementCompanyItems));
                    this.umbrellaEditForm.controls['directors'].setValue(newUmbrella.directors);
                    this.umbrellaEditForm.controls['domicile'].setValue(FundComponent.getListItemText(newUmbrella.domicile, this.domicileItems));
                    this.umbrellaEditForm.controls['fundAdministratorID'].setValue(FundComponent.getListItemText(newUmbrella.fundAdministratorID, this.fundAdministratorItems));
                    this.umbrellaEditForm.controls['giin'].setValue(newUmbrella.giin);
                    this.umbrellaEditForm.controls['investmentAdvisorID'].setValue(FundComponent.getListItemText(newUmbrella.investmentAdvisorID, this.investmentAdvisorItems));
                    this.umbrellaEditForm.controls['legalAdvisorID'].setValue(FundComponent.getListItemText(newUmbrella.legalAdvisorID, this.legalAdvisorItems));
                    this.umbrellaEditForm.controls['legalEntityIdentifier'].setValue(newUmbrella.legalEntityIdentifier);
                    this.umbrellaEditForm.controls['managementCompanyID'].setValue(FundComponent.getListItemText(newUmbrella.managementCompanyID, this.managementCompanyItems));
                    this.umbrellaEditForm.controls['payingAgentID'].setValue(FundComponent.getListItemText(newUmbrella.payingAgentID, this.payingAgentItems));
                    this.umbrellaEditForm.controls['principlePromoterID'].setValue(FundComponent.getListItemText(newUmbrella.principlePromoterID, this.principalPromoterItems));
                    this.umbrellaEditForm.controls['registerOffice'].setValue(newUmbrella.registerOffice);
                    this.umbrellaEditForm.controls['registerOfficeAddress'].setValue(newUmbrella.registerOfficeAddress);
                    this.umbrellaEditForm.controls['taxAuditorID'].setValue(FundComponent.getListItemText(newUmbrella.taxAuditorID, this.taxAuditorItems));
                    this.umbrellaEditForm.controls['transferAgentID'].setValue(FundComponent.getListItemText(newUmbrella.transferAgentID, this.transferAgentItems));
                    this.umbrellaEditForm.controls['umbrellaFundCreationDate'].setValue(newUmbrella.umbrellaFundCreationDate.split(' ', 1)[0]);
                    this.umbrellaEditForm.controls['umbrellaFundID'].setValue(newUmbrella.umbrellaFundID);
                    this.umbrellaEditForm.controls['umbrellaFundName'].setValue(newUmbrella.umbrellaFundName);
                    this.umbrellaEditForm.controls['internalReference'].setValue(newUmbrella.internalReference);
                    this.umbrellaEditForm.controls['additionnalNotes'].setValue(newUmbrella.additionnalNotes);

                    this.fundForm.controls['isFundStructure'].setValue(this.enums.isFundStructure.UMBRELLA.toString());

                    this.fundForm.controls['domicile'].setValue(FundComponent.getListItem(newUmbrella.domicile, this.domicileItems));
                    this.fundForm.controls['managementCompanyID'].setValue(FundComponent.getListItem(newUmbrella.managementCompanyID, this.managementCompanyItems));
                    this.fundForm.controls['fundAdministrator'].setValue(FundComponent.getListItem(newUmbrella.fundAdministratorID, this.fundAdministratorItems));
                    this.fundForm.controls['custodianBank'].setValue(FundComponent.getListItem(newUmbrella.custodianBankID, this.custodianBankItems));
                    this.fundForm.controls['investmentAdvisor'].setValue(FundComponent.getListItem(newUmbrella.investmentAdvisorID, this.investmentAdvisorItems));
                    this.fundForm.controls['payingAgent'].setValue(FundComponent.getListItem(newUmbrella.payingAgentID, this.payingAgentItems));
                    this.fundForm.controls['delegatedManagementCompany'].setValue(FundComponent.getListItem(newUmbrella.delegatedManagementCompanyID, this.managementCompanyItems));
                    this.fundForm.controls['auditor'].setValue(FundComponent.getListItem(newUmbrella.auditorID, this.auditorItems));
                    this.fundForm.controls['taxAuditor'].setValue(FundComponent.getListItem(newUmbrella.taxAuditorID, this.taxAuditorItems));
                    this.fundForm.controls['principalPromoter'].setValue(FundComponent.getListItem(newUmbrella.principlePromoterID, this.principalPromoterItems));
                    this.fundForm.controls['legalAdvisor'].setValue(FundComponent.getListItem(newUmbrella.legalAdvisorID, this.legalAdvisorItems));
                    this.fundForm.controls['directors'].setValue(newUmbrella.directors);


                }
                this.selectedUmbrella = d[0].id;
                return;
            });

        this.fundForm.controls['domicile'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                this.fundForm.controls['transferAgent'].setValue([]);
                this.fundForm.controls['centralizingAgent'].setValue([]);
                this.fundForm.controls['homeCountryLegalType'].setValue([]);

                if (this.isHomeCountryLegalTypeVisible()) {
                    this.homeCountryLegalTypeItems = this.fundItems.homeCountryLegalTypeItems[d[0].id] || [];
                    this.fundForm.controls['homeCountryLegalType'].setValidators(Validators.required);
                } else {
                    this.homeCountryLegalTypeItems = [];
                    this.fundForm.controls['homeCountryLegalType'].clearValidators();
                    this.fundForm.controls['homeCountryLegalType'].updateValueAndValidity();
                }
            });

        this.fundForm.controls['isEuDirective'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (d === this.enums.isEuDirective.NO.toString()) {
                    this.fundForm.controls['typeOfEuDirective'].setValue([]);
                    this.fundForm.controls['typeOfEuDirective'].clearValidators();
                    this.fundForm.controls['typeOfEuDirective'].updateValueAndValidity();
                } else {
                    this.fundForm.controls['typeOfEuDirective'].setValidators(Validators.required);
                }
            });

        this.fundForm.controls['typeOfEuDirective'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (_.get(d, ['0', 'id'], false) !== this.enums.typeOfEuDirective.UCITS.toString()) {
                    this.fundForm.controls['UcitsVersion'].setValue([]);
                    this.fundForm.controls['UcitsVersion'].clearValidators();
                    this.fundForm.controls['UcitsVersion'].updateValueAndValidity();
                } else {
                    this.fundForm.controls['UcitsVersion'].setValidators(Validators.required);
                }
            });

        this.fundForm.controls['legalForm'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                this.fundForm.controls['nationalNomenclatureOfLegalForm'].setValue([]);
                if (!d[0]) {
                    this.nationalNomenclatureOfLegalFormItems = [];
                    return;
                }
                this.nationalNomenclatureOfLegalFormItems = this.fundItems.nationalNomenclatureOfLegalFormItems[d[0].id] || [];
                if (this.nationalNomenclatureOfLegalFormItems.length === 1) {
                    this.fundForm.controls['nationalNomenclatureOfLegalForm'].setValue([this.nationalNomenclatureOfLegalFormItems[0]]);
                }
            });

        this.fundForm.controls['hasCapitalPreservation'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (d === this.enums.hasCapitalPreservation.NO.toString()) {
                    this.fundForm.controls['capitalPreservationLevel'].setValue(null);
                    this.fundForm.controls['capitalPreservationPeriod'].setValue(null);
                }
            });

        this.fundForm.controls['hasCppi'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (d === this.enums.hasCppi.NO.toString()) {
                    this.fundForm.controls['cppiMultiplier'].setValue(null);
                }
            });

        this.umbrellaFundList$
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                const values = _.values(d);
                if (!values.length) {
                    return [];
                }
                const newItems = values.map((item) => {
                    return {
                        id: item.umbrellaFundID,
                        text: item.umbrellaFundName,
                    };
                });

                this.umbrellaList = d;
                this.umbrellaItems = _.uniq([
                    ...this.fundItems.umbrellaItems,
                    ...newItems,
                ]);
            });

        this.fundList$
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                this.fundList = d;
            });

        this.managementCompanyAccessList$
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                const values = _.values(d);
                if (!values.length) {
                    return [];
                }
                this.managementCompanyItems = values.map((item) => {
                    return {
                        id: item.companyID.toString(),
                        text: item.companyName,
                    };
                });
            });

        this.currencyList$
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                const data = d.toJS();

                if (!data.length) {
                    return [];
                }

                this.fundCurrencyItems = data;
            });
    }

    static getListItemText(value: string, list: any[]): string {
        const listItem = FundComponent.getListItem(value, list);
        return listItem.length ? listItem[0].text : '';
    }

    static getListItem(value: string, list: any[]): any[] {
        if (value === null) {
            return [];
        }

        const item = _.find(list, { id: value });
        if (!item) {
            return [];
        }
        return [item];
    }

    getEuDirectiveType() {
        return _.get(this.fundForm.controls['typeOfEuDirective'].value, ['0', 'id'], false);
    }

    // Returns true if an umbrella item has been selected
    isUmbrellaSelected() {
        const umb = _.get(this.umbrellaEditForm.controls['umbrellaFund'].value, ['0', 'id'], false);
        return umb !== false && umb !== '0';
    }

    isHomeCountryLegalTypeVisible() {
        const id = _.get(this.fundForm.controls['domicile'].value, ['0', 'id'], false);
        if (!id) {
            return false;
        }
        const homeCountryLegalTypesKeys = Object.keys(this.fundItems.homeCountryLegalTypeItems);
        return homeCountryLegalTypesKeys.indexOf(id) !== -1;
    }

    isTransferAgentActive() {
        const id = _.get(this.fundForm.controls['domicile'].value, ['0', 'id'], false);
        return id === 'IE' || id === 'LU';
    }

    isCentralizingAgentActive() {
        const id = _.get(this.fundForm.controls['domicile'].value, ['0', 'id'], false);
        return id === 'FR';
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if(params.fromShare){
                this.currentRoute.fromShare = true;
            }
            if(params.umbrella){
                this.waitForCurrentUmbrella(params.umbrella);
            }
        });

        this.route.params
            .takeUntil(this.unSubscribe)
            .subscribe((params) => {
                this.param = params.id;

                if (params.id === 'new') {
                    return;
                } else if (Object.keys(this.fundList).indexOf(params.id) !== -1) {
                    if (this.fundList[params.id].umbrellaFundID) {
                        this.umbrellaControl.setValue([{
                            id: this.fundList[params.id].umbrellaFundID,
                            text: this.fundList[params.id].umbrellaFundName,
                        }]);
                    } else {
                        this.umbrellaControl.setValue([
                            this.umbrellaItems[0],
                        ]);
                    }

                    const fund = _.omit(this.fundList[params.id], ['fundID', 'umbrellaFundID', 'umbrellaFundName', 'companyName']);

                    this.homeCountryLegalTypeItems = this.fundItems.homeCountryLegalTypeItems[fund.domicile] || [];
                    this.nationalNomenclatureOfLegalFormItems = this.fundItems.nationalNomenclatureOfLegalFormItems[fund.legalForm];

                    this.fundForm.setValue({
                        ...fund,
                        domicile: FundComponent.getListItem(fund.domicile, this.domicileItems),
                        typeOfEuDirective: FundComponent.getListItem(fund.typeOfEuDirective, this.typeOfEuDirectiveItems),
                        UcitsVersion: FundComponent.getListItem(fund.UcitsVersion, this.UcitsVersionItems),
                        legalForm: FundComponent.getListItem(fund.legalForm, this.legalFormItems),
                        nationalNomenclatureOfLegalForm: FundComponent.getListItem(fund.nationalNomenclatureOfLegalForm, this.nationalNomenclatureOfLegalFormItems),
                        homeCountryLegalType: FundComponent.getListItem(fund.homeCountryLegalType, this.homeCountryLegalTypeItems),
                        fundCurrency: FundComponent.getListItem(fund.fundCurrency, this.fundCurrencyItems),
                        managementCompanyID: FundComponent.getListItem(fund.managementCompanyID, this.managementCompanyItems),
                        fundAdministrator: FundComponent.getListItem(fund.fundAdministrator, this.fundAdministratorItems),
                        custodianBank: FundComponent.getListItem(fund.custodianBank, this.custodianBankItems),
                        investmentManager: FundComponent.getListItem(fund.investmentManager, this.investmentManagerItems),
                        principalPromoter: FundComponent.getListItem(fund.principalPromoter, this.principalPromoterItems),
                        payingAgent: FundComponent.getListItem(fund.payingAgent, this.payingAgentItems),
                        portfolioCurrencyHedge: FundComponent.getListItem(fund.portfolioCurrencyHedge, this.portfolioCurrencyHedgeItems),
                        investmentAdvisor: FundComponent.getListItem(fund.investmentAdvisor, this.investmentAdvisorItems),
                        auditor: FundComponent.getListItem(fund.auditor, this.auditorItems),
                        taxAuditor: FundComponent.getListItem(fund.taxAuditor, this.taxAuditorItems),
                        legalAdvisor: FundComponent.getListItem(fund.legalAdvisor, this.legalAdvisorItems),
                        capitalPreservationPeriod: FundComponent.getListItem(fund.capitalPreservationPeriod, this.capitalPreservationPeriodItems),
                        transferAgent: FundComponent.getListItem(fund.transferAgent, this.transferAgentItems),
                        centralizingAgent: FundComponent.getListItem(fund.centralizingAgent, this.centralizingAgentItems),
                        delegatedManagementCompany: FundComponent.getListItem(fund.delegatedManagementCompany, this.managementCompanyItems),
                    });
                    this.viewMode = 'FUND';
                    return;
                } else {
                    this.router.navigate(['product-module', 'product', 'fund', 'new']);
                    return;
                }
            });
    }

    waitForCurrentUmbrella(umbrellaID) {
        this.umbrellaFundList$
            .filter(umbrellas => umbrellas[umbrellaID])
            .take(1)
            .subscribe(umbrellas => {
                this.setCurrentUmbrella(umbrellas[umbrellaID])
            });
    }

    setCurrentUmbrella(umbrella){
        this.umbrellaControl.setValue([{
            id : umbrella.umbrellaFundID,
            text : umbrella.umbrellaFundName
        }]);
        let newUrl = this.router.createUrlTree([], {
            queryParams: { umbrella: null },
            queryParamsHandling: "merge"
        });
        this.location.replaceState(this.router.serializeUrl(newUrl));

        this.changeDetectorRef.markForCheck();
    }
    // forms
    submitUmbrellaForm(): void {
        this.viewMode = 'FUND';
    }

    submitFundForm() {
        const payload: Fund = {
            ...this.fundForm.getRawValue(),
            domicile: _.get(this.fundForm.controls['domicile'].value, ['0', 'id'], null),
            typeOfEuDirective: _.get(this.fundForm.controls['typeOfEuDirective'].value, ['0', 'id'], null),
            UcitsVersion: _.get(this.fundForm.controls['UcitsVersion'].value, ['0', 'id'], null),
            legalForm: _.get(this.fundForm.controls['legalForm'].value, ['0', 'id'], null),
            nationalNomenclatureOfLegalForm: _.get(this.fundForm.controls['nationalNomenclatureOfLegalForm'].value, ['0', 'id'], null),
            homeCountryLegalType: _.get(this.fundForm.controls['homeCountryLegalType'].value, ['0', 'id'], null),
            fundCurrency: _.get(this.fundForm.controls['fundCurrency'].value, ['0', 'id'], null),
            portfolioCurrencyHedge: _.get(this.fundForm.controls['portfolioCurrencyHedge'].value, ['0', 'id'], null),
            investmentAdvisor: _.get(this.fundForm.controls['investmentAdvisor'].value, ['0', 'id'], null),
            auditor: _.get(this.fundForm.controls['auditor'].value, ['0', 'id'], null),
            taxAuditor: _.get(this.fundForm.controls['taxAuditor'].value, ['0', 'id'], null),
            legalAdvisor: _.get(this.fundForm.controls['legalAdvisor'].value, ['0', 'id'], null),
            fiscalYearEnd: this.fundForm.controls['fiscalYearEnd'].value + '-01',
            fundAdministrator: _.get(this.fundForm.controls['fundAdministrator'].value, ['0', 'id'], null),
            custodianBank: _.get(this.fundForm.controls['custodianBank'].value, ['0', 'id'], null),
            investmentManager: _.get(this.fundForm.controls['investmentManager'].value, ['0', 'id'], null),
            principalPromoter: _.get(this.fundForm.controls['principalPromoter'].value, ['0', 'id'], null),
            payingAgent: _.get(this.fundForm.controls['payingAgent'].value, ['0', 'id'], null),
            managementCompanyID: _.get(this.fundForm.controls['managementCompanyID'].value, ['0', 'id'], null),
            delegatedManagementCompany: _.get(this.fundForm.controls['delegatedManagementCompany'].value, ['0', 'id'], null),
            umbrellaFundID: _.get(this.umbrellaControl.value, ['0', 'id'], null),
            transferAgent: _.get(this.fundForm.controls['transferAgent'].value, ['0', 'id'], null),
            centralizingAgent: _.get(this.fundForm.controls['centralizingAgent'].value, ['0', 'id'], null),
            capitalPreservationPeriod: _.get(this.fundForm.controls['capitalPreservationPeriod'].value, ['0', 'id'], null),
        };

        if (this.param === 'new') {

            this.fundService.iznCreateFund(payload)
                .then(fund => {
                    let fundID = _.get(fund, ['1', 'Data', '0', 'fundID']);
                    let fundName = _.get(fund, ['1', 'Data', '0', 'fundName']);

                    if(!_.isUndefined(fundID)){
                        if(this.currentRoute.fromShare){
                            this.redirectToShare(fundID);
                        } else{
                            this.displaySharePopup(fundName, fundID);
                        }
                    } else{
                        this.creationSuccess(fundName);
                    }
                    OfiFundService.defaultRequestIznesFundList(this.fundService, this.ngRedux);
                    return;
                })
                .catch((err) => {
                    const errMsg = _.get(err, '[1].Data[0].Message', '');
                    this.toasterService.pop('error', 'Failed to create the fund. ' + errMsg);
                    return;
                });
        } else {
            this.fundService.iznUpdateFund(this.param, payload)
                .then(() => {
                    this.toasterService.pop('success', `${this.fundForm.controls['fundName'].value} has been successfully updated.`);
                    OfiFundService.defaultRequestIznesFundList(this.fundService, this.ngRedux);
                    this.location.back();
                    return;
                })
                .catch((err) => {
                    const errMsg = _.get(err, '[1].Data[0].Message', '');
                    this.toasterService.pop('error', 'Failed to update the fund. ' + errMsg);
                    return;
                });
        }
    }

    redirectToShare(fundID?){
        let query = {};
        if(fundID){
            query = { fund: fundID };
        }
        this.router.navigate(['/product-module/product/fund-share/new'], { queryParams: query });
    }

    displaySharePopup(fundName, fundID){
        const message = `<span>By clicking "Yes", you will be able to create a share directly linked to ${fundName}.</span>`;

        this.confirmationService.create(
            '<span>Do you want to create a share?</span>',
            message,
            {confirmText: 'Yes', declineText: 'No'}
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.redirectToShare(fundID);

            } else{
                this.creationSuccess(fundName);
            }
        });
    }

    creationSuccess(fundName){
        this.toasterService.pop('success', `${fundName} has been successfully created.`);
        this.router.navigateByUrl('/product-module/product');
    }

    onClickBack() {
        this.router.navigateByUrl('/product-module/product');
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

}
