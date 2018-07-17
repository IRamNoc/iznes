import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {PersistService} from '@setl/core-persist';
import {isEmpty, castArray} from 'lodash';
import {select} from '@angular-redux/store';
import {Subject} from 'rxjs';
import {filter as rxFilter, map, take, takeUntil} from 'rxjs/operators';

import {RequestsService} from '../../requests.service';
import {NewRequestService} from '../new-request.service';
import {DocumentsService, documentFormPaths} from './documents.service';
import {steps} from "../../requests.config";

@Component({
    selector: 'kyc-step-documents',
    templateUrl: './documents.component.html'
})
export class NewKycDocumentsComponent implements OnInit, OnDestroy {

    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @Input() form: FormGroup;

    @Input() set isListedCompany(isCompany) {
        if (isCompany) {
            (this.form.get('other') as FormGroup).disable();
            (this.form.get('listedCompany') as FormGroup).enable();
        }
        else {
            (this.form.get('other') as FormGroup).enable();
            (this.form.get('listedCompany') as FormGroup).disable();
        }
    };

    open;
    unsubscribe: Subject<any> = new Subject();
    connectedWallet;

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        private persistService: PersistService,
        private documentsService: DocumentsService
    ) {
    }

    ngOnInit() {
        this.initData();
        this.initSubscriptions();
        this.getCurrentFormData();
    }

    initSubscriptions() {
        this.requests$
            .pipe(
                takeUntil(this.unsubscribe),
                map(kycs => kycs[0]),
                rxFilter((kyc: any) => {
                    return kyc && kyc.completedStep
                })
            )
            .subscribe(kyc => {
                if (steps[kyc.completedStep] < steps.documents) {
                    this.persistForm();
                }
            })
        ;
    }

    initData() {
        this.connectedWallet$
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(connectedWallet => {
                this.connectedWallet = connectedWallet;
            })
        ;
    }

    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/documents',
            this.form,
            this.newRequestService.context
        );
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/documents',
            this.newRequestService.createDocumentsFormGroup(),
            this.newRequestService.context
        );
    }

    uploadFile($event, formControl) {
        this.requestsService.uploadFile($event).then((file: any) => {
            formControl.get('hash').patchValue(file.fileHash);
            formControl.get('name').patchValue(file.fileTitle);
        });
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
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
                this.documentsService.sendRequest(this.form, requests, this.connectedWallet);

                this.clearPersistForm();
            });

        return;
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
                    this.documentsService.getCurrentFormDocumentsData(request.kycID, this.connectedWallet).then((data) => {
                        // Patch the global document data followed by the kyc form data
                        data.forEach((formData, index) => {
                            formData.forEach(value => {
                                let type = value.type;
                                let shouldContinue = (index === 1 || (index === 0 && value.common));

                                if (type && shouldContinue) {
                                    let path = documentFormPaths[type];
                                    let control = this.form.get([path, type]);

                                    control.patchValue(value);
                                }
                            });

                        });

                        this.form.updateValueAndValidity();
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
