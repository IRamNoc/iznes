import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef, OnDestroy } from '@angular/core';
import { isEmpty, values, map, toNumber } from 'lodash';
import { select } from '@angular-redux/store';
import { formHelper } from '@setl/utils/helper';
import { Subject } from 'rxjs';
import { filter, take, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { RiskProfileService } from '../risk-profile.service';
import { NewRequestService } from '../../new-request.service';

@Component({
    selector: 'investment-objective',
    templateUrl: './investment-objective.component.html',
})
export class InvestmentObjectiveComponent implements OnInit, OnDestroy {
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form;
    @Input() formConstraint;
    @Input() completedStep: number;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) currentlyRequestedKycs$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    amcs;
    formWatch: Subject<boolean> = new Subject<boolean>();

    constructor(
        private element: ElementRef,
        private newRequestService: NewRequestService,
        private riskProfileService: RiskProfileService,
    ) {
    }

    get objectiveControls() {
        return this.form.get('objectives').controls;
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
            .pipe(takeUntil(this.unsubscribe), distinctUntilChanged())
            .subscribe((data: any) => {
                const cross = toNumber(data.objectivesSameInvestmentCrossAm);
                if (cross) {
                    this.form.get('objectivesSameInvestmentCrossAm').patchValue(cross, { emitEvent: false });
                    this.formCheckSameInvestmentCrossAm(cross);
                }

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
    }

    updateCrossAM() {
        const value = this.form.get('objectivesSameInvestmentCrossAm').value;
        this.formCheckSameInvestmentCrossAm(value);
    }

    initFormCheck() {
        this.form.get('objectivesSameInvestmentCrossAm').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((value) => {
                this.riskProfileService.currentServerData.riskobjective.next('');
                this.formCheckSameInvestmentCrossAm(value);
            });
    }

    formCheckSameInvestmentCrossAm(value) {
        if (value) {
            this.generateObjectives();
        } else {
            this.generateObjectives(map(this.amcs, 'amcID'));
        }

        this.formPercent.refreshFormPercent();
    }

    async generateObjectives(amcs = []) {
        const objectives = await this.newRequestService.createInvestmentObjectives(amcs);
        const objectivesControl = this.form.get('objectives');
        const numberOfControls = objectivesControl.length;

        for (let i = numberOfControls; i > 0; i -= 1) {
            objectivesControl.removeAt(i - 1);
        }

        objectives.forEach((objective) => {
            objectivesControl.push(objective);
        });
    }

    refreshForm() {
        this.formPercent.refreshFormPercent();
    }

    isStepValid() {
        return this.form.valid;
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.form.valid) {
            formHelper.dirty(this.form);
            formHelper.scrollToFirstError(this.element.nativeElement);
            this.submitEvent.emit({ invalid: true });
            return;
        }

        this.requests$
            .pipe(
                take(1),
            )
            .subscribe((requests) => {
                this.riskProfileService.sendRequestInvestmentObjective(this.form, this.formConstraint, requests, 'investmentObjectives')
                    .then(() => {
                        this.submitEvent.emit({
                            completed: true,
                        });
                    })
                    .catch((e) => {
                        this.newRequestService.errorPop(e);
                    })
                    ;
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
