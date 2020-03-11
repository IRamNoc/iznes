import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { filter as rxFilter, map, take, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { isEmpty, find, get as getValue, castArray } from 'lodash';
import * as moment from 'moment';

import { ValidationService } from './validation.service';
import { DocumentsService } from './documents.service';
import { NewRequestService, configDate } from '../new-request.service';
import { RequestsService } from '../../requests.service';
import { getPartyNameFromInvestorType } from '../../kyc-form-helper';
import { KycFormHelperService } from '../../kyc-form-helper.service';
import { OfiKycService } from '../../../../../ofi-main/ofi-req-services/ofi-kyc/service';
import { ClearMyKycListRequested } from '../../../../../ofi-main/ofi-store/ofi-kyc';
import { KycMyInformations } from '../../../../../ofi-main/ofi-store/ofi-kyc/my-informations';
import { MultilingualService } from '../../../../../multilingual';
import { AlertsService } from '../../../../../jaspero-ng2-alerts';
import { formHelper } from '../../../../../utils/helper';

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
    public invitedAs: 'iznes'|'id2s'|'nowcp';
    public isOnlyNowCP: boolean;
    firstName: string;
    investorInformationRequested: boolean = false;
    fadeIn: boolean = false;
    signingAuthorityList: any[];

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        private validationService: ValidationService,
        private alerts: AlertsService,
        private router: Router,
        private documentsService: DocumentsService,
        private ngRedux: NgRedux<any>,
        public translate: MultilingualService,
        public ofiKycService: OfiKycService,
        private changeDetector: ChangeDetectorRef,
        public formHelper: KycFormHelperService,
    ) {}

    ngOnInit() {
        this.initData();
        this.getCurrentFormData();
        this.initSubscriptions();
        this.handlePartyFields();
        this.configDate = configDate;
    }

    initSubscriptions() {

        /* Subscribe for this user's connected info. */
        this.kycMyInformations.takeUntil(this.unsubscribe)
        .subscribe((d) => {
            if (!this.investorInformationRequested) {
                this.investorInformationRequested = true;
                return this.ofiKycService.fetchInvestor();
            }
            this.invitedAs = getPartyNameFromInvestorType(d.investorType);
            this.firstName = d.firstName;
        });
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

    async handlePartyFields() {
        this.isOnlyNowCP = await this.formHelper.onlyNowCP$.toPromise();

        // Set signing authority list
        this.signingAuthorityList = this.translate.translate(this.isOnlyNowCP
            ? this.newRequestService.signingAuthorityNowCPList
            : this.newRequestService.signingAuthorityDefaultList);

        // Disable electronicSignatureDocument for NowCP
        if (this.isOnlyNowCP) this.form.get('electronicSignatureDocument').disable();
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
        if (this.showKYCComplete) this.fadeInContent();

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
                        const todaysDate = moment().format(this.configDate.format);

                        if (formData) {
                            formData.doneDate = todaysDate;
                            this.form.patchValue(formData);

                                if (formData.electronicSignatureDocumentID){
                                    this.documentsService.getDocument(formData.electronicSignatureDocumentID).then((document) => {
                                        const control = this.form.get('electronicSignatureDocument');

                                        if(document){
                                        control.patchValue(document);
                                    }
                                });
                            }
                            return;
                        }

                        this.form.get('doneDate').patchValue(todaysDate);
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

    /**
     * Fades in once the max-height of the content has been set
     *
     * @returns {void}
     */
    private fadeInContent(): void {
        setTimeout(() => {
            this.fadeIn = true;
            this.changeDetector.detectChanges();
        }, 200);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
