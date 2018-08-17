import { Component, OnDestroy, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import {
    SET_LOGIN_DETAIL, RESET_LOGIN_DETAIL, loginRequestAC,
    SET_AUTH_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL,
    SET_PRODUCTION, setLanguage,
} from '@setl/core-store';
import { MultilingualService } from '@setl/multilingual';
import { SagaHelper, APP_CONFIG, AppConfig } from '@setl/utils';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { MyUserService } from '@setl/core-req-services';

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
    private config: Model.ISignupConfiguration;

    @Input() set configuration(config: Model.ISignupConfiguration) {
        this.config = config;

        if (this.signupForm && config.username) {
            this.signupForm.controls.username.patchValue(config.username);
        }
    }
    get configuration(): Model.ISignupConfiguration {
        return this.config;
    }
    @Output() signupDataEmit: EventEmitter<() => Model.ISignupData> = new EventEmitter();

    constructor(private redux: NgRedux<any>,
                private activatedRoute: ActivatedRoute,
                public translate: MultilingualService,
                private alertsService: AlertsService,
                private myUserService: MyUserService,
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
                this.configuration.username ? this.configuration.username : '',
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
                    this.redux.dispatch(setLanguage(languages[lang]));
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

        this.configuration.signupCallback(form).then(() => {
            if (this.configuration.doLoginAfterCallback) this.loginAfterSignup();
        });
    }

    private loginAfterSignup(): void {
        const loginRequestAction = loginRequestAC();
        this.redux.dispatch(loginRequestAction);

        const asyncTaskPipe = this.myUserService.loginRequest({
            username: this.signupForm.controls.username.value,
            password: this.signupForm.controls.password.value,
        });

        this.redux.dispatch(SagaHelper.runAsync(
            [SET_LOGIN_DETAIL, SET_AUTH_LOGIN_DETAIL, SET_PRODUCTION],
            [RESET_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL],
            asyncTaskPipe,
            {},
            () => {
            },
            (data) => {
                this.handleLoginFailMessage(data);
            },
        ));
    }

    private handleLoginFailMessage(data) {
        const responseStatus = _.get(data, '[1].Data[0].Status', 'other').toLowerCase();

        switch (responseStatus) {
        case 'fail':
            this.showLoginErrorMessage(
                'warning',
                '<span mltag="txt_loginerror" class="text-warning">Invalid email address or password!</span>',
            );
            break;
        case 'locked':
            this.showLoginErrorMessage(
                'info',
                '<span mltag="txt_accountlocked" class="text-warning">Sorry, your account has been locked. ' +
                'Please contact Setl support.</span>',
            );
            break;
        default:
            this.showLoginErrorMessage(
                'error',
                '<span mltag="txt_loginproblem" class="text-warning">Sorry, there was a problem logging in, ' +
                'please try again.</span>',
            );
            break;
        }
    }

    private showLoginErrorMessage(type, msg) {
        this.alertsService.create(type, msg, { buttonMessage: 'Please try again to log in' });
    }

    showFieldError(control: any): boolean {
        return !control.valid && control.touched;
    }

    showPasswordRequiredError(control: any): boolean {
        return control.hasError('required') && control.dirty;
    }

    showPasswordLengthError(control: any): boolean {
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
