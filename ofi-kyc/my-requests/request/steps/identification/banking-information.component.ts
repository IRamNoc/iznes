import {Component, OnInit, Input} from '@angular/core';
import {get as getValue} from 'lodash';

import {NewRequestService} from '../../new-request.service';
import {countries} from "../../../requests.config";

@Component({
    selector : 'banking-information',
    templateUrl : './banking-information.component.html'
})
export class BankingInformationComponent implements OnInit{

    @Input() form;
    countries = countries;
    custodianHolderAccountList;

    constructor(
        private newRequestService : NewRequestService
    ){}

    ngOnInit(){
        this.initFormCheck();

        this.custodianHolderAccountList = this.newRequestService.custodianHolderAccountList;
    }

    hasError(control, error = []){
        return this.newRequestService.hasError(this.form, control, error);
    }

    initFormCheck(){
        this.form.get('custodianHolderAccount').valueChanges.subscribe(data => {
            let value = getValue(data, [0, 'id']);
            let control = this.form.get('custodianHolderCustom');
            if(value === 'other'){
                control.enable();
            } else{
                control.disable();
            }
        });
    }

    shouldDisplay(){
        let control = this.form.get('custodianHolderAccount');
        let value = getValue(control, ['value', 0, 'id']);

        return value === 'other';
    }


}