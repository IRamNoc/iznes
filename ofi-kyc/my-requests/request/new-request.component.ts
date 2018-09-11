import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select } from '@angular-redux/store';
import { get as getValue, map, sort, remove, partial, invert } from 'lodash';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { steps, formStepsLight, formStepsFull } from '../requests.config';
import { NewRequestService } from './new-request.service';

import { FormstepsComponent } from '@setl/utils/components/formsteps/formsteps.component';

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
})
export class NewKycRequestComponent implements OnInit, AfterViewInit {

    @ViewChild(FormstepsComponent) formSteps;

    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe: Subject<any> = new Subject();
    stepsConfig: any;
    forms: any = {};

    animating: Boolean;
    fullForm = true;
    applyFullForm = () => {
    };

    currentCompletedStep;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private newRequestService: NewRequestService
    ) {
    }

    get isPro() {
        return this.investorType === 'proBySize' || this.investorType === 'proByNature';
    }

    get investorType() {
        let legalStatusControl = this.forms.get('identification.generalInformation.legalStatus').value;
        let legalStatusValue = getValue(legalStatusControl, [0, 'id']);
        let possibleLegalStatusValues = [
            'pensionMutual',
            'creditInstitution',
            'insurer',
            'institutionalInvestors',
            'otherInvestors',
            'managementCompany',
            'centralBank',
            'localCompanies',
            'nationalGovService',
            'dealersCommodities',
            'internationBodies'
        ];

        let balanceSheetTotalValue = this.forms.get('identification.companyInformation.balanceSheetTotal').value;
        let netRevenuesNetIncomeValue = this.forms.get('identification.companyInformation.netRevenuesNetIncome').value;
        let shareholderEquityValue = this.forms.get('identification.companyInformation.shareholderEquity').value;

        if (possibleLegalStatusValues.indexOf(legalStatusValue) !== -1) {
            return "proByNature";
        }

        let balanceSheetCondition = balanceSheetTotalValue >= 20000000;
        let netRevenuesCondition = netRevenuesNetIncomeValue >= 40000000;
        let equityCondition = shareholderEquityValue >= 2000000;
        let trues = remove([balanceSheetCondition, netRevenuesCondition, equityCondition]);

        if (trues.length >= 2) {
            return "proBySize";
        }

        return "nonPro";
    }

    ngOnInit() {
        this.initForm();
        this.initSubscriptions();
    }

    ngAfterViewInit() {
        if (this.currentCompletedStep) {
            const nextStep = this.getNextStep(this.currentCompletedStep);
            this.goToStep(nextStep);
        }
    }

    initSubscriptions() {
        this.requests$
        .pipe(
            takeUntil(this.unsubscribe)
        )
        .subscribe(amcs => {
            this.newRequestService.getContext(amcs);
        })
        ;

        this.route.queryParamMap.subscribe(params => {
            const step = params.get('step');
            const completed = params.get('completed');

            this.fullForm = !(completed === 'true');

            this.initFormSteps(step);
        });
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
            this.router.navigateByUrl('/my-requests/list');
        }
    }

    isBeginning() {
        if (this.formSteps) {
            return this.formSteps.position === 0;
        }
    }

    handleSubmit(event) {
        if (event.completed) {
            this.formSteps.next();
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

    registered(isRegistered) {
        this.applyFullForm = partial(this.animationDone, !isRegistered);
        this.animating = true;
    }

    animationDone(fullFormValue) {
        this.animating = false;

        this.fullForm = fullFormValue;
        this.initFormSteps(this.currentCompletedStep);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}