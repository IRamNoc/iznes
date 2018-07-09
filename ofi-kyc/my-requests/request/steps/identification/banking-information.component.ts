import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {FormArray} from '@angular/forms';
import {get as getValue, isEmpty, castArray} from 'lodash';
import {Subject} from 'rxjs/Subject';
import {select} from '@angular-redux/store';

import {IdentificationService} from '../identification.service';
import {NewRequestService} from '../../new-request.service';
import {countries} from "../../../requests.config";

@Component({
    selector : 'banking-information',
    templateUrl : './banking-information.component.html',
    styleUrls : ['./banking-information.component.scss']
})
export class BankingInformationComponent implements OnInit, OnDestroy{

    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe : Subject<any> = new Subject();
    open: boolean = false;
    countries = countries;
    custodianHolderAccountList;

    constructor(
        private newRequestService : NewRequestService,
        private identificationService : IdentificationService
    ){}

    get holders() {
        return (this.form.get('custodianHolderCustom') as FormArray).controls;
    }

    ngOnInit(){
        this.initFormCheck();
        this.getCurrentFormData();

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

    getCurrentFormData(){
        this.requests$
            .filter(requests => !isEmpty(requests))
            .map(requests => castArray(requests[0]))
            .subscribe(requests => {
                requests.forEach(request => {
                    this.identificationService.getCurrentFormBankingData(request.kycID).then(formData => {
                        if(formData){
                            this.form.patchValue(formData);
                        }
                    });
                });
            })
        ;
    }

    ngOnDestroy(){
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}