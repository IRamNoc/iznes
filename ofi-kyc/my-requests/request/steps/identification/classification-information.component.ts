import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { get as getValue, isEmpty, castArray, find, pick, omit } from 'lodash';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
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
    @Input() investorType;

    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    countries = countries;
    financialInstrumentsList;
    geographicalAreaList;
    natureOfTransactionsList;
    volumeOfTransactionsList;

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
        public translate: MultilingualService,
    ) {
    }

    ngOnChanges(changes) {
        const investorType = changes.investorType.currentValue;

        if (investorType !== changes.investorType.previousValue) {
            this.investorChanged(investorType);
        }
    }

    investorChanged(investorType) {
        const investorStatus = investorStatusList[investorType];

        this.form.get('investorStatus').patchValue(investorStatus);
        this.toggleForm(investorType);
    }

    ngOnInit() {
        this.financialInstrumentsList = this.newRequestService.financialInstrumentsList;
        this.translate.translate(this.financialInstrumentsList);

        this.geographicalAreaList = this.newRequestService.geographicalAreaList;
        this.translate.translate(this.geographicalAreaList);

        this.natureOfTransactionsList = this.newRequestService.natureOfTransactionsList;
        this.translate.translate(this.natureOfTransactionsList);

        this.volumeOfTransactionsList = this.newRequestService.volumeOfTransactionsList;

        this.initCheckForm();
        this.getCurrentFormData();
        this.investorChanged(this.investorType);
    }

    toggleForm(investorType) {
        const pro: FormGroup = this.form.get('pro');
        const changeProfessionalStatus = this.form.get('pro.changeProfessionalStatus').value;

        if (investorType === 'nonPro') {
            pro.disable();
            this.toggleNonPro('enable');
        } else {
            pro.enable();

            if (!changeProfessionalStatus) {
                this.toggleNonPro('disable');
            } else {
                this.toggleNonPro('enable');
            }
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
            .pipe(
                takeUntil(this.unsubscribe),
            )
            .subscribe((data) => {
                this.formCheckFinancialInstruments(data);
            });

        this.form.get('nonPro.activitiesBenefitFromExperience').valueChanges
            .pipe(
                takeUntil(this.unsubscribe),
            )
            .subscribe((experienceFinancialFieldValue) => {
                this.formCheckExperienceFinancialField(experienceFinancialFieldValue);
            });

        this.form.get('pro.changeProfessionalStatus').valueChanges
            .pipe(
                takeUntil(this.unsubscribe),
            )
            .subscribe((changeProfessionalStatus) => {
                this.formCheckProToNonProChoice(changeProfessionalStatus);
            });
    }

    formCheckProToNonProChoice(value) {
        if (value) {
            this.toggleNonPro('enable');
        } else {
            this.toggleNonPro('disable');
        }

        this.formPercent.refreshFormPercent();
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

    isDisabled(path) {
        const control = this.form.get(path);

        return control.disabled;
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    getCurrentFormData() {
        this.requests$
            .pipe(
                filter(requests => !isEmpty(requests)),
                map(requests => castArray(requests[0])),
                takeUntil(this.unsubscribe),
            )
            .subscribe((requests) => {
                requests.forEach((request) => {
                    this.identificationService.getCurrentFormClassificationData(request.kycID).then((formData) => {
                        if (formData) {
                            const common = pick(formData, ['kycID', 'investorStatus']);
                            const pro = pick(formData, ['excludeProducts', 'changeProfessionalStatus']);
                            const nonPro = omit(formData, ['kycID', 'investorStatus', 'excludeProducts', 'changeProfessionalStatus']);
                            this.form.patchValue(common);
                            this.form.get('pro').patchValue(pro);
                            this.form.get('nonPro').patchValue(nonPro);
                        }
                    });
                });
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
