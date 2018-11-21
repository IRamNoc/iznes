import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { get as getValue, isEmpty, castArray } from 'lodash';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { select } from '@angular-redux/store';

import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { IdentificationService } from '../identification.service';
import { NewRequestService } from '../../new-request.service';
import { countries } from '../../../requests.config';

@Component({
    selector: 'banking-information',
    templateUrl: './banking-information.component.html',
    styleUrls: ['./banking-information.component.scss'],
})
export class BankingInformationComponent implements OnInit, OnDestroy {
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form;
    @Input() companyName: string;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    countries = countries;

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
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
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
