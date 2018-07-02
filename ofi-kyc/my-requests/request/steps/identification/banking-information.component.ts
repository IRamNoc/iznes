import {Component, OnInit, Input} from '@angular/core';
import {FormArray} from '@angular/forms';
import {get as getValue} from 'lodash';


import {NewRequestService} from '../../new-request.service';
import {countries} from "../../../requests.config";

@Component({
    selector : 'banking-information',
    templateUrl : './banking-information.component.html',
    styleUrls : ['./banking-information.component.scss']
})
export class BankingInformationComponent implements OnInit{

    @Input() form;

    open: boolean = false;

    countries = countries;
    custodianHolderAccountList;

    constructor(
        private newRequestService : NewRequestService
    ){}

    get holders() {
        return (this.form.get('custodianHolderCustom') as FormArray).controls;
    }

    ngOnInit(){
        this.initFormCheck();

        this.custodianHolderAccountList = this.newRequestService.custodianHolderAccountList;
    }

    hasError(control, error = []){
        return this.newRequestService.hasError(this.form, control, error);
    }

    initFormCheck(){
        let holderCustom = this.form.get('custodianHolderCustom');
        holderCustom.disable();

        this.form.get('custodianHolderAccount').valueChanges.subscribe(data => {
            let value = getValue(data, [0, 'id']);
            if(value === 'other'){
                holderCustom.enable();
            } else{
                holderCustom.disable();
            }
        });
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }

    addHolder() {
        let control = this.form.get('custodianHolderCustom') as FormArray;
        control.push(this.newRequestService.createHolderCustom());
    }
    removeHolder(i){
        let control = this.form.get('custodianHolderCustom') as FormArray;
        control.removeAt(i);
    }

}