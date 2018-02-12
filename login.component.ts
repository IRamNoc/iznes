// Vendors
import {Component, OnDestroy, Inject, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {
    FormGroup,
    Validators,
    AbstractControl,
    FormControl
} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';
import * as _ from 'lodash';

// Internals
import {SagaHelper, APP_CONFIG, AppConfig} from '@setl/utils';
import {
    MyUserService,
    InitialisationService,
    MyWalletsService,
    ChannelService,
    AccountsService,
    PermissionGroupService,
    ChainService
} from '@setl/core-req-services';
import {
    SET_LOGIN_DETAIL, RESET_LOGIN_DETAIL, loginRequestAC,
    SET_AUTH_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL,
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
export class SetlLoginComponent implements OnDestroy, OnInit {
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

    showForgottenPasswordModal = false;
    emailUser = '';
    emailSent = false;
    countdown = 5;
    token = '';
    isTokenExpired = false;
    changePassword = false;

    showForgottenPasswordModal = true;
    changePassword = true;

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
                @Inject(APP_CONFIG) appConfig: AppConfig) {

        // language
        this.subscriptionsArray.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));

        this.appConfig = appConfig;

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
        // console.log('Language changed from ' + this.language + ' to ' + requested);
        if (requested) {
            switch (requested) {
                case 'fra':
                    this.language = 'fr';
                    break;
                case 'eng':
                    this.language = 'en';
                    break;
                default:
                    this.language = 'en';
                    break;
            }
        }
    }

    ngOnInit() {
        this.isLogin = false;

        this.subscriptionsArray.push(this._activatedRoute.params.subscribe(params => {
            this.token = params['token'];
            if (typeof this.token !== 'undefined' && this.token !== '') {
                this.verifyToken(this.token);
            }
        }));

        // Reduce observable subscription
        this.subscriptionsArray.push(this.authenticationOb.subscribe(authentication => {
            this.updateState(authentication);
        }));

        window.onbeforeunload = null;

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
            this.router.navigateByUrl('/home');

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
        this.showForgottenPasswordModal = true;
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
                // console.log('error: ', data);
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
                    this.changePassword = true;
                    this.showForgottenPasswordModal = true;
                } else {
                    // this.isTokenExpired = true;
                    this.alertsService.create('error', '<span class="text-warning">' + data[1].Data[0].Message + '</span>');
                }
                this.changePassword = true;
                this.showForgottenPasswordModal = true;
            },
            (data) => {
                // console.log('error: ', data);
                this.isTokenExpired = true;
                this.showForgottenPasswordModal = true;
            })
        );
        // // just to test
        // this.changePassword = true;
        // this.showForgottenPasswordModal = true;
    }

    saveNewPassword(formValues) {
        const asyncTaskPipe = this.myUserService.setNewPasswordFromToken(
            {
                token: this.token,
                password: formValues.password,
                lang: this.language
            });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                if (data && data[1] && data[1].Data && data[1].Data[0].Status && data[1].Data[0].Status === 'OK') {
                    this.changedPassword = true;
                    this.closeFPModal();
                } else {
                    this.alertsService.create('error', '<span class="text-warning">' + data[1].Data[0].Message + '</span>');
                    this.closeFPModal();
                }
            },
            (data) => {
                // console.log('error: ', data);
                this.alertsService.create('error', '<span class="text-warning">Sorry, something went wrong.<br>Please try again later!</span>');
                this.closeFPModal();
            })
        );
    }

    closeFPModal() {
        this.forgottenPasswordForm.reset();
        this.emailUser = '';
        this.countdown = 3;
        this.showForgottenPasswordModal = false;
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
