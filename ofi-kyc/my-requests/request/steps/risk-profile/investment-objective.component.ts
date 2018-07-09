import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {NewRequestService} from '../../new-request.service';
import {RiskProfileService} from '../risk-profile.service';
import {select} from '@angular-redux/store';
import {Subject} from 'rxjs/Subject';
import {isEmpty, values, map} from 'lodash';

@Component({
    selector: 'investment-objective',
    templateUrl: './investment-objective.component.html'
})
export class InvestmentObjectiveComponent implements OnInit, OnDestroy {

    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) currentlyRequestedKycs$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    amcs;

    constructor(
        private newRequestService: NewRequestService,
        private riskProfileService : RiskProfileService
    ) {
    }

    get objectiveControls() {
        return this.form.get('objectives').controls;
    }

    ngOnInit() {
        this.initFormCheck();
        this.initData();
        this.getCurrentFormData();

        let objectivesSameInvestmentCrossAmControl = this.form.get('objectivesSameInvestmentCrossAm');
        objectivesSameInvestmentCrossAmControl.setValue(objectivesSameInvestmentCrossAmControl.value);
    }

    getCurrentFormData(){
        this.riskProfileService.currentServerData.riskobjective.subscribe((data : any) => {
            this.form.get('objectivesSameInvestmentCrossAm').patchValue(data.objectivesSameInvestmentCrossAm, {emitEvent : false})
        });
    }

    initData() {
        this.currentlyRequestedKycs$
            .takeUntil(this.unsubscribe)
            .filter(requestedKycs => !isEmpty(requestedKycs))
            .subscribe(requestedKycs => {
                this.amcs = values(requestedKycs);
            })
        ;
    }

    initFormCheck() {
        this.form.get('objectivesSameInvestmentCrossAm').valueChanges.subscribe(value => {
            this.formCheckSameInvestmentCrossAm(value);
        });
    }

    formCheckSameInvestmentCrossAm(value) {
        if (value) {
            this.generateObjectives();
        } else {
            this.generateObjectives(map(this.amcs, 'amcID'));
        }
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