import {Component, OnInit, OnDestroy, Input, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {select} from '@angular-redux/store';
import {FormControl} from '@angular/forms';
import {isEmpty, values, map} from 'lodash';
import {filter, takeUntil} from 'rxjs/operators';

import {FormPercentDirective} from '@setl/utils/directives/form-percent/formpercent';
import {NewRequestService} from '../../new-request.service';
import {RiskProfileService} from '../risk-profile.service';

@Component({
    selector: 'investment-constraint',
    templateUrl: './investment-constraint.component.html'
})
export class InvestmentConstraintComponent implements OnInit, OnDestroy {

    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) currentlyRequestedKycs$;

    open: boolean = false;
    unsubscribe: Subject<any> = new Subject();
    amcs;

    get constraintControls() {
        return this.form.get('constraints').controls;
    }

    constructor(
        private newRequestService: NewRequestService,
        private riskProfileService: RiskProfileService
    ) {
    }


    ngOnInit() {
        this.initFormCheck();
        this.initData();
        this.getCurrentFormData();

        this.updateCrossAM();
    }

    getCurrentFormData() {
        this.riskProfileService.currentServerData.riskobjective
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe((data: any) => {
                if(data.constraintsSameInvestmentCrossAm){
                    this.form.get('constraintsSameInvestmentCrossAm').patchValue(data.constraintsSameInvestmentCrossAm, {emitEvent: false});
                }
            })
        ;
    }

    initData() {
        this.currentlyRequestedKycs$
            .pipe(
                takeUntil(this.unsubscribe),
                filter(requestedKycs => !isEmpty(requestedKycs))
            )
            .subscribe(requestedKycs => {
                this.amcs = values(requestedKycs);
                this.updateCrossAM();
            })
        ;
    }

    updateCrossAM(){
        (this.form.get('constraintsSameInvestmentCrossAm') as FormControl).updateValueAndValidity();
    }

    initFormCheck() {
        this.form.get('constraintsSameInvestmentCrossAm').valueChanges.takeUntil(this.unsubscribe).subscribe(value => {
            this.formCheckSameInvestmentCrossAm(value);
        });
    }

    formCheckSameInvestmentCrossAm(value) {
        if (value) {
            this.generateConstraints();
        } else {
            this.generateConstraints(map(this.amcs, 'amcID'));
        }

        this.formPercent.refreshFormPercent();
    }

    generateConstraints(amcs = []) {
        let constraints = this.newRequestService.createConstraints(amcs);
        let constraintsControl = this.form.get('constraints');
        let numberOfControls = constraintsControl.length;

        for (let i = numberOfControls; i >= 0; i--) {
            constraintsControl.removeAt(i);
        }
        constraints.forEach(constraint => {
            constraintsControl.push(constraint);
        });
    }

    refreshForm() {
        this.formPercent.refreshFormPercent();
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}