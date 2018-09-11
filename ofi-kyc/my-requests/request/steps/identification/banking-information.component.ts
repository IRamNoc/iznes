import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { get as getValue, isEmpty, castArray } from 'lodash';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { select } from '@angular-redux/store';

import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { IdentificationService } from '../identification.service';
import { NewRequestService } from '../../new-request.service';
import { countries } from "../../../requests.config";

@Component({
    selector: 'banking-information',
    templateUrl: './banking-information.component.html',
    styleUrls: ['./banking-information.component.scss']
})
export class BankingInformationComponent implements OnInit, OnDestroy {

    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    countries = countries;
    custodianHolderAccountList;

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService
    ) {
    }

    get holders() {
        return (this.form.get('custodianHolderCustom') as FormArray).controls;
    }

    ngOnInit() {
        this.initFormCheck();
        this.getCurrentFormData();

        this.custodianHolderAccountList = this.newRequestService.custodianHolderAccountList;
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    initFormCheck() {
        let holderCustom = this.form.get('custodianHolderCustom');
        holderCustom.disable();

        this.form.get('custodianHolderAccount').valueChanges
        .pipe(
            takeUntil(this.unsubscribe)
        )
        .subscribe(data => {
            let value = getValue(data, [0, 'id']);
            if (value === 'other') {
                holderCustom.enable();
            } else {
                holderCustom.disable();
            }

            this.formPercent.refreshFormPercent();
        })
        ;
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }

    addHolder() {
        let control = this.form.get('custodianHolderCustom') as FormArray;
        control.push(this.newRequestService.createHolderCustom());
        this.formPercent.refreshFormPercent();
    }

    removeHolder(i) {
        let control = this.form.get('custodianHolderCustom') as FormArray;

        if (control.at(i).value.custodianID !== '') {
            this.identificationService.deleteHolder(
                control.at(i).value.custodianID
            );
        }

        control.removeAt(i);
        this.formPercent.refreshFormPercent();
    }

    getCurrentFormData() {
        this.requests$
        .pipe(
            filter(requests => !isEmpty(requests)),
            map(requests => castArray(requests[0])),
            takeUntil(this.unsubscribe)
        )
        .subscribe(requests => {
            requests.forEach(request => {
                this.identificationService.getCurrentFormBankingData(request.kycID).then(formData => {
                    if (formData) {
                        this.form.patchValue(formData);

                        if (formData.length) {
                            let bankingAccounts = (this.form.get('custodianHolderCustom') as FormArray).controls;
                            bankingAccounts.splice(0);

                            let account = getValue(formData, [0, 'custodianHolderAccount']);
                            let custodianHolderAccount: FormControl = this.form.get('custodianHolderAccount');
                            custodianHolderAccount.patchValue(account);
                            custodianHolderAccount.updateValueAndValidity();

                            formData.forEach(controlValue => {
                                let control = this.newRequestService.createHolderCustom();

                                control.patchValue(controlValue);
                                bankingAccounts.push(control);
                            });
                        }
                    }
                });
            });
        })
        ;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}