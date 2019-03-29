import { Component, OnDestroy, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

import {
    MyUserService,
    InitialisationService,
    MyWalletsService,
    ChannelService,
    AccountsService,
    PermissionGroupService,
    ChainService,
} from '@setl/core-req-services';
import {
    SET_LOGIN_DETAIL, RESET_LOGIN_DETAIL, loginRequestAC,
    SET_AUTH_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL,
    SET_PRODUCTION, setLanguage, SET_SITE_MENU, SET_FORCE_TWO_FACTOR,
} from '@setl/core-store';
import { MultilingualService } from '@setl/multilingual';
import { SagaHelper, APP_CONFIG, AppConfig } from '@setl/utils';
import { passwordValidator } from '@setl/utils/helper/validators/password.directive';

import * as Model from './model';
import { MemberSocketService } from '@setl/websocket-service';
import { LoginService } from '../login.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { ClrLoadingState } from '@clr/angular';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-signup',
    templateUrl: 'component.html',
    styleUrls: ['../login.component.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(500, style({ opacity: 1 })),
            ]),
            state('*', style({ opacity: 1 })),
        ]),
    ],
})
export class SignupComponent implements OnDestroy, OnInit {
    appConfig: AppConfig;
    invitationToken = '';
    public language: string;
    public langLabels = {
        'fr-Latn': 'Francais',
        'en-Latn': 'English',
    };
    redirectURL: string;
    signupForm: FormGroup;
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;

    showTwoFactorModal = false;
    qrCode: string = '';
    submitBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
    alert: any = { show: false, type: '', content: '' };
    signupSuccess: boolean = false;
    signupSuccessText: string = '';

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

    @select(['user', 'authentication']) authenticationOb;
    @select(['user', 'siteSettings', 'forceTwoFactor']) forceTwoFactorOb;
    @select(['user', 'siteSettings', 'language']) requestLanguage;

    constructor(private redux: NgRedux<any>,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                public translate: MultilingualService,
                private myUserService: MyUserService,
                private myWalletsService: MyWalletsService,
                private memberSocketService: MemberSocketService,
                private channelService: ChannelService,
                private accountsService: AccountsService,
                private permissionGroupService: PermissionGroupService,
                private chainService: ChainService,
                private initialisationService: InitialisationService,
                private loginService: LoginService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {

        this.appConfig = appConfig;
    }

    ngOnInit() {
        if (!this.appConfig.platformLegal) this.appConfig.platformLegal = this.appConfig.platform;

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

        this.subscriptions.push(this.authenticationOb.subscribe((auth) => {
            this.updateState(auth);
        }));

        const combinedTwoFactor$ = combineLatest(this.authenticationOb, this.forceTwoFactorOb);

        this.subscriptions.push(combinedTwoFactor$.subscribe(([authentication, forceTwoFactor]) => {
            const useTwoFactor = _.get(authentication, 'useTwoFactor', 0);

            if (useTwoFactor || forceTwoFactor) {
                this.showTwoFactorModal = true;
                if (authentication.token && authentication.token !== 'twoFactorRequired') {
                    this.updateState(authentication);
                }
            } else {
                this.updateState(authentication);
            }
        }));

        this.subscriptions.push(
            this.requestLanguage.subscribe(requested => this.language = requested ? requested : 'English'),
        );

        window.onbeforeunload = null;
    }

    private initSignupForm(): void {
        const validator = this.appConfig.production ? passwordValidator : null;

        this.signupForm = new FormGroup(
            {
                username: new FormControl(
                    this.configuration.username ? this.configuration.username : '',
                    Validators.required,
                ),
                password: new FormControl(
                    '',
                    Validators.compose([
                        Validators.required,
                        validator,
                    ]),
                ),
                passwordConfirm: new FormControl(
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ),
            },
            this.mismatchValidator,
        );
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

    private mismatchValidator(g: FormGroup) {
        return (g.get('password').value === g.get('passwordConfirm').value) ? null : { mismatch: true };
    }

    get title(): string {
        return this.configuration ? this.configuration.title : this.translate.translate('Sign Up');
    }

    get description(): string {
        return this.configuration ? this.configuration.description : null;
    }

    get buttonText(): string {
        return this.configuration ? this.configuration.buttonText : 'Create an account';
    }

    private updateState(auth): void {
        if (auth.isLogin) {
            this.memberSocketService.token = auth.token;

            InitialisationService.membernodeInitialisation(
                this.redux,
                this.myWalletsService,
                this.memberSocketService,
                this.channelService,
                this.accountsService,
                this.myUserService,
                this.permissionGroupService,
                this.chainService,
                this.initialisationService,
            );

            const redirect: any = auth.defaultHomePage ? auth.defaultHomePage : '/home';

            if (this.configuration.doLoginRedirect === true ||
                this.configuration.doLoginRedirect === undefined) {

                this.router.navigateByUrl(redirect);
            }
        }
    }

    signup(form: Model.ISignupForm) {
        if (!this.configuration.signupCallback) return;

        this.submitBtnState = ClrLoadingState.LOADING;

        this.configuration.signupCallback(form)
        .then((successText: any) => {
            this.submitBtnState = ClrLoadingState.DEFAULT;
            if (this.configuration.doLoginAfterCallback) {
                // show sign up successful screen with button
                this.signupSuccessText = typeof successText === 'string'
                    ? successText : 'Your account was created successfully.';
                this.signupSuccess = true;
            }
        })
        .catch((e) => {
            this.submitBtnState = ClrLoadingState.DEFAULT;
            this.showAlert('error', typeof e === 'string' ? e : 'Sorry, something went wrong. Please try again later.');
        });
    }

    private loginAfterSignup(): void {
        this.submitBtnState = ClrLoadingState.LOADING;

        const loginRequestAction = loginRequestAC();
        this.redux.dispatch(loginRequestAction);

        const asyncTaskPipe = this.myUserService.loginRequest({
            username: this.signupForm.controls.username.value,
            password: this.signupForm.controls.password.value,
        });

        this.redux.dispatch(SagaHelper.runAsync(
            [SET_FORCE_TWO_FACTOR, SET_LOGIN_DETAIL, SET_AUTH_LOGIN_DETAIL, SET_PRODUCTION],
            [RESET_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL],
            asyncTaskPipe,
            {},
            (data) => {
                this.submitBtnState = ClrLoadingState.DEFAULT;

                if (_.get(data, '[1].Data[0].qrCode', false)) {
                    this.qrCode = data[1].Data[0].qrCode;
                }

                this.loginService.postLoginRequests();
            },
            (data) => {
                this.submitBtnState = ClrLoadingState.DEFAULT;

                this.handleLoginFailMessage(data);
            },
        ));
    }

    private handleLoginFailMessage(data) {
        const responseStatus = _.get(data, '[1].Data[0].Status', 'other').toLowerCase();

        switch (responseStatus) {
            case 'fail':
                this.showAlert(
                    'error',
                    'Invalid email address or password.',
                );
                break;
            case 'locked':
                this.showAlert(
                    'error',
                    'Sorry, your account has been locked. Please contact your Administrator.',
                );
                break;
            default:
                this.showAlert(
                    'error',
                    'Sorry, there was a problem logging in. Please try again.',
                );
                break;
        }
    }

    toggleShowPasswords(isConfirm: boolean = false) {
        if (isConfirm) {
            this.showConfirmPassword = !this.showConfirmPassword;
            return;
        }

        this.showPassword = !this.showPassword;
    }

    hasError(path, error?) {
        if (this.signupForm) {
            const formControl: AbstractControl = path ? this.signupForm.get(path) : this.signupForm;

            if (!error) {
                return formControl.touched && formControl.errors;
            }
            if (error !== 'required' && formControl.hasError('required')) {
                return false;
            }
            return formControl.touched && (error ? formControl.hasError(error) : formControl.errors);
        }
    }

    isTouched(path) {
        const formControl: AbstractControl = this.signupForm.get(path);

        return formControl.touched;
    }

    updateLang(lang: string) {
        this.redux.dispatch(setLanguage(lang));
    }

    getLangs() {
        return Object.keys(this.langLabels);
    }

    getLabel(lang: string): string {
        return this.langLabels[lang];
    }

    showAlert(type: 'success' | 'warning' | 'info' | 'error' | 'clear', content: string = '') {
        const alertMapping = {
            success: { type: 'alert-success', icon: 'check-circle' },
            warning: { type: 'alert-warning', icon: 'exclamation-triangle' },
            info: { type: 'alert-info', icon: 'info-circle' },
            error: { type: 'alert-danger', icon: 'exclamation-circle' },
        };

        if (!content || !alertMapping[type]) {
            this.alert.show = false;
            return;
        }

        setTimeout(
            () => {
                this.alert = {
                    show: true,
                    type: alertMapping[type].type,
                    icon: alertMapping[type].icon,
                    content,
                };
            },
            5,
        );
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
