import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {select} from '@angular-redux/store';
import {PersistService} from '@setl/core-persist';
import {isEmpty, castArray} from 'lodash';
import {Subject} from 'rxjs';
import {filter as rxFilter, map, take, takeUntil, tap} from 'rxjs/operators';

import {NewRequestService} from '../new-request.service';
import {RiskProfileService} from './risk-profile.service';
import {steps} from "../../requests.config";

@Component({
    selector: 'kyc-step-risk-profile',
    templateUrl: './risk-profile.component.html'
})
export class NewKycRiskProfileComponent implements OnInit, OnDestroy {

    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe: Subject<any> = new Subject();

    constructor(
        private newRequestService: NewRequestService,
        private riskProfileService: RiskProfileService,
        private persistService: PersistService
    ) {
    }

    ngOnInit() {
        this.riskProfileService.currentServerData.riskobjective.next('');
        this.getCurrentFormData();
        this.initSubscriptions();
    }

    initSubscriptions(){
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
            })
        ;
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
                takeUntil(this.unsubscribe)
            )
            .subscribe(requests => {
                requests.forEach(request => {
                    this.riskProfileService.getCurrentFormObjectiveData(request.kycID);
                });
            })
        ;
    }

    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/riskProfile',
            this.form,
            this.newRequestService.context,
            {
                reset: false
            }
        );
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/riskProfile',
            this.newRequestService.createRiskProfileFormGroup(),
            this.newRequestService.context
        );
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.form.valid) {
            return;
        }

        this.requests$
            .pipe(
                take(1)
            )
            .subscribe(requests => {
                this.riskProfileService.sendRequest(this.form, requests).then(() => {
                    this.clearPersistForm();
                });
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
