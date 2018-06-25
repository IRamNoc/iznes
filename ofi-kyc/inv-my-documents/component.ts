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

    private uploadMyDocumentsForm:FormGroup;

    private subscriptions: Array<any> = [];

    allUploadsFiles: Array<any> = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _translate: MultilingualService,
        private _ngRedux: NgRedux<any>,
    ) {
        this.uploadMyDocumentsForm = new FormGroup({
            shareAll: new FormControl([]),
            upload1: new FormControl([]),
            shareUpload1: new FormControl([]),
            upload2: new FormControl([]),
            shareUpload2: new FormControl([]),
            upload3: new FormControl([]),
            shareUpload3: new FormControl([]),
            upload4: new FormControl([]),
            shareUpload4: new FormControl([]),
            upload5: new FormControl([]),
            shareUpload5: new FormControl([]),
            upload6: new FormControl([]),
            shareUpload6: new FormControl([]),
            upload7: new FormControl([]),
            shareUpload7: new FormControl([]),
            upload8: new FormControl([]),
            shareUpload8: new FormControl([]),
            upload9: new FormControl([]),
            shareUpload9: new FormControl([]),
            upload10: new FormControl([]),
            shareUpload10: new FormControl([]),
            upload11: new FormControl([]),
            shareUpload11: new FormControl([]),
            upload12: new FormControl([]),
            shareUpload12: new FormControl([]),
            upload13: new FormControl([]),
            shareUpload13: new FormControl([]),
        });


        this.subscriptions.push(this.uploadMyDocumentsForm.valueChanges.subscribe((form) => this.getUpload(form)));
    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    getUpload(event) {
        console.log(event);
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
