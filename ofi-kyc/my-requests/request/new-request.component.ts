import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {select, NgRedux} from '@angular-redux/store';
import {get as getValue, map, sort, remove} from 'lodash';
import {Subject, combineLatest} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import { clearMyKycRequestedPersist } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { MultilingualService } from '@setl/multilingual';
import {FormStepsDirective} from '@setl/utils/directives/form-steps/formsteps';
import {NewRequestService} from './new-request.service';

@Component({
    templateUrl: './new-request.component.html',
    styleUrls : ['./new-request.component.scss']
})
export class NewKycRequestComponent implements OnInit {
    @ViewChild(FormStepsDirective) formSteps;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe: Subject<any> = new Subject();
    stepsConfig: any;
    forms: any = {};

    fullForm = true;
    currentCompletedStep;
    documentRules = {
        isListed : null,
        isFloatableHigh: null,
        isRegulated: null,
    };

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private newRequestService: NewRequestService,
        public translate: MultilingualService,
        private ngRedux: NgRedux<any>,
    ) {
    }

    get documents() {
        const isListed = this.forms.get('identification.companyInformation.companyListed').value;
        const isFloatableHigh = this.forms.get('identification.companyInformation.floatableShares').value >= 75;
        const isRegulated = this.forms.get('identification.companyInformation.activityRegulated').value;
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

        if (!changed) {
            return this.documentRules;
        }

        return {
            isListed: this.documentRules.isListed,
            isFloatableHigh: this.documentRules.isFloatableHigh,
            isRegulated: this.documentRules.isRegulated,
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

    ngOnInit() {
        this.ngRedux.dispatch(clearMyKycRequestedPersist());

        this.initForm();
        this.initSubscriptions();
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
            let step = params.get('step');
            let completed = params.get('completed');

            this.fullForm = !(completed === 'true');

            this.initFormSteps(step);
        });
    }

    initForm() {
        this.forms = this.newRequestService.createRequestForm();
    }

    initFormSteps(completedStep) {
        this.currentCompletedStep = completedStep;
        let extraSteps = [];
        if (this.fullForm) {
            extraSteps = [
                {
                    title: this.translate.translate('Introduction'),
                    startHere: completedStep === 'amcSelection',
                },
                {
                    title: this.translate.translate('Identification'),
                    id: 'step-identification',
                    form: this.forms.get('identification'),
                    startHere: completedStep === 'introduction'
                },
                {
                    title: this.translate.translate('Risk profile'),
                    id: 'step-risk-profile',
                    form: this.forms.get('riskProfile'),
                    startHere: completedStep === 'identification'
                },
                {
                    title: this.translate.translate('Documents'),
                    id: 'step-documents',
                    form: this.forms.get('documents'),
                    startHere: completedStep === 'riskProfile'
                }
            ];
        }

        this.stepsConfig = [
            {
                title: this.translate.translate('Selection'),
                form: this.forms.get('selection'),
                id: 'step-selection'
            },
            ...extraSteps,
            {
                title: this.translate.translate('Validation'),
                id: 'step-validation',
                form: this.forms.get('validation'),
                startHere: this.fullForm ? completedStep === 'documents' : completedStep === 'amcSelection'
            }
        ];
    }

    registered(isRegistered) {
        this.fullForm = !isRegistered;
        this.initFormSteps(this.currentCompletedStep);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
