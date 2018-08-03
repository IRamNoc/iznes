import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {select} from '@angular-redux/store';
import {get as getValue, map, sort} from 'lodash';
import {Subject, combineLatest} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {FormStepsDirective} from '@setl/utils/directives/form-steps/formsteps';
import {NewRequestService} from './new-request.service';
import {steps} from '../requests.config';

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

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private newRequestService: NewRequestService
    ) {
    }

    get isListedCompany() {
        let legalStatus = getValue(this.forms.get('identification.generalInformation.legalStatus').value, [0, 'id']);
        return legalStatus === 'listedCompany';
    }

    ngOnInit() {
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
                    title: 'Introduction',
                    startHere: completedStep === 'amcSelection',
                },
                {
                    title: 'Identification',
                    id: 'step-identification',
                    form: this.forms.get('identification'),
                    startHere: completedStep === 'introduction'
                },
                {
                    title: 'Risk profile',
                    id: 'step-risk-profile',
                    form: this.forms.get('riskProfile'),
                    startHere: completedStep === 'identification'
                },
                {
                    title: 'Documents',
                    id: 'step-documents',
                    form: this.forms.get('documents'),
                    startHere: completedStep === 'riskProfile'
                }
            ];
        }

        this.stepsConfig = [
            {
                title: 'Selection',
                form: this.forms.get('selection'),
                id: 'step-selection'
            },
            ...extraSteps,
            {
                title: 'Validation',
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