import { Component, OnInit, Input, OnDestroy, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { isEmpty, castArray } from 'lodash';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { filter as rxFilter, map, take, takeUntil } from 'rxjs/operators';
import { PersistService } from '@setl/core-persist';
import { formHelper } from '@setl/utils/helper';

import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';
import { DocumentsService, documentFormPaths } from './documents.service';
import { steps } from '../../requests.config';

@Component({
    selector: 'kyc-step-documents',
    templateUrl: './documents.component.html',
})
export class NewKycDocumentsComponent implements OnInit, OnDestroy {
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @Input() form: FormGroup;

    @Input() set documents(documents) {
        const listedDocuments = this.form.get('listed');
        const floatableDocument = this.form.get('listed.kycevidencefloatable');
        const regulatedDocuments = this.form.get('regulated');
        const nowcpDocuments = this.form.get('nowcp');

        floatableDocument.disable();
        listedDocuments.disable();
        regulatedDocuments.disable();
        nowcpDocuments.disable();

        if (documents.isListed) {
            listedDocuments.enable();

            if (documents.isFloatableHigh) {
                floatableDocument.enable();
            } else {
                floatableDocument.disable();
            }
        }

        if (documents.isRegulated) {
            regulatedDocuments.enable();
        }

        if (documents.isNowCp) {
            nowcpDocuments.enable();
        }
    }

    open;
    unsubscribe: Subject<any> = new Subject();
    connectedWallet;

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        private persistService: PersistService,
        private documentsService: DocumentsService,
        private changeDetectorRef : ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.initData();
        this.getCurrentFormData();
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
    }

    shouldPersist(kyc) {
        if (kyc.context === 'done') {
            return false;
        }
        return !kyc.completedStep || (steps[kyc.completedStep] < steps.documents);
    }

    initData() {
        this.connectedWallet$
        .pipe(
            takeUntil(this.unsubscribe),
        )
        .subscribe((connectedWallet) => {
            this.connectedWallet = connectedWallet;
        });
    }

    persistForm() {
        this.persistService.watchForm(
            'newkycrequest/documents',
            this.form,
            this.newRequestService.context,
            {
                reset: false,
            },
        );
    }

    clearPersistForm() {
        this.persistService.refreshState(
            'newkycrequest/documents',
            this.newRequestService.createDocumentsFormGroup(),
            this.newRequestService.context,
        );
    }

    uploadFile($event, formControl: AbstractControl) {
        const fControl = <FormControl> formControl;

        if (!$event.files.length) {
            const type = formControl.get('type').value;
            const newDocumentControl = this.newRequestService.createDocumentFormGroup(type).value;
            formControl.patchValue(newDocumentControl);
        } else {
            this.requestsService.uploadFile($event).then((file: any) => {
                fControl.get('hash').patchValue(file.fileHash);
                fControl.get('name').patchValue(file.fileTitle);
            });
        }
    }

    isDisabled(path) {
        const control = this.form.get(path);

        return control.disabled;
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
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
        .subscribe((requests) => {
            this
                .documentsService
                .sendRequest(this.form, requests, this.connectedWallet)
                .then(() => {
                    this.clearPersistForm();
                    this.submitEvent.emit({
                        completed: true,
                    });
                })
                .catch(() => {
                    this.newRequestService.errorPop();
                })
            ;

        });

        return;
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
                this.documentsService.getCurrentFormDocumentsData(request.kycID, this.connectedWallet).then((data) => {
                    // Patch the global document data followed by the kyc form data
                    data.forEach((formData, index) => {
                        formData.forEach((value) => {
                            const type = value.type;
                            const shouldContinue = (index === 1 || (index === 0 && value.common));
                            const path = documentFormPaths[type];
                            const control = this.form.get([path, type]);

                            if (type && shouldContinue && control) {
                                control.patchValue(value);
                            }
                        });
                    });

                    this.form.updateValueAndValidity();
                    this.changeDetectorRef.markForCheck();
                    this.initSubscriptions();
                });
            });
        });
    }

    getDocumentPreset(formItem: string[]) {
        const value = this.form.get(formItem).value;

        return !value.hash ? undefined : value;
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
