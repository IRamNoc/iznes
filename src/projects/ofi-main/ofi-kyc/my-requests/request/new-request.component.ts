import { KycFormHelperService } from './../kyc-form-helper.service';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, NgRedux } from '@angular-redux/store';
import { get as getValue, map, sort, remove, partial, invert, find, merge, cloneDeep } from 'lodash';
import { Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { takeUntil, take, filter as rxFilter, map as rxMap } from 'rxjs/operators';

import { clearMyKycRequestedPersist } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { MultilingualService } from '@setl/multilingual';
import { formStepsLight, formStepsFull, formStepsOnboarding } from '../requests.config';
import { NewRequestService } from './new-request.service';

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
} from '../kyc-form-helper';

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
    currentCompletedStep$ = new BehaviorSubject<number>(null);
    currentCompletedStep;

    // kycId to duplicate from.
    duplicate: number;
    // investor type that of the user.original invited with.
    kycInvestorType;

    /* The companies that this user was invited by. */
    public kycPartySelections: PartyCompaniesInterface;

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

        // Subscribe for party details.
        this.kycFormHelperService.kycPartyCompanies$
            .subscribe((data) => {
                this.kycPartySelections = data;
            });
    }

    /**
     * Get investor data that used to decide whether to show certain types of document for the kyc form.
     * this.documetRules is the default investor data.
     * Not sure why it need to build like this?
     * @return {DocumentPermissions}
     */
    get documents(): DocumentPermissions {
        // Defaults.
        let companyInfo: PartyCompaniesInterface = {
            iznes: false,
            id2s: false,
            nowcp: true,
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
                isCompanyListed:      isCompanyListed(this.forms),
                isCompanyUnlisted:    ! isCompanyListed(this.forms),
                isStateOwn:           isStateOwned(this.forms),
                isHighRiskActivity:   isHighRiskActivity(this.forms),
                isHighRiskCountry:    isHighRiskCountry(this.forms),
            },
        };

        return permissionsObject;
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

    async ngOnInit() {
        // Fetch form persisted in redux?
        this.ngRedux.dispatch(clearMyKycRequestedPersist());
        // Fetch investor info
        this.ofiKycService.fetchInvestor();

        await this.initForm();

        this.initSubscriptions();

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
            if (!this.hasBankingInformationSection()) {
                this.stepsConfig = removeStepInStepConfig(this.stepsConfig, 'step-bank-accounts')
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
     * Wheter to has 'banking informations' section in formGroup
     * @return boolean
     */
    hasBankingInformationSection(): boolean {
        return !!this.forms.get('identification').get('bankingInformation');
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
    const index = config.findIndex(d => d.id === stepId);
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
