import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, NgRedux } from '@angular-redux/store';
import { get as getValue, map, sort, remove, partial, invert, find, merge } from 'lodash';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, take, filter as rxFilter, map as rxMap } from 'rxjs/operators';

import { clearMyKycRequestedPersist } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { MultilingualService } from '@setl/multilingual';
import { steps, formStepsLight, formStepsFull, formStepsOnboarding } from '../requests.config';
import { NewRequestService } from './new-request.service';

import { FormstepsComponent } from '@setl/utils/components/formsteps/formsteps.component';
import { OfiKycService } from '../../../ofi-req-services/ofi-kyc/service';
import { setMenuCollapsed } from '@setl/core-store';
import { PartyCompaniesInterface } from '../kyc-form-helper';
import { KycFormHelperService } from './../kyc-form-helper.service';

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
})
export class NewKycRequestComponent implements OnInit, AfterViewInit {

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
    forms: any = {};
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
    currentCompletedStep;

    // kycId to duplicate from.
    duplicate: number;
    // investor type that of the user.original invited with.
    kycInvestorType;

    /* The companies that this user was invited by. */
    public kycPartySelections: PartyCompaniesInterface;

    // default investor data that is used to decide whether to show certian types of document for the kyc form.
    documentRules = {
        isListed: null,
        isFloatableHigh: null,
        isRegulated: null,
        isNowCp: null
    };

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
    ) {
        // collapse the menu by default
        this.ngRedux.dispatch(setMenuCollapsed(true));

        this.kycFormHelperService.kycPartyCompanies$
            .subscribe((parties) => {
                this.kycPartySelections = parties;
            });
    }

    /**
     * Get investor data that used to decide whether to show certain types of document for the kyc form.
     * this.documetRules is the default investor data.
     * Not sure why it need to build like this?
     * @return {{isListed: boolean; isFloatableHigh: boolean; isRegulated: boolean; isNowCp}}
     */
    get documents(): {isListed: boolean; isFloatableHigh: boolean; isRegulated: boolean; isNowCp} {
        const isListed = this.forms.get('identification.companyInformation.companyListed').value;
        const isFloatableHigh = this.forms.get('identification.companyInformation.floatableShares').value >= 75;
        const isRegulated = this.forms.get('identification.companyInformation.activityRegulated').value;
        const isNowCp = (this.kycInvestorType === 70 || this.kycInvestorType === 80);
        let changed = false;

        if (this.documentRules.isListed !== isListed) {
            this.documentRules.isListed = isListed;
            changed = true;
        }
        if (this.documentRules.isFloatableHigh !== isFloatableHigh) {
            this.documentRules.isFloatableHigh = isFloatableHigh;
            changed = true;
        }
        if (this.documentRules.isRegulated !== isRegulated) {
            this.documentRules.isRegulated = isRegulated;
            changed = true;
        }

        if (this.documentRules.isNowCp !== isNowCp) {
            this.documentRules.isNowCp = isNowCp;
            changed = true;
        }

        if (!changed) {
            return this.documentRules;
        }

        return {
            isListed: this.documentRules.isListed,
            isFloatableHigh: this.documentRules.isFloatableHigh,
            isRegulated: this.documentRules.isRegulated,
            isNowCp: this.documentRules.isNowCp,
        };
    }

    /**
     * Get investor type (not the investor type that get from investor invitation)
     * @return {'proByNature' | 'proBySize' | 'nonPro'}
     */
    get investorType(): 'proByNature' | 'proBySize' | 'nonPro' {
        let activityRegulated = this.forms.get('identification.companyInformation.activityRegulated').value;
        activityRegulated = !!Number(activityRegulated);

        const balanceSheetTotalValue = this.forms.get('identification.companyInformation.balanceSheetTotal').value;
        const netRevenuesNetIncomeValue = this.forms.get('identification.companyInformation.netRevenuesNetIncome').value;
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

    ngOnInit() {
        // Fetch form persisted in redux?
        this.ngRedux.dispatch(clearMyKycRequestedPersist());
        // Fetch investor info
        this.ofiKycService.fetchInvestor();

        this.initForm();
        this.initSubscriptions();

    }

    ngAfterViewInit() {
        // Get to the active kyc form step, depend on the current completed step.
        if (this.currentCompletedStep) {
            const nextStep = this.getNextStep(this.currentCompletedStep);
            this.go(nextStep);
        }
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


        // Try to get kyc form shown in current language. I guess because some of the text
        // need to translate in javascript.
        this.language$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.initFormSteps(this.currentCompletedStep);
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
    initForm() {
        this.forms = this.newRequestService.createRequestForm();
    }

    /**
     * Set Form current completed step, and setup stepConfig
     * @param {string} completedStep
     */
    initFormSteps(completedStep): void {
        this.currentCompletedStep = completedStep;

        if (this.fullForm) {
            this.stepsConfig = formStepsFull;
        } else {
            this.stepsConfig = formStepsLight;
        }
    }

    /**
     * Navigate to step of the 'fromStepComponent'(kyc form), programatically.
     * Likely not used anymore
     */
    goToStep(currentStep) {
        const stepLevel = steps[currentStep];
        this.formSteps.goToStep(stepLevel);
    }

    /**
     * Navigate to step of the 'fromStepComponent'(kyc form), programatically.
     * similar to goToStep method.
     */
    go(currentStep) {
        const stepLevel = steps[currentStep];
        this.formSteps.go(stepLevel);
    }

    /**
     * Get next step as string. such as 'amcSelection', 'introduction'.
     * @param {string} step
     * @return {string}
     */
    getNextStep(step: string): string {
        const stepLevel = steps[step];
        const nextStep = invert(steps)[stepLevel + 1];

        if (nextStep) {
            return nextStep;
        }
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

        return general.valid && company.valid && banking.valid;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
