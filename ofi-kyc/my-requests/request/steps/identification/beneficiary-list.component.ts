import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { get as getValue, isNil, find, isEmpty, isNumber, values, some, filter } from 'lodash';

import { ConfirmationService } from '@setl/utils';
import { ToasterService } from 'angular2-toaster';
import { AlertsService } from '@setl/jaspero-ng2-alerts';

import { MultilingualService } from '@setl/multilingual';
import { BeneficiaryService, HierarchySort } from './beneficiary.service';
import { IdentificationService } from '../identification.service';
import { NewRequestService } from '../../new-request.service';
import get = Reflect.get;

@Component({
    selector: 'beneficiary-list',
    templateUrl: './beneficiary-list.component.html',
    styleUrls: ['./beneficiary-list.component.scss'],
})
export class BeneficiaryListComponent implements OnInit, OnDestroy {
    @Input() stakeholders: FormArray;

    @Output() refresh: EventEmitter<any> = new EventEmitter<any>();
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'stakeholderRelations']) stakeholderRelations$;

    selectedStakeholderIndex = null;
    sortedStakeholders = [];
    stakeholderBackup = null;
    isModalOpen: any = false;
    mode: string;
    unsubscribe: Subject<void> = new Subject();
    relations;
    parents;

    get nextId() {
        return this.getHighestID() + 1;
    }

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

    get listStakeholders() {
        if (!this.sortedStakeholders.length) {
            this.sortStakeholders();
        }

        return this.sortedStakeholders;
    }

    constructor(
        private identificationService: IdentificationService,
        private newRequestService: NewRequestService,
        private beneficiaryService: BeneficiaryService,
        private translateService: MultilingualService,
        private confirmationService: ConfirmationService,
        private toasterService: ToasterService,
        private alertsService: AlertsService,
        private hierarchySort: HierarchySort,
    ) {
    }

    ngOnInit() {
        this.initSubscriptions();
    }

    updateParents() {
        this.parents = this.beneficiaryService.parents(this.stakeholders);
    }

    sortStakeholders() {
        const hasValue = getValue(this.stakeholders.get('0.companyBeneficiariesID'), 'value');

        if (!hasValue) {
            return;
        }
        this.sortedStakeholders = this.hierarchySort.sort(this.stakeholders.controls);
        this.updateParents();
    }

    getHighestID() {
        const stakeholders = this.stakeholders;
        const highest = stakeholders.controls.reduce(
            (highest, stakeholder) => {
                let currentID = stakeholder.get('companyBeneficiariesID').value;
                currentID = currentID.replace('temp', '');
                currentID = Number(currentID);

                return Math.max(highest, currentID);
            },
            0,
        );

        return highest;
    }

    initSubscriptions() {

        this.stakeholderRelations$.pipe(
            takeUntil(this.unsubscribe),
        ).subscribe((relations) => {
            this.relations = relations;
        });
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
            this.sortStakeholders();
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
        const realIndex = this.getRealIndex(index);

        switch (action) {
            case 'addChild':
                this.addStakeholder(realIndex);
                break;
            case 'edit':
                this.editStakeholder(realIndex);
                break;
            case 'remove':
                this.checkRemove(realIndex);
                break;
        }
    }

    getParent(index) {
        const realIndex = this.getRealIndex(index);
        const stakeholder = this.stakeholders.at(realIndex);

        if (stakeholder) {
            const parent = stakeholder.get('common.parent').value;
            const parentID = getValue(parent, [0, 'id']);

            if (parentID && parentID !== -1) {
                return find(this.parents, ['id', parentID]);
            }
        }
    }

    getRealIndex(index) {
        const stakeholderInList = this.sortedStakeholders[index];

        return this.stakeholders.controls.indexOf(stakeholderInList);
    }

    addStakeholder(parentIndex?) {
        this.mode = 'add';
        this.openModal = true;

        const stakeholder = this.newRequestService.createBeneficiary();
        this.stakeholders.push(stakeholder);

        this.selectedStakeholderIndex = this.stakeholders.controls.length - 1;

        stakeholder.get('companyBeneficiariesID').setValue(`temp${this.nextId}`);

        if (this.selectedStakeholderIndex === 0) {
            this.beneficiaryService.setStakeholderDirectHolding(stakeholder);
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
        this.beneficiaryService.setStakeholderIndirectHolding(childControl);
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
        const currentID = this.stakeholders.at(i).get('companyBeneficiariesID').value;
        const existsAsParent = some(this.stakeholders.controls, (stakeholder) => {
            const parent = getValue(stakeholder.get('common.parent').value, [0, 'id']);
            return parent === currentID;
        });

        if (existsAsParent) {
            this.modalCantRemove();
            return;
        }

        this.modalRemove(i);
    }

    modalCantRemove() {
        const message = this.translateService.translate('Please delete all children of this stakeholder.');

        this.alertsService.create('error', message);
    }

    modalRemove(i) {
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
            this.beneficiaryService.setStakeholderDirectHolding(firstStakeholder);
        }
        this.removeParentFromStakeholders(companyBeneficiariesID);

        this.sortStakeholders();
        this.askRefresh();
    }

    removeStakeholderRemote(index) {
        const stakeholderToRemove = this.stakeholders.at(index);
        const companyBeneficiariesID = stakeholderToRemove.value.companyBeneficiariesID;

        if (this.shouldRemoveStakeholder(companyBeneficiariesID)) {
            this.getAllStakeholdersToRemove(stakeholderToRemove);
        }
    }

    getAllStakeholdersToRemove(stakeholderToRemove) {
        const kycID = stakeholderToRemove.value.kycID;
        const companyBeneficiariesID = stakeholderToRemove.value.companyBeneficiariesID;
        const relation = find(this.relations, ['kycID', kycID]);
        const position = relation.stakeholderIDs.indexOf(companyBeneficiariesID);

        if (position !== -1) {
            this.relations.forEach((relation) => {
                const kycID = relation.kycID;
                const companyBeneficiariesID = relation.stakeholderIDs[position];

                this.deleteBeneficiary(kycID, companyBeneficiariesID);
            });
        }
    }

    deleteBeneficiary(kycID, companyBeneficiariesID) {
        this.identificationService.deleteBeneficiary(kycID, companyBeneficiariesID);
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

    hasError(type) {
        if (this.openModal || !this.stakeholders.dirty) {
            return;
        }

        if (type === 'length') {
            return !this.stakeholders.length;
        }

        return this.stakeholders.length && this.stakeholders.invalid;
    }

    ngOnDestroy(){
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
