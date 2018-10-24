import {Component, Input, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { FormGroup, AbstractControl, Validators } from '@angular/forms';
import {get as getValue, isEmpty, castArray} from 'lodash';
import {select} from '@angular-redux/store';
import {Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';

import {sirenValidator, siretValidator} from '@setl/utils/helper/validators';
import {FormPercentDirective} from '@setl/utils/directives/form-percent/formpercent';
import {countries} from '../../../requests.config';
import {NewRequestService} from '../../new-request.service';
import {IdentificationService} from '../identification.service';

@Component({
    selector: 'general-information',
    templateUrl: './general-information.component.html'
})
export class GeneralInformationComponent implements OnInit, OnDestroy {

    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form: FormGroup;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    countries = countries;
    legalFormList;
    publicEstablishmentList;
    identificationNumberList;
    associations;

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService
    ) {
    }

    ngOnInit() {
        this.legalFormList = this.newRequestService.legalFormList;
        this.publicEstablishmentList = this.newRequestService.publicEstablishmentList;
        this.identificationNumberList = this.newRequestService.identificationNumberList;

        this.initFormCheck();
        this.getCurrentFormData();
    }

    initFormCheck() {
        this.form.get('otherIdentificationNumber').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                const otherIdentificationNumberValue = getValue(data, [0, 'id']);

                this.formCheckOtherIdentificationNumber(otherIdentificationNumberValue);
            })
        ;

        this.form.get('commercialDomiciliation').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((value) => {
                this.formCheckCommercialDomiciliation(value);
            })
        ;
    }

    formCheckCommercialDomiciliation(value) {
        const commercialDomiciliationControls: AbstractControl[] = [
            this.form.get('commercialAddressLine1'),
            this.form.get('commercialAddressLine2'),
            this.form.get('commercialZipCode'),
            this.form.get('commercialCity'),
            this.form.get('commercialCountry'),
        ];

        if (value) {
            commercialDomiciliationControls.forEach((control) => {
                control.enable();
            });
        } else {
            commercialDomiciliationControls.forEach((control) => {
                control.disable();
            });
        }
    }

    formCheckOtherIdentificationNumber(value) {
        const otherIdentificationNumberTextControl: AbstractControl = this.form.get('otherIdentificationNumberText');

        if (value) {
            otherIdentificationNumberTextControl.enable();

            if (value === 'siren') {
                otherIdentificationNumberTextControl.setValidators([sirenValidator, Validators.required]);
            } else if (value === 'siret') {
                otherIdentificationNumberTextControl.setValidators([siretValidator, Validators.required]);
            } else {
                otherIdentificationNumberTextControl.setValidators([Validators.required]);
            }
        } else {
            otherIdentificationNumberTextControl.disable();
        }

        otherIdentificationNumberTextControl.updateValueAndValidity();
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
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
                    this.identificationService.getCurrentFormGeneralData(request.kycID).then(formData => {
                        if (formData) {
                            this.form.patchValue(formData);
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