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

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiInvMyDocumentsComponent implements OnDestroy, OnInit, AfterViewInit {

    private uploadMyDocumentsForm:FormGroup;

    private subscriptions: Array<any> = [];

    allUploadsFiles: any = [];
    nbUploads = 13;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _translate: MultilingualService,
        private fileService: FileService,
        private toaster: ToasterService,
        private ngRedux: NgRedux<any>,
    ) {
        for (let i = 0; i < this.nbUploads; i++) {
            this.allUploadsFiles[i+1] = {
                    fileID: 0,
                    hash: '',
                    name: '',
            };
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

    assignAllToggles() {
        for (let i=0; i < this.nbUploads; i++) {
            this.uploadMyDocumentsForm.get('shareUpload' + (i+1)).patchValue(this.uploadMyDocumentsForm.get('shareAll').value, { emitEvent: false });
        }
        this._changeDetectorRef.markForCheck();
    }

    checkToggles() {
        let isAllChecked = true;
        for (let i=0; i < this.nbUploads; i++) {
            if (this.uploadMyDocumentsForm.get('shareUpload' + (i+1)).value === false) {
                isAllChecked = false;
            }
        }
        if (isAllChecked) {
            if (this.uploadMyDocumentsForm.get('shareAll').value === true) {
                for (let i=0; i < this.nbUploads; i++) {
                    this.uploadMyDocumentsForm.get('shareUpload' + (i+1)).patchValue(this.uploadMyDocumentsForm.get('shareAll').value, { emitEvent: false });
                }
            }
        } else {
            this.uploadMyDocumentsForm.get('shareAll').patchValue(false, { emitEvent: false });
        }
        this._changeDetectorRef.markForCheck();
    }

    getUpload(event, ix) {
        this.uploadFile(event, ix, this._changeDetectorRef);
    }

    uploadFile(event, ix, changeDetectorRef: ChangeDetectorRef): void {
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
                            this.allUploadsFiles[ix] = {
                                fileID: file[0].fileID,
                                hash: file[0].fileHash,
                                name: file[0].fileTitle,
                            };
                        }
                    });

                    if (errorMessage) {
                        this.toaster.pop('error', errorMessage);
                    }

                    if (data[1].Data.length === 0) {
                        // removed file
                        this.allUploadsFiles[ix] = {
                            fileID: 0,
                            hash: '',
                            name: '',
                        };
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


    /* On Destroy. */
    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (let key of this.subscriptions) {
            key.unsubscribe();
        }
    }
}
