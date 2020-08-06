import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, ViewRef } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { filter as rxFilter, map, takeUntil, take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
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
import { MyKycStakeholderRelations } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { KycMyInformations } from '@ofi/ofi-main/ofi-store/ofi-kyc/my-informations';
import {KycFormHelperService} from "../../../kyc-form-helper.service";
import {clearFormArray} from "../../../../../../utils/helper/forms";

/**
 * Stakeholders main view component of kyc form.
 */
@Component({
    selector: 'beneficiary-list',
    templateUrl: './beneficiary-list.component.html',
    styleUrls: ['./beneficiary-list.component.scss'],
})
export class BeneficiaryListComponent implements OnInit, OnDestroy {
    // Current component formArray.
    @Input() form: FormArray;
    // General information formGroup of the kyc formGroup. used to just get management company name?
    @Input() generalInformationForm: FormGroup;
    // whether the form should render in readonly mode.
    @Input() isFormReadonly = false;
    // current completed step of the kyc form.
    @Input() completedStep: number;
    // Output event to let parent component hande the submit event.
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'stakeholderRelations']) stakeholderRelations$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformations: Observable<KycMyInformations>;
    // Get access to the FormPercentDirective component instance
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;

    // Register company name, used fro rendering
    registeredCompanyName: string;
    // Keep track of the current selected stakeholder index within the form array.
    selectedStakeholderIndex = null;
    // Stakeholders list that group by parent.
    sortedStakeholders = [];
    // Just to load the same stakeholder data, if edit stakeholder is cancel?
    stakeholderBackup = null;
    // Keep track of the open state of modal
    isModalOpen: any = false;
    // mode of the beneficiary modal
    mode: 'add' | 'edit' | 'view';
    unsubscribe: Subject<void> = new Subject();
    // Keep trade of the stakeholders' ID (beneficiaryID), for the active Kyc(s).
    relations: MyKycStakeholderRelations;
    // Store all existing stakeholder, so we can render them in dropdown.
    parents: { id: number; text: string }[];
    connectedWallet;
    //Current user's investor type.
    investorType: number;
    // is the user is type of nowCP.
    isNowCP: boolean = false;

    globalHasPEP = false;

    /**
     * Get temporary stakeholderID, that store in the frontend.
     * @return {number}
     */
    get nextId(): number {
        return this.getHighestID() + 1;
    }

    /**
     * Whether to show modal
     * @return {boolean | string }
     */
    get openModal(): boolean | string {
        return this.isModalOpen;
    }

    /**
     * Set isModalOpen value, and handle closeModal
     */
    set openModal(value) {
        this.isModalOpen = value;

        if (value === 'naturalClose') {
            this.isModalOpen = false;
        }

        if (!value) {
            this.closeModal(true);
        }
    }

    /**
     * Get current stakeholder as formGroup
     * @return {FormGroup}
     */
    get selectedStakeholder(): FormGroup {
        if (this.selectedStakeholderIndex === null) {
            return null;
        }

        return (this.form.at(this.selectedStakeholderIndex)) as FormGroup;
    }

    /**
     * Get the list of stake holder to render in the table.
     */
    get listStakeholders() {
        if (this.sortedStakeholders) {
            if (!this.sortedStakeholders.length && this.form.length) {
                this.sortStakeholders();
            }
            return this.sortedStakeholders;
        }
    }

    /**
     * get value of this.registeredCompanyName. if this.registeredCompanyName is undefined. we
     * fall back to identification -> generalInformation -> entity -> registeredCompanyName
     */
    get registeredCompanyNameStr(): string {
        if (this.registeredCompanyName) {
            return this.registeredCompanyName;
        }
        return this.generalInformationForm.get(['entity', 'registeredCompanyName']).value;
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
        private formBuilder: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private kycFormHelperService: KycFormHelperService,
    ) {
    }

    ngOnInit() {
        this.initSubscriptions();
        this.getFormData();
    }

    /**
     * Fetch stakeholders data from database. and create stakholder formGroups, and set value for the formGroups.
     */
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

                    // Get stakeholder data from membernode to build stakeholder formGroups and fill stakeholdersRelationTable(stakeholders ID within kyc) in redux.
                    const promise = this.identificationService.getCurrentFormCompanyBeneficiariesData(request.kycID).then((formData: any[]) => {
                        // if we have data build the stakeholders
                        if (!isEmpty(formData)) {
                            // create object to
                            const relation = {
                                kycID: request.kycID,
                                stakeholderIDs: formData.map(stakeholder => stakeholder.companyBeneficiariesID),
                            };

                            stakeholdersRelationTable.push(relation);

                            // only build the stakeholders formcontrol once.
                            if (index === 0) {
                                clearFormArray(this.form);

                                // build the stakeholder formArray
                                const promises = formData.map((controlValue) => {
                                    // create formGroup for the stakeholder
                                    const control = this.newRequestService.createBeneficiary();
                                    const documentID = controlValue.documentID;

                                    // convert the stakeholder stored in database to value that can apply to stakeholder formGroup
                                    const newControlValue = buildBeneficiaryObject(controlValue);

                                    // dynamically the formControl, depend on the beneficiary type
                                    this.disableBeneficiaryType(newControlValue, control);

                                    // fetch document data from membernode, and update stakeholder formGroup.
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
                                            this.form.push(control);
                                        });
                                    }

                                    // set the stakeholder formgroup value
                                    control.patchValue(newControlValue);

                                    this.form.push(control);
                                });

                                Promise.all(promises).then(() => {
                                    // update the beneficiaries formArray

                                    // Update some formcontrol within stakeholder, that depending on the data fetch from membernode.
                                    this.beneficiaryService.fillInStakeholderSelects(this.form.get('beneficiaries'));
                                    this.beneficiaryService.updateStakeholdersValidity(this.form.get('beneficiaries') as FormArray);
                                    if (this.formPercent) this.formPercent.refreshFormPercent();
                                    this.sortStakeholders();
                                    // update other stakeholder validators and validity.
                                    this.updateBeneficiariesValidity();
                                    this.changeDetectorRef.detectChanges();
                                });
                            }
                        }
                    });

                    promises.push(promise);
                });

                Promise.all(promises).then(() => {
                    this.ngRedux.dispatch(setMyKycStakeholderRelations(stakeholdersRelationTable));
                }).catch((err) => {
                    console.error(err);
                });
            });

        /**
         * Set the registered company name, from the 'General information' of the kyc.
         */
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

    /**
     * Update stakeholder formgroup depending on the beneficiary type.
     * @param {any} values: stakeholder formGroup value
     * @param {FormGroup} formGroup: stakeholder formGroup
     */
    disableBeneficiaryType(values, formgroup) {
        if (values['beneficiaryType'] === 'legalPerson') {
            // Disable naturalPerson
            formgroup.get('naturalPerson').disable();
            // Enable nationalIdNumberText
            const nationIdNumberType = getValue(values, 'legalPerson.nationalIdNumberType[0].id', '');
            this.beneficiaryService.formCheckNationalIdNumberType(formgroup, nationIdNumberType);
        } else {
            formgroup.get('legalPerson').disable();
        }
    }

    /**
     * Update stakeholder parents list(linked entity). Used in dropdown
     */
    updateParents() {
        this.parents = this.beneficiaryService.parents(this.form);
    }

    /**
     * Update the stakeholder list order, group together if have same beneficiary parent.
     * And Update stakeholder parent list.
     */
    sortStakeholders() {
        if (!this.form.length) {
            this.sortedStakeholders = [];
            return;
        }
        this.sortedStakeholders = this.hierarchySort.sort(this.form.controls);
        this.updateParents();
    }

    /**
     * Get the highest stakeholder ID(actual ID, or temporary ID that only store in frontend) in number.
     * @return {number}
     */
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
        // get stakeholder IDs for the kyc(s).
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

        // Get the investor type.
        this.kycMyInformations
            .takeUntil(this.unsubscribe)
            .subscribe((d) => {
                this.investorType = d.investorType;

                if (this.investorType === 70 || this.investorType === 80 || this.investorType === 90) {
                    this.isNowCP = true;
                }
            });
    }

    /**
     * Handle the stakeholder modal close.
     * @param {boolean} cancel
     */
    closeModal(cancel?: boolean) {
        const stakeholder = this.form.at(this.selectedStakeholderIndex) as FormGroup;

        // if the 'add' action is cancel, remove the stakeholder from stakeholder list.
        if (cancel && this.mode === 'add') {
            this.removeStakeholder(this.selectedStakeholderIndex);
        }

        // if the 'edit' action is cancel, load the stakeholder backup for the editing stakeholder.
        if (cancel && this.mode === 'edit') {
            stakeholder.patchValue(this.stakeholderBackup);
            this.stakeholderBackup = null;
        }

        // if the form is valid. save the stakeholder.
        if (!cancel && this.isValidUpdate(stakeholder)) {
            // Save the added stakeholder
            this.handleSubmit();
            this.confirmClose(this.mode);
            this.sortStakeholders();
        }

        // if the form is not valid. trigger validation error.
        if (!cancel && !this.isValidUpdate(stakeholder)) {
            this.markFormGroupTouched(stakeholder as FormGroup);
        }

        // close when it is view mode?
        if (cancel || this.isValidUpdate(stakeholder)) {
            this.selectedStakeholderIndex = null;
            this.openModal = 'naturalClose';
            this.mode = null;
        }
    }

    /**
     * Whether the stakeholder formGroup is valid.
     * @param {FormGroup} stakeholder
     * @return {boolean}
     */
    private isValidUpdate(stakeholder: FormGroup): boolean {
        const type = stakeholder.get('beneficiaryType').value;
        if (this.isLegalPerson(type)) {
            return this.isLegalPersonValid(stakeholder);
        }

        if (this.isNaturalPerson(type)) {
            return this.isNaturalPersonValid(stakeholder);
        }
    }

    /**
     * Whether stakeholder type of 'legal person' formGroup is valid.
     * @param {FormGroup} stakeholder
     * @return {boolean}
     */
    private isLegalPersonValid(stakeholder: FormGroup): boolean {
        return stakeholder.controls.legalPerson.valid &&
            stakeholder.controls.common.valid;
    }

    /**
     * Whether stakeholder type of 'natural person' formGroup is valid.
     * @param {FormGroup} stakeholder
     * @return {boolean}
     */
    private isNaturalPersonValid(stakeholder: FormGroup): boolean {
        return stakeholder.controls.naturalPerson.valid &&
            stakeholder.controls.common.valid;
    }

    /**
     * Check current stakeholder form is valid.
     * @return {boolean}
     */
    canDoUpdate(): boolean {
        const stakeholder = this.form.at(this.selectedStakeholderIndex) as FormGroup;

        return this.isValidUpdate(stakeholder);
    }

    /**
     * Show successfully save/edit message.
     * @param {string} mode
     */
    confirmClose(mode: string) {
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

            // If parent is not the default parent (-1/registeredCompanyName)
            if (parentID && parentID !== -1) {
                return find(this.parents, ['id', parentID]);
            }

            return { text: this.registeredCompanyName };
        }
    }

    getRealIndex(index) {
        const beneficiariesID = getValue(this.sortedStakeholders[index].value, 'companyBeneficiariesID', -1);
        // handle if beneficiary ID not found
        if (beneficiariesID === -1) {
            return;
        }

        return this.form.controls.findIndex((control: FormGroup) => {
           return getValue(control.value, 'companyBeneficiariesID', -1) === beneficiariesID;
        });
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
        }

        if (this.isNaturalPerson(type)) {
            return 'fa-user';
        }

        return 'fa-users';
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

    isStepValid() {
        return this.form.valid;
    }

    /**
     * Submits the beneficiary (stakeholder) form
     * @param e Event Object (optional)
     * @returns void
     */
    handleSubmit(e = null) {
        if (e) {
            e.preventDefault();
        }

        if (!this.form.valid) {
            formHelper.dirty(this.form);
            formHelper.scrollToFirstError(this.element.nativeElement);
            this.form.markAsTouched();
            this.submitEvent.emit({ invalid: true });
            return;
        }

        // update other stakeholder validators and validity.
        this.updateBeneficiariesValidity();

        this.requests$
        .pipe(take(1))
        .subscribe((requests) => {
            this
            .identificationService
            .sendRequestBeneficiaryList(this.form, requests, this.connectedWallet)
            .then(() => {
                // If event object, navigate to next step
                if (e) {
                    this.submitEvent.emit({
                        completed: true,
                    });
                }
                this.updateParents();
            })
            .catch((e) => {
                this.newRequestService.errorPop(e);
            });
        });
    }

    stopTabbing(e) {
        if (e.keyCode === 9) e.preventDefault();
    }

    /**
     * Update beneficiary list validity.
     * 'If any client is regulated, listed or state-owned then the KBIS or ID in each stakeholder should be optional'
     * 'If the field “Is the stakeholder a political exposed person?” is Yes KBIS or ID in each stakeholder should be required – overwriting the above rule'
     */
    updateBeneficiariesValidity() {
       const beneficiariesValue: any[] = this.form.value;
       let kbisAndIDRequired = false;


        const highRisk = this.kycFormHelperService.isHighRiskActivity() || this.kycFormHelperService.isHighRiskCountry();
        if (highRisk) {
            kbisAndIDRequired = true;
        }

       for (const beneficiaryValue of beneficiariesValue) {
           this.globalHasPEP = false;
           const beneficiaryType = beneficiaryValue.beneficiaryType;
           const isNaturalPerson = beneficiaryType === 'naturalPerson';
           const isPoliticallyExposed = getValue(beneficiaryValue, ['naturalPerson', 'isPoliticallyExposed'], 0) === 1;

           if (isPoliticallyExposed && isNaturalPerson) {
              kbisAndIDRequired = true;
              this.globalHasPEP = true;
              break;
           }
       }

       if (this.kycFormHelperService.isStateOwnedAnyPercentCapital() || this.kycFormHelperService.isCompanyRegulated() || this.kycFormHelperService.isCompanyListed()) {
           kbisAndIDRequired = false;
       }

       for (const beneficiaryFormGroup of (this.form as FormArray).controls) {
           if (kbisAndIDRequired) {
               beneficiaryFormGroup.get(['common', 'document', 'hash']).setValidators([Validators.required]);
           } else {
               beneficiaryFormGroup.get(['common', 'document', 'hash']).clearValidators();
           }
           beneficiaryFormGroup.get(['common', 'document', 'hash']).updateValueAndValidity();
           if (! (this.changeDetectorRef as ViewRef).destroyed) this.changeDetectorRef.markForCheck();
       }

    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
