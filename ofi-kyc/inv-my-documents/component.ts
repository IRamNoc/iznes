/* Core/Angular imports. */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Inject, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
/* Redux */
import {NgRedux, select} from '@angular-redux/store';
import {fromJS} from 'immutable';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MultilingualService} from '@setl/multilingual';

import * as _ from 'lodash';
import * as SagaHelper from '@setl/utils/sagaHelper';
import { ToasterService } from 'angular2-toaster';
import { FileService } from '@setl/core-req-services/file/file.service';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service'

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiInvMyDocumentsComponent implements OnDestroy, OnInit, AfterViewInit {

    public kycEnums;

    public uploadMyDocumentsForm:FormGroup;
    public connectedWalletId: number;
    public subscriptions: Array<any> = [];

    allUploadsFiles: any = [];
    nbUploads = 13;

    filesFromRedux = [];

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['ofi', 'ofiKyc', 'invMyDocuments', 'requested']) requestedOfiInvMyDocsOb;
    @select(['ofi', 'ofiKyc', 'invMyDocuments', 'myDocumentsList']) OfiInvMyDocsListOb;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _translate: MultilingualService,
        private fileService: FileService,
        private _ofiKycService: OfiKycService,
        private toaster: ToasterService,
        private ngRedux: NgRedux<any>,
        @Inject('kycEnums') kycEnums,
    ) {
        this.kycEnums = kycEnums.documents;

        for (var k in this.kycEnums) {
            if (this.kycEnums.hasOwnProperty(this.kycEnums[k])) {
                this.allUploadsFiles[this.kycEnums[k]] = {
                    fileID: 0,
                    hash: '',
                    name: '',
                    type: this.kycEnums[k],
                    common: 0,
                    'default': 1,
                    preset: {
                        fileID: 0,
                        hash: '',
                        name: '',
                    },
                    saved: false,
                };
            }
        }

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
            upload12: new FormControl([]),
            shareUpload12: new FormControl(false),
            upload13: new FormControl([]),
            shareUpload13: new FormControl(false),
        });
    }

    ngOnInit() {
        this.subscriptions.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;

            this.subscriptions.push(this.requestedOfiInvMyDocsOb.subscribe((requested) => this.requestedOfiInvMyDocs(requested)));
            this.subscriptions.push(this.OfiInvMyDocsListOb.subscribe((list) => this.getMyDocumentsFromRedux(list)));
        }));
    }

    ngAfterViewInit() {
        const allFileDrop = document.getElementsByClassName('drop-file-nofile') as HTMLCollectionOf<HTMLElement>;
        for (let i in allFileDrop) {
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
            OfiKycService.defaultRequestGetInvKycDocuments(this._ofiKycService, this.ngRedux, {walletID: this.connectedWalletId, kycID: 0});
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
                'default': item.get('default'),
            });
            return result;
        }, []);

        let allChecked = true;
        for (let i in this.allUploadsFiles) {
            for (let j in this.filesFromRedux) {
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
                        'default': 1,
                        preset: {
                            fileID: this.filesFromRedux[j].kycDocumentID,
                            hash: this.filesFromRedux[j].hash,
                            name: this.filesFromRedux[j].name,
                        },
                        saved: false,
                    };
                }
            }
        }
        if (allChecked) {
            this.uploadMyDocumentsForm.get('shareAll').patchValue(true, { emitEvent: false });
        } else {
            this.uploadMyDocumentsForm.get('shareAll').patchValue(false, { emitEvent: false });
        }

        this._changeDetectorRef.markForCheck();
    }

    assignAllToggles() {
        for (let i=0; i < this.nbUploads; i++) {
            this.uploadMyDocumentsForm.get('shareUpload' + (i+1)).patchValue(this.uploadMyDocumentsForm.get('shareAll').value, { emitEvent: false });
        }
        for (let i in this.allUploadsFiles) {
            this.allUploadsFiles[i].common = (this.uploadMyDocumentsForm.get('shareAll').value) ? 1 : 0;
            this.saveFileInDatabase(i);
        }
        this._changeDetectorRef.markForCheck();
    }

    checkToggles(fileRelated, value) {
        let isAllChecked = true;
        for (let i=0; i < this.nbUploads; i++) {
            if (this.uploadMyDocumentsForm.get('shareUpload' + (i+1)).value === false || this.uploadMyDocumentsForm.get('shareUpload' + (i+1)).value === 0) {
                isAllChecked = false;
            }
        }
        if (isAllChecked) {
            if (this.uploadMyDocumentsForm.get('shareAll').value === true || this.uploadMyDocumentsForm.get('shareAll').value === 1) {
                for (let i=0; i < this.nbUploads; i++) {
                    this.uploadMyDocumentsForm.get('shareUpload' + (i+1)).patchValue(true, { emitEvent: false });
                }
                for (let i in this.allUploadsFiles) {
                    this.allUploadsFiles[i].common = 1;
                }
            } else {
                this.uploadMyDocumentsForm.get('shareAll').patchValue(true, { emitEvent: false });
                for (let i in this.allUploadsFiles) {
                    this.allUploadsFiles[i].common = 1;
                }
            }
            this.saveFileInDatabase(fileRelated);
        } else {
            this.uploadMyDocumentsForm.get('shareAll').patchValue(false, { emitEvent: false });
            this.allUploadsFiles[fileRelated].common = (value) ? 1 : 0;
            this.saveFileInDatabase(fileRelated);
        }
        this._changeDetectorRef.markForCheck();
    }

    getUpload(event, fileRelated) {
        this.uploadFile(event, fileRelated, this._changeDetectorRef);
    }

    uploadFile(event, fileRelated, changeDetectorRef: ChangeDetectorRef): void {
        // save file into server
        const asyncTaskPipe = this.fileService.addFile({
            files: _.filter(event.files, (file) => {
                return file.status !== 'uploaded-file';
            }),
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
                        this.toaster.pop('error', errorMessage);
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
                        this.toaster.pop('error', errorMessage);
                    }
                }
            }),
        );
    }

    saveFileInDatabase(fileRelated) {
            const asyncTaskPipe = this._ofiKycService.saveKycDocument(
            {
                walletID: this.connectedWalletId,
                name: this.allUploadsFiles[fileRelated].name,
                hash: this.allUploadsFiles[fileRelated].hash,
                type: this.allUploadsFiles[fileRelated].type,
                common: this.allUploadsFiles[fileRelated].common,
                'default': this.allUploadsFiles[fileRelated].default,
            });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                // success

            },
            (data) => {
                console.log('error: ', data);
            })
        );
    }


    /* On Destroy. */
    ngOnDestroy(): void {
        /* Unsunscribe Observables. */
        for (let key of this.subscriptions) {
            key.unsubscribe();
        }

        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();
    }
}
