import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs';

import { MyUserService } from '@setl/core-req-services';
import { setLanguage } from '@setl/core-store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
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
    redirectURL: string;
    signupForm: FormGroup;
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;

    private configuration: Model.ISignupConfiguration;
    private subscriptions: Subscription[] = [];

    constructor(private ngRedux: NgRedux<any>,
                private router: Router,
                private myUserService: MyUserService,
                private activatedRoute: ActivatedRoute,
                private alertsService: AlertsService,
                public translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {

        this.appConfig = appConfig;
    }

    ngOnInit() {
        this.initSignupForm();
        this.getQueryParams();

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

    private configure(configuration: Model.ISignupConfiguration): void {
        this.configuration = configuration;
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
