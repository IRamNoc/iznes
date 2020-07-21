import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { select } from '@angular-redux/store';
import { Observable, Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MultilingualService } from '@setl/multilingual';
import { APP_CONFIG, AppConfig, ConfirmationService } from '@setl/utils';
import { ISignupConfiguration, ISignupData } from '@setl/core-login';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { ConsumeTokenService } from '../invitation-token/consume-token.service';

@Component({
    selector: 'app-ofi-kyc-signup',
    template: '<app-signup [configuration]="configuration" (signupDataEmit)="setSignupData($event)"></app-signup>',
})
export class OfiSignUpComponent implements OnInit, OnDestroy {
    configuration: ISignupConfiguration;

    private unsubscribe: Subject<any> = new Subject<any>();
    private appConfig;
    private signupData: () => ISignupData;

    @select(['user', 'authentication']) authenticationOb: Observable<any>;

    constructor(private translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
                private alertsService: AlertsService,
                private confirmationService: ConfirmationService,
                private ofiKycService: OfiKycService,
                private router: Router,
                private consumeTokenService: ConsumeTokenService) {

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
            'Your @appConfig.platform@ account will be created with this email address, provided by the Asset Management company.', { 'appConfig.platform': this.appConfig.platform });

        const buttonText = this.translate.translate('Create Account');

        this.configuration = {
            doLoginAfterCallback: true,
            doLoginRedirect: false,
            title,
            description,
            buttonText,
            signupCallback: () => this.signupCallback(),
        };
    }

    private signupCallback(): Promise<any> {
        return new Promise((resolve, reject) => {
            const signupData = this.signupData();

            this.ofiKycService.createUser({
                token: signupData.invitationToken,
                email: signupData.username,
                password: signupData.password,
                lang: signupData.language,
            }).then(() => {
                this.consumeToken();

                // Resolve so user gets logged in and has a token
                resolve(this.translate.translate('Your account was created successfully. A confirmation email was sent to you.'));

                this.authenticationOb.pipe(takeUntil(this.unsubscribe)).subscribe(
                    (authentication) => {
                        this.updateState(authentication);
                    });
                // });
            }).catch((e) => {
                reject('Sorry, something went wrong. Please try again later.');
            });
        });
    }

    private consumeToken() {
        if (this.signupData().invitationToken) {
            this.consumeTokenService.consumeToken(this.signupData().invitationToken);
        }
    }

    private updateState(myAuthenData) {
        if (myAuthenData.isLogin) {
            const redirect = myAuthenData.defaultHomePage ? myAuthenData.defaultHomePage : '/home';

            const params = {
                invitationToken: this.signupData().invitationToken,
                redirect,
            };

            this.consumeTokenService.redirect(params);
        }
    }

    setSignupData(signupData: () => ISignupData): void {
        this.signupData = signupData;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
