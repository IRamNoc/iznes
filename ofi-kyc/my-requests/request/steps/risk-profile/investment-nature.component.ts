import {Component, OnInit, Input} from '@angular/core';
import {isEmpty, castArray} from 'lodash';
import {select} from '@angular-redux/store';
import {Subject} from 'rxjs/Subject';

import {RiskProfileService} from '../risk-profile.service';
import {NewRequestService} from '../../new-request.service';

@Component({
    selector: 'investment-nature',
    templateUrl: './investment-nature.component.html',
    styleUrls: ['./investment-nature.component.scss']
})
export class InvestmentNatureComponent implements OnInit {

    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe : Subject<any> = new Subject();
    open: boolean = false;
    investmentVehicleList;
    frequencyList;

    constructor(
        private newRequestService: NewRequestService,
        private riskProfileService: RiskProfileService
    ) {
    }

    ngOnInit() {
        this.initFormCheck();
        this.getCurrentFormData();

        this.investmentVehicleList = this.newRequestService.investmentVehiclesList;
        this.frequencyList = this.newRequestService.frequencyList;
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    initFormCheck() {
        this.form.get('investmentvehiclesAlreadyUsed').valueChanges.subscribe(investmentvehiclesAlreadyUsed => {
            this.formCheckInvestmentVehicles(investmentvehiclesAlreadyUsed);
        });
    }

    formCheckInvestmentVehicles(value) {
        let investmentvehiclesAlreadyUsedSpecificationControl = this.form.get('investmentvehiclesAlreadyUsedSpecification');

        if (value.other) {
            investmentvehiclesAlreadyUsedSpecificationControl.enable();
        } else {
            investmentvehiclesAlreadyUsedSpecificationControl.disable();
        }
    }

    getCurrentFormData(){
        this.requests$
            .filter(requests => !isEmpty(requests))
            .map(requests => castArray(requests[0]))
            .subscribe(requests => {
                requests.forEach(request => {
                    this.riskProfileService.getCurrentFormNatureData(request.kycID).then(formData => {
                        if(formData){
                            this.form.patchValue(formData);
                        }
                    });
                });
            })
        ;
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