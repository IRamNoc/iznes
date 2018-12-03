
import { timer as observableTimer, Observable, Subscription } from 'rxjs';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper, Common } from '@setl/utils';
import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';
import {
    LoginRequestMessageBody,
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
} from './my-user.service.model';
import { NgRedux } from '@angular-redux/store';
import {
    setMembernodeSessionManager,
    resetMembernodeSessionManager,
} from '@setl/core-store';

interface LoginRequestData {
    username: string;
    password: string;
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

/* TIMEOUT + TIMEOUT_COUNTDOWN must be =< session timeout */
const TIMEOUT = 9 * 60 * 1000;
const TIMEOUT_COUNTDOWN = 60;

@Injectable()
export class MyUserService implements OnDestroy {
    subscriptionsArray: Subscription[];

    constructor(private memberSocketService: MemberSocketService) {
        this.subscriptionsArray = [];
    }

    defaultRefreshToken(ngRedux: NgRedux<any>): any {
        let asyncTask;

        try {
            asyncTask = this.refreshToken();
        } catch (e) {
            return false;
        }

        ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTask,
            (data) => {
                // clear timer
                this.ngOnDestroy();

                ngRedux.dispatch(resetMembernodeSessionManager());

                const timer = observableTimer(TIMEOUT, 1000);
                // subscribing to a observable returns a subscription object
                this.subscriptionsArray.push(timer.subscribe((t) => {
                    if (t > TIMEOUT_COUNTDOWN) {
                        this.ngOnDestroy();
                    } else {
                        ngRedux.dispatch(setMembernodeSessionManager(t));
                    }
                }));
            },
            (data) => {
                throw new Error('Fail to refresh session token');
            }));
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
}
