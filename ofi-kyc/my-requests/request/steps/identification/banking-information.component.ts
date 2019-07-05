import { Component, OnInit, Input, Output, OnDestroy, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { get as getValue, isEmpty, castArray } from 'lodash';
import { Subject } from 'rxjs';
import { filter, map, takeUntil, take } from 'rxjs/operators';
import { select, NgRedux } from '@angular-redux/store';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { IdentificationService } from '../identification.service';
import { NewRequestService } from '../../new-request.service';
import { countries, steps } from '../../../requests.config';
import { formHelper } from '@setl/utils/helper';
import { PersistRequestService } from '@setl/core-req-services';
import { PersistService } from '@setl/core-persist';
import { setMyKycRequestedPersist } from '@ofi/ofi-main/ofi-store/ofi-kyc';

@Component({
    selector: 'banking-information',
    templateUrl: './banking-information.component.html',
    styleUrls: ['./banking-information.component.scss'],
})
export class BankingInformationComponent implements OnInit, OnDestroy {
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form;
    @Input() completedStep: string;
    @Input() isFormReadonly;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    countries = countries;

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
        private element: ElementRef,
        private ngRedux: NgRedux<any>,
        private persistRequestService: PersistRequestService,
        private persistService: PersistService,
    ) {
    }

    get holders() {
        return this.form.get('custodianHolders').controls as FormArray;
    }

    ngOnInit() {
        this.getCurrentFormData();
    }

    hasError(control, error = []) {
        const holders = this.form.get('custodianHolders');
        return this.newRequestService.hasError(holders, control, error);
    }

    addHolder() {
        this.form.get('custodianHolders').push(this.newRequestService.createHolder());
        this.formPercent.refreshFormPercent();
    }

    removeHolder(i) {
        if (this.form.get('custodianHolders').at(i).value.custodianID !== '') {
            this.identificationService.deleteHolder(
                this.form.get('custodianHolders').at(i).value.custodianID,
            );
        }

        this.form.get('custodianHolders').removeAt(i);
        this.formPercent.refreshFormPercent();
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
                this.identificationService.getCurrentFormBankingData(request.kycID).then((formData) => {
                    if (formData) {
                        if (formData.length) {
                            const bankingAccounts = this.form.get('custodianHolders') as FormArray;

                            while (bankingAccounts.length) {
                                bankingAccounts.removeAt(0);
                            }

                            formData.forEach((controlValue) => {
                                const control = this.newRequestService.createHolder();

                                control.patchValue(controlValue);
                                bankingAccounts.push(control);
                            });

                            this.form.updateValueAndValidity();
                        }
                    }
                });
            });

            this.initFormPersist();
        });
    }

    /**
     * Init Form Persist if the step has not been completed
     */
    initFormPersist() {
        if (!this.completedStep || (steps[this.completedStep] < steps.bankAccounts)) this.prePersistForm();
    }

    prePersistForm() {
        this.persistRequestService
        .loadFormState('newkycrequest/identification/bankingInformation', this.newRequestService.context)
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
        const holders = getValue(parsed, ['custodianHolders']);

        const holdersControl = this.form.get(['custodianHolders']);
        if (holders.length > 1) {
            holdersControl.controls.splice(0);
            for (let i = 0; i < holders.length; i += 1) {
                holdersControl.push(this.newRequestService.createHolder());
            }
        }
    }

    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/identification/bankingInformation',
            this.form,
            this.newRequestService.context,
            {
                reset: false,
                returnPromise: true,
            },
        ).then(() => {
            this.ngRedux.dispatch(setMyKycRequestedPersist('identification/bankingInformation'));
        });
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/identification/bankingInformation',
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
            .sendRequestBankingInformation(this.form, requests)
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

    showHelperText(control, errors) {
        return this.form.get('custodianHolders').get(control).invalid && !this.hasError(control, errors);
    }

    stopTabbing(e) {
        e.stopPropagation();
        if (e.keyCode === 9) e.preventDefault();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
