import {Component, Inject, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';

import {Subject} from 'rxjs/Subject';
import {MultilingualService} from '@setl/multilingual';

@Component({
    selector: 'app-ui-layouts-formpercent',
    templateUrl: './formpercent.component.html',
    styles: [`
        input[type=text]{width: 100%!important}
        .well {width: 100%!important}
        .panel-body{
            margin: 15px 25px 35px 25px!important;
        }
        .red {
            color: red;
        }
        .pgContainer {
            width: 300px;
            position: absolute;
            right: 42px;
            top: 14px;
        }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFormPercentComponent implements OnInit {

    myForm1: FormGroup;
    myForm2: FormGroup;

    showInfoPanes: boolean = true;
    lang: string;
    @select(['user', 'siteSettings', 'language']) language$;

    private unsubscribe: Subject<any> = new Subject();

    constructor(
        private _fb: FormBuilder,
        private _ngRedux: NgRedux<any>,
        private _changeDetectorRef: ChangeDetectorRef,
        public _translate: MultilingualService,
    ) {
        this.language$.takeUntil(this.unsubscribe).subscribe((language) => this.lang = language);
        this.createForms();
    }

    ngOnInit() {}

    createForms() {
        this.myForm1 = this._fb.group({
            field1: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            field2: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            field3: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            mygroup: this._fb.group({
                field4: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field5: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
            }),
        });
        this.myForm2 = this._fb.group({
            mygroup1: this._fb.group({
                field1: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field2: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
            }),
            mygroup2: this._fb.group({
                field3: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field4: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
            }),
            mygroup3: this._fb.group({
                field5: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field6: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
            }),
            mygroup4: this._fb.group({
                field7: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field8: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
            }),
            mygroup5: this._fb.group({
                field9: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field10: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
            }),
        });
    }

    save(formValues) {
        console.log('save', formValues);
    }

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

}