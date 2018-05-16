import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';

import {ToasterService} from 'angular2-toaster';
import {Subject} from 'rxjs/Subject';
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
        .jumbotron .label {
            border-radius: 3px !important;
            padding: 0 1rem 1px !important;
            font-size: 13px !important;
        }
        .jumbotron {
            padding: 60px 30px;
            margin: 10px 0;
            background-color: #eee;
            border-radius: 6px;
            max-width: 100%;
        }
        .jumbotron a {
            font-weight: 900;
        }
        .jumbotron p {
            margin-bottom: 25px;
            font-size: 14px;
        }
        .jumbotron hr {
            display: block;
            height: 1px;
            border: 0;
            border-top: 1px solid #ccc;
            margin: .6em 0 2em 0;
            padding: 0;
        }
        .jumbotron ol, .jumbotron ul {
            margin: 0 !important;
            padding: 0 !important;
        }
        .jumbotron pre {
            background-color: white;
            margin: .5em 0;
            overflow: auto;
            border: 1px solid #ccc;
            border-radius: 6px;
            padding: 2em;
            color: #666;
            border-width: 1px 1px 1px 20px;
            border-left-color: rgb(73, 164, 95);
            max-height: fit-content !important;
        }
        .jumbotron pre img {
            border: none;
            margin: 0;
            padding: 0;
            float: left;
        }
        @media screen and (min-width: 768px) {
            .jumbotron {
                padding-top: 48px;
                padding-bottom: 48px;
            }
            .jumbotron > h1, .jumbotron .h1 {
                font-size: 34px;
            }
            .jumbotron > h2, .jumbotron .h2 {
                font-size: 28px;
            }
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
        private _translate: MultilingualService,
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