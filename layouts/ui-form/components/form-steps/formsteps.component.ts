import {Component, Inject, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';

import {Subject} from 'rxjs/Subject';
import {MultilingualService} from '@setl/multilingual';

@Component({
    selector: 'app-ui-layouts-formsteps',
    templateUrl: './formsteps.component.html',
    styles: [`
        .red {
            color: red;
        }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFormStepsComponent implements OnInit {

    myFormSteps1: FormGroup;
    myFormSteps2: FormGroup;
    myFormSteps3: FormGroup;

    names = [
        { id: 1, text: 'Laurent' },
        { id: 2, text: 'Michel' },
        { id: 3, text: 'Bob' },
        { id: 4, text: 'Who?' },
    ];

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
        this.createFormSteps();
    }

    ngOnInit() {}

    createFormSteps() {
        this.myFormSteps1 = this._fb.group({
            step1: this._fb.group({
                firstname: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                lastname: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
            }),
            step2: this._fb.group({
                email: [
                    '',
                    Validators.compose([
                        Validators.required,
                        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                    ]),
                ],
            }),
            step3: this._fb.group({
                field1: [
                    'yo',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field2: [
                    'yo',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field3: [
                    'yo',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field4: [
                    'yo',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field5: [
                    'yo',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field6: [
                    'yo',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field7: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
            }),
        });
        this.myFormSteps2 = this._fb.group({
            firstname: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            lastname: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
        });
        this.myFormSteps3 = this._fb.group({
            step1: this._fb.group({
                firstname: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                lastname: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
            }),
            step2: this._fb.group({
                email: [
                    '',
                    Validators.compose([
                        Validators.required,
                        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                    ]),
                ],
            }),
            step3: this._fb.group({
                field1: [
                    'yo',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field2: [
                    'yo',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field3: [
                    'yo',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field4: [
                    'yo',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field5: [
                    'yo',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field6: [
                    'yo',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
                field7: [
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ],
            }),
        });
    }

    save1(formValues) {
        alert('save1: ' + JSON.stringify(formValues));
    }

    save2(formValues) {
        alert('save2: ' + JSON.stringify(formValues));
    }

    save3(formValues) {
        alert('save3: ' + JSON.stringify(formValues));
    }

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

}