// Vendors
import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';
import {LoginGuardService} from "./login-guard.service";
import * as _ from 'lodash';
// Internals
import {APP_CONFIG, AppConfig, SagaHelper} from '@setl/utils';
import {
    AccountsService,
    ChainService,
    ChannelService,
    InitialisationService,
    MyUserService,
    MyWalletsService,
    PermissionGroupService
} from '@setl/core-req-services';
import {
    loginRequestAC,
    RESET_AUTH_LOGIN_DETAIL,
    RESET_LOGIN_DETAIL,
    SET_AUTH_LOGIN_DETAIL,
    SET_LOGIN_DETAIL,
    SET_PRODUCTION
} from '@setl/core-store';
import {MemberSocketService} from '@setl/websocket-service';
import {ToasterService} from 'angular2-toaster';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {Subscription} from 'rxjs/Subscription';

/* Dectorator. */
@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css'],
})

/* Class. */
export class SetlLoginComponent implements OnDestroy, OnInit, AfterViewInit {
    appConfig: AppConfig;

    // Locale
    language = 'fr';

    isLogin: boolean;

    loginForm: FormGroup;
    username: AbstractControl;
    password: AbstractControl;

    forgottenPasswordForm: FormGroup;
    email: AbstractControl;

    changePasswordForm: FormGroup;
    showPasswords1 = false;
    showPasswords2 = false;

    changedPassword = false;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    showModal = false;
    emailUser = '';
    emailSent = false;
    countdown = 5;
    resetToken = '';
    isTokenExpired = false;
    changePassword = false;

    // List of redux observable.
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'authentication']) authenticationOb;

    /* Constructor. */
    constructor(private ngRedux: NgRedux<any>,
                private myUserService: MyUserService,
                private memberSocketService: MemberSocketService,
                private myWalletsService: MyWalletsService,
                private channelService: ChannelService,
                private accountsService: AccountsService,
                private permissionGroupService: PermissionGroupService,
                private router: Router,
                private _activatedRoute: ActivatedRoute,
                private alertsService: AlertsService,
                private chainService: ChainService,
                private initialisationService: InitialisationService,
                private toasterService: ToasterService,
                private loginGuardService: LoginGuardService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {

        this.appConfig = appConfig;

        // language
        this.subscriptionsArray.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));

        /**
         * Form control setup
         */
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
        /**
         * Form control setup
         */
        this.forgottenPasswordForm = new FormGroup({
            email: new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                ])),
        });
        /**
         * Form control setup
         */
        this.changePasswordForm = new FormGroup({
            password: new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6)
                ])
            ),
            passwordConfirm: new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6)
                ])
            )
        }, this.passwordValidator);

    }

    getLanguage(requested): void {
        if (requested) {
            this.language = requested;
        }
    }

    ngOnInit() {
        this.isLogin = false;

        this.subscriptionsArray.push(this._activatedRoute.params.subscribe(params => {
            this.resetToken = params['token'];
            if (typeof this.resetToken !== 'undefined' && this.resetToken !== '') {
                this.verifyToken(this.resetToken);
            }
        }));

        // Reduce observable subscription
        this.subscriptionsArray.push(this.authenticationOb.subscribe(authentication => {
            this.updateState(authentication);
        }));

        window.onbeforeunload = null;

        console.log(this.router);

    }

    ngAfterViewInit() {
        document.getElementById('username-field').focus();
    }

    login(value) {

        if (!this.loginForm.valid) {
            return false;
        }

        // if the alert popup exists.
        if (document.getElementsByClassName('jaspero__dialog-icon').length > 0) {
            // remove the popup and return false.
            const elements = document.getElementsByClassName('error');
            if (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
            return false;
        }

        // Dispatch a login request action.
        // this.ngRedux.dispatch({type: 'my-detail/LOGIN_REQUEST'});
        const loginRequestAction = loginRequestAC();
        this.ngRedux.dispatch(loginRequestAction);

        // Create a saga pipe.
        const asyncTaskPipe = this.myUserService.loginRequest({
            username: value.username,
            password: value.password
        });

        // Send a saga action.
        // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // saga pipe function descriptor.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_LOGIN_DETAIL, SET_AUTH_LOGIN_DETAIL, SET_PRODUCTION],
            [RESET_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL],
            asyncTaskPipe,
            {},
            () => {
            },
            // Fail to login
            (data) => {
                this.handleLoginFailMessage(data);
            }
        ));

        return false;
    }

    updateState(myAuthenData) {
        // When first Login, Perform initial actions.
        if (!this.isLogin && myAuthenData.isLogin) {

            // Disable the redirect function for now, as some components need data to render properly.
            // Redirect to the page it was in the url
            // if (this.loginGuardService.redirect !== '') {
            //     this.router.navigateByUrl(this.loginGuardService.redirect);
            //     this.loginGuardService.redirect = '';
            // }else {
            //     const redirect = myAuthenData.defaultHomePage ? myAuthenData.defaultHomePage : '/home';
            //     this.router.navigateByUrl(redirect);
            // }

            const redirect = myAuthenData.defaultHomePage ? myAuthenData.defaultHomePage : '/home';
            this.router.navigateByUrl(redirect);

            this.isLogin = true;

            // Set token for membernode connection
            const token = myAuthenData.token;
            this.memberSocketService.token = token;

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
                this.initialisationService
            );
            window.onbeforeunload = function (e) {
                const leaveMessage = 'Changes that you made may not be saved if you leave this page.';
                e.returnValue = leaveMessage;
                return leaveMessage;
            };
        }

    }

    passwordValidator(g: FormGroup) {
        return (g.get('password').value === g.get('passwordConfirm').value) ? null : {'mismatch': true};
    }

    toggleShowPasswords(num) {
        if (num === 1) {
            this.showPasswords1 = (this.showPasswords1 === false) ? true : false;
        } else if (num === 2) {
            this.showPasswords2 = (this.showPasswords2 === false) ? true : false;
        }
    }

    showFPModal() {
        this.isTokenExpired = false;
        this.showModal = true;
    }

    sendEmail(formValues) {
        this.emailUser = formValues.email;

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
                    let intervalCountdown = setInterval(() => {
                        this.countdown--;
                    }, 1000);

                    setTimeout(() => {
                        clearInterval(intervalCountdown);
                        this.closeFPModal();
                    }, 5000);
                } else {
                    this.alertsService.create('error', '<span class="text-warning">' + data[1].Data[0].Message + '</span>');
                    this.closeFPModal();
                }
            },
            (data) => {
                this.alertsService.create('error', '<span class="text-warning">Sorry, something went wrong.<br>Please try again later!</span>');
                this.closeFPModal();
            })
        );
    }

    verifyToken(token) {
        const asyncTaskPipe = this.myUserService.validToken(
            {
                token: token
            });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                if (data && data[1] && data[1].Data && data[1].Data[0].Status && data[1].Data[0].Status === 'OK') {
                    // add a delay to prevent appear effect side effects
                    setTimeout(() => {
                        this.changePassword = true;
                        this.showModal = true;
                    }, 1500);
                } else {
                    this.alertsService.create('error', '<span class="text-warning">' + data[1].Data[0].Message + '</span>');
                }
            },
            (data) => {
                // add a delay to prevent appear effect side effects
                setTimeout(() => {
                    this.isTokenExpired = true;
                    this.showModal = true;
                }, 1500);
            })
        );
    }

    saveNewPassword(formValues) {
        const asyncTaskPipe = this.myUserService.setNewPasswordFromToken(
            {
                token: this.resetToken,
                password: formValues.password,
                lang: this.language
            });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                if (data && data[1] && data[1].Data && data[1].Data[0].Status && data[1].Data[0].Status === 'OK') {
                    this.changedPassword = true;
                    this.closeFPModal();

                    this.toasterService.pop('success', 'Your password has been changed!');
                } else {
                    this.alertsService.create('error', '<span class="text-warning">' + data[1].Data[0].Message + '</span>');
                    this.closeFPModal();
                }
            },
            (data) => {
                this.alertsService.create('error', '<span class="text-warning">Sorry, something went wrong.<br>Please try again later!</span>');
                this.closeFPModal();
            })
        );
    }

    closeFPModal() {
        this.forgottenPasswordForm.reset();
        this.emailUser = '';
        this.countdown = 5;
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
                this.showLoginErrorMessage('warning',
                    '<span mltag="txt_loginerror" class="text-warning">Invalid email address or password!</span>'
                );
                break;
            case 'locked':
                this.showLoginErrorMessage('info',
                    '<span mltag="txt_accountlocked" class="text-warning">Sorry, your account has been locked. ' +
                    'Please contact Setl support.</span>'
                );
                break;
            default:
                this.showLoginErrorMessage('error',
                    '<span mltag="txt_loginproblem" class="text-warning">Sorry, there was a problem logging in, please try again.</span>'
                );
                break;
        }
    }

    showLoginErrorMessage(type, msg) {
        this.alertsService.create(type, msg, {buttonMessage: 'Please try again to log in'});
    }
}
