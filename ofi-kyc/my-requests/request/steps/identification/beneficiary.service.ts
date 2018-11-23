import { Injectable } from '@angular/core';
import { AbstractControl, Validators, FormControl, FormArray } from '@angular/forms';

import { get as getValue, find, isNumber } from 'lodash';

import { MultilingualService } from '@setl/multilingual';
import { sirenValidator, siretValidator } from '@setl/utils/helper/validators';
import { countries, holdingTypesList, beneficiaryTypesList } from '../../../requests.config';
import has = Reflect.has;

@Injectable({
    providedIn: 'root',
})
export class BeneficiaryService {

    constructor(
        private translate: MultilingualService,
    ) {}

    getStakeholderType(stakeholder) {
        const type = stakeholder.get('beneficiaryType').value;
        const typeObject = find(beneficiaryTypesList, ['id', type]);

        if (typeObject) {
            return typeObject.text;
        }
    }

    getDisplayName(stakeholder) {
        stakeholder = stakeholder.value;
        const type = stakeholder.beneficiaryType;

        if (type === 'legalPerson') {
            return getValue(stakeholder, 'legalPerson.legalName');
        }

        if (type === 'naturalPerson') {
            const firstName = getValue(stakeholder, 'naturalPerson.firstName', '');
            const lastName = getValue(stakeholder, 'naturalPerson.lastName', '');

            return `${firstName} ${lastName}`;
        }
    }

    setFirstStakeholderParent(stakeholder: AbstractControl) {
        stakeholder.get('common.parent').setValue(-1);
    }

    setStakeholderDirectHolding(stakeholder: AbstractControl) {
        const directHolding = find(holdingTypesList, ['id', 'directHolding']);

        stakeholder.get('common.holdingType').setValue([directHolding]);
    }

    setStakeholderIndirectHolding(stakeholder: AbstractControl) {
        const indirectHolding = find(holdingTypesList, ['id', 'indirectHolding']);

        stakeholder.get('common.holdingType').setValue([indirectHolding]);
    }

    isLocalBeneficiaryId(id) {
        if (typeof id !== 'string') {
            id = getValue(id, 'value[0].id', '');
        }

        if (isNumber(id)) {
            return false;
        }

        return id.indexOf('temp') !== -1;
    }

    parents(stakeholders) {
        stakeholders = stakeholders.controls;

        return stakeholders.map((stakeholder) => {
            const text = this.getDisplayName(stakeholder);

            return {
                id: stakeholder.value.companyBeneficiariesID,
                text,
            };
        });
    }

    fillInStakeholderSelects(stakeholders) {
        const parents = this.parents(stakeholders);

        stakeholders.controls.forEach((stakeholder) => {
            const nationalityControl = stakeholder.get('common.nationality');
            const countryTaxResidenceControl = stakeholder.get('common.countryTaxResidence');
            const parentControl = stakeholder.get('common.parent');
            const holdingTypeControl = stakeholder.get('common.holdingType');

            const nationalityValue = nationalityControl.value;
            const nationalityId = getValue(nationalityValue, '[0].id');
            const nationality = find(countries, ['id', nationalityId]);

            if (nationality) {
                nationalityControl.patchValue([nationality]);
            }

            const countryTaxResidenceValue = countryTaxResidenceControl.value;
            const countryTaxResidenceId = getValue(countryTaxResidenceValue, '[0].id');
            const countryTaxResidence = find(countries, ['id', countryTaxResidenceId]);

            if (countryTaxResidence) {
                countryTaxResidenceControl.patchValue([countryTaxResidence]);
            }

            const parentValue = parentControl.value;
            const parentId = getValue(parentValue, '[0].id');
            const parent = find(parents, ['id', parentId]);

            if (parent) {
                parentControl.patchValue([parent]);
            }

            const holdingTypeValue = holdingTypeControl.value;
            const holdingTypeId = getValue(holdingTypeValue, '[0].id');
            const holdingType = find(holdingTypesList, ['id', holdingTypeId]);

            if (holdingType) {
                holdingTypeControl.patchValue([holdingType]);
            }

        });
    }

    formCheckNationalIdNumber(form, value) {
        const nationalIdNumberTextControl: AbstractControl = form.get('legalPerson.nationalIdNumberText');

        if (value) {
            nationalIdNumberTextControl.enable();

            if (value === 'siren') {
                nationalIdNumberTextControl.setValidators([sirenValidator, Validators.required]);
            } else if (value === 'siret') {
                nationalIdNumberTextControl.setValidators([siretValidator, Validators.required]);
            } else {
                nationalIdNumberTextControl.setValidators([Validators.required]);
            }
        } else {
            nationalIdNumberTextControl.disable();
        }

        nationalIdNumberTextControl.updateValueAndValidity();
    }

    formCheckBeneficiaryType(form, value) {
        const legalPersonControl: AbstractControl = form.get('legalPerson');
        const naturalPersonControl: AbstractControl = form.get('naturalPerson');

        if (value === 'legalPerson') {
            legalPersonControl.enable();
            naturalPersonControl.disable();
            (form.get('legalPerson.nationalIdNumber') as FormControl).updateValueAndValidity();
        } else if (value === 'naturalPerson') {
            naturalPersonControl.enable();
            legalPersonControl.disable({ emitEvent: false });
        }
    }

    updateStakeholdersValidity(form: FormArray) {
        form.controls.forEach((stakeholder) => {
            const beneficiaryType = stakeholder.get('beneficiaryType').value;
            this.formCheckBeneficiaryType(stakeholder, beneficiaryType);

            const nationalIdNumber = stakeholder.get('legalPerson.nationalIdNumber').value;
            this.formCheckNationalIdNumber(stakeholder, nationalIdNumber);
        });
    }
}

@Injectable({
    providedIn: 'root',
})
export class HierarchySort {

    private hashObject = {};
    private noParent = -1;

    private hierarchySort(hashObject, key, result) {
        if (!hashObject[key]) {
            return;
        }

        const arr = hashObject[key];

        arr.forEach((single) => {
            result.push(single);
            this.hierarchySort(hashObject, single.get('companyBeneficiariesID').value, result);
        });

        return result;
    }

    sort(controls) {
        this.hashObject = {};

        controls.forEach((control) => {
            const parent = getValue(control.get('common.parent').value, [0, 'id'], this.noParent);
            if (!this.hashObject[parent]) {
                this.hashObject[parent] = [];
            }
            this.hashObject[parent].push(control);
        });

        const result = this.hierarchySort(this.hashObject, this.noParent, []);
        return result;
    }

}
