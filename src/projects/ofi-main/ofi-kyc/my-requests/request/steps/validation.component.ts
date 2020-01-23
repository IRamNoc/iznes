import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { filter as rxFilter, map, take, takeUntil } from 'rxjs/operators';
import { isEmpty, find, get as getValue, castArray } from 'lodash';
import * as moment from 'moment';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { PersistService } from '@setl/core-persist';
import { formHelper } from '@setl/utils/helper';

import { RequestsService } from '../../requests.service';
import { NewRequestService, configDate } from '../new-request.service';
import { ValidationService } from './validation.service';
import { DocumentsService } from './documents.service';
import { steps } from '../../requests.config';
import { ClearMyKycListRequested } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { MultilingualService } from '@setl/multilingual';
import { KycMyInformations } from '@ofi/ofi-main/ofi-store/ofi-kyc/my-informations';
import { Observable } from 'rxjs/Observable';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';

@Component({
    selector: 'kyc-step-validation',
    templateUrl: './validation.component.html',
    styleUrls: ['./validation.component.scss'],
})
export class NewKycValidationComponent implements OnInit, OnDestroy {
    @Input() form;
    @Input() hasClientFile = false;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();

    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformations: Observable<KycMyInformations>;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;

    unsubscribe: Subject<any> = new Subject();
    amcs = [];
    configDate;
    connectedWallet;
    open = true;
    showKYCComplete: boolean = false;
    isNowCP: boolean = false;
    firstName: string;
    investorInformationRequested: boolean = false;

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        private validationService: ValidationService,
        private alerts: AlertsService,
        private router: Router,
        private persistService: PersistService,
        private documentsService: DocumentsService,
        private ngRedux: NgRedux<any>,
        public translate: MultilingualService,
        public ofiKycService: OfiKycService,
    ) {
    }

    ngOnInit() {
        this.initData();
        this.getCurrentFormData();
        this.initSubscriptions();

        this.configDate = configDate;
        this.form.get('doneDate').patchValue(moment().format(this.configDate.format));
    }

    initSubscriptions() {
        this.requests$
        .pipe(
            takeUntil(this.unsubscribe),
            map(kycs => kycs[0]),
            rxFilter((kyc: any) => {
                return kyc && kyc.amcID;
            }),
            )
            .subscribe((kyc) => {
                if (this.shouldPersist(kyc)) {
                    this.persistForm();
                }
            });

        /* Subscribe for this user's connected info. */
        this.kycMyInformations.takeUntil(this.unsubscribe)
        .subscribe((d) => {
            if (!this.investorInformationRequested) {
                this.investorInformationRequested = true;
                return this.ofiKycService.fetchInvestor();
            }
            this.isNowCP = d.investorType === 70 || d.investorType === 80;
            this.firstName = d.firstName;
        });
    }

    shouldPersist(kyc) {
        if (kyc.context === 'done') {
            return false;
        }
        return !kyc.completedStep || (steps[kyc.completedStep] < steps.validation);
    }

    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/validation',
            this.form,
            this.newRequestService.context,
            {
                reset: false,
            },
        );
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/validation',
            this.newRequestService.createValidationFormGroup(),
            this.newRequestService.context,
        );
    }

    initData() {
        combineLatest(
            this.requests$,
            this.managementCompanyList$,
        )
        .pipe(
            takeUntil(this.unsubscribe),
        )
        .subscribe(([requests, managementCompanyList]) => {
            const managementCompanies = managementCompanyList.toJS();

            if (!isEmpty(requests) && !isEmpty(managementCompanies)) {
                this.getCompanyNames(requests, managementCompanies);
            }
            });

        this.connectedWallet$
        .pipe(
                takeUntil(this.unsubscribe),
        )
        .subscribe((connectedWallet) => {
            this.connectedWallet = connectedWallet;
            });
    }

    getCompanyNames(requests, managementCompanyList) {
        this.amcs = [];
        requests.forEach((request) => {
            const company = find(managementCompanyList, ['companyID', request.amcID]);
            const companyName = getValue(company, 'companyName');

            if (companyName) {
                this.amcs.push({
                    amcID: request.amcID,
                    companyName,
                });
            }
        });
    }

    handleConfirm(closed = false, startAgain = false) {
        this.showKYCComplete = !closed;

        if (closed) {
            this.router.navigate(['onboarding-requests', 'list'])
            .then(() => {
                this.ngRedux.dispatch(ClearMyKycListRequested());
                // Maybe find a better way to do this if we have time
                if (startAgain) setTimeout(() => this.router.navigate(['onboarding-requests', 'onboard-iznes']), 200);
            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.form.valid) {
            formHelper.dirty(this.form);
            return;
        }

        this.requests$
        .pipe(
                take(1),
        )
        .subscribe(async (requests) => {
            // Send requests one after another.
            try {
                for (const req of requests) {
                    await this.validationService.sendRequest(this.form, req, this.connectedWallet);
                }

                this.handleConfirm(this.hasClientFile);
                this.submitEvent.emit({
                    completed: true,
                });
            } catch(e) {
                this.newRequestService.errorPop();
            }
        });
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    isDisabled(path) {
        const control = this.form.get(path);

        return control.disabled;
    }

    uploadFile($event) {
        this.requestsService.uploadFile($event).then((file: any) => {
            this.form.get('electronicSignatureDocument.hash').patchValue(file.fileHash);
            this.form.get('electronicSignatureDocument.name').patchValue(file.fileTitle);
            this.form.get('electronicSignatureDocument.kycDocumentID').patchValue('');
            this.submitEvent.emit({ updateView: true });
        });
    }

    getCurrentFormData() {
        this.requests$
        .pipe(
            rxFilter(requests => !isEmpty(requests)),
            map(requests => castArray(requests[0])),
                takeUntil(this.unsubscribe),
        )
            .subscribe((requests) => {
                requests.forEach((request) => {
                    this.validationService.getCurrentFormValidationData(request.kycID).then((formData) => {
                        if(formData){
                        this.form.patchValue(formData);

                            if(formData.electronicSignatureDocumentID){
                                this.documentsService.getDocument(formData.electronicSignatureDocumentID).then((document) => {
                                    const control = this.form.get('electronicSignatureDocument');

                                    if(document){
                                    control.patchValue(document);
                                }
                            });
                        }
                    }
                });
            });
            });
    }

    /* isStepValid
     * - this gets run by the form-steps component to enable/disable the next button
     */
    isStepValid() {
        return this.form.valid;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
