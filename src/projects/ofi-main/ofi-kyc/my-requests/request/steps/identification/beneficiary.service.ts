import { Injectable } from '@angular/core';
import { AbstractControl, Validators, FormControl, FormArray } from '@angular/forms';
import { get as getValue, find, isNumber } from 'lodash';
import { sirenValidator, siretValidator } from '@setl/utils/helper/validators';
import { countries, relationTypesList, holdingTypesList, beneficiaryTypesList, percentTypeList } from '../../../requests.config';
import has = Reflect.has;

@Injectable({
    providedIn: 'root',
})
export class BeneficiaryService {

    constructor() {
    }

    getStakeholderType(stakeholder) {
        const type = stakeholder.get('beneficiaryType').value;
        const typeObject = find(beneficiaryTypesList, ['id', type]);

        if (typeObject) {
            return typeObject.text;
        }
    }

    getDisplayName(stakeholderIn) {
        const stakeholder = stakeholderIn.value;
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

    parents(stakeholdersIn) {
        if (stakeholdersIn === null) return [];

        const stakeholders = stakeholdersIn.controls;

        return stakeholders.map((stakeholder) => {
            const text = this.getDisplayName(stakeholder);

            return {
                id: stakeholder.value.companyBeneficiariesID,
                text,
            };
        });
    }

    /**
     * Fill some of the fields, that deduce other value within stakeholders.
     * @param {any[]} stakeholdes
     */
    fillInStakeholderSelects(stakeholders) {
        if (stakeholders === null) return;

        const parents = this.parents(stakeholders);

        stakeholders.controls.forEach((stakeholder) => {
            const nationalityControl = stakeholder.get('common.nationality');
            const countryTaxResidenceControl = stakeholder.get('common.countryTaxResidence');
            const parentControl = stakeholder.get('common.parent');
            const relationTypeControl = stakeholder.get('common.relationType');
            const holdingTypeControl = stakeholder.get('common.holdingType');
            const holdingPercentageControl = stakeholder.get('common.holdingPercentage');
            const votingPercentageControl = stakeholder.get('common.votingPercentage');

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

            const relationTypeValue = relationTypeControl.value;
            const relationTypeId = getValue(relationTypeValue, '[0].id');
            const relationType = find(relationTypesList, ['id', relationTypeId]);

            if (relationType) {
                relationTypeControl.patchValue([relationType]);
            }

            const holdingTypeValue = holdingTypeControl.value;
            const holdingTypeId = getValue(holdingTypeValue, '[0].id');
            const holdingType = find(holdingTypesList, ['id', holdingTypeId]);

            if (holdingType) {
                holdingTypeControl.patchValue([holdingType]);
            }
            const holdingPercentageValue = holdingPercentageControl.value;
            const holdingPercentageId = getValue(holdingPercentageValue, '[0].id');
            const holdingPercentage = find(percentTypeList, ['id', holdingPercentageId]);
            if (holdingPercentage) {
                holdingPercentageControl.patchValue([holdingPercentage]);
            }
            const votingPercentageValue = votingPercentageControl.value;
            const votingPercentageId = getValue(votingPercentageValue, '[0].id');
            const votingPercentage = find(percentTypeList, ['id', votingPercentageId]);
            if (votingPercentage) {
                votingPercentageControl.patchValue([votingPercentage]);
            }
        });
    }

    /**
     * Update stakeholder formgroup dynamically, depending on the nationalID number type.
     * @param {FormGroup} form: stakeholder group
     * @param {any} value: value of nationalID number type value
     */
    formCheckNationalIdNumberType(form, value) {
        const otherNationalIdNumberTypeTextControl: AbstractControl = form.get('legalPerson.otherNationalIdNumberType');
        const nationalIdNumberTextControl: AbstractControl = form.get('legalPerson.nationalIdNumberText');

        if (value) {
            nationalIdNumberTextControl.enable();

            if (value === 'siren') {
                nationalIdNumberTextControl.setValidators([sirenValidator, Validators.required]);
                otherNationalIdNumberTypeTextControl.disable();
            } else if (value === 'siret') {
                nationalIdNumberTextControl.setValidators([siretValidator, Validators.required]);
                otherNationalIdNumberTypeTextControl.disable();
            } else {
                otherNationalIdNumberTypeTextControl.enable();
                otherNationalIdNumberTypeTextControl.setValidators([Validators.required]);
                nationalIdNumberTextControl.setValidators([Validators.required]);
            }
        } else {
            otherNationalIdNumberTypeTextControl.disable();
            nationalIdNumberTextControl.disable();
        }

        nationalIdNumberTextControl.updateValueAndValidity();
    }

    /**
     * Update stakeholder formgroup dynamically, depending on the beneficiary type.
     * @param {FormGroup} form: stakeholder group
     * @param {any} value: value of beneficiary type value
     */
    formCheckBeneficiaryType(form, value) {
        const legalPersonControl: AbstractControl = form.get('legalPerson');
        const naturalPersonControl: AbstractControl = form.get('naturalPerson');

        if (value === 'legalPerson') {
            legalPersonControl.enable();
            naturalPersonControl.disable();
            (form.get('legalPerson.nationalIdNumberType') as FormControl).updateValueAndValidity();
        } else if (value === 'naturalPerson') {
            naturalPersonControl.enable();
            legalPersonControl.disable({ emitEvent: false });
        }
    }

    /**
     * Update stakeholder form validity, that depending on some field within the stakeholder field.
     * @param {FormArray} form
     */
    updateStakeholdersValidity(form: FormArray) {
        if (form === null) return;

        form.controls.forEach((stakeholder) => {
            const beneficiaryType = stakeholder.get('beneficiaryType').value;
            this.formCheckBeneficiaryType(stakeholder, beneficiaryType);

            const nationalIdNumber = stakeholder.get('legalPerson.nationalIdNumberType').value;
            this.formCheckNationalIdNumberType(stakeholder, nationalIdNumber);
        });
    }
}

/**
 * Show beneficiary list in a way, that the beneficiaries has the same parent to be shown together 
 */
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
