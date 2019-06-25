import { Component, Input, Output, OnInit, OnDestroy, ViewChildren, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { isEmpty, castArray, find, pick, omit, values, map, assign, findIndex, get as getValue } from 'lodash';
import { select, NgRedux } from '@angular-redux/store';
import { Subject, combineLatest } from 'rxjs';
import { filter, map as rxMap, takeUntil, take } from 'rxjs/operators';
import { IdentificationService } from '../identification.service';
import { NewRequestService } from '../../new-request.service';
import { countries, investorStatusList, steps } from '../../../requests.config';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { MultilingualService } from '@setl/multilingual';
import { formHelper } from '@setl/utils/helper';
import { PersistRequestService } from '@setl/core-req-services';
import { PersistService } from '@setl/core-persist';
import { setMyKycRequestedPersist } from '@ofi/ofi-main/ofi-store/ofi-kyc';

@Component({
    selector: 'classification-information',
    templateUrl: './classification-information.component.html',
    styleUrls: ['./classification-information.component.scss'],
})
export class ClassificationInformationComponent implements OnInit, OnDestroy {
    @ViewChildren(FormPercentDirective) formPercent: FormPercentDirective[] = [];
    @Input() form;
    @Input() enabled;
    @Input() investorType;
    @Input() isFormReadonly;
    @Input() completedStep: string;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) currentlyRequestedKycs$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'formPersist']) persistedForms$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    countries = countries;
    financialInstrumentsList;
    geographicalAreaList;
    natureOfTransactionsList;
    volumeOfTransactionsList;
    amcs = [];
    ready = false;
    instrumentChecked: {} = {};
    geographicalAreaChecked: {} = {};

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
        public translate: MultilingualService,
        public element: ElementRef,
        private persistService: PersistService,
        private ngRedux: NgRedux<any>,
    ) {
    }

    openPanel($e) {
        $e.preventDefault();

        if (this.enabled) {
            this.open = !this.open;
        }
    }

    ngOnChanges(changes) {
        const currentInvestorType = getValue(changes, ['investorType', 'currentValue']);
        const previousInvestorType = getValue(changes, ['investorType', 'previousValue']);

        if (currentInvestorType !== previousInvestorType) {
            this.investorChanged(currentInvestorType);
        }
    }

    setFinancialInstruments(instrument, event) {
        const control = this.form.get(['nonPro', 'financialInstruments']);
        const currentInstruments = control.value || [];
        const matched = currentInstruments.find(ins => ins.id === instrument.id);

        if (event.srcElement.checked && !matched) {
            currentInstruments.push({ id: instrument.id });
        } else {
            const index = currentInstruments.indexOf(matched);
            if (index > -1) currentInstruments.splice(index, 1);
        }

        control.setValue(currentInstruments);
        this.updateFormPercent();
    }

    updateFormPercent() {
        this.formPercent.forEach(child => child.refreshFormPercent());
    }

    setInstrumentCheckboxes() {
        this.instrumentChecked = [];
        (this.form.get(['nonPro', 'financialInstruments']).value || []).forEach((instrument) => {
            this.instrumentChecked[instrument.id] = true;
        });
        this.updateFormPercent();
    }

    setGeographicalAreas(area, event) {
        const control = this.form.get(['nonPro', 'marketArea']);
        const currentAreas = control.value || [];
        const matched = currentAreas.find(ins => ins.id === area.id);

        if (event.srcElement.checked && !matched) {
            currentAreas.push({ id: area.id });
        } else {
            const index = currentAreas.indexOf(matched);
            if (index > -1) currentAreas.splice(index, 1);
        }

        control.setValue(currentAreas);
    }

    setGeograpgicalAreaCheckboxes() {
        (this.form.get(['nonPro', 'marketArea']).value || []).forEach((area) => {
            this.geographicalAreaChecked[area.id] = true;
        });
    }

    isEven(n) {
        return n % 2 === 0;
    }

    investorChanged(investorType) {
        const investorStatus = investorStatusList[investorType];

        this.form.get('investorStatus').patchValue(investorStatus);
        if (this.ready) {
            this.form.get('optFor').setValue(0);
        }
        this.toggleForm(investorType);
    }

    ngOnInit() {
        this.ready = false;
        this.initData();
        this.initCheckForm();
        this.getCurrentFormData();
        this.investorChanged(this.investorType);
    }

    initData() {
        combineLatest(this.currentlyRequestedKycs$, this.managementCompanyList$)
        .pipe(
            takeUntil(this.unsubscribe),
            filter(([requestedKycs, managementCompanyList]) => {
                return !isEmpty(requestedKycs) && managementCompanyList && managementCompanyList.size > 0;
            }),
            rxMap(([requestedKycs, managementCompanyList]) => {
                const amcs = map(requestedKycs, (requested) => {
                    return assign({}, requested, find(managementCompanyList.toJS(), ['companyID', requested.amcID]));
                });

                return amcs;
            }),
        )
        .subscribe((amcs) => {
            this.amcs = amcs;

            this.generateOptFors(amcs).disable();
        })
        ;

        this.persistedForms$
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((forms) => {
            if (forms.identification) {
                setTimeout(() => { this.ready = true; });
            }
        })
        ;

        this.financialInstrumentsList = this.newRequestService.financialInstrumentsList;
        this.translate.translate(this.financialInstrumentsList);

        this.geographicalAreaList = this.newRequestService.geographicalAreaList;
        this.translate.translate(this.geographicalAreaList);

        this.natureOfTransactionsList = this.newRequestService.natureOfTransactionsList;
        this.translate.translate(this.natureOfTransactionsList);

        this.volumeOfTransactionsList = this.newRequestService.volumeOfTransactionsList;
    }

    multiOpt() {
        const optFor = this.form.get('optFor').value;

        return optFor && this.amcs.length > 1;
    }

    toggleForm(investorType) {
        if (investorType === 'nonPro') {
            this.toggleNonPro('enable');
        } else {
            this.toggleNonPro('disable');
        }

        this.updateFormPercent();
    }

    toggleNonPro(action) {
        if (action === 'enable') {
            (this.form.get('nonPro') as FormGroup).enable();
            (this.form.get('nonPro.activitiesBenefitFromExperience') as FormControl).updateValueAndValidity();
            (this.form.get('nonPro.trainingKnowledgeSkills') as FormControl).updateValueAndValidity();
            (this.form.get('nonPro.financialInstruments') as FormControl).updateValueAndValidity();
        } else {
            (this.form.get('nonPro') as FormGroup).disable();
            (this.form.get('nonPro.activitiesBenefitFromExperienceSpecification') as FormControl).disable();
            (this.form.get('nonPro.trainingKnowledgeSkillsSpecification') as FormControl).disable();
            (this.form.get('nonPro.financialInstrumentsSpecification') as FormControl).disable();
        }
    }

    initCheckForm() {
        this.form.get('nonPro.financialInstruments').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
            this.formCheckFinancialInstruments(data);
        })
        ;
        this.form.get('nonPro.activitiesBenefitFromExperience').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((experienceFinancialFieldValue) => {
            this.formCheckExperienceFinancialField(experienceFinancialFieldValue);
        })
        ;

        this.form.get('nonPro.trainingKnowledgeSkills').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((trainingKnowledgeSkillsFieldValue) => {
            this.formCheckTrainingKnowledgeSkillsField(trainingKnowledgeSkillsFieldValue);
        })
        ;

        this.form.get('optFor').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((value) => {
            this.formCheckOptFor(value);
        });
    }

    formCheckOptFor(value) {
        const optForControl = this.form.get('optForValues');

        if (this.amcs.length <= 1) {
            optForControl.disable();
            return;
        }

        if (value) {
            optForControl.enable();
        } else {
            optForControl.disable();
        }
    }

    formCheckExperienceFinancialField(value) {
        const experienceFinancialFieldTextControl: FormGroup = this.form.get('nonPro.activitiesBenefitFromExperienceSpecification');

        if (value) {
            experienceFinancialFieldTextControl.enable();
        } else {
            experienceFinancialFieldTextControl.disable();
        }
    }

    formCheckTrainingKnowledgeSkillsField(value) {
        const trainingKnowledgeSkillsFieldTextControl: FormGroup = this.form.get('nonPro.trainingKnowledgeSkillsSpecification');

        if (value) {
            trainingKnowledgeSkillsFieldTextControl.enable();
        } else {
            trainingKnowledgeSkillsFieldTextControl.disable();
        }
    }

    formCheckFinancialInstruments(value) {
        const hasOther = find(value, ['id', 'other']);

        const financialInstrumentsTextControl: FormGroup = this.form.get('nonPro.financialInstrumentsSpecification');

        if (hasOther) {
            financialInstrumentsTextControl.enable();
        } else {
            financialInstrumentsTextControl.disable();
        }
    }

    getFormControl(kycID) {
        if (!kycID) {
            return;
        }

        const formControl = this.form.get('optForValues');
        const value = formControl.value;
        const index = findIndex(value, ['id', kycID]);

        return formControl.at(index).get('opted');
    }

    generateOptFors(amcs, values = []) {
        amcs = map(amcs, amc => amc.kycID);
        const optFors = this.newRequestService.createOptFors(amcs);

        const optForsControl = this.form.get('optForValues');
        const numberOfControls = optForsControl.length;

        for (let i = numberOfControls; i > 0; i -= 1) {
            optForsControl.removeAt(i - 1);
        }

        optFors.forEach((optFor, i) => {
            if (values[i]) {
                optFor.get('opted').setValue(values[i]);
            }

            optForsControl.push(optFor);
        });

        return optForsControl;
    }

    isDisabled(path) {
        const control = this.form.get(path);

        return control.disabled;
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    getCurrentFormData() {
        this.currentlyRequestedKycs$
        .pipe(
            filter(requests => !isEmpty(requests)),
            takeUntil(this.unsubscribe),
        )
        .subscribe((requests) => {
            const promises = [];

            requests.forEach((request, i) => {
                const promise = this.identificationService.getCurrentFormClassificationData(request.kycID).then((formData) => {
                    if (!isEmpty(formData) && i === 0) {
                        const common = pick(formData, ['kycID', 'investorStatus', 'excludeProducts']);
                        const nonPro = omit(formData, ['kycID', 'investorStatus', 'excludeProducts', 'optFor']);
                        this.form.patchValue(common);

                        this.form.get('nonPro').patchValue(nonPro);
                        this.setInstrumentCheckboxes();
                        this.setGeograpgicalAreaCheckboxes();
                    }
                    return formData;
                });

                promises.push(promise);
            });

            Promise.all(promises).then((results) => {
                const haveResults = results.reduce((acc, cur) => acc || !isEmpty(cur), false);
                if (haveResults) {
                    const optFor = results.reduce((acc, result) => !!result.optFor || acc, false);
                    const optForsControl = this.generateOptFors(results, map(results, 'optFor'));
                    this.form.get('optFor').patchValue(optFor);

                    this.formCheckOptFor(optFor);
                }

                this.initFormPersist();
            });
        })
        ;
    }

    /**
     * Init Form Persist if the step has not been completed
     */
    initFormPersist() {
        if (!this.completedStep || (steps[this.completedStep] < steps.classification)) this.persistForm();
    }

    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/identification/classificationInformation',
            this.form,
            this.newRequestService.context,
            {
                reset: false,
                returnPromise: true,
            },
        ).then(() => {
            this.ngRedux.dispatch(setMyKycRequestedPersist('identification/classificationInformation'));
            this.setInstrumentCheckboxes();
        });
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/identification/classificationInformation',
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
            .sendRequestClassificationInformation(this.form, requests)
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
