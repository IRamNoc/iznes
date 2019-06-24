import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef, OnDestroy } from '@angular/core';
import { isEmpty, values, map, toNumber } from 'lodash';
import { select } from '@angular-redux/store';
import { formHelper } from '@setl/utils/helper';
import { Subject } from 'rxjs';
import { filter, takeUntil, take, distinctUntilChanged } from 'rxjs/operators';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { RiskProfileService } from '../risk-profile.service';
import { NewRequestService } from '../../new-request.service';
import { PersistService } from '@setl/core-persist';
import { steps } from '../../../requests.config';

@Component({
    selector: 'investment-constraint',
    templateUrl: './investment-constraint.component.html',
})
export class InvestmentConstraintComponent implements OnInit, OnDestroy {
    // Disabled because there no required fields for non- nowCP investorType
    // @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form;
    @Input() formObjective;
    @Input() completedStep: string;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) currentlyRequestedKycs$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    amcs;
    formWatch: Subject<boolean> = new Subject<boolean>();

    constructor(
        private persistService: PersistService,
        private element: ElementRef,
        private newRequestService: NewRequestService,
        private riskProfileService: RiskProfileService,
    ) {
    }

    get constraintControls() {
        return this.form.get('constraints').controls;
    }

    ngOnInit() {
        this.initData();
        this.initFormCheck();
        this.getCurrentFormData();
        this.updateCrossAM();
    }

    getCurrentFormData() {
        this.requests$
            .pipe(
                filter(requests => !isEmpty(requests)),
                takeUntil(this.unsubscribe),
            )
            .subscribe((requests) => {
                requests.forEach((request) => {
                    this.riskProfileService.getCurrentFormObjectiveData(request.kycID);
                });
            });

        this.riskProfileService.currentServerData.riskobjective
            .pipe(
                takeUntil(this.unsubscribe),
                distinctUntilChanged(),
            )
            .subscribe((data: any) => {
                const cross = toNumber(data.constraintsSameInvestmentCrossAm);
                if (cross) {
                    this.form.get('constraintsSameInvestmentCrossAm').patchValue(cross, { emitEvent: false });
                    this.formCheckSameInvestmentCrossAm(cross);
                }
                this.initFormPersist();
            });
    }

    initData() {
        this.currentlyRequestedKycs$
            .pipe(
                takeUntil(this.unsubscribe),
                filter(requestedKycs => !isEmpty(requestedKycs)),
            )
            .subscribe((requestedKycs) => {
                this.amcs = values(requestedKycs);
                this.updateCrossAM();
            });

        this.formWatch
            .pipe(
                takeUntil(this.unsubscribe),
            )
            .subscribe(() => {
                // Disabled because there no required fields for non- nowCP investorType
                // this.refreshForm();
            });
    }

    updateCrossAM() {
        const value = this.form.get('constraintsSameInvestmentCrossAm').value;
        this.formCheckSameInvestmentCrossAm(value);
    }

    initFormCheck() {
        this.form.get('constraintsSameInvestmentCrossAm').valueChanges.takeUntil(this.unsubscribe).subscribe((value) => {
            this.riskProfileService.currentServerData.riskobjective.next('');
            this.formCheckSameInvestmentCrossAm(value);
        });
    }

    formCheckSameInvestmentCrossAm(value) {
        if (value) {
            this.generateConstraints();
        } else {
            this.generateConstraints(map(this.amcs, 'amcID'));
        }

        // Disabled because there no required fields for non- nowCP investorType
        // this.refreshForm();
    }

    generateConstraints(amcs = []) {
        const constraints = this.newRequestService.createConstraints(amcs);
        const constraintsControl = this.form.get('constraints');
        const numberOfControls = constraintsControl.length;

        for (let i = numberOfControls; i >= 0; i -= 1) {
            constraintsControl.removeAt(i);
        }
        constraints.forEach((constraint) => {
            constraintsControl.push(constraint);
        });
    }

    // Disabled because there no required fields for non- nowCP investorType
    /* refreshForm() {
        this.formPercent.refreshFormPercent();
    } */

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    /**
     * Init Form Persist if the step has not been completed
     */
    initFormPersist() {
        if (!this.completedStep || (steps[this.completedStep] < steps.investmentConstraints)) this.persistForm();
    }

    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/riskProfile/investmentConstraint',
            this.form,
            this.newRequestService.context,
            {
                reset: false,
                returnPromise: true,
            },
        ).then(() => {
            this.formWatch.next(true);
        });
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/riskProfile/investmentConstraint',
            this.newRequestService.createRiskProfileFormGroup(),
            this.newRequestService.context,
        );
    }

    isDisabled(path) {
        const control = this.form.get(path);

        return control.disabled;
    }

    isStepValid() {
        return this.form.valid;
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.form.valid) {
            formHelper.dirty(this.form);
            formHelper.scrollToFirstError(this.element.nativeElement);
            return;
        }

        this.requests$
            .pipe(
                take(1),
            )
            .subscribe((requests) => {
                this.riskProfileService.sendRequestInvestmentObjective(this.formObjective, this.form, requests, 'investmentConstraints')
                    .then(() => {
                        this.clearPersistForm();
                        this.submitEvent.emit({
                            completed: true,
                        });
                    })
                    .catch(() => {
                        this.newRequestService.errorPop();
                    })
                    ;
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
