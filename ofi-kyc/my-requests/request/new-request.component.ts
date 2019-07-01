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

    @ViewChild(FormstepsComponent) formSteps;

    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;
    @select(['user', 'siteSettings', 'language']) language$;
    @select(['ofi', 'ofiKyc', 'myInformations', 'investorType']) kycInvestorType$;

    @select(['ofi', 'ofiKyc', 'myInformations']) inviteInfo$;
    @select(['user', 'authentication', 'defaultHomePage']) defaultHomePage$;

    unsubscribe: Subject<any> = new Subject();
    stepsConfig: any;
    forms: any = {};
    isDuplicateFromClientFile = false;
    clientFileId: number;

    animating: Boolean;
    fullForm = true;
    onboardingMode = false;
    applyFullForm = () => {
    }

    currentCompletedStep;

    isBeginning: boolean = false;
    duplicate;
    duplicateCompany = '';
    // this is the investor decide when asset manager/nowcp send invitation
    kycInvestorType;

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
    ) {
        this.ngRedux.dispatch(setMenuCollapsed(true));
    }

    get documents() {
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

    get investorType() {
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

    get isFormReadonly():boolean {
        if (this.isDuplicateFromClientFile) {
            return true;
        }
        // if we have client file, and now we are not editing client, the form should be readonly
        if (typeof this.clientFileId !== 'undefined' && this.clientFileId !== Number(this.newRequestService.context))  {
            return true;
        }
        return false;
    }

    get hasClientFile(): boolean {
        return Boolean(this.clientFileId);
    }

    ngOnInit() {
        this.ngRedux.dispatch(clearMyKycRequestedPersist());
        this.ofiKycService.fetchInvestor();

        this.initForm();
        this.initSubscriptions();

    }

    ngAfterViewInit() {
        if (this.currentCompletedStep) {
            const nextStep = this.getNextStep(this.currentCompletedStep);
            this.go(nextStep);
        }
    }

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
                this.newRequestService.getContext(amcs);
            });

        this.route.queryParamMap.subscribe((params) => {
            const step = params.get('step');
            const completed = params.get('completed');

            if (params.get('duplicate')) {
                this.duplicate = Number(params.get('duplicate'));
                this.removeQueryParams();
                this.getDuplicatedCompany();
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

        this.language$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.initFormSteps(this.currentCompletedStep);
        });

        this.myKycList$.pipe(
            rxMap((kycs) => {
                const list = Object.keys(kycs).map(k => kycs[k])
                   .filter(kyc => kyc.amManagementCompanyID === null);
                return getValue(list, '[0].kycID', undefined);
            }),
            takeUntil(this.unsubscribe),
        ).subscribe(clientFileId => this.clientFileId = clientFileId);

        this.kycInvestorType$.pipe(
            takeUntil(this.unsubscribe),
        ).subscribe(t => this.kycInvestorType = t);
    }

    initForm() {
        this.forms = this.newRequestService.createRequestForm();
    }

    initFormSteps(completedStep) {
        this.currentCompletedStep = completedStep;

        if (this.fullForm) {
            this.stepsConfig = formStepsFull;
        } else {
            this.stepsConfig = formStepsLight;
        }
    }

    goToStep(currentStep) {
        const stepLevel = steps[currentStep];
        this.formSteps.goToStep(stepLevel);
    }

    go(currentStep) {
        const stepLevel = steps[currentStep];
        this.formSteps.go(stepLevel);
    }

    getNextStep(step) {
        const stepLevel = steps[step];
        const nextStep = invert(steps)[stepLevel + 1];

        if (nextStep) {
            return nextStep;
        }
    }

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

    handleSubmit(event) {
        if (event.completed) {
            this.formSteps.next();
        }

        if (event.updateView) {
            this.changeDetectorRef.detectChanges();
        }
    }

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

    getDuplicatedCompany() {
        combineLatest(this.myKycList$, this.managementCompanyList$)
        .pipe(
            rxMap(([kycs, managementCompanies]) => ([kycs, managementCompanies.toJS()])),
            rxFilter(([kycs, managementCompanies]) => managementCompanies.length),
            take(1),
        )
        .subscribe(([kycs, managementCompanies]) => {
            const kyc = find(kycs, ['kycID', this.duplicate]);
            const managementCompany = find(managementCompanies, ['companyID', kyc.amManagementCompanyID]);
            if (managementCompany) {
                this.duplicateCompany = managementCompany.companyName;
            }
        });
    }

    registered(isRegistered) {
        this.applyFullForm = partial(this.animationDone, !isRegistered);
        this.animating = true;
    }

    animationDone(fullFormValue) {
        this.animating = false;

        this.fullForm = fullFormValue;
        this.initFormSteps(this.currentCompletedStep);
    }

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
