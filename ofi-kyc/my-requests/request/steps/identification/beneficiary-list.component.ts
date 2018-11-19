import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { get as getValue, isNil, find, isEmpty, isNumber, values } from 'lodash';

import { ConfirmationService } from '@setl/utils';
import { ToasterService } from 'angular2-toaster';

import { MultilingualService } from '@setl/multilingual';
import { BeneficiaryService } from './beneficiary.service';
import { IdentificationService } from '../identification.service';
import { NewRequestService } from '../../new-request.service';

@Component({
    selector: 'beneficiary-list',
    templateUrl: './beneficiary-list.component.html',
    styleUrls: ['./beneficiary-list.component.scss'],
})
export class BeneficiaryListComponent implements OnInit {
    @Input() stakeholders: FormArray;
    @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

    selectedStakeholderIndex = null;
    stakeholderCounter = 0;
    stakeholderBackup = null;
    isModalOpen: any = false;
    mode: string;

    get openModal() {
        return this.isModalOpen;
    }

    set openModal(value) {
        this.isModalOpen = value;

        if (value === 'naturalClose') {
            this.isModalOpen = false;
        }

        if (!value) {
            this.closeModal(true);
        }
    }

    get selectedStakeholder() {
        if (this.selectedStakeholderIndex === null) {
            return null;
        }

        return this.stakeholders.at(this.selectedStakeholderIndex);
    }

    get parents() {
        return this.beneficiaryService.parents(this.stakeholders);
    }

    get nextId() {
        this.stakeholderCounter += 1;

        return this.stakeholderCounter;
    }

    constructor(
        private identificationService: IdentificationService,
        private newRequestService: NewRequestService,
        private beneficiaryService: BeneficiaryService,
        private translateService: MultilingualService,
        private confirmationService: ConfirmationService,
        private toasterService: ToasterService,
    ) {
    }

    ngOnInit() {

    }

    closeModal(cancel?) {
        const stakeholder = this.stakeholders.at(this.selectedStakeholderIndex);

        if (cancel && this.mode === 'add') {
            this.removeStakeholder(this.selectedStakeholderIndex);
        }

        if (cancel && this.mode === 'edit') {
            stakeholder.patchValue(this.stakeholderBackup);
            this.stakeholderBackup = null;
        }

        if (!cancel && stakeholder.valid) {
            this.confirmClose(this.mode);
        }

        if (!cancel && !stakeholder.valid) {
            this.markFormGroupTouched(stakeholder as FormGroup);
        }

        if (cancel || stakeholder.valid) {
            this.selectedStakeholderIndex = null;
            this.openModal = 'naturalClose';
            this.mode = null;
        }
    }

    confirmClose(mode) {
        let text;

        if (mode === 'edit') {
            text = this.translateService.translate('The stakeholder has been successfully updated!');
        }
        if (mode === 'add') {
            text = this.translateService.translate('The stakeholder has been successfully added!');
        }

        this.toasterService.pop('success', text);
    }

    handleAction(action, index) {
        switch (action) {
            case 'addChild':
                this.addStakeholder(index);
                break;
            case 'edit':
                this.editStakeholder(index);
                break;
            case 'remove':
                this.checkRemove(index);
                break;
        }
    }

    addStakeholder(parentIndex?) {
        this.mode = 'add';
        this.openModal = true;

        const stakeholder = this.newRequestService.createBeneficiary();
        this.stakeholders.push(stakeholder);

        this.selectedStakeholderIndex = this.stakeholders.controls.length - 1;

        stakeholder.get('companyBeneficiariesID').setValue(`temp${this.nextId}`);

        if (this.selectedStakeholderIndex === 0) {
            this.beneficiaryService.setFirstStakeholderHolding(stakeholder);
            this.beneficiaryService.setFirstStakeholderParent(stakeholder);
        }

        if (!isNil(parentIndex)) {
            this.addStakeholderChild(parentIndex, this.selectedStakeholderIndex);
        }

        this.askRefresh();
    }

    addStakeholderChild(parentIndex, childIndex) {
        const childControl = this.stakeholders.at(childIndex);
        const parentControl = this.stakeholders.at(parentIndex);
        const parent = find(this.parents, ['id', parentControl.get('companyBeneficiariesID').value]);

        childControl.get('common.parent').setValue([parent]);
        this.beneficiaryService.setChildStakeholderHolding(childControl);
    }

    editStakeholder(i) {
        this.openModal = true;
        this.mode = 'edit';
        this.selectedStakeholderIndex = i;
        this.stakeholderBackup = this.stakeholders.at(this.selectedStakeholderIndex).value;
    }

    viewStakeholder(i) {
        this.openModal = true;
        this.mode = 'view';
        this.selectedStakeholderIndex = i;
    }

    checkRemove(i) {
        const stakeholder = this.stakeholders.at(i);
        let title = this.translateService.translate('Delete stakeholder');
        const message = this.translateService.translate('Are you sure you want to delete this stakeholder?');
        const name = this.beneficiaryService.getDisplayName(stakeholder);

        title = `${title} - ${name}`;
        this.confirmationService.create(
            title,
            message,
            { confirmText: 'Delete', declineText: 'Cancel', btnClass: 'error' },
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.removeStakeholder(i);

                const confirmation = this.translateService.translate('The stakeholder has been successfully deleted!');
                this.toasterService.pop('success', confirmation);
            }
        });
    }

    removeStakeholder(i) {
        const stakeholders = this.stakeholders;
        const companyBeneficiariesID = stakeholders.at(i).value.companyBeneficiariesID;

        this.removeStakeholderRemote(i);
        stakeholders.removeAt(i);

        const firstStakeholder = stakeholders.at(0);
        if (firstStakeholder && i === 0) {
            this.beneficiaryService.setFirstStakeholderParent(firstStakeholder);
            this.beneficiaryService.setFirstStakeholderHolding(firstStakeholder);
        }
        this.removeParentFromStakeholders(companyBeneficiariesID);

        this.askRefresh();
    }

    removeStakeholderRemote(index) {
        const stakeholderToRemove = this.stakeholders.at(index);
        const companyBeneficiariesID = stakeholderToRemove.value.companyBeneficiariesID;

        if (this.shouldRemoveStakeholder(companyBeneficiariesID)) {
            this.identificationService.deleteBeneficiary(
                stakeholderToRemove.value.kycID,
                stakeholderToRemove.value.companyBeneficiariesID,
            );
        }
    }

    getTitle() {
        const currentStakeholder = this.stakeholders.at(this.selectedStakeholderIndex);

        if (this.mode === 'add') {
            return this.translateService.translate('Add stakeholder');
        }

        let name = this.beneficiaryService.getDisplayName(currentStakeholder);

        if (this.mode === 'edit') {
            name = `${this.translateService.translate('Edit')} - ${name}`;
        }

        return name;
    }

    getIcon() {
        const currentStakeholder = this.stakeholders.at(this.selectedStakeholderIndex);
        const type = currentStakeholder.get('beneficiaryType').value;

        if (type === 'legalPerson') {
            return 'fa-building';
        }
        if (type === 'naturalPerson') {
            return 'fa-user';
        }
    }

    shouldRemoveStakeholder(companyBeneficiariesID) {
        if (isNumber(companyBeneficiariesID)) {
            return true;
        }
    }

    removeParentFromStakeholders(removedParent) {
        this.stakeholders.controls.forEach((stakeholder) => {
            const parent = stakeholder.get('common.parent');

            const parentId = getValue(parent.value, '[0].id');
            if (parentId === removedParent) {
                parent.setValue(null);
            }
        });
    }

    askRefresh() {
        this.refresh.emit();
    }

    markFormGroupTouched(formGroup: FormGroup) {
        values(formGroup.controls).forEach((control) => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }
}
