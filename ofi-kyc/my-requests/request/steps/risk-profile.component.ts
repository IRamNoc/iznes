import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { select } from '@angular-redux/store';
import { isEmpty, castArray } from 'lodash';
import { Subject } from 'rxjs';
import { filter as rxFilter, map, take, takeUntil } from 'rxjs/operators';

import { PersistService } from '@setl/core-persist';
import { formHelper } from '@setl/utils/helper';

import { NewRequestService } from '../new-request.service';
import { RiskProfileService } from './risk-profile.service';
import { steps } from '../../requests.config';

@Component({
    selector: 'kyc-step-risk-profile',
    templateUrl: './risk-profile.component.html',
})
export class NewKycRiskProfileComponent implements OnInit, OnDestroy {
    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();

    unsubscribe: Subject<any> = new Subject();
    formWatch: Subject<boolean> = new Subject<boolean>();

    constructor(
        private newRequestService: NewRequestService,
        private riskProfileService: RiskProfileService,
        private persistService: PersistService,
        private element: ElementRef,
    ) {
    }

    ngOnInit() {
        this.riskProfileService.currentServerData.riskobjective.next('');
        this.getCurrentFormData();
        this.initSubscriptions();
    }

    initSubscriptions() {
        this.requests$
        .pipe(
            map(kycs => kycs[0]),
            rxFilter((kyc: any) => {
                return kyc && kyc.amcID;
            }),
            take(1),
        )
        .subscribe((kyc) => {
            if (this.shouldPersist(kyc)) {
                this.persistForm();
            }
        });
    }

    shouldPersist(kyc) {
        if (kyc.context === 'done') {
            return false;
        }
        return !kyc.completedStep || (steps[kyc.completedStep] < steps.riskProfile);
    }

    getCurrentFormData() {
        this.requests$
        .pipe(
            rxFilter(requests => !isEmpty(requests)),
            takeUntil(this.unsubscribe),
        )
        .subscribe((requests) => {
            requests.forEach((request) => {
                this.riskProfileService.getCurrentFormObjectiveData(request.kycID);
                this.riskProfileService.getCurrentFormNatureData(request.kycID);
            });
        });
    }

    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/riskProfile',
            this.form,
            this.newRequestService.context,
            {
                reset: false,
                returnPromise: true,
            },
        ).then(() => {
            this.formWatch.next(true);
        });
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/riskProfile',
            this.newRequestService.createRiskProfileFormGroup(),
            this.newRequestService.context,
        );
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.form.valid) {
            formHelper.dirty(this.form);
            formHelper.scrollToFirstError(this.element.nativeElement);
            return;
        }

        this.requests$
        .pipe(
            take(1),
        )
        .subscribe((requests) => {
            this.riskProfileService.sendRequest(this.form, requests)
            .then(() => {
                this.clearPersistForm();
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

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
