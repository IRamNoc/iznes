import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {Router} from '@angular/router';
import {Subject, combineLatest} from 'rxjs';
import {filter as rxFilter, map, take, takeUntil} from 'rxjs/operators';
import {isEmpty, find, get as getValue, castArray} from 'lodash';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import * as moment from 'moment';

import {PersistService} from '@setl/core-persist';
import {RequestsService} from '../../requests.service';
import {NewRequestService, configDate} from '../new-request.service';
import {ValidationService} from './validation.service';
import {DocumentsService} from './documents.service';
import {steps} from "../../requests.config";
import { ClearMyKycListRequested } from '@ofi/ofi-main/ofi-store/ofi-kyc';

@Component({
    selector: 'kyc-step-validation',
    templateUrl: './validation.component.html',
    styleUrls: ['./validation.component.scss']
})
export class NewKycValidationComponent implements OnInit, OnDestroy {

    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;

    unsubscribe: Subject<any> = new Subject();
    amcs = [];
    configDate;
    connectedWallet;
    open = true;

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        private validationService: ValidationService,
        private alerts: AlertsService,
        private router: Router,
        private persistService: PersistService,
        private documentsService: DocumentsService,
        private ngRedux: NgRedux<any>
    ) {
    }

    ngOnInit() {
        this.initData();
        this.getCurrentFormData();
        this.initSubscriptions();

        this.configDate = configDate;
        this.form.get('doneDate').patchValue(moment().format(this.configDate.format));
    }

    initSubscriptions(){
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
            })
            ;
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
                reset: false
            }
        );
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/validation',
            this.newRequestService.createValidationFormGroup(),
            this.newRequestService.context
        )
    }

    initData() {
        combineLatest(
            this.requests$,
            this.managementCompanyList$
        )
            .pipe(
                takeUntil(this.unsubscribe),
            )
            .subscribe(([requests, managementCompanyList]) => {
                const managementCompanies = managementCompanyList.toJS();

                if (!isEmpty(requests) && !isEmpty(managementCompanies)) {
                    this.getCompanyNames(requests, managementCompanies);
                }
            })
        ;

        this.connectedWallet$
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(connectedWallet => {
                this.connectedWallet = connectedWallet;
            })
        ;
    }

    getCompanyNames(requests, managementCompanyList) {
        this.amcs = [];
        requests.forEach(request => {
            let company = find(managementCompanyList, ['companyID', request.amcID]);
            let companyName = getValue(company, 'companyName');

            if (companyName) {
                this.amcs.push({
                    amcID: request.amcID,
                    companyName: companyName
                });
            }
        });
    }

    handleConfirm() {
        let bodyMessage;

        if (this.amcs.length == 1) {
            let companyName = getValue(this.amcs, ['0', 'companyName']);
            bodyMessage = `<p>Your request has been successfully sent to ${companyName}. Once they will have validated your request, you will be able to start trading on IZNES on ${companyName}'s products.</p>`;
        }
        else {
            let companies = ['<ul>'];
            this.amcs.forEach(amc => {
                let companyText = `<li>${amc.companyName}</li>`;
                companies.push(companyText);
            });
            companies.push('</ul>');

            bodyMessage = `<p>Your request has been successfully sent to the following asset management companies:</p> ${companies.join('')} <p>Once they will have validated your request, you will be able to start trading on IZNES these asset management companies' products.</p>`;
        }

        this.alerts.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-success">${bodyMessage}</td>
                    </tr>
                </tbody>
            </table>
        `).pipe(
            take(1)
        ).subscribe(() => {
            this.router.navigate(['my-requests', 'list']).then(() => {
                this.ngRedux.dispatch(ClearMyKycListRequested());
            });
        });
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
                this.validationService.sendRequest(this.form, requests, this.connectedWallet).then(() => {
                    this.handleConfirm();
                });
            });
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }

    uploadFile($event) {
        this.requestsService.uploadFile($event).then((file: any) => {
            this.form.get('electronicSignatureDocument.hash').patchValue(file.fileHash);
            this.form.get('electronicSignatureDocument.name').patchValue(file.fileTitle);
            this.form.get('electronicSignatureDocument.kycDocumentID').patchValue('');
        });
    }

    getCurrentFormData() {
        this.requests$
            .pipe(
                rxFilter(requests => !isEmpty(requests)),
                map(requests => castArray(requests[0])),
                takeUntil(this.unsubscribe)
            )
            .subscribe(requests => {
                requests.forEach(request => {
                    this.validationService.getCurrentFormValidationData(request.kycID).then(formData => {
                        if(formData){
                            this.form.patchValue(formData);

                            if(formData.electronicSignatureDocumentID){
                                this.documentsService.getDocument(formData.electronicSignatureDocumentID).then(document => {
                                    let control = this.form.get('electronicSignatureDocument');
                                    if(document){
                                        control.patchValue(document);
                                    }
                                });
                            }
                        }
                    });
                });
            })
        ;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
