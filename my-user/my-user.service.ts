import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {
    LoginRequestMessageBody,
    UserDetailsRequestMessageBody,
    SaveUserDetailsRequestBody,
    SaveNewPasswordRequestBody,
    RefreshTokenRequestBody
} from './my-user.service.model';
import {NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import {Subscription} from 'rxjs/Subscription';
import {
    setMembernodeSessionManager,
    resetMembernodeSessionManager
} from '@setl/core-store';

interface LoginRequestData {
    username: string;
    password: string;
}

interface UserDetailsData {
    displayName: string;
    firstName: string;
    lastName: string;
    mobilePhone: string;
    addressPrefix: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    postalCode: string;
    country: string;
    memorableQuestion: string;
    memorableAnswer: string;
    profileText: string;
}

interface NewPasswordData {
    oldPassword: string;
    newPassword: string;
}

const TIMEOUT = 14 * 60 * 1000;

@Injectable()
export class MyUserService implements OnDestroy {
    subscriptionsArray: Array<Subscription>;

    constructor(private memberSocketService: MemberSocketService) {
        this.subscriptionsArray = [];
    }

    defaultRefreshToken(ngRedux: NgRedux<any>) {
        const asynTask = this.refreshToken();

        ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asynTask,
            (data) => {
                // clear timer
                this.ngOnDestroy();

                ngRedux.dispatch(resetMembernodeSessionManager());

                const timer = Observable.timer(TIMEOUT, 1000);
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
            CFCountry: '.'
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestMyUserDetails(): any {
        const messageBody: UserDetailsRequestMessageBody = {
            RequestName: 'gud',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveMyUserDetails(userData: UserDetailsData): any {
        const messageBody: SaveUserDetailsRequestBody = {
            RequestName: 'ud',
            token: this.memberSocketService.token,
            displayName: userData.displayName,
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobilePhone: userData.mobilePhone,
            addressPrefix: userData.addressPrefix,
            address1: userData.address1,
            address2: userData.address2,
            address3: userData.address3,
            address4: userData.address4,
            postalCode: userData.postalCode,
            country: userData.country,
            memorableQuestion: userData.memorableQuestion,
            memorableAnswer: userData.memorableAnswer,
            profileText: userData.profileText
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveNewPassword(userData: NewPasswordData): any {
        const messageBody: SaveNewPasswordRequestBody = {
            RequestName: 'setpassword',
            token: this.memberSocketService.token,
            oldPassword: userData.oldPassword,
            newPassword: userData.newPassword
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    refreshToken(): any {
        const messageBody: RefreshTokenRequestBody = {
            RequestName: 'extendsession',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
