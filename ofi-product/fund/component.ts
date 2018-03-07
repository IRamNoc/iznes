import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as _ from 'lodash';

@Component({
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
})
export class FundComponent implements OnInit, OnDestroy {

    viewMode = 'UMBRELLA';
    selectedUmbrella: number;

    // select inputs data
    fundItems: any;

    fundDomicileItems = [];
    umbrellaItems = [];
    isEuDirectiveRelevantItems = [];
    UCITSVersionItems = [];
    fundLegalFormItems = [];
    nationalNomenclatureOfLegalFormItems = [];
    homeCountryLegalTypeItems = [];
    fundCurrencyItems = [];
    portfolioCurrencyHedgeItems = [];
    investmentAdvisorItems = [];
    auditorItems = [];
    taxAuditorItems = [];
    legalAdvisorItems = [];

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

    unSubscribe: Subject<any> = new Subject();

    constructor(
        private router: Router,
        private fb: FormBuilder,
        @Inject('fund-items') fundItems,
    ) {

        this.fundItems = fundItems;

        this.fundDomicileItems = fundItems.fundDomicileItems;
        this.umbrellaItems = fundItems.umbrellaItems;
        this.isEuDirectiveRelevantItems = fundItems.isEuDirectiveRelevantItems;
        this.UCITSVersionItems = fundItems.UCITSVersionItems;
        this.fundLegalFormItems = fundItems.fundLegalFormItems;
        this.fundCurrencyItems = fundItems.fundCurrencyItems;
        this.portfolioCurrencyHedgeItems = fundItems.portfolioCurrencyHedgeItems;
        this.investmentAdvisorItems = fundItems.investmentAdvisorItems;
        this.auditorItems = fundItems.auditorItems;
        this.taxAuditorItems = fundItems.taxAuditorItems;
        this.legalAdvisorItems = fundItems.legalAdvisorItems;

        this.umbrellaForm = fb.group({
            'umbrellaFund': ['', Validators.required],
            'umbrellaFundName': {value: 'nem', disabled: true},
            'umbrellaLei': {value: 'lei', disabled: true},
            'umbrellaFundDomicile': {value: 'dom', disabled: true},
        });

        this.fundForm = fb.group({
            'fundStructure': ['', Validators.required],
            'umbrellaName': '',
            'fundName': ['', Validators.required],
            'AuMFund': ['', Validators.required],
            'AuMFundDate': ['', Validators.required],
            'lei': ['', Validators.pattern(/^\w{20}$/)],
            'registeredOfficeName': [''],
            'registeredOfficeAddress': [''],
            'fundDomicile': ['', Validators.required],
            'isEuDirectiveRelevant': ['', Validators.required],
            'euDirectiveType': ['', Validators.required],
            'UCITSVersion': ['', Validators.required],
            'fundLegalForm': ['', Validators.required],
            'nationalNomenclatureOfLegalForm': ['', Validators.required],
            'homeCountryLegalType': ['', Validators.required],
            'fundCreationDate': [''],
            'fundLaunchDate': [''],
            'fundCurrency': ['', Validators.required],
            'fundStructureType': ['', Validators.required],
            'fiscalYearEnd': ['', Validators.required],
            'fundOfFunds': ['', Validators.required],
            'managementCompany': ['', Validators.required],
            'fundAdmin': ['', Validators.required],
            'custodianBank': ['', Validators.required],
            'investmentManager': [''],
            'principalPromoter': [''],
            'payingAgent': [''],
            'fundManagers': [''],
            'transfertAgent': ['', Validators.required],
            'centralizingAgent': ['', Validators.required],
            'dedicatedFund': ['', Validators.required],
            'portfolioCurrencyHedge': ['', Validators.required],

            'giin': [''],
            'delegatedManagementCompany': [''],
            'investmentAdvisor': [''],
            'auditor': [''],
            'taxAuditor': [''],
            'legalAdvisor': [''],
            'directors': [''],
            'pocket': [''],
            'hasEmbeddedDerivatives': [''],
            'hasCapitalPreservation': [''],
            'capitalPreservationLevel': [''],
            'capitalPreservationPeriod': [''],
            'hasCppi': [''],
            'cppiMultiplier': [''],
            'hasHedgeFundStrategy': [''],
            'isLeveraged': [''],
            'has130/30Strategy': [''],
            'isFundTargetingEos': [''],
            'isFundTargetingSri': [''],
            'isPassiveFund': [''],
            'hasSecurityLending': [''],
            'hasSwap': [''],
            'hasDurationHedge': [''],
            'investmentObjective': [''],
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

        this.fundForm.controls['fundStructure'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (d === 'FUND') {
                    this.fundForm.controls['umbrellaName'].setValue('');
                }
            });

        this.fundForm.controls['fundDomicile'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                this.fundForm.controls['transfertAgent'].setValue('');
                this.fundForm.controls['centralizingAgent'].setValue('');
                this.fundForm.controls['homeCountryLegalType'].setValue('');
                if (d.length) {
                    this.homeCountryLegalTypeItems = this.fundItems.homeCountryLegalTypeItems[d[0].id] || [];
                } else {
                    this.homeCountryLegalTypeItems = [];
                }
            });

        this.fundForm.controls['isEuDirectiveRelevant'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (d === 'NO') {
                    this.fundForm.controls['euDirectiveType'].setValue('');
                }
            });

        this.fundForm.controls['euDirectiveType'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (_.get(d, ['0', 'id'], false) !== 'UCITS') {
                    this.fundForm.controls['UCITSVersion'].setValue('');
                }
            });

        this.fundForm.controls['fundLegalForm'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                this.fundForm.controls['nationalNomenclatureOfLegalForm'].setValue('');
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
                if (d === 'NO') {
                    this.fundForm.controls['capitalPreservationLevel'].setValue('');
                }
            });
    }

    getEuDirectiveType() {
        return _.get(this.fundForm.controls['euDirectiveType'].value, ['0', 'id'], false);
    }

    isTransfertAgentVisible() {
        const id = _.get(this.fundForm.controls['fundDomicile'].value, ['0', 'id'], false);
        return id === 'IE' || id === 'LU';
    }

    isCentralizingAgentVisible() {
        const id = _.get(this.fundForm.controls['fundDomicile'].value, ['0', 'id'], false);
        return id === 'FR';
    }

    ngOnInit() {

    }

    // forms
    submitUmbrellaForm(): void {
        this.viewMode = 'FUND';
    }

    submitFundForm() {

    }

    onClickBack() {
        this.router.navigate(['product-module', 'home']);
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

}
