import { Component, Input, Output, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl, Validators, FormBuilder, FormControl } from '@angular/forms';
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
import { shouldFormSectionPersist } from '../../../kyc-form-helper';

/**
 * Kyc form sub component: Indentification -> General Information
 */
@Component({
    selector: 'general-information',
    templateUrl: './general-information.component.html',
})
export class GeneralInformationComponent implements OnInit, OnDestroy {
    // Get access to the FormPercentDirective component instance
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;

    // Sub form group for the whole kyc: identification -> generalInformation
    @Input() parentForm: FormGroup;

    // current completed step of the kyc form.
    @Input() completedStep: number;
    // whether the form should render in readonly mode.
    @Input() isFormReadonly = false;
    // Output event to let parent component hande the submit event.
    @Output() submitEvent: EventEmitter<{completed: boolean; updateView?: boolean}> = new EventEmitter<any>();
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;

    // Current component formGroup.
    form: FormGroup;
    unsubscribe: Subject<any> = new Subject();

    // countries list that used in dropdown
    countries;
    // legal from list that used in dropdown
    legalFormList;
    // finalcial rating lit that used in dropdown
    financialRatingList;
    // pulbic establishment list that used in dropdown
    publicEstablishmentList;
    // identification number type list that used in dropdown
    identificationNumberTypeList;

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
        public translate: MultilingualService,
        private element: ElementRef,
        private persistRequestService: PersistRequestService,
        private persistService: PersistService,
        private ngRedux: NgRedux<any>,
        private formBuilder: FormBuilder,
    ) {
    }

    ngOnInit() {
        // Construct the formgroup for the current component
        this.form = this.formBuilder.group({
            ...(this.parentForm.get('entity') as FormGroup).controls,
            ...(this.parentForm.get('location') as FormGroup).controls,
        });

        this.countries = this.translate.translate(countries);

        this.initFormCheck();
        this.getCurrentFormData();
        this.initLists();

        this.requestLanguageObj
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(() => this.initLists());
    }

    /**
     * Init Form Persist if the step has not been completed
     * Store this form step to formPersist in database, if the current step 
     */
    initFormPersist() {
        if (shouldFormSectionPersist('generalInformation', this.completedStep, '')) this.persistForm();
    }

    /**
     * Observe specified properties of the form, and change the properties of the current form dynamically.
     */
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

    /**
     * Observe the kyc property 'commercialDomiciliation', change the form dynamically.
     * @param {any} value: value of the property 'commercialDomiciliation'.
     */
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

    /**
     * Observe the kyc property 'otherIdentificationNumberType', change the form dynamically.
     * @param {any} value: value of the property 'otherIdentificationNumberType'.
     */
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

    /**
     * Check if value of the formcontrol 'otherIdentificationNumberText' is valid.
     * @param {string} value: error type to check
     */
    checkIdentificationNumberType(value) {
        return getValue(this.form.get('otherIdentificationNumberText'), ['errors', value], '');
    }

    /**
     * Constuct the lists for dropdowns. with text tranlsated.
     */
    initLists() {
        this.legalFormList = this.translate.translate(this.newRequestService.legalFormList);
        this.financialRatingList = this.newRequestService.financialRatingList;
        this.publicEstablishmentList = this.translate.translate(this.newRequestService.publicEstablishmentList);
        this.identificationNumberTypeList = this.translate.translate(this.newRequestService.identificationNumberTypeList);
    }

    /**
     * Check a form control has certian validation error type
     */
    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    /**
     * Check specific formControl of the formGroup of this component, is disabled or not. In order to hide certian formControl.
     * @param {string} path
     * @return {boolean}
     */
    isDisabled(path): boolean {
        const control = this.form.get(path);

        return control.disabled;
    }

    /**
     * Get kyc Identification -> General Information, from membernode, and update the formGroup.
     * Not sure why loop through the kyc(s)(because it might container multiple kyc), and update the formGroup multiple time.
     */
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
                            this.updateParentForm();
                        }
                        this.initFormPersist();
                    }).catch((err) => {
                        this.initFormPersist();
                    });
                });
            });
    }

    /**
     * Initiate form persist, so the form can be auto fill with the data that wasn't save in the current form.
     */
    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/identification/generalInformation',
            this.form,
            this.newRequestService.context,
            {
                reset : false,
                returnPromise: true,
            },
        ).then(() => {
            this.ngRedux.dispatch(setMyKycRequestedPersist('identification/generalInformation'));
        });
    }

    /**
     * Clear form persist, when this section of the kyc form is submitted.
     */
    async clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/identification/generalInformation',
            await this.newRequestService.createIdentificationFormGroup(),
            this.newRequestService.context,
        );
    }

    /**
     * Loop through all the kyc(s) for the current kyc form. and send request to membernode to update 'General Information'.
     * @param {any} e
     * @return {void}
     */
    handleSubmit(e): void {
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
                this.updateParentForm();
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

    /**
     * Backfill the formGroup in the main kyc formGroup.
     */
    updateParentForm():void {
        const newData = {};
        Object.keys(this.form.controls).forEach((key) => {
            newData[key] = this.form.get(key).value;
        });
        this.parentForm.get('entity').patchValue(newData);
        this.parentForm.get('location').patchValue(newData);
    }

    /**
     * Helper function to check if specific type of validation error is need to be shown.
     * @param {FormControl} control
     * @param {string[]} errors
     * @return {boolean}
     */
    showHelperText(control, errors): boolean {
        return this.form.get(control).invalid && !this.hasError(control, errors);
    }

    /**
     * Used by the FormStep component to check if the current component's formGroup is valid
     * @return {boolean}
     */
    isStepValid(): boolean {
        return this.form.valid;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
