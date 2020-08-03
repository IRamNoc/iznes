import {Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostBinding, ChangeDetectorRef} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap, map } from 'rxjs/operators';
import { get as getValue } from 'lodash';
import { RequestsService } from '../../../requests.service';
import { NewRequestService, configDate } from '../../new-request.service';
import { countries } from '../../../requests.config';
import { MultilingualService } from '@setl/multilingual';
import { BeneficiaryService } from './beneficiary.service';
import { KycFormHelperService } from '../../../kyc-form-helper.service';

@Component({
    selector: '[beneficiary]',
    templateUrl: './beneficiary.component.html',
    styleUrls: ['./beneficiary.component.scss'],
})
export class BeneficiaryComponent implements OnInit, OnDestroy {
    @HostBinding('class.open') get open() {
        return !this.form.get('legalPerson').disabled || !this.form.get('naturalPerson').disabled;
    }
    @Input() form;
    @Input() registeredCompanyName: string;
    @Input() set parents(parents: any[]) {
        this.parentsFiltered = parents.filter((parent, i) => i !== this.index);
        this.parentsFiltered.unshift({
            id: -1,
            text: this.registeredCompanyName,
        });
    }
    @Input() globalHasPEP: boolean;

    get parents() {
        return this.parentsFiltered;
    }
    @Input() index;
    @Input() disabled;

    @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

    unsubscribe: Subject<any> = new Subject<any>();
    configDate;
    beneficiaryTypesList;
    relationTypesList;
    holdingTypesList;
    identificationNumberTypeList;
    countries;
    parentsFiltered;
    holdingTypeText;
    /** Allowed file types passed to FileDrop */
    public allowedFileTypes: string[] = ['application/pdf'];
    /** Whether KBIS or ID field is required */
    public kbisOrIdIsRequired: boolean;

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        public translate: MultilingualService,
        private beneficiaryService: BeneficiaryService,
        private kycHelper: KycFormHelperService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        this.configDate = configDate;

        this.beneficiaryTypesList = this.translate.translate(this.newRequestService.beneficiaryTypesList);
        this.relationTypesList = this.translate.translate(this.newRequestService.relationTypesList);
        this.holdingTypesList = this.translate.translate(this.newRequestService.holdingTypesList);
        this.identificationNumberTypeList = this.translate.translate(this.newRequestService.identificationNumberTypeList);
        this.countries = this.translate.translate(countries);
    }

    ngOnInit() {
        this.form.get('legalPerson').disable();
        this.form.get('naturalPerson').disable();

        this.initFormCheck();

        (this.form.get('beneficiaryType') as FormControl).updateValueAndValidity();
        (this.form.get('legalPerson.nationalIdNumberType') as FormControl).updateValueAndValidity();
        this.refresh.emit();

        this.setHoldingTypeText();

        this.handleKbisandIDValidation();

    }

    initFormCheck() {
        this.form
            .get('beneficiaryType')
            .valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((beneficiaryTypeValue) => {
                this.formCheckBeneficiaryType(beneficiaryTypeValue);
            });

        this.form
            .get('legalPerson.nationalIdNumberType')
            .valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                const nationalIdNumberTypeValue = getValue(data, [0, 'id']);

                this.formCheckNationalIdNumberType(nationalIdNumberTypeValue);
            });

        this.form.get('common.parent')
            .valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((parent) => {
                const id = getValue(parent, [0, 'id']);
                const stakeholder = this.form;

                if (String(id) === '-1') { // -1/Parent/'Linked Entity' is the registered company
                    this.beneficiaryService.setStakeholderDirectHolding(stakeholder);
                } else {
                    this.beneficiaryService.setStakeholderIndirectHolding(stakeholder);
                }

                (this.form.get('common.holdingType') as FormControl).updateValueAndValidity();

                this.setHoldingTypeText();
            });

        // Set KBIS or ID to required if is Politically Exposed
        this.form.get('naturalPerson.isPoliticallyExposed')
            .valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => this.handleKbisandIDValidation());

        // // handle beneficiary document deletion
        this.form.get('common').get('document').get('hash').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((data) => {
                if (data == null || data.length == 0) {
                    const formControl = this.form.get('common.document.kycDocumentID');

                    formControl.setValue(null);
                    formControl.updateValueAndValidity();

                    this.refresh.emit();
                }
            });
    }

    setHoldingTypeText() {
        const controlValue = this.form.get('common.holdingType').value;
        if (controlValue && controlValue[0]) {
            // get text if missing.
            if (! controlValue[0].text) {
                const foundText = this.holdingTypesList.find(t => t.id === controlValue[0].id);
                controlValue[0].text = foundText.text || '';
            }

            this.holdingTypeText = this.translate.translate(controlValue[0].text);
        }
    }

    formCheckNationalIdNumberType(value) {
        this.beneficiaryService.formCheckNationalIdNumberType(this.form, value);
        this.refresh.emit();
    }

    formCheckBeneficiaryType(value) {
        this.beneficiaryService.formCheckBeneficiaryType(this.form, value);
    }

    uploadFile($event) {
        const formControl = this.form.get('common.document');

        if ($event.files.length === 0) {
            formControl.reset();
            formControl.markAsTouched();
            return;
        }

        this.requestsService.uploadFile($event).then((file: any) => {
            const newFormGroup = {
                common: formControl.get('common').value,
                hash: file.fileHash,
                isDefault: formControl.get('isDefault').value,
                kycDocumentID: '',
                name: file.fileTitle,
                type: this.getDocumentTypeStr(),
            };

            formControl.setValue(newFormGroup);
            formControl.updateValueAndValidity();

            this.refresh.emit();
        });
    }

    /**
     * Toggle Required Validator on KBIS document field
     * 'If any client is regulated, listed or state-owned then the KBIS or ID in each stakeholder should be optional'
     * 'If the field “Is the stakeholder a political exposed person?” is Yes KBIS or ID in each stakeholder should be required – overwriting the above rule'
     *
     * @returns {void}
     */
    public handleKbisandIDValidation(): void {
        let required: boolean = false;

        const highRisk = this.kycHelper.isHighRiskActivity() || this.kycHelper.isHighRiskCountry();
        if (highRisk) {
            required = true;
            // this.form.get('common.document').markAsTouched();
        }

        const beneficiaryType = this.form.get('beneficiaryType').value;
        const isNaturalPerson = beneficiaryType === 'naturalPerson';
        const isPoliticallyExposed = !!this.form.get('naturalPerson.isPoliticallyExposed').value;
        if ((isPoliticallyExposed && isNaturalPerson) || this.globalHasPEP) {
            required = true;
            // this.form.get('common.document').markAsTouched();
        }

        if (this.kycHelper.isStateOwnedAnyPercentCapital() || this.kycHelper.isCompanyRegulated() || this.kycHelper.isCompanyListed()) {
            required = false;
        }

        this.toggleKbisAndIdRequired(required);
    }

    /**
     * Toggle the KBIS and ID control required validator
     *
     * @param {boolean} required
     * @returns {void}
     */
    private toggleKbisAndIdRequired(required: boolean): void {
        this.kbisOrIdIsRequired = required;
        const control = this.form.get('common.document.hash');

        if (required) {
            control.setValidators([Validators.required]);
        } else {
            control.clearValidators();
        }

        this.form.get('common.document.hash').updateValueAndValidity();
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Get beneficiary document type
     * @returns {string} kyckbbisdoc or kycbeneiddoc
     */
    getDocumentTypeStr() {
        const beneficiaryType = this.form.get('beneficiaryType').value;
        if (beneficiaryType == 'legalPerson') {
            return 'kyckbbisdoc';
        }
        return 'kycbeneiddoc';
    }

    isDisabled(path) {
        const control = this.form.get(path);

        return control.disabled;
    }

    /**
     * Check whether the first stakeholder has been saved
     * @returns {boolean}
     */
    isFirstStakeholder() {
        return this.parentsFiltered[1].id === 'temp1';
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    showHelperText(control, errors) {
        return this.form.get(control).invalid && !this.hasError(control, errors);
    }

    checkNationalIdNumberType(value) {
        return getValue(this.form.get(['legalPerson', 'nationalIdNumberText']), ['errors', value], '');
    }

    stopTabbing(e) {
        if (e.keyCode === 9) e.preventDefault();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    getDocumentPreset(formItem: string[]) {
        const value = this.form.get(formItem).value;

        return !value.hash ? undefined : value;
    }
}
