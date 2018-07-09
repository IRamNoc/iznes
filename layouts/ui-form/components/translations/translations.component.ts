import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';

import {ToasterService} from 'angular2-toaster';
import {Subject} from 'rxjs';
import {MultilingualService} from '@setl/multilingual';

@Component({
    selector: 'app-ui-layouts-translations',
    templateUrl: './translations.component.html',
    styles: [`
        .padding {
            padding: 0 20px 20px;
        }
        .toggle-info-panes {
            display: block;
            padding-bottom: 10px;
            text-decoration: none;

            &:before, &:after { text-decoration: none; }
        }
    `
    ]
})
export class UiTranslationsComponent {

    translateForm: FormGroup;

    nbMaxTranslationsToProcess = 60;

    fakeName = 'Michel';
    animalList = ['Dog', 'Cat', 'Fish', 'Lion'];

    listTest = [
        {id: 1, text: 'Cancel'},
        {id: 2, text: 'Submit'},
        {id: 3, text: 'Send'},
        {id: 4, text: 'Approve'},
        {id: 5, text: 'Denied'},
    ];

    showInfoPanes: boolean = true;

    lang: string;
    @select(['user', 'siteSettings', 'language']) language$;

    private unsubscribe: Subject<any> = new Subject();

    constructor(
        private toaster: ToasterService,
        private fb: FormBuilder,
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        public _translate: MultilingualService,
    ) {
        this.translateForm = this.fb.group({
            inputText: [
                '',
            ],
            list: [
                '',
            ],
        });
        this.language$.takeUntil(this.unsubscribe).subscribe((language) => this.lang = language);
    }

    fakeSave(value) {
        return false;
    }

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

    // toaster
    showSuccessToaster(): void {
        this.toaster.pop('success', 'This is a success toaster!');
    }

    showWarningToaster(): void {
        this.toaster.pop('warning', 'This is a warning toaster!');
    }

    showErrorToaster(): void {
        this.toaster.pop('error', 'This is a error toaster!');
    }

}