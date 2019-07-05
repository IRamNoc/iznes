import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { get as getValue } from 'lodash';
import { RequestsService } from '../../../requests.service';
import { NewRequestService, configDate } from '../../new-request.service';
import { countries } from '../../../requests.config';
import { MultilingualService } from '@setl/multilingual';
import { BeneficiaryService } from './beneficiary.service';

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

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        public translate: MultilingualService,
        private beneficiaryService: BeneficiaryService,
    ) {
        this.configDate = configDate;

        this.beneficiaryTypesList = this.newRequestService.beneficiaryTypesList;
        this.translate.translate(this.beneficiaryTypesList);
        this.relationTypesList = this.newRequestService.relationTypesList;
        this.translate.translate(this.relationTypesList);
        this.holdingTypesList = this.newRequestService.holdingTypesList;
        this.translate.translate(this.holdingTypesList);
        this.identificationNumberTypeList = this.newRequestService.identificationNumberTypeList;
        this.countries = this.translate.translate(countries);
    }

    ngOnInit() {
        this.form.get('legalPerson').disable();
        this.form.get('naturalPerson').disable();

        this.initFormCheck();

        (this.form.get('beneficiaryType') as FormControl).updateValueAndValidity();
        (this.form.get('legalPerson.nationalIdNumberType') as FormControl).updateValueAndValidity();
        this.refresh.emit();
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
            });
    }

    formCheckNationalIdNumberType(value) {
        this.beneficiaryService.formCheckNationalIdNumberType(this.form, value);
        this.refresh.emit();
    }

    formCheckBeneficiaryType(value) {
        this.beneficiaryService.formCheckBeneficiaryType(this.form, value);
    }

    uploadFile($event) {
        if ($event.files.length === 0) return;

        const formControl = this.form.get('common.document');

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

            this.refresh.emit();
        });
    }

    /**
     * get beneficiary document type string:  kyckbbisdoc or kycbeneiddoc
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
}
