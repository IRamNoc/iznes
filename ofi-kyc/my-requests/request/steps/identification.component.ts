import {Component, OnInit, Input} from '@angular/core';
import {get as getValue} from 'lodash';
import {select} from '@angular-redux/store';
import {PersistService} from '@setl/core-persist';

import {Subject} from 'rxjs';
import {map, take, takeUntil} from 'rxjs/operators';

import {NewRequestService} from '../new-request.service';
import {IdentificationService} from './identification.service';

import {steps} from '../../requests.config';

@Component({
    selector: 'kyc-step-identification',
    templateUrl: './identification.component.html'
})
export class NewKycIdentificationComponent implements OnInit {

    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;

    unsubscribe : Subject<any> = new Subject();
    kycs;
    connectedWallet;

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
        private persistService: PersistService,
    ) {
    }

    ngOnInit() {
        this.initSubscriptions();
    }

    get investorType() {
        let legalStatusControl = this.form.get('generalInformation.legalStatus').value;
        let legalStatusValue = getValue(legalStatusControl, [0, 'id']);
        let possibleLegalStatusValues = ['pensionOrMutualInsurance', 'bankingInstitution', 'insurer', 'listedCompany'];

        let balanceSheetTotalValue = this.form.get('companyInformation.balanceSheetTotal').value;
        let netRevenuesNetIncomeValue = this.form.get('companyInformation.netRevenuesNetIncome').value;
        let shareholderEquityValue = this.form.get('companyInformation.shareholderEquity').value;

        if (possibleLegalStatusValues.indexOf(legalStatusValue) !== -1) {
            if (
                balanceSheetTotalValue < 20000000 &&
                netRevenuesNetIncomeValue < 40000000 &&
                shareholderEquityValue < 2000000
            ) {
                console.log('proByNature');
                return "proByNature";
            } else {
                console.log('proBySize');
                return "proBySize";
            }
        } else {
            console.log('nonPro');
            return "nonPro";
        }
    }


    initSubscriptions(){
        this.connectedWallet$
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(connectedWallet => {
                this.connectedWallet = connectedWallet
            })
        ;

        this.requests$
            .pipe(
                takeUntil(this.unsubscribe),
                map(kycs => kycs[0])
            )
            .subscribe(kyc => {
                console.log('***check persist ident');
                if(steps[kyc.completedStep] < steps.identification){
                    console.log('***persisting identification');
                    this.persistForm();
                }
            })
        ;
    }

    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/identification',
            this.form,
            this.newRequestService.context
        );
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/identification',
            this.newRequestService.createIdentificationFormGroup(),
            this.newRequestService.context
        )
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
                this.identificationService.sendRequest(this.form, requests, this.connectedWallet).then(() => {
                    this.clearPersistForm();
                });
            })
        ;
    }

    ngOnDestroy(){
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}