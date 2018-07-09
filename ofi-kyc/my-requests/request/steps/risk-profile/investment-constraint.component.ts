import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {select} from '@angular-redux/store';
import {isEmpty, values, map} from 'lodash';

import {NewRequestService} from '../../new-request.service';
import {RiskProfileService} from '../risk-profile.service';

@Component({
    selector : 'investment-constraint',
    templateUrl : './investment-constraint.component.html'
})
export class InvestmentConstraintComponent implements OnInit, OnDestroy{

    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) currentlyRequestedKycs$;

    open: boolean = false;
    unsubscribe : Subject<any> = new Subject();
    amcs;

    get constraintControls(){
        return this.form.get('constraints').controls;
    }
    constructor(
        private newRequestService : NewRequestService,
        private riskProfileService : RiskProfileService
    ){}


    ngOnInit(){
        this.initFormCheck();
        this.initData();
        this.getCurrentFormData();

        let constraintsSameInvestmentCrossAmControl = this.form.get('constraintsSameInvestmentCrossAm');
        constraintsSameInvestmentCrossAmControl.setValue(constraintsSameInvestmentCrossAmControl.value);
    }

    getCurrentFormData(){
        this.riskProfileService.currentServerData.riskobjective.subscribe((data : any) => {
            this.form.get('constraintsSameInvestmentCrossAm').patchValue(data.constraintsSameInvestmentCrossAm, {emitEvent : false})
        });
    }

    initData(){
        this.currentlyRequestedKycs$
            .takeUntil(this.unsubscribe)
            .filter(requestedKycs => !isEmpty(requestedKycs))
            .subscribe(requestedKycs => {
                this.amcs = values(requestedKycs);
            })
        ;
    }

    initFormCheck(){
        this.form.get('constraintsSameInvestmentCrossAm').valueChanges.takeUntil(this.unsubscribe).subscribe(value => {
            this.formCheckSameInvestmentCrossAm(value);
        });
    }

    formCheckSameInvestmentCrossAm(value){
        if(value){
            this.generateConstraints();
        } else{
            this.generateConstraints(map(this.amcs, 'amcID'));
        }
    }

    generateConstraints(amcs = []){
        let constraints = this.newRequestService.createConstraints(amcs);
        let constraintsControl = this.form.get('constraints');
        let numberOfControls = constraintsControl.length;

        for(let i = numberOfControls; i >= 0; i--){
            constraintsControl.removeAt(i);
        }
        constraints.forEach(constraint => {
            constraintsControl.push(constraint);
        });
    }

    hasError(control, error = []){
        return this.newRequestService.hasError(this.form, control, error);
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }

    ngOnDestroy(){
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}