
import { timer as observableTimer, Observable, Subscription } from 'rxjs';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper, Common } from '@setl/utils';
import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';
import {
    LoginRequestMessageBody,
    UserDetailsRequestMessageBody,
    SaveUserDetailsRequestBody,
    SaveTwoFactorAuthenticationBody,
    SaveNewPasswordRequestBody,
    RefreshTokenRequestBody,
    ForgotPasswordRequestBody,
    ValidTokenRequestBody,
    SetNewPasswordFromTokenRequestBody,
    SetLanguageRequestBody,
    GetLanguageRequestBody,
    GetSiteMenuRequestBody,
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

interface TwoFactorAuthenticationData {
    twoFactorAuthentication: string;
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

const TIMEOUT = 14 * 60 * 1000;

@Injectable()
export class MyUserService implements OnDestroy {
    subscriptionsArray: Subscription[];

    constructor(private memberSocketService: MemberSocketService) {
        this.subscriptionsArray = [];
    }

    defaultRefreshToken(ngRedux: NgRedux<any>): any {
        let asynTask;

        try {
            asynTask = this.refreshToken();
        } catch (e) {
            return false;
        }

        ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asynTask,
            (data) => {
                // clear timer
                this.ngOnDestroy();

                ngRedux.dispatch(resetMembernodeSessionManager());

                const timer = observableTimer(TIMEOUT, 1000);
                // // subscribing to a observable returns a subscription object
                this.subscriptionsArray.push(timer.subscribe((t) => {
                    if (t > 60) {
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

    saveTwoFactorAuthentication(userData: TwoFactorAuthenticationData): any {
        const messageBody: SaveTwoFactorAuthenticationBody = {
            RequestName: 'twofactorenroll',
            token: this.memberSocketService.token,
            twoFactorAuthentication: userData.twoFactorAuthentication,
            type: 'GoogleAuth',
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
}
