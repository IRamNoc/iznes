import { Component, OnInit, Input, OnDestroy, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { isEmpty, castArray } from 'lodash';
import { select } from '@angular-redux/store';
import { Subject, BehaviorSubject } from 'rxjs';
import { filter as rxFilter, map, take, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { formHelper } from '@setl/utils/helper';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';
import { DocumentsService, documentFormPaths } from './documents.service';
import { KycMyInformations } from '@ofi/ofi-main/ofi-store/ofi-kyc/my-informations';
import { DocumentPermissions, DocumentMetaCache } from './documents.model';

@Component({
    selector: 'kyc-step-documents',
    templateUrl: './documents.component.html',
})
export class NewKycDocumentsComponent implements OnInit, OnDestroy {
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformations: Observable<KycMyInformations>;

    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @Input() form: FormGroup;
    @Input() isFormReadonly = false;

    // Permissions passed in from the parent component.
    @Input('documents') public documentPermissions: DocumentPermissions;

    // An object used to caache document meta info.
    private documentsMetaCache: DocumentMetaCache = {};

    open;
    unsubscribe: Subject<any> = new Subject();
    connectedWallet;
    investorType: number;
    isNowCP: boolean = false;
    /** Allowed file types passed to FileDrop */
    public allowedFileTypes: string[] = ['application/pdf'];
    // data is fetched from database, and patched value to formgroup.
    formDataFilled$ = new BehaviorSubject<boolean>(false);

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        private documentsService: DocumentsService,
        private changeDetectorRef : ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.initData();
        this.getCurrentFormData();
    }

    initSubscriptions() {
        this.kycMyInformations
            .takeUntil(this.unsubscribe)
            .subscribe((d) => {
                this.investorType = d.investorType;

                if (this.investorType === 70 || this.investorType === 80) {
                    this.isNowCP = true;
                }
            });
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
                this.submitEvent.emit({ updateView: true }); // Update the view
            });
        }
    }

    /**
     * Returns a boolean denoting whether this document should be shown.
     *
     * @param docName {string} - The code name of the document to check.
     *
     * @return {boolean}
     */
    public showDocument(docName: string): boolean {
        return this.getDocumentMeta(docName).shouldShow || false;
    }

    /**
     * Returns a boolean denoting whether this document should be optional or required.
     *
     * @param docName {string} - The code name of the document to check.
     *
     * @return {boolean}
     */
    public isDocumentRequired (docName: string): boolean {
        return this.getDocumentMeta(docName).required || false;
    }

    /**
     * Queries for a whether a document is viewable or optional.
     *
     * @param docName {string} - The code name of the document to check.
     *
     * @return {{ shouldShow: boolean; required: boolean; }}
     */
    private getDocumentMeta (docName: string): {
        shouldShow: boolean;
        required: boolean
    } {
        // If not in cache...
        if (! this.documentsMetaCache[docName]) {
            // ...fetch it.
            this.documentsMetaCache[docName] =
            this.documentsService.shouldShowDocument(
                docName,
                this.documentPermissions,
            );
        }

        // Disable formControl if not to show.
        if (! this.documentsMetaCache[docName].shouldShow) {
            this.form.get('common').get(docName).disable();
        }

        return this.documentsMetaCache[docName];
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
                    this.formDataFilled$.next(true);
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
