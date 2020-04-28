import { KycFormHelperService } from './../kyc-form-helper.service';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, NgRedux } from '@angular-redux/store';
import { get as getValue, map, isEmpty, castArray, remove, partial, cloneDeep, filter, set as setValue } from 'lodash';
import { Subject, BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { takeUntil, filter as rxFilter, map as rxMap } from 'rxjs/operators';

import { MultilingualService } from '@setl/multilingual';
import { formStepsLight, formStepsFull, formStepsOnboarding } from '../requests.config';
import { NewRequestService } from './new-request.service';
import { IdentificationService, buildBeneficiaryObject } from './steps/identification.service';

import { FormstepsComponent } from '@setl/utils/components/formsteps/formsteps.component';
import { OfiKycService } from '../../../ofi-req-services/ofi-kyc/service';
import { setMenuCollapsed } from '@setl/core-store';
import { DocumentPermissions } from './steps/documents.model';
import {
    isCompanyListed,
    isStateOwned,
    isHighRiskActivity,
    isHighRiskCountry,
    PartyCompaniesInterface,
    isCompanyRegulated,
    hasStakeholderPEP,
    isFloatingOver75Percent,
} from '../kyc-form-helper';
import { BeneficiaryService } from './steps/identification/beneficiary.service';
import { DocumentsService } from './steps/documents.service';

/**
 * KYC main form wrapper component
 */
@Component({
    templateUrl: './new-request.component.html',
    styleUrls: ['./new-request.component.scss'],
    animations: [
        trigger('toggle', [
            state('false', style({
                opacity: 1,
            })),
            state('true', style({
                opacity: 0,
            })),
            transition('* => *', animate(250)),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [KycFormHelperService],
})
export class NewKycRequestComponent implements OnInit {

    // Get access to instance of formSteps component in the html.
    // The FormstepsComponent maintain the left navigation of the kyc form.
    @ViewChild(FormstepsComponent) formSteps;

    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;
    @select(['user', 'siteSettings', 'language']) language$;
    @select(['ofi', 'ofiKyc', 'myInformations', 'investorType']) kycInvestorType$;

    @select(['ofi', 'ofiKyc', 'myInformations']) inviteInfo$;
    @select(['user', 'authentication', 'defaultHomePage']) defaultHomePage$;

    unsubscribe: Subject<any> = new Subject();
    // config object for the FormstepsComponent.
    stepsConfig: any;

    // Full kyc form formgroup.
    public forms: FormGroup;
    // Whether the form is duplicated from kyc client file. This would make the kyc form readonly if the property is true.
    isDuplicateFromClientFile = false;
    // client file kyc ID, this would be populated by kycList that belong to the current user.
    // kyc that has amcId of '-1' is identified as client file.kyc.
    clientFileId: number;

    // whether form is at the animating state. using by angular animation?
    animating: Boolean;
    // determine whether the kyc form is full kyc form or not.
    fullForm = true;
    // Whether the kyc form is on the onboarding state.
    onboardingMode = false;
    // method to setup kyc form type (light kyc or full kyc), and setup formSteps config.
    applyFullForm = () => {
    }

    // keep track of the current complete step, to decide the active step.
    currentCompletedStep$ = new BehaviorSubject<number>(null);
    currentCompletedStep;

    // kycId to duplicate from.
    duplicate: number;
    // investor type that of the user.original invited with.
    kycInvestorType;
    // Whether make amc select readonly
    amcSelectReadOnly = false;
    // Whether the disclaimer has been signed
    disclaimerSigned: boolean = false;

    /* The companies that this user was invited by. */
    public kycPartySelections: PartyCompaniesInterface;

    /* A subject that is used to pass document permissions to the document component. */
    public documentsPermissionsSubject = new ReplaySubject<DocumentPermissions>(1);

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private newRequestService: NewRequestService,
        public translate: MultilingualService,
        private ngRedux: NgRedux<any>,
        private location: Location,
        private ofiKycService: OfiKycService,
        private changeDetectorRef: ChangeDetectorRef,
        private kycFormHelperService: KycFormHelperService,
        private identificationService: IdentificationService,
        private beneficiaryService: BeneficiaryService,
        private documentsService: DocumentsService,
    ) {
        // collapse the menu by default
        this.ngRedux.dispatch(setMenuCollapsed(true));
    }

    public emitDocumentPermissions () {
        // Defaults.
        let companyInfo: PartyCompaniesInterface = {
            iznes: false,
            id2s: false,
            nowcp: false,
        };

        // Replace with correct object if availible.
        if (this.kycPartySelections) {
            companyInfo.iznes = this.kycPartySelections.iznes || false;
            companyInfo.id2s = this.kycPartySelections.id2s || false;
            companyInfo.nowcp = this.kycPartySelections.nowcp || false;
        }

        const permissionsObject: DocumentPermissions = {
            // Companies that this user belongs to.
            companies: companyInfo,

            // Rules based on other parts of the form.
            rules: {
                /* Company is listed */
                rule1: (
                    isCompanyListed(this.forms)
                ),
                /* Company is regulated company */
                rule2: (
                    isCompanyRegulated(this.forms)
                ),
                /* Company is state-owned/public entities */
                rule3: (
                    isStateOwned(this.forms)
                ),
                /* Company is unregulated, unlisted, not state-owned and does not represent a high risk (risky activity or country): */
                rule4: (
                    ! (
                        isCompanyListed(this.forms) ||
                        isCompanyRegulated(this.forms) ||
                        isStateOwned(this.forms) ||
                        isHighRiskActivity(this.forms) ||
                        isHighRiskCountry(this.forms)
                    )
                ),
                /* Company is unregulated, unlisted, not state-owned with a high activity risk  */
                rule5: (
                    ! (
                        isCompanyListed(this.forms) ||
                        isCompanyRegulated(this.forms) ||
                        isStateOwned(this.forms)
                    ) && isHighRiskActivity(this.forms)
                ),
                /* Company is unregulated, unlisted, not state-owned with a high country risk or a pep  */
                rule6: (
                    ! (
                        isCompanyListed(this.forms) ||
                        isCompanyRegulated(this.forms) ||
                        isStateOwned(this.forms)
                    ) && (
                        isHighRiskCountry(this.forms) ||
                        hasStakeholderPEP(this.forms)
                    )
                ),
                /* Company is listed with a PEP */
                rule7: (
                    isCompanyListed(this.forms) &&
                    hasStakeholderPEP(this.forms)
                ),
                /* Company is regulated company with a PEP */
                rule8: (
                    isCompanyRegulated(this.forms) &&
                    hasStakeholderPEP(this.forms)
                ),
                /* Company is state-owned/public entities with a PEP */
                rule9: (
                    isStateOwned(this.forms) &&
                    hasStakeholderPEP(this.forms)
                ),
            },
            overrides: {
                floating75: (
                    isFloatingOver75Percent(this.forms)
                ),
            }
        };

        console.log('[3] nexting document permissions.');
        console.log(' | companies: ', JSON.stringify(permissionsObject.companies));
        console.log(' | Company is listed? ', permissionsObject.rules['rule1'])
        console.log(' | Company is regulated company? ', permissionsObject.rules['rule2'])
        console.log(' | Company is state-owned/public entities? ', permissionsObject.rules['rule3'])
        console.log(' | Company is unregulated, unlisted, not state - owned and does not represent a high risk(risky activity or country)? ', permissionsObject.rules['rule4'])
        console.log(' | Company is unregulated, unlisted, not state - owned with a high activity risk? ', permissionsObject.rules['rule5'])
        console.log(' | Company is unregulated, unlisted, not state - owned with a high country risk ? ', permissionsObject.rules['rule6'])
        console.log(' | Company is listed with a PEP ? ', permissionsObject.rules['rule7'])
        console.log(' | Company is regulated company with a PEP ? ', permissionsObject.rules['rule8'])
        console.log(' | Company is state-owned/public entities with a PEP ? ', permissionsObject.rules['rule9'])
        console.log(' | Overrides: ', JSON.stringify(permissionsObject['overrides']));

        this.documentsPermissionsSubject.next(permissionsObject);
    }

    /**
     * Get investor data that used to decide whether to show certain types of document for the kyc form.
     * this.documetRules is the default investor data.
     * Not sure why it need to build like this?
     * @return {ReplaySubject<DocumentPermissions>}
     */
    get documents(): ReplaySubject<DocumentPermissions> {
        return this.documentsPermissionsSubject;
    }

    /**
     * Get investor type (not the investor type that get from investor invitation)
     * @return {'proByNature' | 'proBySize' | 'nonPro'}
     */
    get investorType(): 'proByNature' | 'proBySize' | 'nonPro' {
        let activityRegulated = this.forms.get('identification.companyInformation.activityRegulated').value;
        activityRegulated = !!Number(activityRegulated);

        const balanceSheetTotalValue = this.forms.get('identification.companyInformation.balanceSheetTotal').value;
        const netRevenuesNetIncomeValue = this.forms.get('identification.companyInformation.typeOfRevenuesValue').value;
        const shareholderEquityValue = this.forms.get('identification.companyInformation.shareholderEquity').value;

        if (activityRegulated) {
            return 'proByNature';
        }

        const balanceSheetCondition = balanceSheetTotalValue >= 20000000;
        const netRevenuesCondition = netRevenuesNetIncomeValue >= 40000000;
        const equityCondition = shareholderEquityValue >= 2000000;
        const trues = remove([balanceSheetCondition, netRevenuesCondition, equityCondition]);

        if (trues.length >= 2) {
            return 'proBySize';
        }

        return 'nonPro';
    }

    /**
     * Whether the kyc form should be render as readonly.
     * @return {boolean}
     */
    get isFormReadonly():boolean {
        if (this.isDuplicateFromClientFile) {
            return true;
        }
        // if we have client file, but now we are not editing client, the form should be readonly
        if (typeof this.clientFileId !== 'undefined' && this.clientFileId !== Number(this.newRequestService.context))  {
            return true;
        }
        return false;
    }

    /**
     * Current kyc user has client file or not.
     * @return {boolean}
     */
    get hasClientFile(): boolean {
        return Boolean(this.clientFileId);
    }

    async ngOnInit() {
        // Fetch investor info
        this.ofiKycService.fetchInvestor();

        await this.initForm();

        this.initSubscriptions();

        /* Subscribe for KYC party selections. */
        this.kycFormHelperService.kycPartyCompanies$
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                console.log('[2] got party selections: ', data);
                this.kycPartySelections = data;

                /* Emit on changes to party selections. */
                this.emitDocumentPermissions();
            });
        
        /* Emit on changes to forms. */
        this.forms.get('identification').get('companyInformation')
            .valueChanges.subscribe(() => this.kycPartySelections && this.emitDocumentPermissions());
        this.forms.get('identification').get('generalInformation')
            .valueChanges.subscribe(() => this.kycPartySelections && this.emitDocumentPermissions());
        this.forms.get('identification').get('beneficiaries')
            .valueChanges.subscribe(() => this.kycPartySelections && this.emitDocumentPermissions());

        /* Fetch the initial form states required for business logic, then emit. */
        this.getRequiredBusinessLogicFormData().then(() => {
            if (this.kycPartySelections) {
                this.emitDocumentPermissions();
            }
        });
    }

    /**
     * Remove the query params, so certain actions depend on the query params, won't happend again.
     */
    removeQueryParams() {
        const newUrl = this.router.createUrlTree([], {
            queryParams: {
                duplicate: null,
            },
            queryParamsHandling: 'merge',
        });
        this.location.replaceState(this.router.serializeUrl(newUrl));
    }

    initSubscriptions() {
        this.requests$
            .pipe(
                takeUntil(this.unsubscribe),
            )
            .subscribe((amcs) => {
                // Get the current kyc context as string in this format: kycID1-KycID2, such as '3-23'
                this.newRequestService.getContext(amcs);
                if (amcs.length > 0) {
                    this.amcSelectReadOnly = true;
                }
            });

        // fetch data from query params.
        this.route.queryParamMap.subscribe((params) => {
            const step = params.get('step');
            const completed = params.get('completed');

            if (params.get('duplicate')) {
                this.duplicate = Number(params.get('duplicate'));
                this.removeQueryParams();
            }

            if (params.get('isclientfile') === 'true') {
                this.isDuplicateFromClientFile = true;
            }

            if (params.get('onboardingMode') === 'true') {
                this.onboardingMode = true;
            }

            this.fullForm = !(completed === 'true');

            this.initFormSteps(step);
        });


        // Get client fileID from kyc list.
        this.myKycList$.pipe(
            rxMap((kycs) => {
                const list = Object.keys(kycs).map(k => kycs[k])
                   .filter(kyc => kyc.amManagementCompanyID === null);
                return getValue(list, '[0].kycID', undefined);
            }),
            takeUntil(this.unsubscribe),
        ).subscribe(clientFileId => this.clientFileId = clientFileId);

        // Get user investor type.
        this.kycInvestorType$.pipe(
            takeUntil(this.unsubscribe),
        ).subscribe(t => this.kycInvestorType = t);
    }

    /**
     * Create kyc angular form group.
     */
    async initForm() {
        this.forms = await this.newRequestService.createRequestForm();
        // Set form property on helper service needed for KYC helper functions
        this.kycFormHelperService.setForm(this.forms);
    }

    /**
     * Set Form current completed step, and setup stepConfig
     * @param {string} completedStep
     */
    initFormSteps(completedStep): void {

        if (this.fullForm) {
            this.stepsConfig = formStepsFull;
            // remove 'banking Infromation' section if formGroup does not exist

            if (this.isBankingInformationSectionDisabled()) {
                this.stepsConfig = removeStepInStepConfig(this.stepsConfig, 'bankAccounts')
            }

            // remove 'Risk Profile' section if all sub-sections are hidden
            if (!this.showRiskProfileSection()) {
                this.stepsConfig = removeStepInStepConfig(this.stepsConfig, 'riskProfile')
            }

            // remove 'RiskInvestmentDetail' section if formGroup does not exist
            if (this.isRiskInvestmentDetailSectionDisabled()) {
                this.stepsConfig = removeStepInStepConfig(this.stepsConfig, 'investmentDetails')
            }

            // remove 'RiskObjective' section if formGroup does not exist
            if (this.isRiskObjectiveSectionDisabled()) {
                this.stepsConfig = removeStepInStepConfig(this.stepsConfig, 'investmentObjectives')
            }

            // remove 'RiskConstraints' section if formGroup does not exist
            if (this.isRiskConstraintSectionDisabled()) {
                this.stepsConfig = removeStepInStepConfig(this.stepsConfig, 'investmentConstraints')
            }
        } else {
            this.stepsConfig = formStepsLight;
        }

        this.currentCompletedStep = this.stepsConfig.findIndex(a => a.dbId === completedStep);
        this.currentCompletedStep$.next(this.currentCompletedStep);

        this.changeDetectorRef.markForCheck();
    }

    /**
     * Handle click event for 'previous', 'next' and 'close' buttons of the kyc form.
     * @param {any} event: click event
     */
    handleAction(event) {
        const type = event.type;

        if (type === 'previous') {
            this.formSteps.previous();
        }

        if (type === 'next') {
            const noHandler = this.submitCurrentStepComponent();
            if (noHandler) {
                this.formSteps.next();
            }
        }

        if (type === 'close') {
            this.router.navigateByUrl('/onboarding-requests/list');
        }
    }

    /**
     * Handle submitEvent output from sub kyc step component.
     * @param {{completed: boolean; updateView: boolean}} event
     * @return void
     */
    handleSubmit(event: {completed: boolean; updateView: boolean}): void {
        if (event.completed) {
            this.formSteps.next();
        }

        if (event.updateView) {
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Fetch the active kyc substep component. and call handleSubmit method for the component.
     */
    submitCurrentStepComponent() {
        const position = this.formSteps.position;

        const component = this.formSteps.steps[position];

        if (!component.handleSubmit) {
            return true;
        }
        if (!component.form) {
            component.handleSubmit();
        }
    }

    /**
     * Retrieves data for forms, that are required by business logic functions in the KYC helper.
     */
    getRequiredBusinessLogicFormData() {
        return new Promise((resolve0) => {
            this.requests$
                .pipe(
                    rxMap(requests => requests[0]),
                    rxFilter(request => !!request),
                    takeUntil(this.unsubscribe),
                )
                .subscribe((request) => {
                    const promises = [
                        new Promise((resolve1) => {
                            this.identificationService.getCurrentFormCompanyData(request.kycID)
                            .then((formData) => {
                                if (formData) {
                                    this.forms.get('identification').get('companyInformation').patchValue(formData);
                                }
                                resolve1();
                            })
                            .catch((e) => {
                                console.error('Failed to prefetch identification > companyInformation: ', e);
                                resolve1();
                            });
                        }),
                        new Promise((resolve2) => {
                            this.identificationService.getCurrentFormGeneralData(request.kycID)
                            .then((formData) => {
                                if (formData) {
                                    this.forms.get('identification').get('generalInformation').patchValue(formData);
                                }
                                resolve2();
                            })
                            .catch((e) => {
                                console.error('Failed to prefetch identification > generalInformation ', e);
                                resolve2();
                            });
                        }),
                        new Promise((resolve3) => {
                            this.identificationService.getCurrentFormCompanyBeneficiariesData(request.kycID)
                            .then((formData) => {
                                // if we have data build the stakeholders
                                if (!isEmpty(formData)) {
                                    const beneficiaries: any = this.forms.get('identification').get('beneficiaries').get('beneficiaries');

                                    while (beneficiaries.length) {
                                        beneficiaries.removeAt(0);
                                    }

                                    // build the stakeholder formArray
                                    const beneficiaryPromises = formData.map((controlValue) => {
                                        // create formGroup for the stakeholder
                                        const control = this.newRequestService.createBeneficiary();
                                        const documentID = controlValue.documentID;

                                        // convert the stakeholder stored in database to value that can apply to stakeholder formGroup
                                        const newControlValue = buildBeneficiaryObject(controlValue);

                                        // dynamically the formControl, depend on the beneficiary type
                                        this.disableBeneficiaryType(newControlValue, control);

                                        // fetch document data from membernode, and update stakeholder formGroup.
                                        if (documentID) {
                                            return this.documentsService.getDocument(documentID).then((document) => {
                                                if (document) {
                                                    setValue(newControlValue, ['common', 'document'], {
                                                        name: document.name,
                                                        hash: document.hash,
                                                        kycDocumentID: document.kycDocumentID,
                                                    });
                                                }
                                                control.patchValue(newControlValue);
                                                beneficiaries.push(control);
                                            });
                                        }

                                        // set the stakeholder formgroup value
                                        control.patchValue(newControlValue);

                                        beneficiaries.push(control);
                                    });

                                    Promise.race([
                                        Promise.all(beneficiaryPromises),
                                        new Promise((timerResolve) => { setTimeout(() => { timerResolve() }, 5000) })
                                    ]).then(() => {
                                        if (beneficiaries.value.length) {
                                            // Update some formcontrol within stakeholder, that depending on the data fetch from membernode.
                                            this.beneficiaryService.fillInStakeholderSelects(this.forms.get('identification').get('beneficiaries').get('beneficiaries') as FormArray);
                                            this.beneficiaryService.updateStakeholdersValidity(this.forms.get('identification').get('beneficiaries').get('beneficiaries') as FormArray);
                                        }

                                        // resolve up.
                                        resolve3();
                                    }).catch((e) => {
                                        console.error('Preloaded beneficiaryPromises caught an error: ', e);
                                    });
                                } else {
                                    console.error('Empty form data for identification > beneficiaries > beneficiaries: ', formData);
                                    resolve3();
                                }
                            }).catch((e) => {
                                // on error, still resolve.
                                resolve3();
                                console.error('Failed to prefetch identification > beneficiaries > beneficiaries: ', e);
                            });
                        })
                    ];
                    
                    Promise.all(promises).then(() => {
                        console.log('[1] got forms for business rules: ', this.forms);
                        resolve0();
                    });
                });
        });
    }

    /**
     * Update stakeholder formgroup depending on the beneficiary type.
     * @param {any} values: stakeholder formGroup value
     * @param {FormGroup} formGroup: stakeholder formGroup
     */
    disableBeneficiaryType(values, formgroup) {
        if (values['beneficiaryType'] === 'legalPerson') {
            // Disable naturalPerson
            formgroup.get('naturalPerson').disable();
            // Enable nationalIdNumberText
            const nationIdNumberType = getValue(values, 'legalPerson.nationalIdNumberType[0].id', '');
            this.beneficiaryService.formCheckNationalIdNumberType(formgroup, nationIdNumberType);
        } else {
            formgroup.get('legalPerson').disable();
        }
    }

    /**
     * Update this.applyFullForm method dynamically base on the 'isRegisterd'(is light kyc) value
     * @param {boolean} isRegistered: is the kyc is light kyc.
     */
    registered(isRegistered: boolean) {
        this.applyFullForm = partial(this.animationDone, !isRegistered);
        this.animating = true;
    }

    /**
     * Use to build the this.applyFullForm method. Set whether the form is 'full kyc' or 'light kyc',
     * and setup the formsteps config.
     * @param {boolean} fullFormValue: whether this is full kyc or light kyc
     */
    animationDone(fullFormValue): void {
        this.animating = false;

        this.fullForm = fullFormValue;
        this.initFormSteps(this.currentCompletedStep);
    }

    /**
     * Check if the kyc form is filled and valid.
     */
    checkCompletion() {
        const general = this.forms.get('identification').get('generalInformation');
        const company = this.forms.get('identification').get('companyInformation');
        const banking = this.forms.get('identification').get('bankingInformation');

        const bankingFormValid = banking ? banking.valid : true;

        return general.valid && company.valid && bankingFormValid;
    }

    /**
     * Whether to 'banking informations' section is disabled in formGroup
     * @return boolean
     */
    isBankingInformationSectionDisabled(): boolean {
        return this.forms.get('identification').get('bankingInformation').disabled;
    }

    /**
     * Whether to 'Risk profile -> investment detail' section is disabled in formGroup
     * @return boolean
     */
    isRiskInvestmentDetailSectionDisabled(): boolean {
        return this.forms.get('riskProfile').get('investmentNature').get('natures').disabled;
    }

    /**
     * Whether to 'Risk profile -> Risk objective' section is disabled in formGroup
     * @return boolean
     */
    isRiskObjectiveSectionDisabled(): boolean {
        return this.forms.get('riskProfile').get('investmentObjective').get('objectives').disabled;
    }

    /**
     * Whether to 'Risk profile -> Risk constraints' section is disabled in formGroup
     * @return boolean
     */
    isRiskConstraintSectionDisabled(): boolean {
        return this.forms.get('riskProfile').get('investmentConstraint').get('constraints').disabled;
    }

    /**
     * Whether to show 'Risk Profile' section
     * @return boolean
     */
    showRiskProfileSection(): boolean {
        return !this.isRiskInvestmentDetailSectionDisabled() ||
               !this.isRiskObjectiveSectionDisabled() ||
               !this.isRiskConstraintSectionDisabled();
    }

    /**
     * Reload kyc form after kyc party selection is updated.
     */
    async reloadKycForm() {
        await this.initForm();
        this.initFormSteps('amcSelection');
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}

/**
 * Remove a step from step config, for the specified stepId.
 * @param {any[]} config
 * @return {any[]}
 */
function removeStepInStepConfig(config: any[], stepId: string): any[] {
    const index = config.findIndex(d => d.dbId === stepId);
    const stepTitle = config[index].title;
    let clone = cloneDeep(config);
    clone.splice(index, 1);

    // remove step from parent step
    clone.filter(c => c.children).forEach((p) => {
        const indexInChildren = p.children.findIndex(d => d === stepTitle);
        if (indexInChildren !== -1) {
            p.children.splice(indexInChildren, 1);
        }
    });
    return clone;
}
