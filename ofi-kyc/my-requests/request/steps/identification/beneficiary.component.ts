import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { get as getValue } from 'lodash';

import {sirenValidator, siretValidator} from '@setl/utils/helper/validators';
import { RequestsService } from '../../../requests.service';
import { NewRequestService, configDate } from '../../new-request.service';
import { countries } from '../../../requests.config';

@Component({
    selector: 'beneficiary',
    templateUrl: './beneficiary.component.html',
})
export class BeneficiaryComponent implements OnInit, OnDestroy {

    @Input() form;
    @Input() index;
    @Output() ready: EventEmitter<any> = new EventEmitter<any>();

    unsubscribe: Subject<any> = new Subject<any>();
    configDate;
    beneficiaryTypesList;
    holdingTypesList;
    nationalIdNumberList;
    countries;

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
    ) {
        this.configDate = configDate;
        this.beneficiaryTypesList = this.newRequestService.beneficiaryTypesList;
        this.holdingTypesList = this.newRequestService.holdingTypesList;
        this.nationalIdNumberList = this.newRequestService.nationalIdNumberList;
        this.countries = countries;
    }

    ngOnInit() {
        this.form.get('legalPerson').disable();
        this.form.get('naturalPerson').disable();

        this.initFormCheck();

        (this.form.get('beneficiaryType') as FormControl).updateValueAndValidity();
        (this.form.get('legalPerson.nationalIdNumber') as FormControl).updateValueAndValidity();
        this.ready.emit();
    }

    initFormCheck() {
        this.form
        .get('beneficiaryType')
        .valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
            const beneficiaryTypeValue = getValue(data, [0, 'id']);

            this.formCheckBeneficiaryType(beneficiaryTypeValue);
        })
        ;

        this.form
        .get('legalPerson.nationalIdNumber')
        .valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
            const nationalIdNumberValue = getValue(data, [0, 'id']);

            this.formCheckNationalIdNumber(nationalIdNumberValue);
        })
        ;
    }

    formCheckNationalIdNumber(value) {
        const nationalIdNumberTextControl: AbstractControl = this.form.get('legalPerson.nationalIdNumberText');

        if (value) {
            nationalIdNumberTextControl.enable();

            if (value === 'siren') {
                nationalIdNumberTextControl.setValidators([sirenValidator]);
            } else if (value === 'siret') {
                nationalIdNumberTextControl.setValidators([siretValidator]);
            } else {
                nationalIdNumberTextControl.clearValidators();
            }
        } else {
            nationalIdNumberTextControl.disable();
        }

        nationalIdNumberTextControl.updateValueAndValidity();
    }

    formCheckBeneficiaryType(value) {
        const legalPersonControl: AbstractControl = this.form.get('legalPerson');
        const naturalPersonControl: AbstractControl = this.form.get('naturalPerson');

        if (value === 'legalPerson') {
            legalPersonControl.enable();
            naturalPersonControl.disable();
            (this.form.get('legalPerson.nationalIdNumber') as FormControl).updateValueAndValidity();
        } else if (value === 'naturalPerson') {
            naturalPersonControl.enable();
            legalPersonControl.disable({ emitEvent: false });
        }
    }

    uploadFile($event) {
        const formControl = this.form.get('naturalPerson.document');

        this.requestsService.uploadFile($event).then((file: any) => {
            formControl.get('hash').patchValue(file.fileHash);
            formControl.get('name').patchValue(file.fileTitle);
            formControl.get('kycDocumentID').patchValue('');
        });
    }

    isDisabled(path) {
        const control = this.form.get(path);

        return control.disabled;
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
