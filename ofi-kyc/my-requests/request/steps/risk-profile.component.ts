import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {select} from '@angular-redux/store';
import {PersistService} from '@setl/core-persist';
import {isEmpty, castArray} from 'lodash';
import {Subject} from 'rxjs/Subject';

import {NewRequestService} from '../new-request.service';
import {RiskProfileService} from './risk-profile.service';

@Component({
    selector: 'kyc-step-risk-profile',
    templateUrl: './risk-profile.component.html'
})
export class NewKycRiskProfileComponent implements OnInit, OnDestroy {

    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe : Subject<any> = new Subject();

    constructor(
        private newRequestService: NewRequestService,
        private riskProfileService: RiskProfileService,
        private persistService: PersistService
    ) {
    }

    ngOnInit() {
        // this.persistForm();
        this.getCurrentFormData();
    }

    getCurrentFormData(){
        this.requests$
            .filter(requests => !isEmpty(requests))
            .map(requests => castArray(requests[0]))
            .takeUntil(this.unsubscribe)
            .subscribe(requests => {
                requests.forEach(request => {
                    this.riskProfileService.getCurrentFormObjectiveData(request.kycID);
                });
            })
        ;
    }

    persistForm(){
        this.persistService.watchForm(
            'newkycrequest/riskProfile',
            this.form
        );
    }

    clearPersistForm(){
        this.persistService.refreshState(
            'newkycrequest/riskProfile',
            this.newRequestService.createRiskProfileFormGroup()
        );
    }

    handleSubmit(e) {
        e.preventDefault();

        if(!this.form.valid){
            return;
        }

        this.requests$.take(1).subscribe(requests => {
            this.riskProfileService.sendRequest(this.form, requests).then(() => {
                this.clearPersistForm();
            });
        });
    }

    ngOnDestroy(){
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}