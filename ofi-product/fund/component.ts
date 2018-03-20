import {Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormGroup, Validators, FormBuilder, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as _ from 'lodash';
import {NgRedux, select} from '@angular-redux/store';
import {ToasterService} from 'angular2-toaster';

import {OfiFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import {OfiUmbrellaFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import {Fund} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service.model';
import {OfiManagementCompanyService} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import {typeOfEuDirective} from '../fundConfig';

interface UmbrellaItem {
    auditorID: number;
    centralisingAgentID: number;
    custodianBankID: number;
    delegatedManagementCompanyID: number;
    directors: string;
    domicile: string;
    fundAdministratorID: number;
    giin: string;
    investmentAdvisorID: number;
    investmentManagerID: number;
    legalAdvisorID: number;
    legalEntityIdentifier: string;
    managementCompanyID: number;
    payingAgentID: number;
    principlePromoterID: number;
    registerOffice: string;
    registerOfficeAddress: string;
    taxAuditorID: number;
    transferAgentID: number;
    umbrellaFundCreationDate: string; // datetime
    umbrellaFundID: number;
    umbrellaFundName: string;
}

interface UmbrellaList {
    [key: string]: UmbrellaItem;
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

    viewMode = 'UMBRELLA';
    selectedUmbrella: number;
    param: string;

    // local copy of config
    fundItems: any;
    enums: any;

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
    language = 'fr';

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

    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaFundList$;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyAccessList$;

    unSubscribe: Subject<any> = new Subject();

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private fundService: OfiFundService,
        private umbrellaService: OfiUmbrellaFundService,
        private ofiManagementCompanyService: OfiManagementCompanyService,
        private ngRedux: NgRedux<any>,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        @Inject('fund-items') fundItems,
    ) {


        OfiUmbrellaFundService.defaultRequestUmbrellaFundList(umbrellaService, ngRedux);
        OfiManagementCompanyService.defaultRequestManagementCompanyList(this.ofiManagementCompanyService, this.ngRedux);

        this.fundItems = fundItems.fundItems;
        this.enums = fundItems.enums;

        this.domicileItems = this.fundItems.domicileItems;
        this.umbrellaItems = this.fundItems.umbrellaItems;
        this.typeOfEuDirectiveItems = this.fundItems.typeOfEuDirectiveItems;
        this.UcitsVersionItems = this.fundItems.UCITSVersionItems;
        this.legalFormItems = this.fundItems.fundLegalFormItems;
        this.fundCurrencyItems = this.fundItems.fundCurrencyItems;
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

        this.umbrellaForm = fb.group({
            'umbrellaFundName': {value: 'nem', disabled: true},
            'umbrellaLei': {value: 'lei', disabled: true},
            'umbrellaFundDomicile': {value: 'dom', disabled: true},
        });

        this.umbrellaEditForm = fb.group({
            'umbrellaEditLei': {value: '', disabled: true},
            'umbrellaEditFundDomicile': {value: '', disabled: true},
            'auditorID': {value: '', disabled: true},
            'centralisingAgentID': {value: '', disabled: true},
            'custodianBankID': {value: '', disabled: true},
            'delegatedManagementCompanyID': {value: '', disabled: true},
            'directors': {value: '', disabled: true},
            'domicile': {value: '', disabled: true},
            'fundAdministratorID': {value: '', disabled: true},
            'giin': {value: '', disabled: true},
            'investmentAdvisorID': {value: '', disabled: true},
            'investmentManagerID': {value: '', disabled: true},
            'legalAdvisorID': {value: '', disabled: true},
            'legalEntityIdentifier': {value: '', disabled: true},
            'managementCompanyID': {value: '', disabled: true},
            'payingAgentID': {value: '', disabled: true},
            'principlePromoterID': {value: '', disabled: true},
            'registerOffice': {value: '', disabled: true},
            'registerOfficeAddress': {value: '', disabled: true},
            'taxAuditorID': {value: '', disabled: true},
            'transferAgentID': {value: '', disabled: true},
            'umbrellaFundCreationDate': {value: '', disabled: true},
            'umbrellaFundID': {value: '', disabled: true},
            'umbrellaFundName': {value: '', disabled: true},
        });

        this.fundForm = fb.group({
            'isFundStructure': {value: '', disabled: true},
            'fundName': [null, Validators.required],
            'AuMFund': [null, Validators.required],
            'AuMFundDate': [null, Validators.required],
            'legalEntityIdentifier': [null, Validators.pattern(/^(\w{20})?$/)],
            'registerOffice': [null],
            'registerOfficeAddress': [null],
            'domicile': [[], Validators.required],
            'isEuDirective': [null, Validators.required],
            'typeOfEuDirective': [[]],
            'UcitsVersion': [[]],
            'legalForm': [[], Validators.required],
            'nationalNomenclatureOfLegalForm': [[], Validators.required],
            'homeCountryLegalType': [[]],
            'fundCreationDate': [null],
            'fundLaunchate': [null],
            'fundCurrency': [[], Validators.required],
            'openOrCloseEnded': [null, Validators.required],
            'fiscalYearEnd': [null, Validators.required],
            'isFundOfFund': [null, Validators.required],
            'managementCompanyID': [[], Validators.required],
            'fundAdministrator': [[], Validators.required],
            'custodianBank': [[], Validators.required],
            'investmentManager': [[]],
            'principalPromoter': [[]],
            'payingAgent': [[]],
            'fundManagers': [null],
            'transferAgent': [[]],
            'centralizingAgent': [[]],
            'isDedicatedFund': [null, Validators.required],
            'portfolioCurrencyHedge': [[], Validators.required],

            'globalItermediaryIdentification': [null],
            'delegatedManagementCompany': [null],
            'investmentAdvisor': [[]],
            'auditor': [[]],
            'taxAuditor': [[]],
            'legalAdvisor': [[]],
            'directors': [null],
            'pocket': [null],
            'hasEmbeddedDirective': [null],
            'hasCapitalPreservation': [null],
            'capitalPreservationLevel': [null],
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
                    this.umbrellaForm.controls['umbrellaFundDomicile'].setValue(newUmbrella.domicile);

                    this.umbrellaEditForm.controls['umbrellaEditLei'].setValue(newUmbrella.legalEntityIdentifier);
                    this.umbrellaEditForm.controls['umbrellaEditFundDomicile'].setValue(newUmbrella.domicile);
                    this.umbrellaEditForm.controls['auditorID'].setValue(newUmbrella.auditorID);
                    this.umbrellaEditForm.controls['centralisingAgentID'].setValue(newUmbrella.centralisingAgentID);
                    this.umbrellaEditForm.controls['custodianBankID'].setValue(newUmbrella.custodianBankID);
                    this.umbrellaEditForm.controls['delegatedManagementCompanyID'].setValue(newUmbrella.delegatedManagementCompanyID);
                    this.umbrellaEditForm.controls['directors'].setValue(newUmbrella.directors);
                    this.umbrellaEditForm.controls['domicile'].setValue(newUmbrella.domicile);
                    this.umbrellaEditForm.controls['fundAdministratorID'].setValue(newUmbrella.fundAdministratorID);
                    this.umbrellaEditForm.controls['giin'].setValue(newUmbrella.giin);
                    this.umbrellaEditForm.controls['investmentAdvisorID'].setValue(newUmbrella.investmentAdvisorID);
                    this.umbrellaEditForm.controls['investmentManagerID'].setValue(newUmbrella.investmentManagerID);
                    this.umbrellaEditForm.controls['legalAdvisorID'].setValue(newUmbrella.legalAdvisorID);
                    this.umbrellaEditForm.controls['legalEntityIdentifier'].setValue(newUmbrella.legalEntityIdentifier);
                    this.umbrellaEditForm.controls['managementCompanyID'].setValue(newUmbrella.managementCompanyID);
                    this.umbrellaEditForm.controls['payingAgentID'].setValue(newUmbrella.payingAgentID);
                    this.umbrellaEditForm.controls['principlePromoterID'].setValue(newUmbrella.principlePromoterID);
                    this.umbrellaEditForm.controls['registerOffice'].setValue(newUmbrella.registerOffice);
                    this.umbrellaEditForm.controls['registerOfficeAddress'].setValue(newUmbrella.registerOfficeAddress);
                    this.umbrellaEditForm.controls['taxAuditorID'].setValue(newUmbrella.taxAuditorID);
                    this.umbrellaEditForm.controls['transferAgentID'].setValue(newUmbrella.transferAgentID);
                    this.umbrellaEditForm.controls['umbrellaFundCreationDate'].setValue(newUmbrella.umbrellaFundCreationDate.split(' ', 1)[0]);
                    this.umbrellaEditForm.controls['umbrellaFundID'].setValue(newUmbrella.umbrellaFundID);
                    this.umbrellaEditForm.controls['umbrellaFundName'].setValue(newUmbrella.umbrellaFundName);

                    this.fundForm.controls['isFundStructure'].setValue(this.enums.isFundStructure.UMBRELLA.toString());
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

                if (this.isTransferAgentActive()) {
                    this.fundForm.controls['transferAgent'].setValidators(Validators.required);
                } else {
                    this.fundForm.controls['transferAgent'].clearValidators();
                }

                if (this.isCentralizingAgentActive()) {
                    this.fundForm.controls['centralizingAgent'].setValidators(Validators.required);
                } else {
                    this.fundForm.controls['centralizingAgent'].clearValidators();
                }

                if (this.isHomeCountryLegalTypeVisible()) {
                    this.homeCountryLegalTypeItems = this.fundItems.homeCountryLegalTypeItems[d[0].id] || [];
                    this.fundForm.controls['homeCountryLegalType'].setValidators(Validators.required);
                } else {
                    this.homeCountryLegalTypeItems = [];
                    this.fundForm.controls['homeCountryLegalType'].clearValidators();
                }
            });

        this.fundForm.controls['isEuDirective'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (d === this.enums.isEuDirective.NO.toString()) {
                    this.fundForm.controls['typeOfEuDirective'].setValue([]);
                    this.fundForm.controls['typeOfEuDirective'].clearValidators();
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
                const values =  _.values(d);
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
                const values =  _.values(d);
                if (!values.length) {
                    return [];
                }
                this.managementCompanyItems = values.map((item) => {
                    return {
                        id: item.companyID,
                        text: item.companyName,
                    };
                });
            });
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
        this.route.params
            .takeUntil(this.unSubscribe)
            .subscribe((params) => {
                this.param = params.id;

                if (params.id === 'new') {
                    return;
                } else if (Object.keys(this.fundList).indexOf(params.id) !== -1) {
                    this.umbrellaControl.setValue([{
                        id: this.fundList[params.id].umbrellaFundID,
                        text: this.fundList[params.id].umbrellaFundName,
                    }]);
                    const fund = _.omit(this.fundList[params.id], ['fundID', 'umbrellaFundID', 'umbrellaFundName', 'companyName']);

                    this.homeCountryLegalTypeItems = this.fundItems.homeCountryLegalTypeItems[fund.domicile] || [];
                    this.nationalNomenclatureOfLegalFormItems = this.fundItems.nationalNomenclatureOfLegalFormItems[fund.legalForm];

                    this.fundForm.setValue({
                        ...fund,
                        AuMFund: null,
                        AuMFundDate: null,
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
                    });
                    this.viewMode = 'FUND';
                    return;
                } else {
                    this.router.navigate(['product-module', 'fund', 'new']);
                    return;
                }
            });
    }

    // forms
    submitUmbrellaForm(): void {
        this.viewMode = 'FUND';
    }

    submitFundForm() {
        const payload: Fund = _.omit({
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
            managementCompanyID:  _.get(this.fundForm.controls['managementCompanyID'].value, ['0', 'id'], null),
            umbrellaFundID:  _.get(this.umbrellaControl.value, ['0', 'id'], null),
            transferAgent: _.get(this.fundForm.controls['transferAgent'].value, ['0', 'id'], null),
            centralizingAgent: _.get(this.fundForm.controls['centralizingAgent'].value, ['0', 'id'], null),
            capitalPreservationPeriod: _.get(this.fundForm.controls['capitalPreservationPeriod'].value, ['0', 'id'], null),
        }, ['AuMFund', 'AuMFundDate']);

        if (this.param === 'new') {
            this.fundService.iznCreateFund(payload)
                .then(() => {
                    this.toasterService.pop('success', `${this.fundForm.controls['fundName'].value} has been successfully created.`);
                    OfiFundService.defaultRequestIznesFundList(this.fundService, this.ngRedux);
                    this.router.navigate(['product-module', 'home']);
                    return;
                })
                .catch(() => {
                    this.toasterService.pop('error', 'Failed to create the fund.');
                    return;
                });
        } else {
            this.fundService.iznUpdateFund(this.param, payload)
                .then(() => {
                    this.toasterService.pop('success', `${this.fundForm.controls['fundName'].value} has been successfully updated.`);
                    OfiFundService.defaultRequestIznesFundList(this.fundService, this.ngRedux);
                    this.router.navigate(['product-module', 'home']);
                    return;
                })
                .catch(() => {
                    this.toasterService.pop('error', 'Failed to update the fund.');
                    return;
                });
        }
    }

    onClickBack() {
        this.router.navigate(['product-module', 'home']);
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

}
