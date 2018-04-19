// Vendor
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, Inject} from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import {fromJS} from 'immutable';
import {select, NgRedux} from '@angular-redux/store';
import {ActivatedRoute, Router, Params} from '@angular/router';

/* Internal */
import {Subscription} from 'rxjs/Subscription';

/* Services */
import {OfiUmbrellaFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';

/* Alert service. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ToasterService} from 'angular2-toaster';

/* Models */

/* Utils. */
import {APP_CONFIG, AppConfig, SagaHelper, NumberConverterService, commonHelper} from '@setl/utils';
import {Observable} from 'rxjs/Observable';
import * as math from 'mathjs';
import {Location} from '@angular/common';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-umbrella-fund',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UmbrellaFundComponent implements OnInit, AfterViewInit, OnDestroy {

    /* Public properties. */
    umbrellaFundForm: FormGroup;
    umbrellaFundList = [];
    managementCompanyList = [];

    showTransferAgent = false;
    showCentralizingAgent = false;

    umbrellaFund: any;
    umbrellaFundID: any = 0;
    editForm = false;
    showModal = false;
    showConfirmModal = false;
    modalTitle = '';
    modalText = '';

    mainInformationOpen = true;
    optionalInformationOpen = false;

    // Locale
    language = 'fr';

    // Datepicker config
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language
    };

    countries = [];

    fundAdminOptions = [];
    custodianBankOptions = [];
    investmentManagerOptions = [];
    investmentAdvisorOptions = [];
    payingagentOptions = [];
    auditorOptions = [];
    taxAuditorOptions = [];
    principalPromoterOptions = [];
    legalAdvisorOptions = [];

    /* Private properties. */
    subscriptionsArray: Array<Subscription> = [];

    /* Redux observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'requested']) requestedOfiUmbrellaFundListOb;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaFundAccessListOb;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'requested']) requestedOfiManagementCompanyListOb;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyAccessListOb;

    constructor(
        private _fb: FormBuilder,
        private ngRedux: NgRedux<any>,
        private _changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private _router: Router,
        private _location: Location,
        private _activatedRoute: ActivatedRoute,
        private _numberConverterService: NumberConverterService,
        private _toasterService: ToasterService,
        private _ofiUmbrellaFundService: OfiUmbrellaFundService,
        private _ofiManagementCompanyService: OfiManagementCompanyService,
        @Inject('product-config') productConfig,
    ) {

        this.countries = productConfig.fundItems.domicileItems;
        this.fundAdminOptions = productConfig.fundItems.fundAdministratorItems;
        this.custodianBankOptions = productConfig.fundItems.custodianBankItems;
        this.investmentManagerOptions = productConfig.fundItems.investmentManagerItems;
        this.investmentAdvisorOptions = productConfig.fundItems.investmentAdvisorItems;
        this.payingagentOptions = productConfig.fundItems.payingAgentItems;
        this.auditorOptions = productConfig.fundItems.auditorItems;
        this.taxAuditorOptions = productConfig.fundItems.taxAuditorItems;
        this.principalPromoterOptions = productConfig.fundItems.principalPromoterItems;
        this.legalAdvisorOptions = productConfig.fundItems.legalAdvisorItems;

        // param url
        this.subscriptionsArray.push(this._activatedRoute.params.subscribe(params => {
            this.umbrellaFundID = params['id'];
            if (typeof this.umbrellaFundID !== 'undefined' && this.umbrellaFundID !== '' && this.umbrellaFundID > 0) {
                this.editForm = true;
            }
        }));

        this.umbrellaFundForm = this._fb.group({
            umbrellaFundID: [
                '',
            ],
            umbrellaFundName: [
                '',
                Validators.compose([
                    Validators.required,
                    productConfig.alphanumeric,
                ])
            ],
            registerOffice: [
                '',
                Validators.compose([
                    Validators.required,
                    productConfig.alphanumeric,
                ])
            ],
            registerOfficeAddress: [
                '',
                Validators.compose([
                    Validators.required,
                    productConfig.alphanumeric,
                ])
            ],
            legalEntityIdentifier: [
                '',
                Validators.compose([
                    Validators.required,
                    productConfig.lei,
                ])
            ],
            domicile: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            umbrellaFundCreationDate: [
                '',
                Validators.compose([
                    Validators.required,
                    productConfig.validators.date.day,
                ])
            ],
            managementCompanyID: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            fundAdministratorID: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            custodianBankID: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            investmentManagerID: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            investmentAdvisorID: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            payingAgentID: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            transferAgentID: [
                '',
            ],
            centralisingAgentID: [
                '',
            ],
            giin: [
                '',
                productConfig.validators.giin,
            ],
            delegatedManagementCompanyID: [
                '',
            ],
            auditorID: [
                '',
            ],
            taxAuditorID: [
                '',
            ],
            principlePromoterID: [
                '',
            ],
            legalAdvisorID: [
                '',
            ],
            directors: [
                '',
                productConfig.alphanumeric,
            ],
        });

        this.subscriptionsArray.push(this.umbrellaFundForm.controls['domicile'].valueChanges.subscribe((form) => this.processFormChanges(form)));

        // language
        this.subscriptionsArray.push(this.requestLanguageObj.subscribe((d) => this.getLanguage(d)));
        this.subscriptionsArray.push(this.requestedOfiUmbrellaFundListOb.subscribe((requested) => this.getUmbrellaFundRequested(requested)));
        this.subscriptionsArray.push(this.umbrellaFundAccessListOb.subscribe((list) => this.getUmbrellaFundList(list)));
        this.subscriptionsArray.push(this.requestedOfiManagementCompanyListOb.subscribe((requested) => this.getManagementCompanyRequested(requested)));
        this.subscriptionsArray.push(this.managementCompanyAccessListOb.subscribe((list) => this.getManagementCompanyList(list)));
    }

    ngOnInit() {
    }

    ngAfterViewInit() {

    }

    getLanguage(language): void {
        if (!language) {
            return;
        }

        this.language = language.substr(0, 2);
        this.configDate = {
            ...this.configDate,
            locale: this.language,
        };
    }

    getUmbrellaFundRequested(requested): void {
        if (!requested) {
            OfiUmbrellaFundService.defaultRequestUmbrellaFundList(this._ofiUmbrellaFundService, this.ngRedux);
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
                delegatedManagementCompanyID: item.get('delegatedManagementCompanyID', 0),
                auditorID: item.get('auditorID', 0),
                taxAuditorID: item.get('taxAuditorID', 0),
                principlePromoterID: item.get('principlePromoterID', 0),
                legalAdvisorID: item.get('legalAdvisorID', 0),
                directors: item.get('directors', ''),
            });

            return result;
        }, []);

        if (this.editForm && this.umbrellaFundID !== 0 && this.managementCompanyList.length > 0) {
            this.fillForm();
        }

        this._changeDetectorRef.markForCheck();
    }

    getManagementCompanyRequested(requested): void {
        if (!requested) {
            OfiManagementCompanyService.defaultRequestManagementCompanyList(this._ofiManagementCompanyService, this.ngRedux);
        }
    }

    getManagementCompanyList(list) {
        const listImu = fromJS(list);

        this.managementCompanyList = listImu.reduce((result, item) => {

            result.push({
                id: item.get('companyID', 0),
                text: item.get('companyName', ''),
            });

            return result;
        }, []);

        if (this.editForm && this.umbrellaFundID !== 0 && this.managementCompanyList.length > 0) {
            this.fillForm();
        }

        this._changeDetectorRef.markForCheck();
    }

    fillForm(): void {
        this.umbrellaFund = this.umbrellaFundList.filter(element => element.umbrellaFundID.toString() === this.umbrellaFundID.toString());

        this.umbrellaFundForm.get('umbrellaFundID').patchValue(this.umbrellaFund[0].umbrellaFundID, {emitEvent: false});
        this.umbrellaFundForm.get('umbrellaFundName').patchValue(this.umbrellaFund[0].umbrellaFundName, {emitEvent: false});
        this.umbrellaFundForm.get('registerOffice').patchValue(this.umbrellaFund[0].registerOffice, {emitEvent: false});
        this.umbrellaFundForm.get('registerOfficeAddress').patchValue(this.umbrellaFund[0].registerOfficeAddress, {emitEvent: false});
        this.umbrellaFundForm.get('legalEntityIdentifier').patchValue(this.umbrellaFund[0].legalEntityIdentifier, {emitEvent: false});
        const domicile = this.countries.filter(element => element.id.toString() === this.umbrellaFund[0].domicile.toString());
        if (domicile.length > 0) {
            this.umbrellaFundForm.get('domicile').patchValue(domicile, {emitEvent: true});
        }
        this.umbrellaFundForm.get('umbrellaFundCreationDate').patchValue(this.umbrellaFund[0].umbrellaFundCreationDate, {emitEvent: false});
        const managementCompany = this.managementCompanyList.filter(element => element.id.toString() === this.umbrellaFund[0].managementCompanyID.toString());
        if (managementCompany.length > 0) {
            this.umbrellaFundForm.get('managementCompanyID').patchValue(managementCompany, {emitEvent: false});
        }
        console.log('fundAdministratorID', this.umbrellaFund[0].fundAdministratorID);
        const fundAdministrator = this.fundAdminOptions.filter(element => element.id.toString() === this.umbrellaFund[0].fundAdministratorID.toString());
        console.log('fundAdministrator', fundAdministrator);
        if (fundAdministrator.length > 0) {
            this.umbrellaFundForm.get('fundAdministratorID').patchValue(fundAdministrator, {emitEvent: false});
        }
        const custodianBank = this.custodianBankOptions.filter(element => element.id.toString() === this.umbrellaFund[0].custodianBankID.toString());
        if (custodianBank.length > 0) {
            this.umbrellaFundForm.get('custodianBankID').patchValue(custodianBank, {emitEvent: false});
        }
        const investmentManager = this.investmentManagerOptions.filter(element => element.id.toString() === this.umbrellaFund[0].investmentManagerID.toString());
        if (investmentManager.length > 0) {
            this.umbrellaFundForm.get('investmentManagerID').patchValue(investmentManager, {emitEvent: false});
        }
        const investmentAdvisor = this.investmentAdvisorOptions.filter(element => element.id.toString() === this.umbrellaFund[0].investmentAdvisorID.toString());
        if (investmentAdvisor.length > 0) {
            this.umbrellaFundForm.get('investmentAdvisorID').patchValue(investmentAdvisor, {emitEvent: false});
        }
        const payingAgent = this.payingagentOptions.filter(element => element.id.toString() === this.umbrellaFund[0].payingAgentID.toString());
        if (payingAgent.length > 0) {
            this.umbrellaFundForm.get('payingAgentID').patchValue(payingAgent, {emitEvent: false});
        }
        this.umbrellaFundForm.get('transferAgentID').patchValue(this.umbrellaFund[0].transferAgentID, {emitEvent: false});
        this.umbrellaFundForm.get('centralisingAgentID').patchValue(this.umbrellaFund[0].centralisingAgentID, {emitEvent: false});
        this.umbrellaFundForm.get('giin').patchValue(this.umbrellaFund[0].giin, {emitEvent: false});
        const delegatedManagementCompany = this.managementCompanyList.filter(element => element.id.toString() === this.umbrellaFund[0].delegatedManagementCompanyID.toString());
        if (delegatedManagementCompany.length > 0) {
            this.umbrellaFundForm.get('delegatedManagementCompanyID').patchValue(delegatedManagementCompany, {emitEvent: false});
        }
        const auditor = this.auditorOptions.filter(element => element.id.toString() === this.umbrellaFund[0].auditorID.toString());
        if (auditor.length > 0) {
            this.umbrellaFundForm.get('auditorID').patchValue(auditor, {emitEvent: false});
        }
        const taxAuditor = this.taxAuditorOptions.filter(element => element.id.toString() === this.umbrellaFund[0].taxAuditorID.toString());
        if (taxAuditor.length > 0) {
            this.umbrellaFundForm.get('taxAuditorID').patchValue(auditor, {emitEvent: false});
        }
        const principlePromoter = this.principalPromoterOptions.filter(element => element.id.toString() === this.umbrellaFund[0].principlePromoterID.toString());
        if (principlePromoter.length > 0) {
            this.umbrellaFundForm.get('principlePromoterID').patchValue(principlePromoter, {emitEvent: false});
        }
        const legalAdvisor = this.legalAdvisorOptions.filter(element => element.id.toString() === this.umbrellaFund[0].legalAdvisorID.toString());
        if (legalAdvisor.length > 0) {
            this.umbrellaFundForm.get('legalAdvisorID').patchValue(legalAdvisor, {emitEvent: false});
        }
        this.umbrellaFundForm.get('directors').patchValue(this.umbrellaFund[0].directors, {emitEvent: false});

        this.umbrellaFundForm.updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
    }

    processFormChanges(field): void {
        this.showTransferAgent = false;
        this.showCentralizingAgent = false;
        if (!!field && field.length > 0) {
            if (field[0].id === 'LU' || field[0].id === 'IE') {
                this.umbrellaFundForm.get('transferAgentID').setValidators(Validators.required);
                this.showTransferAgent = true;
            } else  if (field[0].id === 'FR') {
                this.umbrellaFundForm.get('centralisingAgentID').setValidators(Validators.required);
                this.showCentralizingAgent = true;
            } else {
                this.umbrellaFundForm.get('transferAgentID').patchValue(null, {emitEvent: false});
                this.umbrellaFundForm.get('transferAgentID').setValidators(null);
                this.umbrellaFundForm.get('centralisingAgentID').patchValue(null, {emitEvent: false});
                this.umbrellaFundForm.get('centralisingAgentID').setValidators(null);
            }
        } else {
            this.umbrellaFundForm.get('transferAgentID').patchValue(null, {emitEvent: false});
            this.umbrellaFundForm.get('transferAgentID').setValidators(null);
            this.umbrellaFundForm.get('centralisingAgentID').patchValue(null, {emitEvent: false});
            this.umbrellaFundForm.get('centralisingAgentID').setValidators(null);
        }
        // apply changes
        this.umbrellaFundForm.get('transferAgentID').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
        this.umbrellaFundForm.get('centralisingAgentID').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
    }

    cancel() {
        this._router.navigateByUrl('/product-module');
    }

    save(formValues) {
        if (!!formValues.umbrellaFundID && formValues.umbrellaFundID !== '' && this.editForm) {
            // UPDATE
            const asyncTaskPipe = this._ofiUmbrellaFundService.updateUmbrellaFund(
                {
                    umbrellaFundID: formValues.umbrellaFundID,
                    umbrellaFundName: formValues.umbrellaFundName || '',
                    registerOffice: formValues.registerOffice || '',
                    registerOfficeAddress: formValues.registerOfficeAddress || '',
                    legalEntityIdentifier: formValues.legalEntityIdentifier || '',
                    domicile: (formValues.domicile.length > 0) ? formValues.domicile[0].id : 0,
                    umbrellaFundCreationDate: formValues.umbrellaFundCreationDate || '',
                    managementCompanyID: (formValues.managementCompanyID.length > 0) ? formValues.managementCompanyID[0].id : 0,
                    fundAdministratorID: (formValues.fundAdministratorID.length > 0) ? formValues.fundAdministratorID[0].id : 0,
                    custodianBankID: (formValues.custodianBankID.length > 0) ? formValues.custodianBankID[0].id : 0,
                    investmentManagerID: (formValues.investmentManagerID.length > 0) ? formValues.investmentManagerID[0].id : 0,
                    investmentAdvisorID: (formValues.investmentAdvisorID.length > 0) ? formValues.investmentAdvisorID[0].id : 0,
                    payingAgentID: (formValues.payingAgentID.length > 0) ? formValues.payingAgentID[0].id : 0,
                    transferAgentID: formValues.transferAgentID || 0,
                    centralisingAgentID: formValues.centralisingAgentID || 0,
                    giin: formValues.giin || null,
                    delegatedManagementCompanyID: (formValues.delegatedManagementCompanyID.length > 0) ? formValues.delegatedManagementCompanyID[0].id : 0,
                    auditorID: (formValues.auditorID.length > 0) ? formValues.auditorID[0].id : 0,
                    taxAuditorID: (formValues.taxAuditorID.length > 0) ? formValues.taxAuditorID[0].id : 0,
                    principlePromoterID: (formValues.principlePromoterID.length > 0) ? formValues.principlePromoterID[0].id : 0,
                    legalAdvisorID: (formValues.legalAdvisorID.length > 0) ? formValues.legalAdvisorID[0].id : 0,
                    directors: formValues.directors || ''
                },
                this.ngRedux);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    // console.log('save success new fund', data); // success
                    OfiUmbrellaFundService.setRequested(false, this.ngRedux);
                    this._toasterService.pop('success', formValues.umbrellaFundName + ' has been successfully updated!');
                    this._location.back();
                },
                (data) => {
                    console.log('Error: ', data);
                    // this.modalTitle = 'Error';
                    // this.modalText = JSON.stringify(data);
                    // this.showTextModal = true;
                    this.showError(JSON.stringify(data));
                    this._changeDetectorRef.markForCheck();
                })
            );
        } else {
            // INSERT
            const asyncTaskPipe = this._ofiUmbrellaFundService.saveUmbrellaFund(
                {
                    umbrellaFundName: formValues.umbrellaFundName || '',
                    registerOffice: formValues.registerOffice || '',
                    registerOfficeAddress: formValues.registerOfficeAddress || '',
                    legalEntityIdentifier: formValues.legalEntityIdentifier || '',
                    domicile: (formValues.domicile.length > 0) ? formValues.domicile[0].id : 0,
                    umbrellaFundCreationDate: formValues.umbrellaFundCreationDate || '',
                    managementCompanyID: (formValues.managementCompanyID.length > 0) ? formValues.managementCompanyID[0].id : 0,
                    fundAdministratorID: (formValues.fundAdministratorID.length > 0) ? formValues.fundAdministratorID[0].id : 0,
                    custodianBankID: (formValues.custodianBankID.length > 0) ? formValues.custodianBankID[0].id : 0,
                    investmentManagerID: (formValues.investmentManagerID.length > 0) ? formValues.investmentManagerID[0].id : 0,
                    investmentAdvisorID: (formValues.investmentAdvisorID.length > 0) ? formValues.investmentAdvisorID[0].id : 0,
                    payingAgentID: (formValues.payingAgentID.length > 0) ? formValues.payingAgentID[0].id : 0,
                    transferAgentID: formValues.transferAgentID || 0,
                    centralisingAgentID: formValues.centralisingAgentID || 0,
                    giin: formValues.giin || null,
                    delegatedManagementCompanyID: (formValues.delegatedManagementCompanyID.length > 0) ? formValues.delegatedManagementCompanyID[0].id : 0,
                    auditorID: (formValues.auditorID.length > 0) ? formValues.auditorID[0].id : 0,
                    taxAuditorID: (formValues.taxAuditorID.length > 0) ? formValues.taxAuditorID[0].id : 0,
                    principlePromoterID: (formValues.principlePromoterID.length > 0) ? formValues.principlePromoterID[0].id : 0,
                    legalAdvisorID: (formValues.legalAdvisorID.length > 0) ? formValues.legalAdvisorID[0].id : 0,
                    directors: formValues.directors || ''
                },
                this.ngRedux);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    // console.log('save success new fund', data); // success
                    OfiUmbrellaFundService.setRequested(false, this.ngRedux);
                    this._toasterService.pop('success', formValues.umbrellaFundName + ' has been successfully created!');
                    this._location.back();
                },
                (data) => {
                    console.log('Error: ', data);
                    // this.modalTitle = 'Error';
                    // this.modalText = JSON.stringify(data);
                    // this.showTextModal = true;
                    this.showError(JSON.stringify(data));
                    this._changeDetectorRef.markForCheck();
                })
            );
        }
    }

    confirmModal(response) {

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

        /* Unsunscribe Observables. */
        for (const subscription of this.subscriptionsArray) {
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
