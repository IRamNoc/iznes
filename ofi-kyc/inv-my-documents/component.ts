/* Core/Angular imports. */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Inject, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
/* Redux */
import {NgRedux, select} from '@angular-redux/store';
import {fromJS} from 'immutable';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MultilingualService} from '@setl/multilingual';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiInvMyDocumentsComponent implements OnDestroy, OnInit, AfterViewInit {

    private formGroup:FormGroup;

    @ViewChild('upload1') upload1: ElementRef;
    @ViewChild('upload2') upload2: ElementRef;
    @ViewChild('upload3') upload3: ElementRef;
    @ViewChild('upload4') upload4: ElementRef;
    @ViewChild('upload5') upload5: ElementRef;
    @ViewChild('upload6') upload6: ElementRef;
    @ViewChild('upload7') upload7: ElementRef;
    @ViewChild('upload8') upload8: ElementRef;
    @ViewChild('upload9') upload9: ElementRef;
    @ViewChild('upload10') upload10: ElementRef;
    @ViewChild('upload11') upload11: ElementRef;
    @ViewChild('upload12') upload12: ElementRef;
    @ViewChild('upload13') upload13: ElementRef;

    private subscriptions: Array<any> = [];

    private shareAllDocsToAllAM = false;
    shareUpload1 = false;
    shareUpload2 = false;
    shareUpload3 = false;
    shareUpload4 = false;
    shareUpload5 = false;
    shareUpload6 = false;
    shareUpload7 = false;
    shareUpload8 = false;
    shareUpload9 = false;
    shareUpload10 = false;
    shareUpload11 = false;
    shareUpload12 = false;
    shareUpload13 = false;

    allUploadsFiles: Array<any> = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _translate: MultilingualService,
        private _ngRedux: NgRedux<any>,
    ) {
        this.formGroup = new FormGroup({
            upload1: new FormControl([]),
        });
    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    assignShareAllDocsToAllAM() {
        this.shareUpload1 = this.shareAllDocsToAllAM;
        this.shareUpload2 = this.shareAllDocsToAllAM;
        this.shareUpload3 = this.shareAllDocsToAllAM;
        this.shareUpload4 = this.shareAllDocsToAllAM;
        this.shareUpload5 = this.shareAllDocsToAllAM;
        this.shareUpload6 = this.shareAllDocsToAllAM;
        this.shareUpload7 = this.shareAllDocsToAllAM;
        this.shareUpload8 = this.shareAllDocsToAllAM;
        this.shareUpload9 = this.shareAllDocsToAllAM;
        this.shareUpload10 = this.shareAllDocsToAllAM;
        this.shareUpload11 = this.shareAllDocsToAllAM;
        this.shareUpload12 = this.shareAllDocsToAllAM;
        this.shareUpload13 = this.shareAllDocsToAllAM;
    }

    getUpload(event) {
        console.log(event);
    }

    processUpload(field, file) {
        // https://stackoverflow.com/questions/47936183/angular-5-file-upload
        this.allUploadsFiles[field] = {
            name: field,
            file: file,
        };
        console.log(field, this.allUploadsFiles[field].file);
    }

    removeFile(fileName) {
        if (this.allUploadsFiles[fileName]) {
            this[fileName].nativeElement.value = '';
            delete this.allUploadsFiles[fileName];
        }
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
