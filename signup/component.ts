import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import * as _ from 'lodash';
import { MultilingualService } from '@setl/multilingual';
import { APP_CONFIG, AppConfig, ConfirmationService, immutableHelper } from '@setl/utils';
import { ISignupConfiguration, ISignupData } from '@setl/core-login';
import { AccountSignupService } from './service';

@Component({
    selector: 'app-ofi-kyc-signup',
    template: '<app-signup [configuration]="configuration" (signupDataEmit)="setSignupData($event)"></app-signup>',
})
export class AccountSignUpComponent implements OnInit, OnDestroy {
    configuration: ISignupConfiguration;

    private appConfig;
    private signupData: () => ISignupData;

    constructor(private service: AccountSignupService,
                private translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
                private alertsService: AlertsService,
                private toasterService: AlertsService,
                private confirmationService: ConfirmationService,
                private router: Router) {

        this.appConfig = appConfig;

        this.initConfiguration();
    }

    ngOnInit() {
    }

    private initConfiguration(): void {
        const title = this.translate.translate(
            'Sign up to @appConfig.platform@',
            { 'appConfig.platform': this.appConfig.platform });

        const description = this.translate.translate(
            'Your @appConfig.platform@ account will be created with this email address,' +
            'provided by the Asset Management company.',
            { 'appConfig.platform': this.appConfig.platform });

        const buttonText = this.translate.translate('Create Account');

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

            this.service.completeUserSignup(
                signupData.invitationToken,
                signupData.password,
                () => this.onSignupSuccess(resolve),
                () => this.onSignupError(reject),
            );
        });
    }

    private onSignupSuccess(resolve): void {
        this.confirmationService.create(
            'Success',
            `<p><b>${this.translate.translate('Account successfully activated.')}</b></p>`,
            {
                confirmText: this.translate.translate(
                    'Continue to @appConfig.platform@', { 'appConfig.platform': this.appConfig.platform }),
                declineText: '',
                btnClass: 'success',
            },
        ).subscribe(() => {
            resolve();
        });
    }

    private onSignupError(reject): void {
        this.alertsService.create(
            'error',
            `<span class="text-warning">
            ${this.translate.translate('Could not process invitation.')}
            <br>
            ${this.translate.translate('Please try again later.')}
            </span>`,
        );

        reject();
    }

    private validateSignupData(): void {
        if (!this.signupData().invitationToken) {
            this.router.navigateByUrl('/');

            return;
        }

        this.service.readUserInvitation(
            this.signupData().invitationToken,
            (data: any) => this.onReadInvitationSuccess(data),
            (e: any) => this.onReadInvitationError(e),
        );
    }

    private onReadInvitationSuccess(data): void {
        if (!data[1] || !data[1].Data[0] || !data[1].Data[0].email) {
            this.router.navigateByUrl('/');

            return;
        }

        const newConfig = immutableHelper.copy(this.configuration);
        newConfig.username = data[1].Data[0].email;

        this.configuration = newConfig;
    }

    private onReadInvitationError(e): void {
        this.toasterService.create('error', this.translate.translate('Could not validate invitation'));
        this.router.navigateByUrl('/');
    }

    setSignupData(signupData: () => ISignupData): void {
        this.signupData = signupData;

        this.validateSignupData();
    }

    ngOnDestroy() {
    }
}
