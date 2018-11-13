import { Component, OnInit, Input } from '@angular/core';
import { get as getValue, remove } from 'lodash';
import { select, NgRedux } from '@angular-redux/store';
import { PersistService } from '@setl/core-persist';
import { Subject } from 'rxjs';
import { map, take, takeUntil, filter as rxFilter } from 'rxjs/operators';
import { PersistRequestService } from '@setl/core-req-services';
import { NewRequestService } from '../new-request.service';
import { IdentificationService } from './identification.service';
import { setMyKycRequestedPersist } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { steps } from '../../requests.config';
import { BeneficiaryService } from './identification/beneficiary.service';

@Component({
    selector: 'kyc-step-identification',
    templateUrl: './identification.component.html',
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
        private persistRequestService: PersistRequestService,
        private ngRedux: NgRedux<any>,
        private beneficiaryService: BeneficiaryService,
    ) {
    }

    ngOnInit() {
        this.initSubscriptions();
    }

    initSubscriptions() {
        this.connectedWallet$
            .pipe(
                takeUntil(this.unsubscribe),
            )
            .subscribe((connectedWallet) => {
                this.connectedWallet = connectedWallet;
            });

        this.requests$
            .pipe(
                takeUntil(this.unsubscribe),
                map(kycs => kycs[0]),
                rxFilter((kyc: any) => (kyc && kyc.amcID)),
            )
            .subscribe((kyc) => {
                if (this.shouldPersist(kyc)) {
                    this.prePersistForm();
                }
            });
    }

    shouldPersist(kyc) {
        if (kyc.context === 'done') {
            return false;
        }
        return !kyc.completedStep || (steps[kyc.completedStep] < steps.identification);
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
        });
    }

    prepareArrayControls(parsed) {
        const beneficiaries = getValue(parsed, ['companyInformation', 'beneficiaries']);
        const holders = getValue(parsed, ['bankingInformation', 'custodianHolders']);

        const beneficiariesControl = this.form.get(['companyInformation', 'beneficiaries']);
        if (beneficiaries.length > 0) {
            beneficiariesControl.controls.splice(0);
            for (let i = 0; i < beneficiaries.length; i += 1) {
                beneficiariesControl.push(this.newRequestService.createBeneficiary());
            }
        }

        const holdersControl = this.form.get(['bankingInformation', 'custodianHolders']);
        if (holders.length > 1) {
            holdersControl.controls.splice(0);
            for (let i = 0; i < holders.length; i += 1) {
                holdersControl.push(this.newRequestService.createHolder());
            }
        }
    }

    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/identification',
            this.form,
            this.newRequestService.context,
            {
                reset : false,
                returnPromise: true,
            },
        ).then(() => {
            this.beneficiaryService.updateStakeholdersValidity(this.form.get('companyInformation.beneficiaries'));

            this.ngRedux.dispatch(setMyKycRequestedPersist('identification'));
        });
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/identification',
            this.newRequestService.createIdentificationFormGroup(),
            this.newRequestService.context,
        );
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.form.valid) {
            return;
        }

        this.requests$
            .pipe(take(1))
            .subscribe((requests) => {
                this.identificationService.sendRequest(this.form, requests, this.connectedWallet).then(() => {
                    this.clearPersistForm();
                });
            });
    }

    checkCompletion() {
        const general = this.form.get('generalInformation');
        const company = this.form.get('companyInformation');
        const banking = this.form.get('bankingInformation');

        return general.valid && company.valid && banking.valid;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
