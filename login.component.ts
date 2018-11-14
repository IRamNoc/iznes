// Vendors
import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ElementRef,
    ViewChild,
    ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { LoginGuardService } from './login-guard.service';
import * as _ from 'lodash';
// Internals
import { APP_CONFIG, AppConfig, SagaHelper, LogService, ConfirmationService } from '@setl/utils';
import {
    AccountsService,
    ChainService,
    ChannelService,
    InitialisationService,
    MyUserService,
    MyWalletsService,
    PermissionGroupService,
} from '@setl/core-req-services';
import {
    loginRequestAC,
    RESET_AUTH_LOGIN_DETAIL,
    RESET_LOGIN_DETAIL,
    SET_AUTH_LOGIN_DETAIL,
    SET_LOGIN_DETAIL,
    SET_PRODUCTION,
    SET_FORCE_TWO_FACTOR,
    SET_SITE_MENU,
    SET_NEW_PASSWORD,
    setLanguage,
} from '@setl/core-store';
import { MemberSocketService } from '@setl/websocket-service';
import { ToasterService } from 'angular2-toaster';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { MultilingualService } from '@setl/multilingual';
import { passwordValidator } from '@setl/utils/helper/validators/password.directive';
import { LoginService } from "./login.service";

/* Dectorator. */
@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss'],
})

/* Class. */
export class SetlLoginComponent implements OnDestroy, OnInit, AfterViewInit {
    appConfig: AppConfig;

    // Locale
    language: string;
    langLabels = {
        'fr-Latn': 'Francais',
        'en-Latn': 'English',
    };

    isLogin: boolean;

    loginForm: FormGroup;
    username: AbstractControl;
    password: AbstractControl;

    forgottenPasswordForm: FormGroup;
    email: AbstractControl;

    changePasswordForm: FormGroup;
    showPasswords = {
        change1: false,
        change2: false,
        resetold: false,
        reset1: false,
        reset2: false,
    };

    resetPasswordForm: FormGroup;
    resetPassword: boolean = false;

    changedPassword = false;
    changedPasswordContinue: boolean = false;

    // List of observable subscription
    subscriptionsArray: Subscription[] = [];

    showTwoFactorModal = false;
    qrCode: string = '';
    resetTwoFactorToken = '';

    showModal = false;
    emailUser = '';
    emailSent = false;
    countdown = 10;
    resetToken = '';
    isTokenExpired = false;
    changePassword = false;

    private userAuthenticationState: any;

    private queryParams: any;

    @ViewChild('usernameInput') usernameEl: ElementRef;
    @ViewChild('passwordInput') passwordEl: ElementRef;

    // List of redux observable.
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'authentication']) authenticationOb;
    @select(['user', 'siteSettings', 'forceTwoFactor']) forceTwoFactorOb;
    @select(['user', 'siteSettings', 'siteMenu']) siteMenuOb;

    set loginValue(email) {
        this.loginForm.get('username').patchValue(email);
    }

    /* Constructor. */
    constructor(private ngRedux: NgRedux<any>,
                private myUserService: MyUserService,
                private memberSocketService: MemberSocketService,
                private myWalletsService: MyWalletsService,
                private channelService: ChannelService,
                private accountsService: AccountsService,
                private permissionGroupService: PermissionGroupService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private alertsService: AlertsService,
                private chainService: ChainService,
                private initialisationService: InitialisationService,
                private toasterService: ToasterService,
                private loginGuardService: LoginGuardService,
                private logService: LogService,
                public translate: MultilingualService,
                private changeDetectorRef: ChangeDetectorRef,
                private confirmationService: ConfirmationService,
                private loginService: LoginService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {

        this.appConfig = appConfig;

        // we added platformLegal for showing legal name for different version on 26 June 2018, but some other
        // system we don't have it in the environment config. so we handle it here.
        if (typeof appConfig.platformLegal === 'undefined') {
            this.appConfig.platformLegal = 'SETL OpenCSD';
        }

        // language
        this.subscriptionsArray.push(this.requestLanguageObj.subscribe(requested => this.getLanguage(requested)));

        this.setupForms();
    }

    setupForms() {
        this.loginForm = new FormGroup({
            username: new FormControl(''),
            password: new FormControl('', Validators.required),
        });

        this.forgottenPasswordForm = new FormGroup({
            email: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.pattern(/^(((\([A-z0-9]+\))?[^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                ]),
        });

        this.changePasswordForm = new FormGroup(this.getPasswordControls(), this.passwordValidator);

        const controls = Object.assign(
            this.getPasswordControls(),
            {
                oldPassword: new FormControl('', Validators.required),
            },
        );
        this.resetPasswordForm = new FormGroup(controls, [
            (formGroup) => {
                const passwordErrors = formGroup.get('password').errors;
                if (_.isObject(passwordErrors)) delete passwordErrors.same;
                if (formGroup.get('oldPassword').value && formGroup.get('password').value) {
                    formGroup.get('password').setErrors(
                        formGroup.get('oldPassword').value !== formGroup.get('password').value ?
                            (_.isEmpty(passwordErrors) ? null : passwordErrors) :
                            Object.assign({}, passwordErrors, { same: true }));
                }
                return null;
            },
            this.passwordValidator,
        ]);
    }

    getPasswordControls() {
        const validator = this.appConfig.production ? passwordValidator : null;
        return {
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
        };
    }

    hasError(formControl: AbstractControl, error) {
        if (error !== 'required' && formControl.hasError('required')) {
            return false;
        }
        return formControl.touched && (error ? formControl.hasError(error) : formControl.errors);
    }

    getLanguage(requested): void {
        if (requested) {
            this.language = requested;
        }
    }

    ngOnInit() {
        this.isLogin = false;

        this.getQueryParams();

        const params$ = this.activatedRoute.params;
        const data$ = this.activatedRoute.data;
        const combined$ = combineLatest(params$, data$);

        const subscription = combined$.subscribe(([params, data]) => {
            const loggedIn = data['loggedIn'];
            this.resetToken = params['token'];

            if (params['twofactortoken']) {
                this.resetTwoFactorToken = params['twofactortoken'];
                this.showTwoFactorModal = true;
            }

            if (this.resetToken) {
                this.verifyToken(this.resetToken);
            } else if (loggedIn && this.memberSocketService.token) {
                this.resetPassword = true;
            }
        });

        this.subscriptionsArray.push(subscription);

        // Reduce observable subscription
        // Observable.combineLatest(this.authenticationOb, this.siteMenuOb).subscribe(([authentication, siteMenu]) => {
        //     if (Object.keys(siteMenu).length > 0) this.updateState(authentication);
        // });

        const combinedTwoFactor$ = combineLatest(this.authenticationOb, this.forceTwoFactorOb);

        this.subscriptionsArray.push(combinedTwoFactor$.subscribe(([authentication, forceTwoFactor]) => {
            this.userAuthenticationState = authentication;
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

        window.onbeforeunload = null;

        this.logService.log(this.router);
    }

    ngAfterViewInit() {
        if (this.loginForm.controls['username'].value) {
            this.passwordEl.nativeElement.focus();
            return;
        }
        this.usernameEl.nativeElement.focus();
    }

    login(value) {
        if (!this.loginForm.valid) {
            return false;
        }

        // if the alert popup exists.
        // if (document.getElementsByClassName('jaspero__dialog-icon').length > 0) {
        //     // remove the popup and return false.
        //     const elements = document.getElementsByClassName('error');
        //     if (elements.length > 0) {
        //         elements[0].parentNode.removeChild(elements[0]);
        //     }
        //     return false;
        // }

        // Dispatch a login request action.
        // this.ngRedux.dispatch({type: 'my-detail/LOGIN_REQUEST'});
        const loginRequestAction = loginRequestAC();
        this.ngRedux.dispatch(loginRequestAction);

        // Create a saga pipe.
        const asyncTaskPipe = this.myUserService.loginRequest({
            username: value.username,
            password: value.password,
        });

        // Send a saga action.
        // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // saga pipe function descriptor.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FORCE_TWO_FACTOR, SET_LOGIN_DETAIL, SET_AUTH_LOGIN_DETAIL, SET_PRODUCTION],
            [RESET_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL],
            asyncTaskPipe,
            {},
            (data) => {
                if (_.get(data, '[1].Data[0].qrCode', false)) {
                    this.qrCode = data[1].Data[0].qrCode;
                }

                this.loginService.postLoginRequests();
            },
            // Fail to login
            (data) => {
                this.showTwoFactorModal = false;
                this.changeDetectorRef.detectChanges();
                this.handleLoginFailMessage(data);
            },
        ));

        return false;
    }

    updateState(myAuthenData) {
        // When first Login, Perform initial actions.
        if (!this.isLogin && myAuthenData.isLogin) {

            // Set token for membernode connection
            const token = myAuthenData.token;
            this.memberSocketService.token = token;

            if (myAuthenData.mustChangePassword) {
                this.resetPassword = true;
                return;
            }

            // Disable the redirect function for now, as some components need data to render properly.
            // Redirect to the page it was in the url
            // if (this.loginGuardService.redirect !== '') {
            //     this.router.navigateByUrl(this.loginGuardService.redirect);
            //     this.loginGuardService.redirect = '';
            // }else {
            //     const redirect = myAuthenData.defaultHomePage ? myAuthenData.defaultHomePage : '/home';
            //     this.router.navigateByUrl(redirect);
            // }

            const redirect: any = myAuthenData.defaultHomePage ? myAuthenData.defaultHomePage : '/home';

            if (this.queryParams.invitationToken) {
                const extras = {
                    queryParams: {
                        invitationToken: this.queryParams.invitationToken,
                        redirect,
                    },
                };

                this.router.navigate(['consume'], extras);
            } else {
                this.router.navigateByUrl(redirect);
            }

            this.isLogin = true;

            // Request initial data from member node.
            InitialisationService.membernodeInitialisation(
                this.ngRedux,
                this.myWalletsService,
                this.memberSocketService,
                this.channelService,
                this.accountsService,
                this.myUserService,
                this.permissionGroupService,
                this.chainService,
                this.initialisationService,
            );
            window.onbeforeunload = (e) => {
                const leaveMessage = 'Changes that you made may not be saved if you leave this page.';
                e.returnValue = leaveMessage;
                return leaveMessage;
            };
        }
    }

    getQueryParams() {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.queryParams = params;

            if (params.email) {
                this.loginValue = params.email;
            }
            if (params.error) {
                this.displayError();
            }
        });
    }

    displayError() {
        setTimeout(
            () => {
                this.toasterService.pop('error', 'This link is no longer valid. Please try to login again.');
            },
            0,
        );
    }

    passwordValidator(g: FormGroup) {
        if (g.get('password').value && g.get('passwordConfirm').value) {
            g.get('passwordConfirm').setErrors(g.get('password').value === g.get('passwordConfirm').value ?
                null : { mismatch: true });
        }
        return null;
    }

    /**
     * Sets required validator on username
     * Done outside of FormGroup setup as Chrome autofill triggers the required validator until the DOM is clicked
     */
    setUsernameRequired() {
        this.loginForm.controls.username.setValidators(Validators.required);
        if (!this.loginForm.get('username').value) this.loginForm.controls.username.setErrors({ required: true });
    }

    toggleShowPasswords(key) {
        this.showPasswords[key] = !this.showPasswords[key];
    }

    showFPModal() {
        this.isTokenExpired = false;
        this.showModal = true;
    }

    sendEmail() {
        if (this.forgottenPasswordForm.valid) {
            this.emailUser = this.forgottenPasswordForm.controls.email.value;

            const asyncTaskPipe = this.myUserService.forgotPassword(
                {
                    username: this.emailUser,
                    lang: this.language,
                });

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    if (data && data[1] && data[1].Data && data[1].Data[0].Status && data[1].Data[0].Status === 'OK') {
                        this.emailSent = true;
                        const intervalCountdown = setInterval(
                            () => {
                                this.countdown -= 1;
                            },
                            1000,
                        );

                        setTimeout(
                            () => {
                                clearInterval(intervalCountdown);
                                this.closeFPModal();
                            },
                            10000,
                        );
                    } else {
                        this.alertsService.generate(
                            'error',
                            data[1].Data[0].Message,
                        );
                        this.closeFPModal();
                    }
                },
                (data) => {
                    this.alertsService.generate(
                        'error',
                        'Sorry, something went wrong.<br>Please try again later!');
                    this.closeFPModal();
                }),
            );
        }
    }

    verifyToken(token) {
        const asyncTaskPipe = this.myUserService.validToken(
            {
                token,
            });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                if (data && data[1] && data[1].Data && data[1].Data[0].Status && data[1].Data[0].Status === 'OK') {
                    // add a delay to prevent appear effect side effects
                    setTimeout(
                        () => {
                            this.changePassword = true;
                            this.showModal = true;
                        },
                        1500,
                    );
                } else {
                    this.alertsService.generate(
                        'error',
                        data[1].Data[0].Message,
                    );
                }
            },
            () => {
                // add a delay to prevent appear effect side effects
                setTimeout(
                    () => {
                        this.isTokenExpired = true;
                        this.showModal = true;
                    },
                    1500,
                );
            }),
        );
    }

    saveNewPassword() {
        if (this.changePasswordForm.valid) {
            const asyncTaskPipe = this.myUserService.setNewPasswordFromToken(
                {
                    token: this.resetToken,
                    password: this.changePasswordForm.controls.password.value,
                    lang: this.language,
                });

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    if (data && data[1] && data[1].Data && data[1].Data[0].Status && data[1].Data[0].Status === 'OK') {
                        this.changedPassword = true;
                        this.closeFPModal();

                        this.toasterService.pop('success', 'Your password has been changed!');
                    } else {
                        this.alertsService.generate(
                            'error',
                            data[1].Data[0].Message);
                        this.closeFPModal();
                    }
                },
                (data) => {
                    this.alertsService.generate(
                        'error',
                        'Sorry, something went wrong.<br>Please try again later!');
                    this.closeFPModal();
                }),
            );
        }
    }

    resetUserPassword($event: Event) {
        if (this.resetPasswordForm.valid) {
            $event.preventDefault();

            const asyncTaskPipe = this.myUserService.saveNewPassword({
                oldPassword: this.resetPasswordForm.controls.oldPassword.value,
                newPassword: this.resetPasswordForm.controls.password.value,
            });
            const saga = SagaHelper.runAsync(
                [SET_NEW_PASSWORD],
                [],
                asyncTaskPipe,
                {},
                (data) => {
                    const platformName = this.getPlatformName();

                    this.resetPassword = false;
                    this.subscriptionsArray.push(
                        this.alertsService.generate(
                            'success',
                            'Your password has been reset<br><br>A confirmation email will be sent to you.',
                            { buttonMessage: `Continue to ${platformName}` },
                        ).subscribe(() => {
                            if (!this.changedPasswordContinue) {
                                this.changedPasswordContinue = true;
                                this.resetPasswordForm.reset();
                                // Update the state with the new token
                                this.userAuthenticationState.token = data[1].Data[0].Token;
                                // The user has completed mustChangePassword so set to false and...
                                this.userAuthenticationState.mustChangePassword = false;
                                // ...call updateState which will route the user to the homepage
                                this.updateState(this.userAuthenticationState);
                            }
                        }),
                    );
                },
                () => {
                    const message = this.translate.translate(
                        'Please make sure you have entered your current password correctly.');
                    this.alertsService.generate('error', message);
                },
            );

            this.ngRedux.dispatch(saga);
        }
    }

    closeFPModal() {
        this.forgottenPasswordForm.reset();
        this.emailUser = '';
        this.countdown = 10;
        this.showModal = false;
        this.emailSent = false;
        this.changePassword = false;
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    handleLoginFailMessage(data) {
        const responseStatus = _.get(data, '[1].Data[0].Status', 'other').toLowerCase();

        switch (responseStatus) {
        case 'fail':
            this.showLoginErrorMessage(
                'warning',
                '<span mltag="txt_loginerror">Invalid email address or password!</span>',
            );
            break;
        case 'locked':
            this.showLoginErrorMessage(
                'info',
                '<span mltag="txt_accountlocked">' +
                'Sorry, your account has been locked. ' +
                'Please contact your Administrator.</span>',
            );
            break;
        default:
            this.showLoginErrorMessage(
                'error',
                '<span mltag="txt_loginproblem">' +
                'Sorry, there was a problem logging in, please try again.</span>',
            );
            break;
        }
    }

    showLoginErrorMessage(type, msg) {
        this.alertsService.generate(type, msg, { buttonMessage: 'Close' });
    }

    updateLang(lang: string) {
        this.ngRedux.dispatch(setLanguage(lang));
    }

    getLangs() {
        return Object.keys(this.langLabels);
    }

    getLabel(lang: string): string {
        return this.langLabels[lang];
    }

    /**
     * Get platform name string for rendering some message.
     */
    getPlatformName() {
        if (typeof this.appConfig.platform === 'undefined') {
            return 'SETL OpenCSD';
        }

        return this.appConfig.platform;
    }
}
