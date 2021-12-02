import { Subject } from 'rxjs/Subject';
import { takeUntil, take, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { NgRedux, select } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import { ConfirmationService } from '@setl/utils';
import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { OfiProductConfigService } from '@ofi/ofi-main/ofi-req-services/ofi-product/configuration/service';
import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import { Fund } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service.model';
import { UmbrellaFundDetail } from '@ofi/ofi-main/ofi-store/ofi-product/umbrella-fund/umbrella-fund-list/model';
import { PermissionsService } from '@setl/utils/services/permissions';

import {
    OfiManagementCompanyService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';

import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import { MultilingualService } from '@setl/multilingual';
import { LeiService } from '@ofi/ofi-main/ofi-req-services/ofi-product/lei/lei.service';
import * as CustomValidators from '@setl/utils/helper/validators';

interface UmbrellaList {
    [key: string]: UmbrellaFundDetail;
}

interface FundList {
    [key: string]: any;
}

const ADMIN_USER_URL = '/admin-product-module/';

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
            2: {
                open: false,
            },
        },
    };

    isLeiVisible = false;
    isFundCapitalisationDateVisible = false;
    viewMode = 'UMBRELLA';
    selectedUmbrella: number;
    param: string;
    prefill: string;

    // local copy of config
    fundItems: any;
    enums: any;
    validators: any;

    // local copy of the state
    umbrellaList: UmbrellaList;
    fundList: FundList;
    fundListItems = [];
    leiList: string[] = [];

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
    classificationItems = [];
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

    currentLei: string;

    hasPermissionUpdateFund: boolean = false;

    // Locale
    language = 'en';

    // forms
    fundControl = new FormControl([]);
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
        locale: this.language,
    };

    configMonthDay = {
        format: 'MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
        monthFormat: 'MMM',
    };

    // product config
    productConfig;
    holidayMgmtConfigDates: () => string[];

    @select(['user', 'siteSettings', 'language']) language$;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaFundList$;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundList$;
    @select([
        'ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList',
    ]) managementCompanyAccessList$;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currencyList$;
    @select(['ofi', 'ofiProduct', 'ofiProductConfiguration', 'requested']) reqConfig$;
    @select(['ofi', 'ofiProduct', 'ofiProductConfiguration', 'configuration']) config$;
    @select(['ofi', 'ofiProduct', 'lei', 'lei']) leiListOb;

    unSubscribe: Subject<any> = new Subject();

    currentRoute: {
        fromShare?: boolean,
    } = {};

    currDraft: number = 0;

    constructor(
        private router: Router,
        private location: Location,
        private fb: FormBuilder,
        private fundService: OfiFundService,
        private umbrellaService: OfiUmbrellaFundService,
        private ofiManagementCompanyService: OfiManagementCompanyService,
        private ofiProductConfigService: OfiProductConfigService,
        private ofiCurrenciesService: OfiCurrenciesService,
        private ngRedux: NgRedux<any>,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef,
        private confirmationService: ConfirmationService,
        private leiService: LeiService,
        public permissionsService: PermissionsService,
        public translate: MultilingualService,
        @Inject('product-config') productConfig,
    ) {
        this.ofiManagementCompanyService.getManagementCompanyList();
        this.ofiCurrenciesService.getCurrencyList();

        this.fundItems = productConfig.fundItems;
        this.enums = productConfig.enums;
        this.validators = productConfig.validators;

        this.domicileItems = this.fundItems.domicileItems;
        this.umbrellaItems = this.fundItems.umbrellaItems;

        this.typeOfEuDirectiveItems = this.fundItems.typeOfEuDirectiveItems;
        this.UcitsVersionItems = this.fundItems.UCITSVersionItems;
        this.legalFormItems = this.sortingList(this.fundItems.fundLegalFormItems);
        this.portfolioCurrencyHedgeItems =  this.sortingList(this.fundItems.portfolioCurrencyHedgeItems);
        this.classificationItems = this.sortingList(this.fundItems.classificationItems);
        this.auditorItems = this.sortingList(this.fundItems.auditorItems);
        this.taxAuditorItems = this.sortingList(this.fundItems.taxAuditorItems);
        this.legalAdvisorItems = this.sortingList(this.fundItems.legalAdvisorItems);
        this.capitalPreservationPeriodItems = this.fundItems.capitalPreservationPeriodItems;
        this.fundAdministratorItems = this.sortingList(this.fundItems.fundAdministratorItems);
        this.custodianBankItems = this.sortingList(this.fundItems.custodianBankItems);
        this.investmentManagerItems = this.sortingList(this.fundItems.investmentManagerItems);
        this.principalPromoterItems = this.sortingList(this.fundItems.principalPromoterItems);
        this.payingAgentItems = this.sortingList(this.fundItems.payingAgentItems);
        this.transferAgentItems = this.sortingList(this.fundItems.transferAgentItems);
        this.centralizingAgentItems = this.sortingList(this.fundItems.centralizingAgentItems);

        if (!this.isAdmin()) {
            this.fundService.getFundList();
            this.umbrellaService.fetchUmbrellaList();
        } else {
        /* For IZNES Admins */
            this.fundService.getAdminFundList();
            this.umbrellaService.getAdminUmbrellaList();
        }

        this.language$
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((d) => {
            this.language = d.substr(0, 2);
            this.configDate = {
                ...this.configDate,
                locale: this.language,
            };
            this.configMonthDay = {
                ...this.configMonthDay,
                locale: this.language,
            };
        });

        this.umbrellaForm = fb.group({
            umbrellaFundName: { value: '', disabled: true },
            umbrellaLei: { value: '', disabled: true },
            umbrellaFundDomicile: { value: '', disabled: true },
        });

        this.umbrellaEditForm = fb.group({
            umbrellaEditLei: { value: '', disabled: true },
            umbrellaEditFundDomicile: { value: '', disabled: true },
            auditorID: { value: '', disabled: true },
            centralisingAgentID: { value: '', disabled: true },
            custodianBankID: { value: '', disabled: true },
            delegatedManagementCompanyID: { value: '', disabled: true },
            directors: { value: '', disabled: true },
            domicile: { value: '', disabled: true },
            fundAdministratorID: { value: '', disabled: true },
            giin: { value: '', disabled: true },
            investmentAdvisorID: { value: '', disabled: true },
            legalAdvisorID: { value: '', disabled: true },
            legalEntityIdentifier: { value: '', disabled: true },
            managementCompanyID: { value: '', disabled: true },
            payingAgentID: { value: '', disabled: true },
            principlePromoterID: { value: '', disabled: true },
            registerOffice: { value: '', disabled: true },
            registerOfficeAddress: { value: '', disabled: true },
            registerOfficeAddressLine2: { value: '', disabled: true },
            registerOfficeAddressZipCode: { value: '', disabled: true },
            registerOfficeAddressCity: { value: '', disabled: true },
            registerOfficeAddressCountry: { value: '', disabled: true },
            taxAuditorID: { value: '', disabled: true },
            transferAgentID: { value: '', disabled: true },
            umbrellaFundCreationDate: { value: '', disabled: true },
            umbrellaFundID: { value: '', disabled: true },
            umbrellaFundName: { value: '', disabled: true },
            umbrellaInternalReference: { value: '', disabled: true },
            internalReference: { value: '', disabled: true },
            additionalNotes: { value: '', disabled: true },
        });

        this.fundForm = fb.group({
            isFundStructure: { value: '', disabled: true },
            fundName: ['', Validators.compose([Validators.required])],
            legalEntityIdentifier: [null, this.validators.lei],
            registerOffice: [null, [
                Validators.required,
                CustomValidators.swiftNameAddressValidator,
            ]],
            registerOfficeAddress: [null, CustomValidators.swiftNameAddressValidator],
            registerOfficeAddressLine2: [null, CustomValidators.swiftNameAddressValidator],
            registerOfficeAddressZipCode: [null, CustomValidators.swiftNameAddressValidator],
            registerOfficeAddressCity: [null, CustomValidators.swiftNameAddressValidator],
            registerOfficeAddressCountry: [[]],
            domicile: [[], this.validators.ngSelectRequired],
            tradingAccount: [],
            isEuDirective: [null, Validators.required],
            typeOfEuDirective: [[]],
            UcitsVersion: [[]],
            legalForm: [[], this.validators.ngSelectRequired],
            nationalNomenclatureOfLegalForm: [[], this.validators.ngSelectRequired],
            homeCountryLegalType: [[]],
            fundCreationDate: [null, this.validators.date.day],
            fundLaunchDate: [null, this.validators.date.day],
            fundCurrency: [[], this.validators.ngSelectRequired],
            openOrCloseEnded: [null, Validators.required],
            fiscalYearEnd: [null, this.validators.date.monthday],
            isFundOfFund: [null, Validators.required],
            managementCompanyID: [[], this.validators.ngSelectRequired],
            fundAdministratorID: [[], this.validators.ngSelectRequired],
            custodianBankID: [[], this.validators.ngSelectRequired],
            investmentManagerID: [[]],
            principlePromoterID: [[]],
            payingAgentID: [[]],
            fundManagers: [null],
            transferAgentID: [[]],
            centralizingAgentID: [[]],
            isDedicatedFund: [null],
            portfolioCurrencyHedge: [[], this.validators.ngSelectRequired],
            classification: [[], this.validators.ngSelectRequired],
            globalIntermediaryIdentification: [null, this.validators.giin],
            delegatedManagementCompany: [[]],
            investmentAdvisorID: [null],
            auditorID: [[]],
            taxAuditorID: [[]],
            legalAdvisorID: [[]],
            directors: [null],
            hasEmbeddedDirective: [null],
            hasCapitalPreservation: [null],
            capitalPreservationLevel: [null, Validators.compose([
                Validators.min(0),
                Validators.max(100),
            ])],
            capitalPreservationPeriod: [null],
            capitalisationDate: [null, this.validators.date.day],
            hasCppi: [null],
            cppiMultiplier: [null],
            hasHedgeFundStrategy: [null],
            isLeveraged: [null],
            has130Or30Strategy: [null],
            isFundTargetingEos: [null],
            isFundTargetingSri: [null],
            isPassiveFund: [null],
            hasSecurityLending: [null],
            hasSwap: [null],
            hasDurationHedge: [null],
            useDefaultHolidayMgmt: [null],
            holidayMgmtConfig: [null],
            investmentObjective: [null],
            internalReference: ['', this.validators.internalReference],
            additionalNotes: ['', this.validators.additionalNotes],
        });

        this.umbrellaForm.addControl('umbrellaFund', this.umbrellaControl);
        this.umbrellaEditForm.addControl('umbrellaFund', this.umbrellaControl);
        this.umbrellaForm.addControl('umbrellaFundID', this.umbrellaControl);

        this.umbrellaControl.valueChanges
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((d) => {
            if (!d || !d.length) {
                this.selectedUmbrella = null;
                return;
            }

            if (d[0].id === '0') {
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
                this.umbrellaForm.controls['umbrellaFundDomicile']
                .setValue(FundComponent.getListItemText(newUmbrella.domicile, this.domicileItems));

                this.umbrellaEditForm.controls['umbrellaEditLei']
                .setValue(newUmbrella.legalEntityIdentifier);
                this.umbrellaEditForm.controls['umbrellaEditFundDomicile']
                .setValue(FundComponent.getListItemText(newUmbrella.domicile, this.domicileItems));
                this.umbrellaEditForm.controls['auditorID']
                .setValue(FundComponent.getListItemText(newUmbrella.auditorID, this.auditorItems));
                this.umbrellaEditForm.controls['centralisingAgentID']
                .setValue(FundComponent.getListItemText(newUmbrella.centralisingAgentID, this.centralizingAgentItems));
                this.umbrellaEditForm.controls['custodianBankID']
                .setValue(FundComponent.getListItemText(newUmbrella.custodianBankID, this.custodianBankItems));
                this.umbrellaEditForm.controls['delegatedManagementCompanyID']
                .setValue(FundComponent.getListItemText(newUmbrella.delegatedManagementCompanyID, this.managementCompanyItems));
                this.umbrellaEditForm.controls['directors']
                .setValue(newUmbrella.directors);
                this.umbrellaEditForm.controls['domicile']
                .setValue(FundComponent.getListItemText(newUmbrella.domicile, this.domicileItems));
                this.umbrellaEditForm.controls['fundAdministratorID']
                .setValue(FundComponent.getListItemText(newUmbrella.fundAdministratorID, this.fundAdministratorItems));
                this.umbrellaEditForm.controls['giin']
                .setValue(newUmbrella.giin);
                this.umbrellaEditForm.controls['investmentAdvisorID']
                .setValue(newUmbrella.investmentAdvisorID);
                this.umbrellaEditForm.controls['legalAdvisorID']
                .setValue(FundComponent.getListItemText(newUmbrella.legalAdvisorID, this.legalAdvisorItems));
                this.umbrellaEditForm.controls['legalEntityIdentifier']
                .setValue(newUmbrella.legalEntityIdentifier);
                this.umbrellaEditForm.controls['managementCompanyID']
                .setValue(FundComponent.getListItemText(newUmbrella.managementCompanyID, this.managementCompanyItems));
                this.umbrellaEditForm.controls['payingAgentID']
                .setValue(this.getListItems(newUmbrella.payingAgentID, this.payingAgentItems));
                this.umbrellaEditForm.controls['principlePromoterID']
                .setValue(this.getListItems(newUmbrella.principlePromoterID, this.principalPromoterItems));
                this.umbrellaEditForm.controls['registerOffice']
                .setValue(newUmbrella.registerOffice);
                this.umbrellaEditForm.controls['registerOfficeAddress']
                .setValue(newUmbrella.registerOfficeAddress);
                this.umbrellaEditForm.controls['registerOfficeAddressLine2']
                .setValue(newUmbrella.registerOfficeAddressLine2);
                this.umbrellaEditForm.controls['registerOfficeAddressZipCode']
                .setValue(newUmbrella.registerOfficeAddressZipCode);
                this.umbrellaEditForm.controls['registerOfficeAddressCity']
                .setValue(newUmbrella.registerOfficeAddressCity);
                this.umbrellaEditForm.controls['registerOfficeAddressCountry']
                .setValue(FundComponent.getListItemText(newUmbrella.registerOfficeAddressCountry, this.domicileItems));
                this.umbrellaEditForm.controls['taxAuditorID']
                .setValue(FundComponent.getListItemText(newUmbrella.taxAuditorID, this.taxAuditorItems));
                this.umbrellaEditForm.controls['transferAgentID']
                .setValue(FundComponent.getListItemText(newUmbrella.transferAgentID, this.transferAgentItems));

                if (newUmbrella.umbrellaFundCreationDate) {
                    this.umbrellaEditForm.controls['umbrellaFundCreationDate']
                    .setValue(newUmbrella.umbrellaFundCreationDate.split(' ', 1)[0]);
                }

                this.umbrellaEditForm.controls['umbrellaFundID']
                .setValue(newUmbrella.umbrellaFundID);
                this.umbrellaEditForm.controls['umbrellaFundName']
                .setValue(newUmbrella.umbrellaFundName);
                this.umbrellaEditForm.controls['umbrellaInternalReference']
                .setValue(newUmbrella.internalReference);
                this.umbrellaEditForm.controls['internalReference']
                .setValue(newUmbrella.internalReference);
                this.umbrellaEditForm.controls['additionalNotes']
                .setValue(newUmbrella.additionalNotes);

                this.fundForm.controls['isFundStructure'].setValue(this.enums.isFundStructure.UMBRELLA.toString());

                this.fundForm.controls['domicile']
                .setValue(FundComponent.getListItem(newUmbrella.domicile, this.domicileItems));
                this.fundForm.controls['managementCompanyID']
                .setValue(FundComponent.getListItem(newUmbrella.managementCompanyID, this.managementCompanyItems));
                this.fundForm.controls['fundAdministratorID']
                .setValue(FundComponent.getListItem(newUmbrella.fundAdministratorID, this.fundAdministratorItems));
                this.fundForm.controls['custodianBankID']
                .setValue(FundComponent.getListItem(newUmbrella.custodianBankID, this.custodianBankItems));
                this.fundForm.controls['investmentAdvisorID']
                .setValue(newUmbrella.investmentAdvisorID);
                this.fundForm.controls['payingAgentID']
                .setValue(this.getListItems(newUmbrella.payingAgentID, this.payingAgentItems));
                this.fundForm.controls['delegatedManagementCompany']
                .setValue(FundComponent.getListItem(newUmbrella.delegatedManagementCompanyID, this.managementCompanyItems));
                this.fundForm.controls['auditorID']
                .setValue(FundComponent.getListItem(newUmbrella.auditorID, this.auditorItems));
                this.fundForm.controls['taxAuditorID']
                .setValue(FundComponent.getListItem(newUmbrella.taxAuditorID, this.taxAuditorItems));
                this.fundForm.controls['principlePromoterID']
                .setValue(this.getListItems(newUmbrella.principlePromoterID, this.principalPromoterItems));
                this.fundForm.controls['legalAdvisorID']
                .setValue(FundComponent.getListItem(newUmbrella.legalAdvisorID, this.legalAdvisorItems));
                this.fundForm.controls['directors'].setValue(newUmbrella.directors);
            }
            this.selectedUmbrella = d[0].id;
            return;
        });

        this.fundForm.controls['domicile'].valueChanges
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((d) => {
            this.fundForm.controls['transferAgentID'].setValue([]);
            this.fundForm.controls['centralizingAgentID'].setValue([]);
            this.fundForm.controls['homeCountryLegalType'].setValue([]);

            if (d && this.isHomeCountryLegalTypeVisible()) {
                this.homeCountryLegalTypeItems = this.fundItems.homeCountryLegalTypeItems[d[0].id] || [];
            } else {
                this.homeCountryLegalTypeItems = [];
                this.fundForm.controls['homeCountryLegalType'].clearValidators();
                this.fundForm.controls['homeCountryLegalType'].updateValueAndValidity();
            }
        });

        this.fundForm.controls['isEuDirective'].valueChanges
        .pipe(
            takeUntil(this.unSubscribe),
        )
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
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((d) => {
            if (_.get(d, ['0', 'id'], false) !== this.enums.typeOfEuDirective.UCITS) {
                this.fundForm.controls['UcitsVersion'].setValue([]);
                this.fundForm.controls['UcitsVersion'].clearValidators();
                this.fundForm.controls['UcitsVersion'].updateValueAndValidity();
            } else {
                this.fundForm.controls['UcitsVersion'].setValidators(Validators.required);
            }
        });

        this.fundForm.controls['legalForm'].valueChanges
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((d) => {
            this.fundForm.controls['nationalNomenclatureOfLegalForm'].setValue([]);
            if (!d || !d[0]) {
                this.nationalNomenclatureOfLegalFormItems = [];
                return;
            }
            this.nationalNomenclatureOfLegalFormItems = this.fundItems.nationalNomenclatureOfLegalFormItems[d[0].id] || [];
            if (this.nationalNomenclatureOfLegalFormItems.length === 1) {
                this.fundForm.controls['nationalNomenclatureOfLegalForm'].setValue([this.nationalNomenclatureOfLegalFormItems[0]]);
            }
        });

        this.fundForm.controls['hasCapitalPreservation'].valueChanges
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((d) => {
            if (d === this.enums.hasCapitalPreservation.NO.toString()) {
                this.fundForm.controls['capitalPreservationLevel'].setValue(null);
                this.fundForm.controls['capitalPreservationPeriod'].setValue(null);
                this.fundForm.controls['capitalisationDate'].setValue(null);
                this.isFundCapitalisationDateVisible = false;
            }
        });

        this.fundForm.controls['capitalPreservationPeriod'].valueChanges
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((d) => {
            if (d && d[0] && d[0].text === 'None') {
                this.isFundCapitalisationDateVisible = true;
            } else {
                this.isFundCapitalisationDateVisible = false;
            }
        });

        this.fundForm.controls['hasCppi'].valueChanges
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((d) => {
            if (d === this.enums.hasCppi.NO.toString()) {
                this.fundForm.controls['cppiMultiplier'].setValue(null);
            }
        });

        this.umbrellaFundList$
        .pipe(
            takeUntil(this.unSubscribe),
        )
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

        combineLatest(
            this.fundList$,
            this.managementCompanyAccessList$,
            this.umbrellaFundList$,
            this.route.params,
            this.route.queryParams,
        )
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe(([funds, m, u, params, queryParams]) => {
            if (!Object.keys(funds) || !Object.keys(m) || !Object.keys(u)) {
                return;
            }
            this.setManagementCompanyItems(m);
            this.setFundList(funds);
            this.param = params.id;
            this.prefill = queryParams.prefill;
            if (queryParams.prefill) {
                this.fundControl.setValue(
                    FundComponent.getListItem(queryParams.prefill, this.fundListItems),
                );
            }
            if (
                this.managementCompanyItems.length > 0
                && this.fundList.length > 0
                && (this.param || this.prefill)
            ) {
                this.fillFormByFundID(this.param || this.prefill);
                this.viewMode = 'FUND';
                return;
            }
        });

        this.reqConfig$.pipe(
            takeUntil(this.unSubscribe))
        .subscribe((requested) => {
            this.requestConfig(requested);
        });

        this.config$.pipe(
            takeUntil(this.unSubscribe))
        .subscribe((config) => {
            this.productConfig = config;
        });

        this.currencyList$
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((d) => {
            const data = d.toJS();

            if (!data.length) {
                return [];
            }

            this.fundCurrencyItems = this.sortingList(data);
        });
    }

    sortingList(updateList){
        return _.sortBy(updateList, 'text');
    }
    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            if (params.fromShare) {
                this.currentRoute.fromShare = true;
            }
            if (params.umbrella) {
                this.waitForCurrentUmbrella(params.umbrella);
            }
        });

        this.fundControl.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((item) => {
                if (!item || !item.length) {
                    this.umbrellaControl.reset();
                    this.umbrellaEditForm.reset();
                    this.fundForm.reset();
                    return;
                }
                this.fillFormByFundID(item[0].id);
                this.changeDetectorRef.markForCheck();
            });

        this.leiListOb
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((leiList) => {
                this.leiList = leiList;

                if (this.fundForm) {
                    this.fundForm.controls.legalEntityIdentifier.updateValueAndValidity({
                        emitEvent: true,
                    });
                }
            });

        this.fundForm.controls['legalEntityIdentifier'].valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((val) => {
                if (!this.isLeiVisible) {
                    return;
                }

                const leiControl = this.fundForm.controls.legalEntityIdentifier;

                if (leiControl.errors) {
                    return;
                }

                if (!val || !this.isLeiAlreadyExisting(val)) {
                    return;
                }

                leiControl
                    .setErrors({
                        isAlreadyExisting: true,
                    });
            });

        this.leiService.fetchLEIs();

        this.permissionsService.hasPermission('manageFund', 'canUpdate').then(
            (hasPermission) => {
                this.hasPermissionUpdateFund = hasPermission;
            },
        );
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

    fundFormValue() {
        return {
            ...this.fundForm.getRawValue(),
            isFundStructure: Number(this.fundForm.controls.isFundStructure.value),
            isEuDirective: Number(this.fundForm.controls.isEuDirective.value),
            openOrCloseEnded: Number(this.fundForm.controls.openOrCloseEnded.value),
            isFundOfFund: Number(this.fundForm.controls.isFundOfFund.value),
            isDedicatedFund: Number(this.fundForm.controls.isDedicatedFund.value),
            useDefaultHolidayMgmt: Number(this.fundForm.controls.useDefaultHolidayMgmt.value),
            hasEmbeddedDirective: !_.isNull(this.fundForm.controls.hasEmbeddedDirective.value)
                ? Number(this.fundForm.controls.hasEmbeddedDirective.value)
                : null,
            hasCapitalPreservation: !_.isNull(this.fundForm.controls.hasCapitalPreservation.value)
                ? Number(this.fundForm.controls.hasCapitalPreservation.value)
                : null,
            hasCppi: !_.isNull(this.fundForm.controls.hasCppi.value)
                ? Number(this.fundForm.controls.hasCppi.value)
                : null,
            hasHedgeFundStrategy: !_.isNull(this.fundForm.controls.hasHedgeFundStrategy.value)
                ? Number(this.fundForm.controls.hasHedgeFundStrategy.value)
                : null,
            isLeveraged: !_.isNull(this.fundForm.controls.isLeveraged.value)
                ? Number(this.fundForm.controls.isLeveraged.value)
                : null,
            has130Or30Strategy: !_.isNull(this.fundForm.controls.has130Or30Strategy.value)
                ? Number(this.fundForm.controls.has130Or30Strategy.value)
                : null,
            isFundTargetingEos: !_.isNull(this.fundForm.controls.isFundTargetingEos.value)
                ? Number(this.fundForm.controls.isFundTargetingEos.value)
                : null,
            isFundTargetingSri: !_.isNull(this.fundForm.controls.isFundTargetingSri.value)
                ? Number(this.fundForm.controls.isFundTargetingSri.value)
                : null,
            isPassiveFund: !_.isNull(this.fundForm.controls.isPassiveFund.value)
                ? Number(this.fundForm.controls.isPassiveFund.value)
                : null,
            hasSecurityLending: !_.isNull(this.fundForm.controls.hasSecurityLending.value)
                ? Number(this.fundForm.controls.hasSecurityLending.value)
                : null,
            hasSwap: !_.isNull(this.fundForm.controls.hasSwap.value)
                ? Number(this.fundForm.controls.hasSwap.value)
                : null,
            hasDurationHedge: !_.isNull(this.fundForm.controls.hasDurationHedge.value)
                ? Number(this.fundForm.controls.hasDurationHedge.value)
                : null,

            registerOfficeAddressCountry: _.get(this.fundForm.controls['registerOfficeAddressCountry'].value, ['0', 'id'], null),
            domicile: _.get(this.fundForm.controls['domicile'].value, ['0', 'id'], null),
            typeOfEuDirective: _.get(this.fundForm.controls['typeOfEuDirective'].value, ['0', 'id'], null),
            UcitsVersion: _.get(this.fundForm.controls['UcitsVersion'].value, ['0', 'id'], null),
            legalForm: _.get(this.fundForm.controls['legalForm'].value, ['0', 'id'], null),
            nationalNomenclatureOfLegalForm: _.get(this.fundForm.controls['nationalNomenclatureOfLegalForm'].value, ['0', 'id'], null),
            homeCountryLegalType: _.get(this.fundForm.controls['homeCountryLegalType'].value, ['0', 'id'], null),
            fundCurrency: _.get(this.fundForm.controls['fundCurrency'].value, ['0', 'id'], null),
            portfolioCurrencyHedge: _.get(this.fundForm.controls['portfolioCurrencyHedge'].value, ['0', 'id'], null),
            classification: _.get(this.fundForm.controls['classification'].value, ['0', 'id'], null),
            auditorID: _.get(this.fundForm.controls['auditorID'].value, ['0', 'id'], null),
            taxAuditorID: _.get(this.fundForm.controls['taxAuditorID'].value, ['0', 'id'], null),
            legalAdvisorID: _.get(this.fundForm.controls['legalAdvisorID'].value, ['0', 'id'], null),
            fundAdministratorID: _.get(this.fundForm.controls['fundAdministratorID'].value, ['0', 'id'], null),
            custodianBankID: _.get(this.fundForm.controls['custodianBankID'].value, ['0', 'id'], null),
            investmentManagerID: _.get(this.fundForm.controls['investmentManagerID'].value, ['0', 'id'], null),
            principlePromoterID: this.getIdsFromList(this.fundForm.controls['principlePromoterID'].value),
            payingAgentID: this.getIdsFromList(this.fundForm.controls['payingAgentID'].value),
            managementCompanyID: _.get(this.fundForm.controls['managementCompanyID'].value, ['0', 'id'], null),
            delegatedManagementCompany: !_.isNull(_.get(this.fundForm.controls['delegatedManagementCompany'].value, ['0', 'id'], null))
                ? Number(_.get(this.fundForm.controls['delegatedManagementCompany'].value, ['0', 'id'], null))
                : null,
            umbrellaFundID: !_.isNull(_.get(this.umbrellaControl.value, ['0', 'id'], null))
                ? Number(_.get(this.umbrellaControl.value, ['0', 'id'], null))
                : null,
            transferAgentID: _.get(this.fundForm.controls['transferAgentID'].value, ['0', 'id'], null),
            centralizingAgentID: _.get(this.fundForm.controls['centralizingAgentID'].value, ['0', 'id'], null),
            capitalPreservationPeriod: _.get(this.fundForm.controls['capitalPreservationPeriod'].value, ['0', 'id'], null),
            holidayMgmtConfig: this.getHolidayMgmtConfig(),
            legalEntityIdentifier: this.isLeiVisible ? this.fundForm.controls['legalEntityIdentifier'].value : null,
            fundCreationDate: this.fundForm.controls['fundCreationDate'].value || null,
            fundLaunchDate: this.fundForm.controls['fundLaunchDate'].value || null,
            fiscalYearEnd: this.fundForm.controls['fiscalYearEnd'].value || null,
            capitalisationDate: this.fundForm.controls['capitalisationDate'].value || null,
        };
    }

    private requestConfig(requested: boolean): void {
        if (requested) return;

        OfiProductConfigService.defaultRequestProductConfig(this.ofiProductConfigService, this.ngRedux);
    }

    static getListItemText(value: string | number, list: { id: string | number, text: string }[]): string {
        const listItem = FundComponent.getListItem(value, list);
        return listItem.length ? listItem[0].text : '';
    }

    static getListItem(
        value: string | number,
        list: { id: string | number, text: string }[],
    ): { id: any, text: string }[] {
        if (value === null) {
            return [];
        }

        // const val = (typeof value === 'number') ? String(value) : value;
        const item = _.find(list, { id: value });

        if (!item) {
            return [];
        }
        return [item];
    }

    getListItems(val: any[], list: { id: string, text: string }[]): { id: string, text: string }[] {
        if (!val || !val.length) {
            return [];
        }

        return val.map((id: number) => {
            const newItem = FundComponent.getListItem(id, list);
            if (!newItem.length) {
                return null;
            }
            return newItem[0];
        }).filter(d => d !== null);
    }

    getIdsFromList(val: { id: string, text: string }[]): string[] {
        if (!val.length) {
            return [];
        }
        return val.map(item => item.id);
    }

    getEuDirectiveType() {
        return _.get(this.fundForm.controls['typeOfEuDirective'].value, ['0', 'id'], false);
    }

    /**
     * Toggle the visibility of form elements given the selection of an Umbrella Fund
     *
     * @return {boolean}
     */
    isUmbrellaSelected() {
        const umb = _.get(this.umbrellaEditForm.controls['umbrellaFund'].value, ['0', 'id'], false);
        return umb !== false && umb !== '0';
    }

    /**
     * Toggle the visibility of the homeCountryLegalType form control given the selected domicile
     *
     * @return {boolean}
     */
    isHomeCountryLegalTypeVisible() {
        const id = _.get(this.fundForm.controls['domicile'].value, ['0', 'id'], false);
        if (!id) {
            return false;
        }
        const homeCountryLegalTypesKeys = Object.keys(this.fundItems.homeCountryLegalTypeItems);
        return homeCountryLegalTypesKeys.indexOf(id) !== -1;
    }

    /**
     * Toggle the visibility of the nationalNomenclatureOfLegalForm form control given the value of legalForm
     *
     * @return {boolean}
     */
    isNationalNomenclatureOfLegalFormVisible() {
        return _.get(this.fundForm.controls['legalForm'].value, ['length'], false);
    }

    /**
     * Toggle the visibility of the transferAgentID form control given the selected domicile
     *
     * @return {boolean}
     */
    isTransferAgentActive() {
        const id = _.get(this.fundForm.controls['domicile'].value, ['0', 'id'], false);
        return id === 'IE' || id === 'LU';
    }

    /**
     * Toggle the visibility of the centralisingAgentID form control given the selected domicile
     *
     * @return {boolean}
     */
    isCentralizingAgentActive() {
        const id = _.get(this.fundForm.controls['domicile'].value, ['0', 'id'], false);
        return id === 'FR';
    }

    /**
     * Check for the existence of an LEI in the leiList
     *
     * @param {string} currentLei
     * @return {boolean}
     */
    isLeiAlreadyExisting(currentLei: string): boolean {
        // if undefined the LEI won't exist
        if (!currentLei) return false;

        // if the LEI is equal to the current LEI for this umbrella fund, that is ok
        if (currentLei === this.currentLei) return false;

        // otherwise if LEI is a match with the list, then it does exist
        return this.leiList.indexOf(currentLei) !== -1;
    }

    /**
     * Set the managementCompanyItems
     *
     * @param {any} funds
     * @return {void | object}
     */
    setManagementCompanyItems(d) {
        const values = _.values(d);
        if (!values.length) {
            return [];
        }
        this.managementCompanyItems = values.map((item) => {
            return {
                id: item.companyID,
                text: item.companyName,
            };
        });
    }

    /**
     * Set the fundList and fundListItems
     *
     * @param {any} funds
     * @return {void | object}
     */
    setFundList(funds): void | object {
        if (!Object.keys(funds).length) {
            this.fundList = [];
            this.fundListItems = [];
            return;
        }

        this.fundListItems = Object.keys(funds).map((key) => {
            return {
                id: key,
                text: funds[key].fundName,
            };
        });

        this.fundList = Object.keys(funds).map((key) => {
            const fund = funds[key];

            const homeCountryLegalTypeItems = this.fundItems.homeCountryLegalTypeItems[fund.domicile] || [];
            const nationalNomenclatureOfLegalFormItems = this.fundItems
                .nationalNomenclatureOfLegalFormItems[fund.legalForm];

            return {
                ...fund,
                registerOfficeAddressCountry: FundComponent.getListItem(fund.registerOfficeAddressCountry, this.domicileItems),
                domicile: FundComponent.getListItem(fund.domicile, this.domicileItems),
                typeOfEuDirective: FundComponent.getListItem(
                    fund.typeOfEuDirective,
                    this.typeOfEuDirectiveItems,
                ),
                UcitsVersion: FundComponent.getListItem(fund.UcitsVersion, this.UcitsVersionItems),
                legalForm: FundComponent.getListItem(fund.legalForm, this.legalFormItems),
                nationalNomenclatureOfLegalForm: FundComponent.getListItem(
                    fund.nationalNomenclatureOfLegalForm,
                    nationalNomenclatureOfLegalFormItems,
                ),
                homeCountryLegalType: FundComponent.getListItem(
                    fund.homeCountryLegalType,
                    homeCountryLegalTypeItems,
                ),
                fundCurrency: FundComponent.getListItem(fund.fundCurrency, this.fundCurrencyItems),
                managementCompanyID: FundComponent.getListItem(
                    fund.managementCompanyID,
                    this.managementCompanyItems,
                ),
                fundAdministratorID: FundComponent.getListItem(
                    fund.fundAdministratorID,
                    this.fundAdministratorItems,
                ),
                custodianBankID: FundComponent.getListItem(fund.custodianBankID, this.custodianBankItems),
                investmentManagerID: FundComponent.getListItem(
                    fund.investmentManagerID,
                    this.investmentManagerItems,
                ),
                principlePromoterID: this.getListItems(fund.principlePromoterID, this.principalPromoterItems),
                payingAgentID: this.getListItems(fund.payingAgentID, this.payingAgentItems),
                portfolioCurrencyHedge: FundComponent.getListItem(
                    fund.portfolioCurrencyHedge,
                    this.portfolioCurrencyHedgeItems,
                ),
                classification: FundComponent.getListItem(
                    fund.classification,
                    this.classificationItems,
                ),
                investmentAdvisorID: fund.investmentAdvisorID,
                auditorID: FundComponent.getListItem(fund.auditorID, this.auditorItems),
                taxAuditorID: FundComponent.getListItem(fund.taxAuditorID, this.taxAuditorItems),
                legalAdvisorID: FundComponent.getListItem(fund.legalAdvisorID, this.legalAdvisorItems),
                capitalPreservationPeriod: FundComponent.getListItem(
                    fund.capitalPreservationPeriod,
                    this.capitalPreservationPeriodItems,
                ),
                transferAgentID: FundComponent.getListItem(fund.transferAgentID, this.transferAgentItems),
                centralizingAgentID: FundComponent.getListItem(
                    fund.centralizingAgentID,
                    this.centralizingAgentItems,
                ),
                delegatedManagementCompany: FundComponent.getListItem(
                    fund.delegatedManagementCompany,
                    this.managementCompanyItems,
                ),
                holidayMgmtConfig: JSON.parse(fund.holidayMgmtConfig),
            };
        });
    }

    /**
     * Populate the fundForm
     *
     * @param {string} fundID
     * @return {void}
     */
    fillFormByFundID(fundID: string): void {
        const fund = _.find(this.fundList, { fundID: Number(fundID) });
        if (fund.umbrellaFundID) {
            this.umbrellaControl.setValue(
                FundComponent.getListItem(fund.umbrellaFundID, this.umbrellaItems),
            );
        } else {
            this.umbrellaControl.setValue([
                this.umbrellaItems[0],
            ]);
        }

        this.homeCountryLegalTypeItems = this.fundItems.homeCountryLegalTypeItems[fund.domicile] || [];
        this.nationalNomenclatureOfLegalFormItems = this.fundItems.nationalNomenclatureOfLegalFormItems[fund.legalForm];

        this.currDraft = fund.draft;

        this.fundForm.setValue({
            ..._.omit(fund, [
                'fundID',
                'umbrellaFundID',
                'umbrellaFundName',
                'companyName',
                'draft',
                'draftUser',
                'draftDate',
            ]),
            fundName: this.param ? fund.fundName : '',
            legalEntityIdentifier: this.param ? fund.legalEntityIdentifier : '',

            // formatting for radio inputs
            isFundStructure: fund.isFundStructure.toString(),
            isEuDirective: fund.isEuDirective.toString(),
            openOrCloseEnded: fund.openOrCloseEnded.toString(),
            isFundOfFund: fund.isFundOfFund.toString(),
            isDedicatedFund: fund.isDedicatedFund.toString(),
            useDefaultHolidayMgmt: fund.useDefaultHolidayMgmt.toString(),
            hasEmbeddedDirective: !_.isNull(fund.hasEmbeddedDirective) ? fund.hasEmbeddedDirective.toString() : null,
            hasCapitalPreservation: !_.isNull(fund.hasCapitalPreservation) ? fund.hasCapitalPreservation.toString() : null,
            hasCppi: !_.isNull(fund.hasCppi) ? fund.hasCppi.toString() : null,
            hasHedgeFundStrategy: !_.isNull(fund.hasHedgeFundStrategy) ? fund.hasHedgeFundStrategy.toString() : null,
            isLeveraged: !_.isNull(fund.isLeveraged) ? fund.isLeveraged.toString() : null,
            has130Or30Strategy: !_.isNull(fund.has130Or30Strategy) ? fund.has130Or30Strategy.toString() : null,
            isFundTargetingEos: !_.isNull(fund.isFundTargetingEos) ? fund.isFundTargetingEos.toString() : null,
            isFundTargetingSri: !_.isNull(fund.isFundTargetingSri) ? fund.isFundTargetingSri.toString() : null,
            isPassiveFund: !_.isNull(fund.isPassiveFund) ? fund.isPassiveFund.toString() : null,
            hasSecurityLending: !_.isNull(fund.hasSecurityLending) ? fund.hasSecurityLending.toString() : null,
            hasSwap: !_.isNull(fund.hasSwap) ? fund.hasSwap.toString() : null,
            hasDurationHedge: !_.isNull(fund.hasDurationHedge) ? fund.hasDurationHedge.toString() : null,
        });
        this.toggleLeiSwitch(!!fund.legalEntityIdentifier);

        this.currentLei = fund.legalEntityIdentifier;

        if (this.isAdmin()) {
            this.fundForm.disable();
        }

        return;
    }

    waitForCurrentUmbrella(umbrellaID: string | number) {
        this.umbrellaFundList$
        .pipe(
            filter(umbrellas => umbrellas[umbrellaID]),
            take(1),
        )
        .subscribe((umbrellas) => {
            this.setCurrentUmbrella(umbrellas[umbrellaID]);
        });
    }

    /**
     * Set the current Umbrella Fund and update URL
     *
     * @param {any}
     * @return {void}
     */
    setCurrentUmbrella(umbrella): void {
        this.umbrellaControl.setValue([{
            id: umbrella.umbrellaFundID,
            text: umbrella.umbrellaFundName,
        }]);
        const newUrl = this.router.createUrlTree([], {
            queryParams: { umbrella: null },
            queryParamsHandling: 'merge',
        });
        this.location.replaceState(this.router.serializeUrl(newUrl));

        this.changeDetectorRef.markForCheck();
    }

    /**
     * Hide the fund creation forms
     *
     * @return {void}
     */
    submitUmbrellaForm(): void {
        this.viewMode = 'FUND';
    }

    /**
     * Save/Update a Fund
     *
     * @return {void}
     */
    submitFundForm() {
        if (!this.fundForm.valid) {
            return;
        }

        const payload: Fund = {
            draft: 0,
            ...this.fundFormValue(),
        };

        if (!this.param) {
            this.fundService.iznCreateFund(payload)
            .then((fund) => {
                const fundID = _.get(fund, ['1', 'Data', '0', 'fundID']);
                const fundName = _.get(fund, ['1', 'Data', '0', 'fundName']);

                if (!_.isUndefined(fundID)) {
                    if (this.currentRoute.fromShare) {
                        this.redirectToShare(fundID);
                    } else {
                        this.displaySharePopup(fundName, fundID);
                    }
                } else {
                    this.creationSuccess(fundName);
                }
                this.fundService.fetchFundList();
                return;
            })
            .catch((err) => {
                let errMsg = _.get(err, ['1', 'Data', '0', 'Message'], '');

                if (errMsg) {
                    errMsg = this.translate.translate(errMsg);
                }

                this.toasterService.pop(
                    'error',
                    this.translate.translate(
                        'Failed to create the Fund. @errMsg@',
                        { 'errMsg': errMsg },
                    ),
                );
                return;
            });
        } else {
            this.fundService.iznUpdateFund(this.param, payload)
            .then(() => {
                this.toasterService.pop(
                    'success',
                    this.translate.translate(
                        '@fundName@ has been successfully updated.',
                        { 'fundName': this.fundForm.controls['fundName'].value },
                    ),
                );
                this.fundService.fetchFundList();
                this.location.back();
                return;
            })
            .catch((err) => {
                let errMsg = _.get(err, '[1].Data[0].Message', '');
                errMsg = this.translate.translate(errMsg);

                this.toasterService.pop(
                    'error',
                    this.translate.translate(
                        'Failed to create the Fund. @errMsg@',
                        { 'errMsg': errMsg },
                    ),
                );
                return;
            });
        }
    }

    /**
     * Save/Update a Fund Draft
     *
     * @return {void}
     */
    saveDraft() {
        const payload: Fund = {
            draft: 1,
            ...this.fundFormValue(),
        };

        if (!this.param) {

            this.fundService.iznCreateFund(payload)
            .then(() => {
                this.toasterService.pop(
                    'success',
                    this.translate.translate(
                        '@fundName@ draft has been successfully saved.',
                        { 'fundName': this.fundForm.controls['fundName'].value },
                    ),
                );
                this.fundService.fetchFundList();
                this.location.back();
                return;
            })
            .catch((err) => {
                let errMsg = _.get(err, '[1].Data[0].Message', '');
                errMsg = this.translate.translate(errMsg);

                this.toasterService.pop(
                    'error',
                    this.translate.translate(
                        'Failed to create the Fund. @errMsg@',
                        { 'errMsg': errMsg },
                    ),
                );
                return;
            });
        } else {
            this.fundService.iznUpdateFund(this.param, payload)
            .then(() => {
                this.toasterService.pop(
                    'success',
                    this.translate.translate(
                        '@fundName@ draft has been successfully updated.',
                        { 'fundName': this.fundForm.controls['fundName'].value },
                    ),
                );
                this.fundService.fetchFundList();
                this.location.back();
                return;
            })
            .catch((err) => {
                let errMsg = _.get(err, '[1].Data[0].Message', '');
                errMsg = this.translate.translate(errMsg);

                this.toasterService.pop(
                    'error',
                    this.translate.translate(
                        'Failed to create the Fund. @errMsg@',
                        { 'errMsg': errMsg },
                    ),
                );
                return;
            });
        }
    }

    /**
     * Redirect to the new Fund Share page
     *
     * @param {string} fundID
     * @return {void}
     */
    redirectToShare(fundID?) {
        let query = {};
        if (fundID) {
            query = { fund: fundID };
        }
        this.router.navigate(['/product-module/product/fund-share/new'], { queryParams: query });
    }

    /**
     * Duplicate a Fund
     *
     * @param {string} fundID
     * @return {void}
     */
    duplicate(fundID: string) {
        this.router.navigateByUrl(`/product-module/product/fund/new?prefill=${fundID}`);
    }

    /**
     * Redirect to the Fund Audit page
     *
     * @param {string} fundID
     * @return {void}
     */
    auditTrail(fundID: string) {
        this.router.navigateByUrl(`${this.isAdmin() ? ADMIN_USER_URL : '/product-module/'}product/fund/${fundID}/audit`);
    }

    /**
     * Check whether the userType is an IZNES Admin User
     *
     * @return {boolean}
     */
    isAdmin(): boolean {
        return this.router.url.startsWith(ADMIN_USER_URL);
    }

    /**
     * Show Share creation confirmation modal
     *
     * @param {string} fundName
     * @param {any} fundID
     * @return {void}
     */
    displaySharePopup(fundName: string, fundID: any): void {
        const message = `<span>${this.translate.translate('By clicking "Yes", you will be able to create a share directly linked to @fundName@.', { 'fundName': fundName })}</span>`;

        this.confirmationService.create(
            `<span>${this.translate.translate('Do you want to create a Share?')}</span>`,
            message,
            { confirmText: this.translate.translate('Yes'), declineText: this.translate.translate('No') },
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.redirectToShare(fundID);

            } else {
                this.creationSuccess(fundName);
            }
        });
    }

    /**
     * Show Fund successfully created toaster
     *
     * @param {string} fundName
     * @return {void}
     */
    creationSuccess(fundName) {
        this.toasterService.pop(
            'success',
            this.translate.translate(
                '@fundName@ has been successfully created.',
                { 'fundName': fundName },
            ),
        );
        this.router.navigateByUrl('/product-module/product');
    }

    onClickBack() {
        this.router.navigateByUrl(`${this.isAdmin() ? ADMIN_USER_URL : '/product-module/'}product`);
    }

    /**
     * Set list of holiday dates from the datepicker
     *
     * @return {void}
     */
    setHolidayMgmtConfig(dates: () => string[]): void {
        this.holidayMgmtConfigDates = dates;
    }

    /**
     * Get list of holiday dates in json format
     *
     * @return {string}
     */
    getHolidayMgmtConfig(): string {
        /*
        if (this.fundForm.value.useDefaultHolidayMgmt === '0') {
            return JSON.stringify(this.holidayMgmtConfigDates());
        }
        */

        return JSON.stringify([]);
    }

    /**
     * Toggle the visibility of the Default Holiday Management Configuration datepicker
     *
     * @param {boolean} nextState
     * @return {void}
     */
    showHolidayMgmtConfig(): boolean {
        return this.fundForm.value.useDefaultHolidayMgmt === '0';
    }

    /**
     * Toggle the visibility and validity of the legalEntityIdentifier form control
     *
     * @param {boolean} nextState
     * @return {void}
     */
    toggleLeiSwitch(nextState: boolean) {
        if (!nextState) {
            this.fundForm.controls['legalEntityIdentifier'].disable();
            this.fundForm.controls['legalEntityIdentifier'].clearValidators();
        } else {
            this.fundForm.controls['legalEntityIdentifier'].enable();
            this.fundForm.controls['legalEntityIdentifier'].setValidators(Validators.compose([
                Validators.required,
                this.validators.lei,
            ]));
        }
        this.isLeiVisible = nextState;
    }
}
