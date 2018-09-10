import {Component, OnInit, Input, OnDestroy, ViewChild} from '@angular/core';
import {select} from '@angular-redux/store';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {filter, take, takeUntil} from 'rxjs/operators';
import {isEmpty, values, map} from 'lodash';

import {FormPercentDirective} from '@setl/utils/directives/form-percent/formpercent';
import {NewRequestService} from '../../new-request.service';
import {RiskProfileService} from '../risk-profile.service';

@Component({
    selector: 'investment-objective',
    templateUrl: './investment-objective.component.html'
})
export class InvestmentObjectiveComponent implements OnInit, OnDestroy {

    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) currentlyRequestedKycs$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    amcs;

    constructor(
        private newRequestService: NewRequestService,
        private riskProfileService: RiskProfileService
    ) {
    }

    get objectiveControls() {
        return this.form.get('objectives').controls;
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
                if(data.objectivesSameInvestmentCrossAm){
                    this.form.get('objectivesSameInvestmentCrossAm').patchValue(data.objectivesSameInvestmentCrossAm, {emitEvent: false})
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
        (this.form.get('objectivesSameInvestmentCrossAm') as FormControl).updateValueAndValidity();
    }

    initFormCheck() {
        this.form.get('objectivesSameInvestmentCrossAm').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(value => {
                this.formCheckSameInvestmentCrossAm(value);
            })
        ;
    }

    formCheckSameInvestmentCrossAm(value) {
        if (value) {
            this.generateObjectives();
        } else {
            this.generateObjectives(map(this.amcs, 'amcID'));
        }

        this.formPercent.refreshFormPercent();
    }

    generateObjectives(amcs = []) {
        let objectives = this.newRequestService.createInvestmentObjectives(amcs);
        let objectivesControl = this.form.get('objectives');
        let numberOfControls = objectivesControl.length;

        for (let i = numberOfControls; i >= 0; i--) {
            objectivesControl.removeAt(i);
        }

        objectives.forEach(objective => {
            objectivesControl.push(objective);
        });
    }

    refreshForm(){
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