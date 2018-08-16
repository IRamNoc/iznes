import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { AlertsService } from '@setl/jaspero-ng2-alerts';

import { MultilingualService } from '@setl/multilingual';
import { APP_CONFIG, AppConfig, ConfirmationService } from '@setl/utils';
import { ISignupConfiguration, ISignupData } from '@setl/core-login';

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
                private ofiKycService: OfiKycService) {

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
            doLoginAfterCallback: true,
            title,
            description,
            buttonText,
            signupCallback: () => this.signupCallback(),
        };
    }

    private signupCallback(): Promise<void> {
        return new Promise((resolve, reject) => {
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
                    resolve();
                });
            }).catch((e) => {
                this.alertsService.create(
                    'error',
                    '<span class="text-warning">Sorry, something went wrong.<br>Please try again later!</span>',
                );
            });
        });
    }

    setSignupData(signupData: () => ISignupData): void {
        this.signupData = signupData;
    }

    ngOnDestroy() {}
}
