/* Core/Angular imports. */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    Inject,
    OnInit,
    AfterViewInit,
} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
/* Redux */
import { NgRedux, select } from '@angular-redux/store';
import { fromJS } from 'immutable';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators'
import { MultilingualService } from '@setl/multilingual';

import * as _ from 'lodash';
import * as SagaHelper from '@setl/utils/sagaHelper';
import { ToasterService } from 'angular2-toaster';
import { FileService } from '@setl/core-req-services/file/file.service';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { ofiClearRequestedMyDocuments } from '@ofi/ofi-main/ofi-store/ofi-kyc/inv-my-documents';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    animations: [
        trigger('fade', [

            state('in', style({ opacity: 1 })),

            transition(':enter', [
                style({ opacity: 0 }),
                animate(600),
            ]),

            transition(
                ':leave',
                animate(
                    600,
                    style(
                        { opacity: 0 },
                    ),
                ),
            ),
        ]),
    ],
})
export class OfiInvMyDocumentsComponent implements OnDestroy, OnInit, AfterViewInit {
    public uploadMyDocumentsForm: FormGroup;
    public connectedWalletId: number;
    public subscriptions: Array<any> = [];

    allUploadsFiles: any = [];
    nbUploads = 11;
    filesFromRedux = [];
    kycDocPath: string = '/iznes/kyc-inv-docs';
    kycEnums = [
        'kycstatuscertifieddoc',
        'kyckbisdoc',
        'kycannualreportdoc',
        'kycidorpassportdoc',
        'kycwolfsbergdoc',
        'kyctaxcertificationdoc',
        'kycw8benefatcadoc',
        'kycisincodedoc',
        'kycevidencefloatable',
        'kycproofofapprovaldoc',
        'kycproofregulationdoc',
    ];
    changed = {};

    unSubscribe: Subject<any> = new Subject();

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['ofi', 'ofiKyc', 'invMyDocuments', 'requested']) requestedOfiInvMyDocsOb;
    @select(['ofi', 'ofiKyc', 'invMyDocuments', 'myDocumentsList']) OfiInvMyDocsListOb;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private translate: MultilingualService,
        private fileService: FileService,
        private ofiKycService: OfiKycService,
        private toaster: ToasterService,
        private ngRedux: NgRedux<any>,
    ) {
        this.kycEnums.forEach((doc) => {
            this.allUploadsFiles[doc] = {
                fileID: 0,
                hash: '',
                name: '',
                type: doc,
                common: 0,
                isDefault: 1,
                preset: {
                    fileID: 0,
                    hash: '',
                    name: '',
                },
                saved: false,
            };

            this.changed[doc] = false;
        });

        this.uploadMyDocumentsForm = new FormGroup({
            shareAll: new FormControl(false),
            upload1: new FormControl([]),
            shareUpload1: new FormControl(false),
            upload2: new FormControl([]),
            shareUpload2: new FormControl(false),
            upload3: new FormControl([]),
            shareUpload3: new FormControl(false),
            upload4: new FormControl([]),
            shareUpload4: new FormControl(false),
            upload5: new FormControl([]),
            shareUpload5: new FormControl(false),
            upload6: new FormControl([]),
            shareUpload6: new FormControl(false),
            upload7: new FormControl([]),
            shareUpload7: new FormControl(false),
            upload8: new FormControl([]),
            shareUpload8: new FormControl(false),
            upload9: new FormControl([]),
            shareUpload9: new FormControl(false),
            upload10: new FormControl([]),
            shareUpload10: new FormControl(false),
            upload11: new FormControl([]),
            shareUpload11: new FormControl(false),
        });
    }

    ngOnInit() {
        this.connectedWalletOb
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(connected => {
                this.connectedWalletId = connected;

                this.requestedOfiInvMyDocsOb
                    .pipe(
                        takeUntil(this.unSubscribe),
                    )
                    .subscribe((requested) => this.requestedOfiInvMyDocs(requested));

                this.OfiInvMyDocsListOb
                    .pipe(
                        takeUntil(this.unSubscribe),
                    )
                    .subscribe((list) => this.getMyDocumentsFromRedux(list));
            });

        this.uploadMyDocumentsForm.controls.upload1.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(() => {
                this.deleteDocument(this.allUploadsFiles['kycproofofapprovaldoc'].fileID);
            });

        this.uploadMyDocumentsForm.controls.upload2.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(() => {
                this.deleteDocument(this.allUploadsFiles['kycisincodedoc'].fileID);
            });

        this.uploadMyDocumentsForm.controls.upload3.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(() => {
                this.deleteDocument(this.allUploadsFiles['kycwolfsbergdoc'].fileID);
            });

        this.uploadMyDocumentsForm.controls.upload4.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(() => {
                this.deleteDocument(this.allUploadsFiles['kycstatuscertifieddoc'].fileID);
            });

        this.uploadMyDocumentsForm.controls.upload5.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(() => {
                this.deleteDocument(this.allUploadsFiles['kyckbisdoc'].fileID);
            });

        this.uploadMyDocumentsForm.controls.upload6.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(() => {
                this.deleteDocument(this.allUploadsFiles['kycannualreportdoc'].fileID);
            });

        this.uploadMyDocumentsForm.controls.upload7.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(() => {
                this.deleteDocument(this.allUploadsFiles['kycidorpassportdoc'].fileID);
            });

        this.uploadMyDocumentsForm.controls.upload8.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(() => {
                this.deleteDocument(this.allUploadsFiles['kyclistshareholdersdoc'].fileID);
            });

        this.uploadMyDocumentsForm.controls.upload9.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(() => {
                this.deleteDocument(this.allUploadsFiles['kyclistdirectorsdoc'].fileID);
            });

        this.uploadMyDocumentsForm.controls.upload10.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(() => {
                this.deleteDocument(this.allUploadsFiles['kyclistauthoriseddoc'].fileID);
            });

        this.uploadMyDocumentsForm.controls.upload11.valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(() => {
                this.deleteDocument(this.allUploadsFiles['kycbeneficialownersdoc'].fileID);
            });
    }

    ngAfterViewInit() {
        const allFileDrop = document.getElementsByClassName('drop-file-nofile') as HTMLCollectionOf<HTMLElement>;
        for (const i in allFileDrop) {
            if (allFileDrop[i] && allFileDrop[i] !== undefined) {
                if (allFileDrop[i].tagName === 'DIV') {
                    allFileDrop[i].style.zIndex = '0';
                    allFileDrop[i].style.pointerEvents = 'none';
                }
            }
        }
    }

    requestedOfiInvMyDocs(requested): void {
        if (!requested) {
            OfiKycService.defaultRequestGetInvKycDocuments(this.ofiKycService, this.ngRedux, {
                walletID: this.connectedWalletId,
                kycID: 0,
            });
        }
    }

    markAsChanged(doc) {
        if (this.changed[doc] !== undefined) {
            const timer = setTimeout(
                () => {
                    this.changed[doc] = false;
                    this.changeDetectorRef.detectChanges();
                },
                2000,
            );

            if (this.changed[doc]) {
                clearTimeout(this.changed[doc]);
            }

            this.changed[doc] = timer;
        }
    }

    getMyDocumentsFromRedux(list) {
        const listImu = fromJS(list);
        this.filesFromRedux = listImu.reduce((result, item) => {
            result.push({
                kycID: item.get('kycID'),
                kycDocumentID: item.get('kycDocumentID'),
                walletID: item.get('walletID'),
                name: item.get('name'),
                hash: item.get('hash'),
                type: item.get('type'),
                common: item.get('common'),
                isDefault: item.get('default'),
            });
            return result;
        }, []);

        let allChecked = true;
        for (const i in this.allUploadsFiles) {
            for (const j in this.filesFromRedux) {
                if (this.allUploadsFiles[i].type === this.filesFromRedux[j].type) {
                    if (this.filesFromRedux[j].common !== 1) {
                        allChecked = false;
                    }
                    this.allUploadsFiles[i] = {
                        fileID: this.filesFromRedux[j].kycDocumentID,
                        hash: this.filesFromRedux[j].hash,
                        name: this.filesFromRedux[j].name,
                        type: this.filesFromRedux[j].type,
                        common: this.filesFromRedux[j].common,
                        isDefault: 1,
                        preset: {
                            fileID: this.filesFromRedux[j].kycDocumentID,
                            hash: this.filesFromRedux[j].hash,
                            name: this.filesFromRedux[j].name,
                        },
                        saved: false,
                    };
                }
            }
            if (this.filesFromRedux.length == 0 && this.allUploadsFiles[i].common !== 1) {
                allChecked = false;
            }
        }
        if (allChecked) {
            this.uploadMyDocumentsForm.get('shareAll').patchValue(true, { emitEvent: false });
        } else {
            this.uploadMyDocumentsForm.get('shareAll').patchValue(false, { emitEvent: false });
        }

        this.changeDetectorRef.markForCheck();
    }

    assignAllToggles() {
        for (let i = 0; i < this.nbUploads; i++) {
            this.uploadMyDocumentsForm.get('shareUpload' + (i + 1)).patchValue(this.uploadMyDocumentsForm.get('shareAll').value, { emitEvent: false });
        }
        for (const i in this.allUploadsFiles) {
            this.allUploadsFiles[i].common = (this.uploadMyDocumentsForm.get('shareAll').value) ? 1 : 0;
            this.saveFileInDatabase(i);
        }
        this.changeDetectorRef.markForCheck();
    }

    checkToggles(fileRelated, value) {
        let isAllChecked = true;
        for (let i = 0; i < this.nbUploads; i++) {
            if (this.uploadMyDocumentsForm.get('shareUpload' + (i + 1)).value === false || this.uploadMyDocumentsForm.get('shareUpload' + (i + 1)).value === 0) {
                isAllChecked = false;
            }
        }
        if (isAllChecked) {
            if (this.uploadMyDocumentsForm.get('shareAll').value === true || this.uploadMyDocumentsForm.get('shareAll').value === 1) {
                for (let i = 0; i < this.nbUploads; i++) {
                    this.uploadMyDocumentsForm.get('shareUpload' + (i + 1)).patchValue(true, { emitEvent: false });
                }
                for (const i in this.allUploadsFiles) {
                    this.allUploadsFiles[i].common = 1;
                }
            } else {
                this.uploadMyDocumentsForm.get('shareAll').patchValue(true, { emitEvent: false });
                for (const i in this.allUploadsFiles) {
                    this.allUploadsFiles[i].common = 1;
                }
            }
            this.saveFileInDatabase(fileRelated);
        } else {
            this.uploadMyDocumentsForm.get('shareAll').patchValue(false, { emitEvent: false });
            this.allUploadsFiles[fileRelated].common = (value) ? 1 : 0;
            this.saveFileInDatabase(fileRelated);
        }
        this.changeDetectorRef.markForCheck();
    }

    getUpload(event, fileRelated) {
        console.log('send', event, fileRelated);
        this.uploadFile(event, fileRelated, this.changeDetectorRef);
    }

    uploadFile(event, fileRelated, changeDetectorRef: ChangeDetectorRef): void {
        // save file into server
        const asyncTaskPipe = this.fileService.addFile({
            files: _.filter(event.files, (file) => {
                return file.status !== 'uploaded-file';
            }),
            // secure: true,
            // path: '/iznes/kyc-inv-docs',
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                if (data[1] && data[1].Data) {
                    let errorMessage;

                    _.each(data[1].Data, (file) => {
                        if (file.error) {
                            errorMessage = file.error;
                            event.target.updateFileStatus(file.id, 'file-error');
                        } else {
                            event.target.updateFileStatus(file[0].id, 'uploaded-file');

                            this.allUploadsFiles[fileRelated].fileID = file[0].fileID;
                            this.allUploadsFiles[fileRelated].hash = file[0].fileHash;
                            this.allUploadsFiles[fileRelated].name = file[0].fileTitle;
                            this.allUploadsFiles[fileRelated].preset = {
                                fileID: file[0].fileID,
                                hash: file[0].fileHash,
                                name: file[0].fileTitle,
                            };

                            // now save in database
                            this.saveFileInDatabase(fileRelated);
                        }
                    });

                    if (errorMessage) {
                        this.toaster.pop('error', this.translate.translate(errorMessage));
                    }

                    if (data[1].Data.length === 0) {
                        // removed file
                        this.allUploadsFiles[fileRelated].fileID = 0;
                        this.allUploadsFiles[fileRelated].hash = '';
                        this.allUploadsFiles[fileRelated].name = '';
                        this.allUploadsFiles[fileRelated].common = '';
                        this.allUploadsFiles[fileRelated].preset = {
                            fileID: 0,
                            hash: '',
                            name: '',
                        };
                        // based on ngModel of common
                        this.uploadMyDocumentsForm.get('shareAll').patchValue(false, { emitEvent: false });

                        // INSERT an empty file to update in database - no update SP
                        this.saveFileInDatabase(fileRelated);
                    }

                    this.markAsChanged(fileRelated);

                    changeDetectorRef.markForCheck();
                    changeDetectorRef.detectChanges();
                }
            },
            (data) => {
                let errorMessage;

                _.each(data[1].Data, (file) => {
                    if (file.error) {
                        errorMessage += file.error + '<br/>';
                        event.target.updateFileStatus(file.id, 'file-error');
                    }
                });

                if (errorMessage) {
                    if (errorMessage) {
                        this.toaster.pop('error', this.translate.translate(errorMessage));
                    }
                }
            }),
        );
    }

    saveFileInDatabase(fileRelated) {
        const asyncTaskPipe = this.ofiKycService.saveKycDocument(
            {
                walletID: this.connectedWalletId,
                name: this.allUploadsFiles[fileRelated].name,
                hash: this.allUploadsFiles[fileRelated].hash,
                type: this.allUploadsFiles[fileRelated].type,
                common: this.allUploadsFiles[fileRelated].common,
                isDefault: this.allUploadsFiles[fileRelated].default,
            });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                // success
                this.markAsChanged(fileRelated);
                this.ngRedux.dispatch(ofiClearRequestedMyDocuments());
            },
            (data) => {
                console.log('error: ', data);
            }),
        );
    }

    deleteDocument(documentID) {
        console.log('deleting document');
        this.ofiKycService.deleteKycDocument(documentID)
            .then(() => {
                OfiKycService.defaultRequestGetInvKycDocuments(this.ofiKycService, this.ngRedux, {
                    walletID: this.connectedWalletId,
                    kycID: 0,
                });
            });
    }

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Unsubscribe Observables. */
        for (const key of this.subscriptions) {
            key.unsubscribe();
        }
        this.unSubscribe.next();
        this.unSubscribe.complete();

        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();
    }
}
