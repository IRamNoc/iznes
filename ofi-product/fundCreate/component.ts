import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as _ from 'lodash';
import {NgRedux, select} from '@angular-redux/store';
import {ToasterService} from 'angular2-toaster';

import {OfiFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import {OfiUmbrellaFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import {Fund} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service.model';
import {OfiManagementCompanyService} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';


@Component({
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
})
export class FundCreateComponent implements OnInit, OnDestroy {

    viewMode = 'UMBRELLA';
    selectedUmbrella: number;

    // select inputs data
    fundItems: any;
    enums: any;

    domicileItems = [];
    umbrellaItems = [];
    typeOfEuDirectiveItems = [];
    ucitsVersionItems = [];
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

    // Locale
    language = 'fr';

    // forms
    umbrellaForm: FormGroup;
    fundForm: FormGroup;

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

    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'requested']) requestedOfiUmbrellaFundList$;
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
        @Inject('fund-items') fundItems,
    ) {

        OfiUmbrellaFundService.defaultRequestUmbrellaFundList(umbrellaService, ngRedux);
        OfiManagementCompanyService.defaultRequestManagementCompanyList(this.ofiManagementCompanyService, this.ngRedux);

        this.fundItems = fundItems.fundItems;
        this.enums = fundItems.enums;

        this.domicileItems = this.fundItems.domicileItems;
        this.umbrellaItems = this.fundItems.umbrellaItems;
        this.typeOfEuDirectiveItems = this.fundItems.typeOfEuDirectiveItems;
        this.ucitsVersionItems = this.fundItems.UCITSVersionItems;
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

        this.umbrellaForm = fb.group({
            'umbrellaFund': ['', Validators.required],
            'umbrellaFundName': {value: 'nem', disabled: true},
            'umbrellaLei': {value: 'lei', disabled: true},
            'umbrellaFundDomicile': {value: 'dom', disabled: true},
        });

        this.fundForm = fb.group({
            'isFundStructure': [null, Validators.required],
            'umbrellaFundID': null,
            'fundName': [null, Validators.required],
            'AuMFund': [null, Validators.required],
            'AuMFundDate': [null, Validators.required],
            'legalEntityIdentifier': [null, Validators.pattern(/^(\w{20})?$/)],
            'registerOffice': [null],
            'registerOfficeAddress': [null],
            'domicile': [[], Validators.required],
            'isEuDirective': [null, Validators.required],
            'typeOfEuDirective': [[]],
            'ucitsVersion': [[]],
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
            'transferAgent': [''],
            'centralizingAgent': [''],
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
            'isfundTargetingEos': [null],
            'isFundTargetingSri': [null],
            'isPassiveFund': [null],
            'hasSecurityiesLending': [null],
            'hasSwap': [null],
            'hasDurationHedge': [null],
            'investmentObjective': [null],
        });

        this.umbrellaForm.controls['umbrellaFund'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (!d.length) {
                    this.selectedUmbrella = null;
                } else {
                    this.selectedUmbrella = d[0].id;
                    this.umbrellaForm.controls['umbrellaFundName'].setValue(d[0].text);
                }
            });

        this.fundForm.controls['isFundStructure'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (d === this.enums.isFundStructure.FUND.toString()) {
                    this.fundForm.controls['umbrellaFundID'].setValue(null);
                }
            });

        this.fundForm.controls['domicile'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                this.fundForm.controls['transferAgent'].setValue(null);
                this.fundForm.controls['centralizingAgent'].setValue(null);
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
                    this.fundForm.controls['ucitsVersion'].setValue([]);
                    this.fundForm.controls['ucitsVersion'].clearValidators();
                } else {
                    this.fundForm.controls['ucitsVersion'].setValidators(Validators.required);
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

    getEuDirectiveType() {
        return _.get(this.fundForm.controls['typeOfEuDirective'].value, ['0', 'id'], false);
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

    }

    // forms
    submitUmbrellaForm(): void {
        this.viewMode = 'FUND';
    }

    submitFundForm() {
        const payload: Fund = _.omit({
            ...this.fundForm.value,
            domicile: _.get(this.fundForm.controls['domicile'].value, ['0', 'id'], null),
            typeOfEuDirective: _.get(this.fundForm.controls['typeOfEuDirective'].value, ['0', 'id'], null),
            ucitsVersion: _.get(this.fundForm.controls['ucitsVersion'].value, ['0', 'id'], null),
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
        }, ['AuMFund', 'AuMFundDate']);

        this.fundService.iznCreateFund(payload)
            .then(() => {
                this.toasterService.pop('success', `${this.fundForm.controls['fundName'].value} has been successfully created.`);
                this.router.navigate(['product-module', 'home']);
                return;
            })
            .catch(() => {
                this.toasterService.pop('error', 'Failed to save the fund.');
                return;
            });
    }

    onClickBack() {
        this.router.navigate(['product-module', 'home']);
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

}
