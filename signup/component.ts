import { Component, OnDestroy, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs';

import { setLanguage } from '@setl/core-store';
import { MultilingualService } from '@setl/multilingual';
import { APP_CONFIG, AppConfig } from '@setl/utils';

import * as Model from './model';

@Component({
    selector: 'app-signup',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class SignupComponent implements OnDestroy, OnInit {
    appConfig: AppConfig;
    invitationToken = '';
    language: string;
    redirectURL: string;
    signupForm: FormGroup;
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;

    private subscriptions: Subscription[] = [];

    @Input() configuration: Model.ISignupConfiguration;
    @Output() signupDataEmit: EventEmitter<() => Model.ISignupData> = new EventEmitter();

    constructor(private ngRedux: NgRedux<any>,
                private activatedRoute: ActivatedRoute,
                public translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {

        this.appConfig = appConfig;
    }

    ngOnInit() {
        this.initSignupForm();
        this.getQueryParams();

        this.signupDataEmit.emit(() => {
            return {
                username: this.signupForm.controls.username.value,
                password: this.signupForm.controls.password.value,
                invitationToken: this.invitationToken,
                language: this.language,
            };
        });

        window.onbeforeunload = null;
    }

    private initSignupForm(): void {
        this.signupForm = new FormGroup({
            username: new FormControl(
                '',
                Validators.required,
            ),
            password: new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                ]),
            ),
            passwordConfirm: new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                ]),
            ),
        },                              this.passwordValidator);
    }

    private getQueryParams() {
        this.subscriptions.push(this.activatedRoute.queryParams.subscribe((params) => {
            const invitationToken = params.invitationToken;
            if (invitationToken) {
                this.invitationToken = invitationToken;
            }

            const email = params.email;
            if (email) {
                this.signupForm.get('username').patchValue(email);
            }

            const lang = params.lang;
            this.language = lang;
            if (lang) {
                const languages = {
                    en: 'en-Latn',
                    fr: 'fr-Latn',
                    tch: 'tch',
                    sch: 'sch',
                };

                if (languages[lang] != null) {
                    this.ngRedux.dispatch(setLanguage(languages[lang]));
                }
            }
        }));
    }

    private passwordValidator(g: FormGroup) {
        return (g.get('password').value === g.get('passwordConfirm').value) ? null : { mismatch: true };
    }

    get title(): string {
        return this.configuration ? this.configuration.title : this.translate.translate('Sign up');
    }

    get description(): string {
        return this.configuration ? this.configuration.description : null;
    }

    get buttonText(): string {
        return this.configuration ? this.configuration.buttonText : this.translate.translate('Create an account');
    }

    signup(form: Model.ISignupForm) {
        if (!this.configuration.signupCallback) return;

        this.configuration.signupCallback(form);
    }

    showFieldError(control: FormControl): boolean {
        return !control.valid && control.touched;
    }

    showPasswordRequiredError(control: FormControl): boolean {
        return control.hasError('required') && control.dirty;
    }

    showPasswordLengthError(control: FormControl): boolean {
        return !control.valid &&
            !control.hasError('required') &&
            control.touched;
    }

    showPasswordMismatchError(): boolean {
        return !this.signupForm.controls.passwordConfirm.hasError('minlength') &&
            !this.signupForm.controls.passwordConfirm.hasError('required') &&
            this.signupForm.controls.passwordConfirm.dirty &&
            this.signupForm.hasError('mismatch') &&
            this.signupForm.controls.password.valid;
    }

    toggleShowPasswords(isConfirm: boolean = false) {
        if (isConfirm) {
            this.showConfirmPassword = !this.showConfirmPassword;
            return;
        }

        this.showPassword = !this.showPassword;
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
