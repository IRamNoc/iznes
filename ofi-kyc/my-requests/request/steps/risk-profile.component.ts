import {Component, OnInit, OnDestroy, Input, AfterViewInit} from '@angular/core';
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
export class NewKycRiskProfileComponent implements OnInit, AfterViewInit {

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

    ngAfterViewInit() {
        // this.form.get('investmentNature').patchValue({
        //     financialAssetManagementMethod: {
        //         internalManagement: true
        //     },
        //     frequencyFinancialTransactions: [{id: 'Daily', text: 'Daily'}],
        //     investmentvehiclesAlreadyUsed: [{id: 'Bonds', text: 'Bonds'}],
        //     performanceProfile: [{id: 'Income', text: 'Income'}],
        //     clientNeeds: [{id: 'Standaloneinvestment', text: 'Standalone investment'}],
        //
        // });
        // this.form.get('investmentObjective').patchValue({
        //     objectivesSameInvestmentCrossAm: true,
        //     objectives: [{
        //         investmentHorizonWanted: {
        //             Notimeconstraints : true
        //         },
        //         riskProfile: [{id: 'GuaranteedCapital', text: 'Guaranteed Capital'}],
        //         riskAcceptanceLevel1: 11,
        //         riskAcceptanceLevel2: 12,
        //         riskAcceptanceLevel3: 13,
        //         riskAcceptanceLevel4: 14
        //     }]
        // });
        //
        // this.form.get('investmentConstraint').patchValue({
        //     constraintsSameInvestmentCrossAm: true,
        //     constraints: [
        //         {
        //             statutoryConstraints: 'statutoryConstraints',
        //             taxConstraints: 'taxConstraints',
        //             otherConstraints: 'otherConstraints',
        //             investmentDecisionsAdHocCommittee: 'no',
        //             otherPersonsAuthorised: 'otherPersonsAuthorised'
        //         }
        //     ]
        // });
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