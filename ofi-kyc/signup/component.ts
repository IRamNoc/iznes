import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';

import { MultilingualService } from '@setl/multilingual';
import { SagaHelper, APP_CONFIG, AppConfig, ConfirmationService } from '@setl/utils';
import { ISignupConfiguration, ISignupData } from '@setl/core-login';
import { MyUserService } from '@setl/core-req-services';

import {
    SET_LOGIN_DETAIL, RESET_LOGIN_DETAIL, loginRequestAC,
    SET_AUTH_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL,
    SET_PRODUCTION,
} from '@setl/core-store';

import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';

@Component({
    selector: 'app-ofi-kyc-signup',
    template: '<app-signup [configuration]="configuration" (signupDataEmit)="setSignupData($event)"></app-signup>',
})
export class OfiSignUpComponent implements OnInit, OnDestroy {

    configuration: ISignupConfiguration;

    private appConfig;
    private signupData: () => ISignupData;

    constructor(private translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
                private alertsService: AlertsService,
                private confirmationService: ConfirmationService,
                private ofiKycService: OfiKycService,
                private redux: NgRedux<any>,
                private myUserService: MyUserService,
                private router: Router) {

        this.appConfig = appConfig;

        this.initConfiguration();
    }

    ngOnInit() { }

    private initConfiguration(): void {
        const title = this.translate.translate(
            'Sign up to @appConfig.platform@',
            { 'appConfig.platform': this.appConfig.platform });

        const description = this.translate.translate(
            'Your @appConfig.platform@ account will be created with this email address,' +
            'provided by the Asset Management company.',
            { 'appConfig.platform': this.appConfig.platform });

        const buttonText = this.translate.translate('Create an account');

        this.configuration = {
            title,
            description,
            buttonText,
            signupCallback: () => this.signupCallback(),
        };
    }

    private signupCallback(): void {
        const signupData = this.signupData();

        this.ofiKycService.createUser({
            token: signupData.invitationToken,
            email: signupData.username,
            password: signupData.password,
            lang: signupData.language,
        }).then(() => {
            this.confirmationService.create(
                'Success',
                '<p><b>Your account was created</b></p><p>A confirmation email was sent to you.</p>',
                {
                    confirmText: 'Continue to ' + this.appConfig.platform,
                    declineText: '',
                    btnClass: 'success',
                },
            ).subscribe(() => {
                this.loginAfterSignup(signupData.username, signupData.password);
            });
        }).catch((e) => {
            this.alertsService.create(
                'error',
                '<span class="text-warning">Sorry, something went wrong.<br>Please try again later!</span>',
            );
        });
    }

    private loginAfterSignup(username: string, password: string): void {
        const loginRequestAction = loginRequestAC();
        this.redux.dispatch(loginRequestAction);

        const asyncTaskPipe = this.myUserService.loginRequest({
            username,
            password,
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

    setSignupData(signupData: () => ISignupData): void {
        this.signupData = signupData;
    }

    ngOnDestroy() {}
}
