import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { filter as rxFilter, map, takeUntil, take } from 'rxjs/operators';
import { get as getValue, isNil, find, isEmpty, isNumber, values, some, filter, set as setValue } from 'lodash';
import { ConfirmationService } from '@setl/utils';
import { ToasterService } from 'angular2-toaster';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { MultilingualService } from '@setl/multilingual';
import { BeneficiaryService, HierarchySort } from './beneficiary.service';
import { IdentificationService, buildBeneficiaryObject } from '../identification.service';
import { NewRequestService } from '../../new-request.service';
import get = Reflect.get;
import { DocumentsService } from '../documents.service';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { setMyKycStakeholderRelations } from '@ofi/ofi-main/ofi-store/ofi-kyc/kyc-request';
import { formHelper } from '@setl/utils/helper';
import { PersistRequestService } from '@setl/core-req-services';
import { PersistService } from '@setl/core-persist';
import { setMyKycRequestedPersist } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { steps } from '../../../requests.config';

@Component({
    selector: 'beneficiary-list',
    templateUrl: './beneficiary-list.component.html',
    styleUrls: ['./beneficiary-list.component.scss'],
})
export class BeneficiaryListComponent implements OnInit, OnDestroy {
    @Input() form: FormArray;
    @Input() isFormReadonly = false;
    @Input() completedStep: string;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'stakeholderRelations']) stakeholderRelations$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;

    registeredCompanyName: string;
    selectedStakeholderIndex = null;
    sortedStakeholders = [];
    stakeholderBackup = null;
    isModalOpen: any = false;
    mode: string;
    unsubscribe: Subject<void> = new Subject();
    relations;
    parents;
    connectedWallet;

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

        return this.form.at(this.selectedStakeholderIndex);
    }

    get listStakeholders() {
        if (this.sortedStakeholders) {
            if (!this.sortedStakeholders.length && this.form.length) {
                this.sortStakeholders();
            }
            return this.sortedStakeholders;
        }
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
        private documentsService: DocumentsService,
        private ngRedux: NgRedux<any>,
        private element: ElementRef,
        private persistRequestService: PersistRequestService,
        private persistService: PersistService,
    ) {
    }

    ngOnInit() {
        this.initSubscriptions();
        this.getFormData();
    }

    getFormData() {
        const requests$ = this.requests$
        .pipe(
            rxFilter(requests => !isEmpty(requests)),
        );

        requests$.pipe(
                takeUntil(this.unsubscribe),
            ).subscribe((requests) => {
                const promises = [];
                const stakeholdersRelationTable = [];

                requests.forEach((request, index) => {

                    const promise = this.identificationService.getCurrentFormCompanyBeneficiariesData(request.kycID).then((formData) => {
                        if (!isEmpty(formData)) {
                            const relation = {
                                kycID: request.kycID,
                                stakeholderIDs: formData.map(stakeholder => stakeholder.companyBeneficiariesID),
                            };

                            stakeholdersRelationTable.push(relation);

                            if (index === 0) {
                                const beneficiaries: FormArray = this.form as FormArray;

                                while (beneficiaries.length) {
                                    beneficiaries.removeAt(0);
                                }

                                const promises = formData.map((controlValue) => {
                                    const control = this.newRequestService.createBeneficiary();
                                    const documentID = controlValue.documentID;

                                    const newControlValue = buildBeneficiaryObject(controlValue);

                                    // depend on beneficiaryType, disable part of the form.
                                    if (newControlValue['beneficiaryType'] === 'legalPerson') {
                                        control.get('naturalPerson').disable();
                                    } else {
                                        control.get('legalPerson').disable();
                                    }

                                    if (documentID) {
                                        return this.documentsService.getDocument(documentID).then((document) => {
                                            if (document) {
                                                setValue(newControlValue, ['common', 'document'], {
                                                    name: document.name,
                                                    hash: document.hash,
                                                    kycDocumentID: document.kycDocumentID,
                                                });
                                            }
                                            control.patchValue(newControlValue);
                                            beneficiaries.push(control);
                                        });
                                    }

                                    control.patchValue(newControlValue);
                                    beneficiaries.push(control);
                                });

                                Promise.all(promises).then(() => {
                                    this.beneficiaryService.fillInStakeholderSelects(this.form.get('beneficiaries'));
                                    this.beneficiaryService.updateStakeholdersValidity(this.form.get('beneficiaries') as FormArray);
                                    if (this.formPercent) this.formPercent.refreshFormPercent();
                                });
                            }
                        }
                    });

                    promises.push(promise);
                });

                Promise.all(promises).then(() => {
                    this.ngRedux.dispatch(setMyKycStakeholderRelations(stakeholdersRelationTable));
                    this.initFormPersist();
                }).catch(() => {
                    this.initFormPersist();
                });
            });

        requests$.pipe(
            map(requests => requests[0]),
            rxFilter(request => !!request),
            takeUntil(this.unsubscribe),
        )
            .subscribe((request) => {
                this.identificationService.getCurrentFormGeneralData(request.kycID).then((formData) => {
                    if (formData) {
                        this.registeredCompanyName = formData.registeredCompanyName;
                    }
                });
            });
    }

    updateParents() {
        this.parents = this.beneficiaryService.parents(this.form);
    }

    sortStakeholders() {
        if (!this.form.length) {
            this.sortedStakeholders = [];
            return;
        }
        this.sortedStakeholders = this.hierarchySort.sort(this.form.controls);
        this.updateParents();
    }

    getHighestID() {
        const stakeholders = this.form;
        const highest = stakeholders.controls.reduce(
            (highest, stakeholder) => {
                let currentID = stakeholder.get('companyBeneficiariesID').value;

                if (typeof currentID === 'string') {
                    currentID = currentID.replace('temp', '');
                    currentID = Number(currentID);
                }

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

        this.connectedWallet$
            .pipe(
                takeUntil(this.unsubscribe),
            )
            .subscribe((connectedWallet) => {
                this.connectedWallet = connectedWallet;
            });

        this.requests$
        .pipe(
            takeUntil(this.unsubscribe),
            map(kycs => kycs[0]),
            rxFilter((kyc: any) => {
                return kyc && kyc.amcID;
            }),
        )
        .subscribe((kyc) => {
            if (this.shouldPersist(kyc)) {
                this.prePersistForm();
            }
        });
    }

    shouldPersist(kyc) {
        if (kyc.context === 'done') {
            return false;
        }
        return !kyc.completedStep || (steps[kyc.completedStep] < steps.stakeholders);
    }

    closeModal(cancel?) {
        const stakeholder = this.form.at(this.selectedStakeholderIndex);

        if (cancel && this.mode === 'add') {
            this.removeStakeholder(this.selectedStakeholderIndex);
        }

        if (cancel && this.mode === 'edit') {
            stakeholder.patchValue(this.stakeholderBackup);
            this.stakeholderBackup = null;
        }

        if (!cancel && this.isValidUpdate(stakeholder)) {
            this.confirmClose(this.mode);
            this.sortStakeholders();
        }

        if (!cancel && !this.isValidUpdate(stakeholder)) {
            this.markFormGroupTouched(stakeholder as FormGroup);
        }

        if (cancel || this.isValidUpdate(stakeholder)) {
            this.selectedStakeholderIndex = null;
            this.openModal = 'naturalClose';
            this.mode = null;
        }
    }

    private isValidUpdate(stakeholder): boolean {
        const type = stakeholder.get('beneficiaryType').value;
        if(this.isLegalPerson(type)) {
            return this.isLegalPersonValid(stakeholder);
        } else if(this.isNaturalPerson(type)) {
            return this.isNaturalPersonValid(stakeholder);
        }
    }

    private isLegalPersonValid(stakeholder): boolean {
        return stakeholder.controls.legalPerson.valid &&
            stakeholder.controls.common.valid;
    }

    private isNaturalPersonValid(stakeholder): boolean {
        return stakeholder.controls.naturalPerson.valid &&
            stakeholder.controls.common.valid;
    }

    canDoUpdate(): boolean {
        const stakeholder = this.form.at(this.selectedStakeholderIndex);

        return this.isValidUpdate(stakeholder);
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
        if (this.isFormReadonly) {
            return;
        }

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
        const stakeholder = this.form.at(realIndex);

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

        return this.form.controls.indexOf(stakeholderInList);
    }

    addStakeholder(parentIndex?) {
        this.mode = 'add';
        this.openModal = true;

        const stakeholder = this.newRequestService.createBeneficiary();
        this.form.push(stakeholder);

        this.selectedStakeholderIndex = this.form.controls.length - 1;

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
        const childControl = this.form.at(childIndex);
        const parentControl = this.form.at(parentIndex);
        const parent = find(this.parents, ['id', parentControl.get('companyBeneficiariesID').value]);

        childControl.get('common.parent').setValue([parent]);
        this.beneficiaryService.setStakeholderIndirectHolding(childControl);
    }

    editStakeholder(i) {
        this.openModal = true;
        this.mode = 'edit';
        this.selectedStakeholderIndex = i < 0 ? 0 : i;
        this.stakeholderBackup = this.form.at(this.selectedStakeholderIndex).value;
    }

    viewStakeholder(i) {
        this.openModal = true;
        this.mode = 'view';
        this.selectedStakeholderIndex = i;
    }

    checkRemove(i) {
        const currentID = this.form.at(i).get('companyBeneficiariesID').value;
        const existsAsParent = some(this.form.controls, (stakeholder) => {
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
        const stakeholder = this.form.at(i);
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
        const stakeholders = this.form;
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
        const stakeholderToRemove = this.form.at(index);
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
        const currentStakeholder = this.form.at(this.selectedStakeholderIndex);

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
        const currentStakeholder = this.form.at(this.selectedStakeholderIndex);
        const type = currentStakeholder.get('beneficiaryType').value;

        if (this.isLegalPerson(type)) {
            return 'fa-building';
        } else if (this.isNaturalPerson(type)) {
            return 'fa-user';
        } else {
            return 'fa-users';
        }
    }

    shouldRemoveStakeholder(companyBeneficiariesID) {
        if (isNumber(companyBeneficiariesID)) {
            return true;
        }
    }

    removeParentFromStakeholders(removedParent) {
        this.form.controls.forEach((stakeholder) => {
            const parent = stakeholder.get('common.parent');

            const parentId = getValue(parent.value, '[0].id');
            if (parentId === removedParent) {
                parent.setValue(null);
            }
        });
    }

    askRefresh() {
        this.submitEvent.emit({ updateView: true });
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
        if (this.openModal || !this.form.dirty) {
            return;
        }

        if (type === 'length') {
            return !this.form.length;
        }

        return this.form.length && this.form.invalid;
    }

    private isLegalPerson(type: string): boolean {
        return type === 'legalPerson';
    }

    private isNaturalPerson(type: string): boolean {
        return type === 'naturalPerson';
    }

    /**
     * Init Form Persist if the step has not been completed
     */
    initFormPersist() {
        if (!this.completedStep || (steps[this.completedStep] < steps.stakeholders)) this.prePersistForm();
    }

    prePersistForm() {
        this.persistRequestService
        .loadFormState('newkycrequest/identification/beneficiaryInformation', this.newRequestService.context)
        .then((responseData) => {
            const data = getValue(responseData, [1, 'Data', 0, 'data']);

            if (!data) {
                throw 'No data';
            }

            try {
                const parsed = JSON.parse(data);
                this.prepareArrayControls(parsed);
                this.persistForm();
            } catch (e) {
                throw 'Error';
            }

        })
        .catch((e) => {
            this.persistForm();
        });
    }

    prepareArrayControls(parsed) {
        const beneficiaries = getValue(parsed, ['beneficiaries']);

        const beneficiariesControl = this.form;
        if (beneficiaries.length > 0) {
            beneficiariesControl.controls.splice(0);

            for (let i = 0; i < beneficiaries.length; i += 1) {
                beneficiariesControl.push(this.newRequestService.createBeneficiary());
            }
        }
    }

    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/identification/beneficiaryInformation',
            this.form.parent as FormGroup,
            this.newRequestService.context,
            {
                reset: false,
                returnPromise: true,
            },
        ).then(() => {
            this.ngRedux.dispatch(setMyKycRequestedPersist('identification/beneficiaryInformation'));
        });
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/identification/beneficiaryInformation',
            this.newRequestService.createIdentificationFormGroup(),
            this.newRequestService.context,
        );
    }

    isStepValid() {
        return this.form.valid;
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
            .sendRequestBeneficiaryList(this.form, requests, this.connectedWallet)
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
