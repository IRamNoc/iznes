import {Component, OnInit, Input} from '@angular/core';

import {NewRequestService} from '../../new-request.service';

@Component({
    selector: 'investment-nature',
    templateUrl: './investment-nature.component.html',
    styleUrls: ['./investment-nature.component.scss']
})
export class InvestmentNatureComponent implements OnInit {

    @Input() form;
    open: boolean = false;
    investmentVehicleList;
    frequencyList;

    constructor(
        private newRequestService: NewRequestService
    ) {
    }

    ngOnInit() {
        this.initFormCheck();
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

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }
}