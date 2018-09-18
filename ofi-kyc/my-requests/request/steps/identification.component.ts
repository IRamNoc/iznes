import {Component, OnInit, Input} from '@angular/core';
import {get as getValue, remove} from 'lodash';
import {select} from '@angular-redux/store';
import {PersistService} from '@setl/core-persist';

import {Subject} from 'rxjs';
import {map, take, takeUntil, filter as rxFilter} from 'rxjs/operators';

import {PersistRequestService} from '@setl/core-req-services';

import {NewRequestService} from '../new-request.service';
import {IdentificationService} from './identification.service';

import {steps} from '../../requests.config';

@Component({
    selector: 'kyc-step-identification',
    templateUrl: './identification.component.html'
})
export class NewKycIdentificationComponent implements OnInit {

    @Input() form;
    @Input() investorType;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;

    unsubscribe : Subject<any> = new Subject();
    kycs;
    connectedWallet;

    constructor(
        private newRequestService: NewRequestService,
        private identificationService: IdentificationService,
        private persistService: PersistService,
        private persistRequestService: PersistRequestService
    ) {
    }

    ngOnInit() {
        this.initSubscriptions();
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
                map(kycs => kycs[0]),
                rxFilter((kyc: any) => (kyc && kyc.amcID))
            )
            .subscribe(kyc => {
                if(!kyc.completedStep || (steps[kyc.completedStep] < steps.identification)){
                    this.prePersistForm();
                }
            })
        ;
    }

    prePersistForm() {
        this.persistRequestService
        .loadFormState('newkycrequest/identification', this.newRequestService.context)
        .then((data) => {
            data = getValue(data, [1, 'Data', 0, 'data']);

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
        })
        ;
    }

    prepareArrayControls(parsed) {
        const beneficiaries = getValue(parsed, ['companyInformation', 'beneficiaries']);
        const holders = getValue(parsed, ['bankingInformation', 'custodianHolderCustom']);

        const beneficiariesControl = this.form.get(['companyInformation', 'beneficiaries']);
        if (beneficiaries.length > 1) {
            beneficiariesControl.controls.splice(0);
            for (let i = 0; i < beneficiaries.length; i += 1) {
                beneficiariesControl.push(this.newRequestService.createBeneficiary());
            }
        }

        const holdersControl = this.form.get(['bankingInformation', 'custodianHolderCustom']);
        if (holders.length > 1) {
            holdersControl.controls.splice(0);
            for (let i = 0; i < holders.length; i += 1) {
                holdersControl.push(this.newRequestService.createHolderCustom());
            }
        }
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
