
import {timer as observableTimer, Observable, Subscription, Subject, interval} from 'rxjs';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import {MemberSocketService, WalletNodeSocketService} from '@setl/websocket-service';
import { SagaHelper, Common } from '@setl/utils';
import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';
import {
    LoginRequestMessageBody,
    LoginSSORequestMessageBody,
    UserDetailsRequestMessageBody,
    SaveUserDetailsRequestBody,
    SetTwoFactorAuthenticationBody,
    AuthenticateTwoFactorAuthenticationBody,
    GetTwoFactorQrCodeBody,
    ForgotTwoFactorRequestBody,
    ResetTwoFactorRequestBody,
    SaveNewPasswordRequestBody,
    RefreshTokenRequestBody,
    ForgotPasswordRequestBody,
    ValidTokenRequestBody,
    SetNewPasswordFromTokenRequestBody,
    SetLanguageRequestBody,
    GetLanguageRequestBody,
    GetSiteMenuRequestBody,
    StatusNotificationsMessageBody,
    RegisterNotificationsMessageBody,
    TruncateNotificationsMessageBody,
    RemoveNotificationsMessageBody,
    TestNotificationsMessageBody,
    GetAlertsRequestBody,
    MarkAlertAsReadRequestBody,
} from './my-user.service.model';
import { NgRedux, select } from '@angular-redux/store';
import {
    setMembernodeSessionManager,
    resetMembernodeSessionManager,
} from '@setl/core-store';
import {takeUntil} from "rxjs/operators";
import { throttle } from 'rxjs/operators';
import {Router} from "@angular/router";

interface LoginRequestData {
    username: string;
    password: string;
}

interface LoginSSORequestData {
    emailAddress: string;
    accessToken: string;
}

interface UserDetailsData {
    displayName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    mobilePhone?: string;
    addressPrefix?: string;
    address1?: string;
    address2?: string;
    address3?: string;
    address4?: string;
    postalCode?: string;
    country?: string;
    companyName?: string;
    phoneCode?: string;
    phoneNumber?: string;
    defaultHomePage?: string;
    memorableQuestion?: string;
    memorableAnswer?: string;
    profileText?: string;
}

interface SetTwoFactorAuthenticationData {
    twoFactorAuthentication: string;
    type: string;
}

interface AuthenticateTwoFactorData {
    twoFactorCode: string;
    userID: string;
    type: string;
}

interface ForgotTwoFactorData {
    email: string;
}

interface ResetTwoFactorData {
    resetToken: string;
}

interface NewPasswordData {
    oldPassword: string;
    newPassword: string;
}

interface ForgotPasswordData {
    username: string;
    lang: string;
}

interface ValidTokenData {
    token: string;
}

interface SetNewPasswordFromTokenData {
    token: string;
    password: string;
    lang: string;
}

interface SetLanguageTokenData {
    lang: any;
}

interface GetLanguageTokenData {
    userID: string;
}

@Injectable()
export class MyUserService implements OnDestroy {
    @select(['user', 'myDetail', 'sessionTimeoutSecs']) sessionTimeoutSecsOb;
    private subscriptionsArray: Subscription[] = [];
    private TIMEOUT_COUNTDOWN: number = 60; // Modal countdown seconds
    private TIMEOUT: number; // Milliseconds until modal displayed
    private cleanTimer$: Subject<boolean> =  new Subject();
    public readonly logout$: Subject<boolean> =  new Subject();
    private userActive$: Observable<Event>;
    private counterStarted = false;

    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
        private router: Router,
        private walletSocket: WalletNodeSocketService,
    ) {
        // TIMEOUT + TIMEOUT_COUNTDOWN must be <= session timeout
        this.subscriptionsArray.push(this.sessionTimeoutSecsOb.subscribe((sessionTimeoutSecs) => {
            this.TIMEOUT = sessionTimeoutSecs ? (sessionTimeoutSecs - this.TIMEOUT_COUNTDOWN) * 1000 : 0;
        }));
    }

    /**
     * Do thing after logged in.
     */
    loginInit() {
        // auto extend session if user is active
        this.watchIfUserActive();
    }

    /**
     * Monitor user mouse movement, to check if user active.
     * if user active, we extend the toke automatically.
     */
    watchIfUserActive() {
        this.userActive$ = Observable.fromEvent(window, "mousemove");
        this.userActive$.pipe(
            takeUntil(this.logout$),
            // throttle the mouse movement for "timeout" (timeout is number of millisecond for section timeout - 1 minute)
            throttle(val => interval(this.TIMEOUT / 2)),
        ).subscribe(() => {
            if (!this.counterStarted) {
                this.defaultRefreshToken();
            }
        });
    }

    defaultRefreshToken(): any {
        let asyncTask;

        try {
            asyncTask = this.refreshToken();
        } catch (e) {
            return false;
        }

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTask,
            (data) => {
                this.startSessionTimeoutWatcher()
            },
            (data) => {
                console.error('Fail to refresh session token: ', data);
            }));
    }

    startSessionTimeoutWatcher() {
        // clear timer
        this.cleanTimer$.next(true);
        this.counterStarted = false;

        this.ngRedux.dispatch(resetMembernodeSessionManager());

        const timer = observableTimer(this.TIMEOUT, 1000);
        // subscribing to a observable returns a subscription object
        timer.pipe(
            takeUntil(this.cleanTimer$)
        ).subscribe((t) => {
            this.counterStarted = true;
            if (t > this.TIMEOUT_COUNTDOWN) {
                this.cleanTimer$.next(true);
            } else {
                this.ngRedux.dispatch(setMembernodeSessionManager(t));
            }
        });

    }

    isReady() {
        return this.memberSocketService.token && this.memberSocketService.token !== 'twoFactorRequired';
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    loginRequest(loginData: LoginRequestData): any {
        const messageBody: LoginRequestMessageBody = {
            RequestName: 'Login',
            UserName: loginData.username,
            Password: loginData.password,
            CFCountry: '.',
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    loginSSORequest(loginSSOData: LoginSSORequestData): any {
        const messageBody: LoginSSORequestMessageBody = {
            RequestName: 'LoginSSO',
            emailAddress: loginSSOData.emailAddress,
            accessToken: loginSSOData.accessToken,
            CFCountry: '.',
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestMyUserDetails(): any {
        const messageBody: UserDetailsRequestMessageBody = {
            RequestName: 'gud',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveMyUserDetails(userData: UserDetailsData): any {
        const messageBody: SaveUserDetailsRequestBody = {
            ...{
                RequestName: 'ud',
                token: this.memberSocketService.token,
            }, ...userData,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    setTwoFactorAuthentication(userData: SetTwoFactorAuthenticationData): any {
        const messageBody: SetTwoFactorAuthenticationBody = {
            RequestName: 'settwofactor',
            token: String(this.memberSocketService.token),
            twoFactorAuthentication: userData.twoFactorAuthentication,
            type: userData.type || 'GoogleAuth',
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    authenticateTwoFactorAuthentication(userData: AuthenticateTwoFactorData): any {
        const messageBody: AuthenticateTwoFactorAuthenticationBody = {
            RequestName: 'authenticatetwofactor',
            twoFactorCode: userData.twoFactorCode,
            userID: userData.userID,
            type: userData.type || 'GoogleAuth',
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getTwoFactorQrCode(): any {
        const messageBody: GetTwoFactorQrCodeBody = {
            RequestName: 'gettwofactorqrcode',
            token: String(this.memberSocketService.token),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    forgotTwoFactor(data: ForgotTwoFactorData): any {
        const messageBody: ForgotTwoFactorRequestBody = {
            RequestName: 'forgottwofactor',
            email: data.email,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    resetTwoFactor(data: ResetTwoFactorData): any {
        const messageBody: ResetTwoFactorRequestBody = {
            RequestName: 'resettwofactor',
            resetToken: data.resetToken,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveNewPassword(userData: NewPasswordData): any {
        const messageBody: SaveNewPasswordRequestBody = {
            RequestName: 'setpassword',
            token: this.memberSocketService.token,
            oldPassword: userData.oldPassword,
            newPassword: userData.newPassword,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    refreshToken(): any {
        if (!this.memberSocketService.token) {
            throw new Error('Fail to refresh token, due to token is missing');
        }

        const messageBody: RefreshTokenRequestBody = {
            RequestName: 'extendsession',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    forgotPassword(data: ForgotPasswordData): any {
        const messageBody: ForgotPasswordRequestBody = {
            RequestName: 'forgotpassword',
            username: data.username,
            lang: data.lang,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    validToken(data: ValidTokenData): any {
        const messageBody: ValidTokenRequestBody = {
            RequestName: 'validresettoken',
            resetToken: data.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    setNewPasswordFromToken(data: SetNewPasswordFromTokenData): any {
        const messageBody: SetNewPasswordFromTokenRequestBody = {
            RequestName: 'setnewpasswordfromtoken',
            resetToken: data.token,
            newPassword: data.password,
            lang: data.lang,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    setLanguage(data: SetLanguageTokenData): any {
        const messageBody: SetLanguageRequestBody = {
            RequestName: 'setlanguage',
            token: this.memberSocketService.token,
            lang: data.lang,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getLanguage(data: GetLanguageTokenData): any {
        const messageBody: GetLanguageRequestBody = {
            RequestName: 'getlanguage',
            token: this.memberSocketService.token,
            userID: data.userID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getSiteMenu(redux: NgRedux<any>): any {
        const token = redux.getState().user.authentication.token;
        const messageBody: GetSiteMenuRequestBody = {
            RequestName: 'getmenuspec',
            token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /*
     * Update default home page of a user
     * @param: {string} homepage
     */
    updateHomePage(homepage: string): any {
        const messageBody: SaveUserDetailsRequestBody =
        {
            RequestName: 'ud',
            token: this.memberSocketService.token,
            defaultHomePage: homepage,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    statusNotifications(): any {
        const messageBody: StatusNotificationsMessageBody = {
            RequestName: 'queueStatus',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    registerNotifications(): any {
        const messageBody: RegisterNotificationsMessageBody = {
            RequestName: 'queueRegister',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    truncateNotifications(): any {
        const messageBody: TruncateNotificationsMessageBody = {
            RequestName: 'queueTruncate',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    removeNotifications(): any {
        const messageBody: RemoveNotificationsMessageBody = {
            RequestName: 'queueRemove',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    testNotifications(): any {
        const messageBody: TestNotificationsMessageBody = {
            RequestName: 'queueTest',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getAlerts(): any {
        const messageBody: GetAlertsRequestBody = {
            RequestName: 'getAlerts',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    markAlertAsRead(alertID: number): any {
        const messageBody: MarkAlertAsReadRequestBody = {
            RequestName: 'markAlertAsRead',
            token: this.memberSocketService.token,
            alertID: alertID,
        };
        
        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    async logout(): Promise<any> {
        this.walletSocket.clearConnection();
        this.logout$.next(true);

        this.memberSocketService.token = '';
        this.ngRedux.dispatch({ type: 'USER_LOGOUT' });

        await this.memberSocketService.connect();

        this.router.navigate(['login']);
    }
}
