import {
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    QueryList,
    ViewChildren
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';

import { Subject } from 'rxjs';
import { MultilingualService } from '@setl/multilingual';

import { FormStepsDirective } from "@setl/utils/directives/form-steps/formsteps";

@Component({
    selector: 'app-ui-layouts-formsteps',
    templateUrl: './formsteps.component.html',
    styles: [`
        .red {
            color: red;
        }

        input[type=checkbox] {
            visibility: hidden;
        }

        .customCheckbox {
            width: 50px;
            margin: -10px 0;
            position: relative;
        }

        .customCheckbox label {
            cursor: pointer;
            position: absolute;
            width: 30px;
            height: 30px;
            top: 0;
            border-radius: 4px;

            -webkit-box-shadow: inset 0px 1px 1px white, 0px 1px 3px rgba(0, 0, 0, 0.5);
            -moz-box-shadow: inset 0px 1px 1px white, 0px 1px 3px rgba(0, 0, 0, 0.5);
            box-shadow: inset 0px 1px 1px white, 0px 1px 3px rgba(0, 0, 0, 0.5);
            background: #fcfff4;

            background: -webkit-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
            background: -moz-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
            background: -o-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
            background: -ms-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
            background: linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fcfff4', endColorstr='#b3bead', GradientType=0);
        }

        .customCheckbox label:after {
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
            filter: alpha(opacity=0);
            opacity: 0;
            content: '';
            position: absolute;
            width: 16px;
            height: 10px;
            background: transparent;
            top: 8px;
            left: 7px;
            border: 4px solid green;
            border-top: none;
            border-right: none;

            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            transform: rotate(-45deg);
        }

        .customCheckbox label:hover::after {
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=30)";
            filter: alpha(opacity=30);
            opacity: 0.5;
        }

        .customCheckbox input[type=checkbox]:checked + label:after {
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
            filter: alpha(opacity=100);
            opacity: 1;
        }

    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFormStepsComponent implements OnInit {

    @ViewChildren(FormStepsDirective) formSteps: any;

    myFormSteps1: FormGroup;
    myFormSteps2: FormGroup;
    myFormSteps3: FormGroup;
    myFormSteps4: FormGroup;

    names = [
        { id: 1, text: 'Laurent' },
        { id: 2, text: 'Michel' },
        { id: 3, text: 'Bob' },
        { id: 4, text: 'Who?' },
    ];

    dynamicConfig = [];
    isFullForm = false;

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

        this.dynamicConfig = [{ title: 'Introduction' }, {
            form: this.myFormSteps4,
            id: 'myFormSteps4',
            title: 'Form'
        }];
    }

    ngOnInit() {
    }

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
                        Validators.pattern(/^(((\([A-z0-9]+\))?[^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
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
        this.myFormSteps4 = this._fb.group({
            isFull: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
        });
        this.myFormSteps4.valueChanges.subscribe((form) => this.formChanges(form));
    }

    save1(formValues) {
        console.log('save1: ' + JSON.stringify(formValues));
    }

    save2(formValues) {
        console.log('save2: ' + JSON.stringify(formValues));
    }

    save3(formValues) {
        console.log('save3: ' + JSON.stringify(formValues));
    }

    save4(formValues) {
        console.log('save4: ' + JSON.stringify(formValues));
    }

    formChanges(form) {
        if (this.myFormSteps4.controls['isFull'].value) {
            this.dynamicConfig = [{ title: 'Introduction' }, {
                form: this.myFormSteps4,
                id: 'myFormSteps4',
                title: 'Form'
            }, { title: 'Outro' }, { form: this.myFormSteps3, id: 'myFormSteps3', title: 'Form again' }];
            setTimeout(() => {
                this.isFullForm = true;
                this._changeDetectorRef.markForCheck();
            }, 180);
        } else {
            this.dynamicConfig = [{ title: 'Introduction' }, {
                form: this.myFormSteps4,
                id: 'myFormSteps4',
                title: 'Form'
            }];
            setTimeout(() => {
                this.isFullForm = false;
                this._changeDetectorRef.markForCheck();
            }, 180);
        }
        this._changeDetectorRef.markForCheck();
    }

    addField() {
        (this.myFormSteps1.get('step1') as FormGroup).addControl('nickname', new FormControl('', Validators.required));
        // send to my 2nd directive on 3
        this.formSteps.toArray()[1].refreshFormSteps();
    }

    removeField() {
        (this.myFormSteps1.get('step1') as FormGroup).removeControl('nickname');
        // send to my 2nd directive on 3
        this.formSteps.toArray()[1].refreshFormSteps();
    }

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

}