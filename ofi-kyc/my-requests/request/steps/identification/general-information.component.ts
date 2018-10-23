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
    sectorActivityList;
    legalStatusList;
    legalStatusInsurerTypeList;
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
        this.sectorActivityList = this.newRequestService.sectorActivityList;
        this.legalStatusList = this.newRequestService.legalStatusList;
        this.legalStatusInsurerTypeList = this.newRequestService.legalStatusInsurerTypeList;
        this.publicEstablishmentList = this.newRequestService.publicEstablishmentList;
        this.identificationNumberList = this.newRequestService.identificationNumberList;

        this.initFormCheck();
        this.getCurrentFormData();
    }

    initFormCheck() {
        this.form.get('legalStatus').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(data => {
                let legalStatusValue = getValue(data, [0, 'id']);

                this.formCheckLegalStatus(legalStatusValue);
            })
        ;

        this.form.get('sectorActivity').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(data => {
                let sectorActivityValue = getValue(data, [0, 'id']);

                this.formCheckSectorActivity(sectorActivityValue);
            })
        ;

        this.form.get('otherIdentificationNumber').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                const otherIdentificationNumberValue = getValue(data, [0, 'id']);

                this.formCheckOtherIdentificationNumber(otherIdentificationNumberValue);
            })
        ;
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

    formCheckSectorActivity(value) {
        let form = this.form;
        let sectorActivityTextControl = form.get('sectorActivityText');

        if (value === 'other') {
            sectorActivityTextControl.enable();
        } else {
            sectorActivityTextControl.disable();
        }

        this.formPercent.refreshFormPercent();
    }

    formCheckLegalStatus(value) {
        let form = this.form;
        let controls = ['legalStatusListingMarkets', 'legalStatusInsurerType', 'legalStatusListingOther'];

        for (const control of controls) {
            form.get(control).disable();
        }

        switch (value) {
            case 'listedCompany':
                form.get('legalStatusListingMarkets').enable();
                break;
            case 'insurer':
                form.get('legalStatusInsurerType').enable();
                break;
            case 'other' :
                form.get('legalStatusListingOther').enable();
                break;
        }

        this.formPercent.refreshFormPercent();
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