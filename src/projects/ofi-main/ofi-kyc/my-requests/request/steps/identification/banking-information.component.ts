import { Component, OnInit, Input, Output, OnDestroy, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { get as getValue, isEmpty, castArray } from 'lodash';
import { Subject, BehaviorSubject } from 'rxjs';
import { filter, map, takeUntil, take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { IdentificationService } from '../identification.service';
import { NewRequestService } from '../../new-request.service';
import { countries } from '../../../requests.config';
import { formHelper } from '@setl/utils/helper';
import { KycMyInformations } from '@ofi/ofi-main/ofi-store/ofi-kyc/my-informations';

@Component({
    selector: 'banking-information',
    templateUrl: './banking-information.component.html',
    styleUrls: ['./banking-information.component.scss'],
})
export class BankingInformationComponent implements OnInit, OnDestroy {
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form;
    @Input() completedStep: number;
    @Input() isFormReadonly;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();

    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformations: Observable<KycMyInformations>;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    countries = countries;
    investorType: number;
    isNowCP: boolean = false;
    // data is fetched from database, and patched value to formgroup.
    formDataFilled$ = new BehaviorSubject<boolean>(false);

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
        private element: ElementRef,
        private ngRedux: NgRedux<any>,
    ) {
    }

    get holders() {
        return this.form.get('custodianHolders').controls as FormArray;
    }

    ngOnInit() {
        this.getCurrentFormData();

        this.kycMyInformations
            .takeUntil(this.unsubscribe)
            .subscribe((d) => {
                this.investorType = d.investorType;

                if (this.investorType === 70 || this.investorType === 80 || this.investorType === 90) {
                    this.isNowCP = true;
                }
            });
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
                    this.formDataFilled$.next(true);
                });
            });

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
