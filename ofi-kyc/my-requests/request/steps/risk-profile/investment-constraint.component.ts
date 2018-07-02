import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {NewRequestService} from '../../new-request.service';
import {Subject} from 'rxjs/Subject';
import {select} from '@angular-redux/store';
import {isEmpty, values} from 'lodash';

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
        private newRequestService : NewRequestService
    ){}


    ngOnInit(){
        this.initFormCheck();
        this.initData();

        let constraintsSameInvestmentCrossAmControl = this.form.get('constraintsSameInvestmentCrossAm');
        constraintsSameInvestmentCrossAmControl.setValue(constraintsSameInvestmentCrossAmControl.value);
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
            this.generateConstraints(this.amcs);
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