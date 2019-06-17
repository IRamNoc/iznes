import { Component, Input, Output, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl, Validators  } from '@angular/forms';
import { get as getValue, isEmpty, castArray } from 'lodash';
import { select, NgRedux } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { filter, take, map, takeUntil } from 'rxjs/operators';
import { sirenValidator, siretValidator } from '@setl/utils/helper/validators';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { countries } from '../../../requests.config';
import { NewRequestService } from '../../new-request.service';
import { IdentificationService } from '../identification.service';
import { MultilingualService } from '@setl/multilingual';
import { formHelper } from '@setl/utils/helper';
import { PersistRequestService } from '@setl/core-req-services';
import { PersistService } from '@setl/core-persist';
import { setMyKycRequestedPersist } from '@ofi/ofi-main/ofi-store/ofi-kyc';

@Component({
    selector: 'general-information',
    templateUrl: './general-information.component.html',
})
export class GeneralInformationComponent implements OnInit, OnDestroy {
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form: FormGroup;
    @Input() isFormReadonly = false;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    countries;
    legalFormList;
    financialRatingList;
    publicEstablishmentList;
    identificationNumberTypeList;
    associations;

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
        public translate: MultilingualService,
        private element: ElementRef,
        private persistRequestService: PersistRequestService,
        private persistService: PersistService,
        private ngRedux: NgRedux<any>,
    ) {
    }

    ngOnInit() {
        this.countries = this.translate.translate(countries);

        this.initFormCheck();
        this.getCurrentFormData();
        this.initLists();

        this.requestLanguageObj
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(() => this.initLists());
    }

    initFormCheck() {
        this.form.get('otherIdentificationNumberType').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                const otherIdentificationNumberTypeValue = getValue(data, [0, 'id']);

                this.formCheckOtherIdentificationNumberType(otherIdentificationNumberTypeValue);
            });

        this.form.get('commercialDomiciliation').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((value) => {
                this.formCheckCommercialDomiciliation(value);
            });
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

        this.formPercent.refreshFormPercent();
    }

    formCheckOtherIdentificationNumberType(value) {
        const otherIdentificationNumberTextControl: AbstractControl = this.form.get('otherIdentificationNumberText');
        const otherIdentificationNumberTypeSpecifyControl: AbstractControl = this.form.get('otherIdentificationNumberTypeSpecify');

        otherIdentificationNumberTypeSpecifyControl.disable();

        if (value) {
            otherIdentificationNumberTextControl.enable();
            otherIdentificationNumberTextControl.clearValidators();
            otherIdentificationNumberTypeSpecifyControl.clearValidators();

            if (value === 'siren') {
                otherIdentificationNumberTextControl.setValidators([sirenValidator, Validators.required]);
                otherIdentificationNumberTypeSpecifyControl.setValue(null);
            } else if (value === 'siret') {
                otherIdentificationNumberTextControl.setValidators([siretValidator, Validators.required]);
                otherIdentificationNumberTypeSpecifyControl.setValue(null);
            } else if (value === 'other') {
                otherIdentificationNumberTypeSpecifyControl.enable();
                otherIdentificationNumberTypeSpecifyControl.setValidators([Validators.required]);
            } else {
                otherIdentificationNumberTextControl.setValidators([Validators.required]);
                otherIdentificationNumberTypeSpecifyControl.setValue(null);
            }
        } else {
            otherIdentificationNumberTextControl.disable();
            otherIdentificationNumberTypeSpecifyControl.disable();
        }

        otherIdentificationNumberTextControl.updateValueAndValidity();
        otherIdentificationNumberTypeSpecifyControl.updateValueAndValidity();
        this.formPercent.refreshFormPercent();
    }

    initLists() {
        this.legalFormList = this.translate.translate(this.newRequestService.legalFormList);
        this.financialRatingList = this.newRequestService.financialRatingList;
        this.publicEstablishmentList = this.translate.translate(this.newRequestService.publicEstablishmentList);
        this.identificationNumberTypeList = this.translate.translate(this.newRequestService.identificationNumberTypeList);
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    isDisabled(path) {
        const control = this.form.get(path);

        return control.disabled;
    }

    getCurrentFormData() {
        this.requests$
            .pipe(
                filter(requests => !isEmpty(requests)),
                map(requests => castArray(requests[0])),
                takeUntil(this.unsubscribe),
            )
            .subscribe((requests) => {
                requests.forEach((request) => {
                    this.identificationService.getCurrentFormGeneralData(request.kycID).then((formData) => {
                        if (formData) {
                            this.form.patchValue(formData);
                            if (this.isFormReadonly) {
                                this.form.disable();
                            }
                        }
                    }).catch((err) => {
                        console.log('Failed on get form data', err);
                    });
                });
            });
    }

    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/identification/general',
            this.form,
            this.newRequestService.context,
            {
                reset : false,
                returnPromise: true,
            },
        ).then(() => {
            this.ngRedux.dispatch(setMyKycRequestedPersist('identification'));
        });
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/identification/general',
            this.newRequestService.createIdentificationFormGroup(),
            this.newRequestService.context,
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.form.valid) {
            formHelper.dirty(this.form);
            formHelper.scrollToFirstError(this.element.nativeElement);
            return;
        }

        this.requests$
        .pipe(take(1))
        .subscribe((requests) => {
            this
            .identificationService
            .sendRequestGeneralInformation(this.form, requests)
            .then(() => {
                this.submitEvent.emit({
                    completed: true,
                });
                this.clearPersistForm();
            })
            .catch(() => {
                this.newRequestService.errorPop();
            })
            ;
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
