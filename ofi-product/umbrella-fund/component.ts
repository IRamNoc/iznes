// Vendor
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    AfterViewInit,
    Inject,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/* Services */
import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import { LeiService } from '@ofi/ofi-main/ofi-req-services/ofi-product/lei/lei.service';

import {
    OfiManagementCompanyService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';

/* Alert service. */
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';

/* Models */
import { UmbrellaFundDetail } from '@ofi/ofi-main/ofi-store/ofi-product/umbrella-fund/umbrella-fund-list/model';

/* Utils. */
import { SagaHelper, LogService, ConfirmationService } from '@setl/utils';
import { validators } from '../productConfig';
import { MultilingualService } from '@setl/multilingual';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-umbrella-fund',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UmbrellaFundComponent implements OnInit, AfterViewInit, OnDestroy {
    /* Public properties. */
    umbrellaFundForm: FormGroup;
    umbrellaFundList = [];
    umbrellaListItems = [];
    umbrellaControl = new FormControl([]);
    managementCompanyList = [];

    umbrellaFund: any;
    umbrellaFundID: string;
    prefill: string;
    isEditMode = false;
    showModal = false;
    showConfirmModal = false;
    modalTitle = '';
    modalText = '';

    isLeiVisible = false;
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
        locale: this.language,
    };

    countries = [];

    fundAdminOptions = [];
    custodianBankOptions = [];
    payingagentOptions = [];
    auditorOptions = [];
    taxAuditorOptions = [];
    principalPromoterOptions = [];
    legalAdvisorOptions = [];
    transferAgentOptions = [];
    centralizingAgentOptions = [];
    currentLei: string;
    leiList: string[] = [];
    currentRoute: {
        fromFund?: boolean,
        fromShare?: boolean,
    } = {};

    currDraft: number = 0;

    /* Private properties. */
    subscriptionsArray: Subscription[] = [];

    unSubscribe: Subject<any> = new Subject();

    /* Redux observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaFundAccessListOb;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyAccessListOb;
    @select(['ofi', 'ofiProduct', 'lei', 'lei']) leiListOb;

    static getListItem(value: string | number, list: any[]): any[] {
        if (value === null || !list.length) {
            return [];
        }

        const item = _.find(list, { id: value });
        if (!item) {
            return [];
        }
        return [item];
    }

    constructor(
        private fb: FormBuilder,
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private router: Router,
        private location: Location,
        private activatedRoute: ActivatedRoute,
        private toasterService: ToasterService,
        private ofiUmbrellaFundService: OfiUmbrellaFundService,
        private managementCompanyService: OfiManagementCompanyService,
        private logService: LogService,
        private confirmationService: ConfirmationService,
        private leiService: LeiService,
        public translate: MultilingualService,
        @Inject('product-config') productConfig,
    ) {
        this.countries = this.translate.translate(productConfig.fundItems.domicileItems);
        this.fundAdminOptions = productConfig.fundItems.fundAdministratorItems;
        this.custodianBankOptions = productConfig.fundItems.custodianBankItems;
        this.payingagentOptions = productConfig.fundItems.payingAgentItems;
        this.auditorOptions = productConfig.fundItems.auditorItems;
        this.taxAuditorOptions = productConfig.fundItems.taxAuditorItems;
        this.principalPromoterOptions = productConfig.fundItems.principalPromoterItems;
        this.legalAdvisorOptions = productConfig.fundItems.legalAdvisorItems;
        this.transferAgentOptions = this.translate.translate(productConfig.fundItems.transferAgentItems);
        this.centralizingAgentOptions = productConfig.fundItems.centralizingAgentItems;

        this.managementCompanyService.getManagementCompanyList();
        this.ofiUmbrellaFundService.fetchUmbrellaList();

        // param url
        this.activatedRoute.params
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((params) => {
                if (params['id']) {
                    this.umbrellaFundID = params['id'];
                    this.isEditMode = true;
                } else {
                    this.umbrellaFundID = null;
                    this.isEditMode = false;
                }
            });

        this.umbrellaFundForm = this.fb.group({
            umbrellaFundID: [
                '',
            ],
            umbrellaFundName: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            registerOffice: [
                '',
            ],
            registerOfficeAddress: [
                '',
            ],
            registerOfficeAddressLine2: [
                '',
            ],
            registerOfficeAddressZipCode: [
                '',
            ],
            registerOfficeAddressCity: [
                '',
            ],
            registerOfficeAddressCountry: [[]],
            legalEntityIdentifier: [
                '',
            ],
            domicile: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            umbrellaFundCreationDate: [
                '',
                Validators.compose([
                    productConfig.validators.date.day,
                ]),
            ],
            managementCompanyID: [
                [],
                Validators.compose([
                    Validators.required,
                ]),
            ],
            fundAdministratorID: [
                [],
                Validators.compose([
                    Validators.required,
                ]),
            ],
            custodianBankID: [
                [],
                Validators.compose([
                    Validators.required,
                ]),
            ],
            investmentAdvisorID: [
                '',
            ],
            payingAgentID: [
                [],
            ],
            transferAgentID: [
                [],
            ],
            centralisingAgentID: [
                [],
            ],
            giin: [
                '',
                productConfig.validators.giin,
            ],
            delegatedManagementCompanyID: [
                [],
            ],
            auditorID: [
                [],
            ],
            taxAuditorID: [
                [],
            ],
            principlePromoterID: [
                [],
            ],
            legalAdvisorID: [
                [],
            ],
            directors: [
                '',
            ],
            internalReference: [
                '',
                productConfig.internalReference,
            ],
            additionnalNotes: [
                '',
                productConfig.additionnalNotes,
            ],
        });

        this.umbrellaFundForm.controls['domicile'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe(() => {
                this.umbrellaFundForm.controls['transferAgentID'].setValue([]);
                this.umbrellaFundForm.controls['centralisingAgentID'].setValue([]);
            });

        this.umbrellaFundForm.controls['umbrellaFundName'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((name) => {
                const registerOffice = this.umbrellaFundForm.controls['registerOffice'];
                if (registerOffice.dirty || this.isEditMode) {
                    return;
                }
                this.umbrellaFundForm.controls['registerOffice'].setValue(name);
            });

        // language
        this.requestLanguageObj
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(d => this.getLanguage(d));

        combineLatest(
            this.umbrellaFundAccessListOb,
            this.managementCompanyAccessListOb,
            this.activatedRoute.queryParams,
            this.activatedRoute.params,
            )
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(([a, b, queryParams, params]) => {
                if (!Object.keys(a) || !Object.keys(b)) {
                    return;
                }
                this.getManagementCompanyList(b);
                this.getUmbrellaFundList(a);
                if (queryParams.prefill) {
                    this.umbrellaControl.setValue(
                        UmbrellaFundComponent.getListItem(queryParams.prefill, this.umbrellaListItems),
                    );
                }
                if (
                    this.managementCompanyList.length > 0
                    && this.managementCompanyList
                    && (this.umbrellaFundID || queryParams.prefill)
                ) {
                    this.fillFormByUmbrellaID(this.umbrellaFundID || queryParams.prefill);
                    this.changeDetectorRef.markForCheck();
                }
            });

        this.umbrellaControl.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((item) => {
                if (!item.length) {
                    this.umbrellaFundForm.reset();
                    return;
                }
                this.fillFormByUmbrellaID(item[0].id);
                this.changeDetectorRef.markForCheck();
            });
    }

    ngOnInit() {
        this.activatedRoute.queryParams
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((params) => {
                if (params.fromFund) {
                    this.currentRoute.fromFund = true;
                }
                if (params.fromShare) {
                    this.currentRoute.fromShare = true;
                }
            });

        this.leiListOb
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((leiList) => {
                this.leiList = leiList;

                if (this.umbrellaFundForm) {
                    this.umbrellaFundForm.controls.legalEntityIdentifier.updateValueAndValidity({
                        emitEvent: true,
                    });
                }
            });

        this.umbrellaFundForm.controls.legalEntityIdentifier.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((val) => {
                const leiControl = this.umbrellaFundForm.controls.legalEntityIdentifier;
                if (leiControl.errors) {
                    return;
                }

                if (!val || !this.isLeiAlreadyExisting(val)) {
                    return;
                } else {
                    leiControl
                        .setErrors({
                            isAlreadyExisting: true,
                        });
                }
            });

        this.leiService.fetchLEIs();
    }

    ngAfterViewInit() {
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsubscribe Observables. */
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

    isTransferAgentActive() {
        const id = _.get(this.umbrellaFundForm.controls['domicile'].value, ['0', 'id'], false);
        return id === 'IE' || id === 'LU';
    }

    isCentralizingAgentActive() {
        const id = _.get(this.umbrellaFundForm.controls['domicile'].value, ['0', 'id'], false);
        return id === 'FR';
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

    getListItems(
        val: string[],
        list: { id: string, text: string }[],
    ): { id: string, text: string }[] {
        try {
            if (!val.length) {
                return [];
            }
        } catch (e) {
            return [];
        }

        return val.map((id) => {
            return _.find(list, { id });
        });
    }

    getIdsFromList(val: { id: number, text: string }[]): number[] {
        if (!val.length) {
            return [];
        }
        return val.map(item => item.id);
    }

    getUmbrellaFundList(list) {
        if (!Object.keys(list).length) {
            this.umbrellaFundList = [];
            this.umbrellaListItems = [];
            return;
        }

        this.umbrellaListItems = Object.keys(list).map((key) => {
            return {
                id: key,
                text: list[key].umbrellaFundName,
            };
        });

        this.umbrellaFundList = Object.keys(list).map((key) => {
            const u = list[key];
            const investmentAdvisorID = u.investmentAdvisorID;
            return {
                // required on save
                umbrellaFundID: u.umbrellaFundID,
                draft: u.draft,
                umbrellaFundName: u.umbrellaFundName,
                legalEntityIdentifier: u.legalEntityIdentifier,
                registerOffice: u.registerOffice,
                registerOfficeAddress: u.registerOfficeAddress,
                registerOfficeAddressLine2: u.registerOfficeAddressLine2,
                registerOfficeAddressZipCode: u.registerOfficeAddressZipCode,
                registerOfficeAddressCity: u.registerOfficeAddressCity,
                registerOfficeAddressCountry: UmbrellaFundComponent.getListItem(u.registerOfficeAddressCountry, this.countries),
                domicile: UmbrellaFundComponent.getListItem(u.domicile, this.countries),
                umbrellaFundCreationDate: u.umbrellaFundCreationDate,
                managementCompanyID: UmbrellaFundComponent.getListItem(
                    Number(u.managementCompanyID),
                    this.managementCompanyList,
                ),
                fundAdministratorID: UmbrellaFundComponent.getListItem(u.fundAdministratorID, this.fundAdminOptions),
                custodianBankID: UmbrellaFundComponent.getListItem(u.custodianBankID, this.custodianBankOptions),

                // optional on save
                investmentAdvisorID,
                payingAgentID: this.getListItems(
                    u.payingAgentID,
                    this.payingagentOptions,
                ),
                transferAgentID: UmbrellaFundComponent.getListItem(u.transferAgentID, this.transferAgentOptions),
                centralisingAgentID: UmbrellaFundComponent.getListItem(
                    u.centralisingAgentID,
                    this.centralizingAgentOptions,
                ),
                giin: u.giin,
                delegatedManagementCompanyID: UmbrellaFundComponent.getListItem(
                    u.delegatedManagementCompanyID,
                    this.managementCompanyList,
                ),
                auditorID: UmbrellaFundComponent.getListItem(u.auditorID, this.auditorOptions),
                taxAuditorID: UmbrellaFundComponent.getListItem(u.taxAuditorID, this.taxAuditorOptions),
                principlePromoterID: this.getListItems(
                    u.principlePromoterID,
                    this.principalPromoterOptions,
                ),
                legalAdvisorID: UmbrellaFundComponent.getListItem(u.legalAdvisorID, this.legalAdvisorOptions),
                directors: u.directors || '',
                internalReference: u.internalReference || '',
                additionnalNotes: u.additionnalNotes || '',
            };
        });
    }

    getManagementCompanyList(list) {
        if (!Object.keys(list).length) {
            this.managementCompanyList = [];
            return;
        }

        this.managementCompanyList = Object.keys(list).map((key) => {
            const item = list[key];
            if (!item.companyID) return null;
            return {
                id: item.companyID,
                text: item.companyName,
            };
        });
    }

    fillFormByUmbrellaID(umbrellaID: string) {
        const requestedUmbrella = this.umbrellaFundList
            .filter(item => item.umbrellaFundID.toString() === umbrellaID);

        const u = requestedUmbrella[0];

        const payload = {
            ..._.omit(u, ['draft', 'draftUser', 'draftDate']),
            umbrellaFundID: this.isEditMode ? umbrellaID : '',
            umbrellaFundName: this.isEditMode ? u.umbrellaFundName : '',
        };

        this.currDraft = u.draft;

        this.toggleLeiSwitch(!!u.legalEntityIdentifier);
        this.umbrellaFundForm.setValue(payload);
        this.currentLei = payload.legalEntityIdentifier;
    }

    isLeiAlreadyExisting(currentLei: string): boolean {
        // if undefined the LEI won't exist
        if (!currentLei) return false;

        // if the LEI is equal to the current LEI for this umbrella fund, that is ok
        if (currentLei === this.currentLei) return false;

        // otherwise if LEI is a match with the list, then it does exist
        return this.leiList.indexOf(currentLei) !== -1;
    }

    duplicate(umbrellaID: string) {
        this.router.navigateByUrl(`/product-module/product/umbrella-fund/new?prefill=${umbrellaID}`);
    }

    auditTrail(umbrellaID: string) {
        this.router.navigateByUrl(`/product-module/product/umbrella-fund/${umbrellaID}/audit`);
    }

    cancel() {
        this.router.navigateByUrl('/product-module/product');
    }

    getPayload(formValues): UmbrellaFundDetail {
        return {
            draft: null,
            umbrellaFundName: formValues.umbrellaFundName || null,
            registerOffice: formValues.registerOffice,
            registerOfficeAddress: formValues.registerOfficeAddress,
            registerOfficeAddressLine2: formValues.registerOfficeAddressLine2,
            registerOfficeAddressZipCode: formValues.registerOfficeAddressZipCode,
            registerOfficeAddressCity: formValues.registerOfficeAddressCity,
            registerOfficeAddressCountry: _.get(formValues.registerOfficeAddressCountry, ['0', 'id'], null),
            legalEntityIdentifier: this.isLeiVisible ? formValues.legalEntityIdentifier : null,
            domicile: (formValues.domicile.length > 0) ? formValues.domicile[0].id : null,
            umbrellaFundCreationDate: (formValues.umbrellaFundCreationDate != '') ? formValues.umbrellaFundCreationDate : null,
            managementCompanyID: (formValues.managementCompanyID.length > 0) ? formValues.managementCompanyID[0].id : null,
            fundAdministratorID: (formValues.fundAdministratorID.length > 0) ? formValues.fundAdministratorID[0].id : null,
            custodianBankID: (formValues.custodianBankID.length > 0) ? formValues.custodianBankID[0].id : null,
            investmentAdvisorID: formValues.investmentAdvisorID,
            payingAgentID: this.getIdsFromList(formValues.payingAgentID),
            transferAgentID: _.get(formValues.transferAgent, ['0', 'id'], null),
            centralisingAgentID: _.get(formValues.centralisingAgentID, ['0', 'id'], null),
            giin: formValues.giin || null,
            delegatedManagementCompanyID: (formValues.delegatedManagementCompanyID.length > 0) ? formValues.delegatedManagementCompanyID[0].id : null,
            auditorID: (formValues.auditorID.length > 0) ? formValues.auditorID[0].id : null,
            taxAuditorID: (formValues.taxAuditorID.length > 0) ? formValues.taxAuditorID[0].id : null,
            principlePromoterID: this.getIdsFromList(formValues.principlePromoterID),
            legalAdvisorID: (formValues.legalAdvisorID.length > 0) ? formValues.legalAdvisorID[0].id : null,
            directors: formValues.directors,
            internalReference: formValues.internalReference,
            additionnalNotes: formValues.additionnalNotes,
        }
    }

    save(formValues) {
        const payload: UmbrellaFundDetail = {
            ...this.getPayload(formValues),
            draft: 0,
        };

        if (!!formValues.umbrellaFundID && formValues.umbrellaFundID !== '' && this.isEditMode) {
            // UPDATE
            const asyncTaskPipe = this.ofiUmbrellaFundService.updateUmbrellaFund(
                {
                    ...payload,
                    umbrellaFundID: formValues.umbrellaFundID,
                },
                this.ngRedux);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    // this.logService.log('save success new fund', data); // success
                    OfiUmbrellaFundService.setRequested(false, this.ngRedux);
                    if (this.currDraft == 1) {
                        const umbrellaFundID = _.get(data, ['1', 'Data', '0', 'umbrellaFundID']);
                        const umbrellaFundName = _.get(data, ['1', 'Data', '0', 'umbrellaFundName']);

                        if (!_.isUndefined(umbrellaFundID)) {
                            if (this.currentRoute.fromFund) {
                                this.redirectToFund(umbrellaFundID);
                            } else {
                                this.displayFundPopup(umbrellaFundName, umbrellaFundID);
                            }
                        } else {
                            this.creationSuccess(umbrellaFundName);
                        }

                        this.currentLei = payload.legalEntityIdentifier;
                    } else {
                        this.toasterService.pop(
                            'success',
                            this.translate.translate(
                                '@umbrellaFundName@ has been successfully updated',
                                { 'umbrellaFundName': formValues.umbrellaFundName },
                            ),
                        );
                        this.router.navigateByUrl('/product-module/product');
                    }
                },
                (data) => {
                    this.logService.log('Error: ', data);
                    // this.modalTitle = 'Error';
                    // this.modalText = JSON.stringify(data);
                    // this.showTextModal = true;
                    let errMsg = _.get(data, '[1].Data[0].Message', '');
                    errMsg = this.translate.translate(errMsg);

                    this.toasterService.pop(
                        'error',
                        this.translate.translate(
                            'Failed to update the Umbrella Fund. @errMsg@',
                            { 'errMsg': errMsg },
                        ),
                    );

                    this.changeDetectorRef.markForCheck();
                })
            );
        } else {
            // INSERT
            const asyncTaskPipe = this.ofiUmbrellaFundService.saveUmbrellaFund(
                payload,
                this.ngRedux);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    const umbrellaFundID = _.get(data, ['1', 'Data', '0', 'umbrellaFundID']);
                    const umbrellaFundName = _.get(data, ['1', 'Data', '0', 'umbrellaFundName']);

                    OfiUmbrellaFundService.setRequested(false, this.ngRedux);

                    if (!_.isUndefined(umbrellaFundID)) {
                        if (this.currentRoute.fromFund) {
                            this.redirectToFund(umbrellaFundID);
                        } else {
                            this.displayFundPopup(umbrellaFundName, umbrellaFundID);
                        }
                    } else {
                        this.creationSuccess(umbrellaFundName);
                    }
                },
                (data) => {
                    this.logService.log('Error: ', data);

                    let errMsg = _.get(data, '[1].Data[0].Message', '');
                    errMsg = this.translate.translate(errMsg);

                    let userErrMsg = this.translate.translate(
                        'Failed to create the Umbrella Fund. @errMsg@',
                        { 'errMsg': errMsg },
                    );

                    if (errMsg === 'Duplicate Umbrella Fund name.') {
                        userErrMsg = this.translate.translate('This name is already being used by another Umbrella Fund.');
                    }

                    this.toasterService.pop('error', userErrMsg);
                    this.changeDetectorRef.markForCheck();
                }),
            );
        }
    }

    saveDraft(formValues) {
        if (formValues.managementCompanyID.length == 0) {
            this.showWarning(
                this.translate.translate('Please fill in at least the management company to be able to save as draft.'),
            );

        } else {
            const payload: UmbrellaFundDetail = {
                ...this.getPayload(formValues),
                draft: 1,
            };

            let asyncTaskPipe = null;

            if (!!formValues.umbrellaFundID && formValues.umbrellaFundID !== '' && this.isEditMode) {
                // UPDATE
                asyncTaskPipe = this.ofiUmbrellaFundService.updateUmbrellaFund(
                    {
                        ...payload,
                        umbrellaFundID: formValues.umbrellaFundID,
                    },
                    this.ngRedux);
            } else {
                // INSERT
                asyncTaskPipe = this.ofiUmbrellaFundService.saveUmbrellaFund(
                    payload,
                    this.ngRedux);
            }

            this.dispatchAction(asyncTaskPipe, formValues.umbrellaFundName);
        }
    }

    dispatchAction(asyncTaskPipe, umbrellaFundName) {
        let successMessage;
        let errorMessage;

        if (this.isEditMode) {
            successMessage = this.translate.translate('@umbrellaFundName@ draft has been successfully updated', { 'umbrellaFundName': umbrellaFundName });

            errorMessage = this.translate.translate('Failed to update the draft Umbrella Fund');
        } else {
            successMessage = this.translate.translate(
                '@umbrellaFundName@ draft has been successfully saved',
                { 'umbrellaFundName': umbrellaFundName },
            );

            errorMessage = this.translate.translate('Failed to create the draft Umbrella Fund.');
        }

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            () => {
                OfiUmbrellaFundService.setRequested(false, this.ngRedux);
                this.toasterService.pop('success', successMessage);
                this.location.back();
            },
            (err) => {
                this.logService.log('Error: ', err);
                let error = _.get(err, '[1].Data[0].Message', '');
                error = this.translate.translate(error);

                this.toasterService.pop('error', `${errorMessage} (${error})`);
                this.changeDetectorRef.markForCheck();
            }),
        );
    }

    redirectToFund(umbrellaID?) {
        let extras = {};

        if (umbrellaID) {
            extras = {
                queryParams: {
                    umbrella: umbrellaID,
                    fromFund: null,
                },
                queryParamsHandling: 'merge',
            };
        }

        this.router.navigate(['/product-module/product/fund/new'], extras);
    }

    toggleLeiSwitch(nextState: boolean) {
        if (!nextState) {
            this.umbrellaFundForm.controls['legalEntityIdentifier'].disable();
            this.umbrellaFundForm.controls['legalEntityIdentifier'].clearValidators();
        } else {
            this.umbrellaFundForm.controls['legalEntityIdentifier'].enable();
            this.umbrellaFundForm.controls['legalEntityIdentifier'].setValidators(Validators.compose([
                Validators.required,
                validators.lei,
            ]));
        }
        this.isLeiVisible = nextState;
    }

    displayFundPopup(umbrellaFundName, umbrellaFundID) {
        const message =
            `<span>${this.translate.translate('By clicking "Yes", you will be able to create a fund directly linked to @umbrellaFundName@', { 'umbrellaFundName': umbrellaFundName })}.</span>`;

        this.confirmationService.create(
            `<span>${this.translate.translate('Do you want to create a Fund?')}</span>`,
            message,
            { confirmText: 'Yes', declineText: 'No' },
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.redirectToFund(umbrellaFundID);
            } else {
                this.creationSuccess(umbrellaFundName);
            }
        });
    }

    creationSuccess(umbrellaFundName) {
        this.toasterService.pop(
            'success',
            this.translate.translate(
                '@umbrellaFundName@ successfully created',
                { 'umbrellaFundName': umbrellaFundName },
            ),
        );

        this.router.navigateByUrl('/product-module/product');
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
                          <td class="text-center text-danger">${this.translate.translate(message)}</td>
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
                          <td class="text-center text-success">${this.translate.translate(message)}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }
}
