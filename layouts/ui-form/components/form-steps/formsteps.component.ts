import {Component, Inject, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';

import {Subject} from 'rxjs/Subject';
import {MultilingualService} from '@setl/multilingual';

import {FormStepsDirective} from "@setl/utils/directives/form-steps/formsteps";

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

    @ViewChildren(FormStepsDirective) formSteps: any;

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
        console.log('save1: ' + JSON.stringify(formValues));
    }

    save2(formValues) {
        console.log('save2: ' + JSON.stringify(formValues));
    }

    save3(formValues) {
        console.log('save3: ' + JSON.stringify(formValues));
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