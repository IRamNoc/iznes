import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { isEmpty, castArray, find, pick, omit, values, map, assign, findIndex, get as getValue } from 'lodash';
import { select } from '@angular-redux/store';
import { Subject, combineLatest } from 'rxjs';
import { filter, map as rxMap, takeUntil } from 'rxjs/operators';

import { IdentificationService } from '../identification.service';
import { NewRequestService } from '../../new-request.service';
import { countries, investorStatusList } from '../../../requests.config';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'classification-information',
    templateUrl: './classification-information.component.html',
    styleUrls: ['./classification-information.component.scss'],
})
export class ClassificationInformationComponent implements OnInit, OnDestroy {
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form;
    @Input() enabled;
    @Input() investorType;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) currentlyRequestedKycs$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'formPersist']) persistedForms$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    countries = countries;
    financialInstrumentsList;
    geographicalAreaList;
    natureOfTransactionsList;
    volumeOfTransactionsList;
    amcs = [];
    ready = false;

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
        public translate: MultilingualService,
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

        this.formPercent.refreshFormPercent();
    }

    toggleNonPro(action) {
        if (action === 'enable') {
            (this.form.get('nonPro') as FormGroup).enable();
            (this.form.get('nonPro.activitiesBenefitFromExperience') as FormControl).updateValueAndValidity();
            (this.form.get('nonPro.financialInstruments') as FormControl).updateValueAndValidity();
        } else {
            (this.form.get('nonPro') as FormGroup).disable();
            (this.form.get('nonPro.activitiesBenefitFromExperienceSpecification') as FormControl).disable();
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

    formCheckFinancialInstruments(value) {
        const hasOther = find(value, ['id', 'other']);

        const financialInstrumentsTextControl: FormGroup = this.form.get('nonPro.financialInstrumentsSpecification');

        if (hasOther) {
            financialInstrumentsTextControl.enable();
        } else {
            financialInstrumentsTextControl.disable();
        }
    }

    getFormControl(amcID) {
        if (!amcID) {
            return;
        }

        const formControl = this.form.get('optForValues');
        const value = formControl.value;
        const index = findIndex(value, ['id', amcID]);

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
            });
        })
        ;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
