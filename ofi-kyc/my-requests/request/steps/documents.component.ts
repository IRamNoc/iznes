import { Component, OnInit, Input, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { PersistService } from '@setl/core-persist';
import { isEmpty, castArray } from 'lodash';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { filter as rxFilter, map, take, takeUntil } from 'rxjs/operators';
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
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @Input() form: FormGroup;

    @Input() set isPro(isPro) {
        if (isPro) {
            (this.form.get('other') as FormGroup).disable();
            (this.form.get('pro') as FormGroup).enable();
        }
        else {
            (this.form.get('other') as FormGroup).enable();
            (this.form.get('pro') as FormGroup).disable();
        }
        this.formPercent.refreshFormPercent();
    };

    open;
    unsubscribe: Subject<any> = new Subject();
    connectedWallet;

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        private persistService: PersistService,
        private documentsService: DocumentsService,
        private changeDetectorRef: ChangeDetectorRef,
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
        formControl = <FormControl> formControl;

        if (!$event.files.length) {
            const type = formControl.get('type').value;
            const newDocumentControl = this.newRequestService.createDocumentFormGroup(type).value;
            formControl.patchValue(newDocumentControl);
        } else {
            this.requestsService.uploadFile($event).then((file: any) => {
                formControl.get('hash').patchValue(file.fileHash);
                formControl.get('name').patchValue(file.fileTitle);
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
            return;
        }

        this.requests$
            .pipe(
                take(1),
            )
            .subscribe((requests) => {
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

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
