import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { SagaHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { UPDATE_TWO_FACTOR } from '@setl/core-store';
import { MyUserService } from '@setl/core-req-services';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-authenticate',
    templateUrl: './authenticate.component.html',
    styleUrls: ['./authenticate.component.scss'],
})
export class AuthenticateComponent implements OnDestroy, OnInit {
    @Input() showQRCode: boolean = true;
    @Input() resetToken: string = '';
    @Output() modalCancelled: EventEmitter<any> = new EventEmitter();
    @Output() verifiedToken: EventEmitter<any> = new EventEmitter();

    connectedWalletId: number;
    username: string;
    userId: number;
    emailUser: string = '';

    twoFactorSecret: string = '';
    sessionTimeout: number = 600;
    showModal: boolean = true;
    showForgottenTwoFactorModal: boolean = false;
    showResetInstruction: boolean = false;
    forgottenTwoFactorForm: FormGroup;
    emailSent = false;
    countdown = 10;
    qrCodeChallengeForm: FormGroup;
    qrCodeURL: string = '';
    qrCodeURLPartial: string = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth://totp/';
    qrAppName: string = 'OpenCSD';

    @select(['user', 'myDetail']) getUserDetails$;
    @select(['user', 'authentication']) authentication$;
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletId$;

    // List of observable subscription
    subscriptionsArray: Subscription[] = [];

    constructor(
        private alertsService: AlertsService,
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private myUserService: MyUserService,
        public translate: MultilingualService,
    ) {
        this.qrCodeChallengeForm = new FormGroup(
            {
                qrCodeNumber: new FormControl(
                    '',
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(6),
                    ]),
                ),
            },
        );

        this.forgottenTwoFactorForm = new FormGroup({
            email: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                ]),
        });
    }

    ngOnInit() {
        if (this.resetToken) {
            this.showModal = false;
            this.verifyTwoFactorToken();
        }

        this.subscriptionsArray.push(this.getUserDetails$.subscribe((userDetails) => {
            this.username = userDetails.username;
            this.userId = userDetails.userId;

            this.subscriptionsArray.push(this.authentication$.subscribe((auth) => {
                this.twoFactorSecret = auth.twoFactorSecret;
                this.sessionTimeout = auth.sessionTimeout;

                this.qrCodeURL =
                    `${this.qrCodeURLPartial}${this.qrAppName}:${this.username}?secret=${this.twoFactorSecret}`;
            }));
        }));

        this.subscriptionsArray.push(this.connectedWalletId$.subscribe((id) => {
            this.connectedWalletId = id;
        }));
    }

    qrCodeChallenge() {
        if (this.qrCodeChallengeForm.valid) {
            // Show loading alert
            this.alertsService.create('loading');

            const qrCodeChallengeResponse = this.qrCodeChallengeForm.controls.qrCodeNumber.value;

            const asyncTaskPipe = this.myUserService.authenticateTwoFactorAuthentication({
                twoFactorCode: qrCodeChallengeResponse,
                secret: String(this.twoFactorSecret),
                userID: String(this.userId),
                type: 'GoogleAuth',
                sessionTimeout: this.sessionTimeout,
            });

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [UPDATE_TWO_FACTOR],
                [],
                asyncTaskPipe,
                {},
                (data) => {
                    this.alertsService.generate('success', data[1].Data[0].Message);
                    this.modalCancelled.emit(true);
                    this.changeDetectorRef.markForCheck();
                },
                (data) => {
                    this.changeDetectorRef.markForCheck();
                    console.error('error: ', data);
                    this.alertsService.generate('error', data[1].Data.Message);
                }),
            );

            this.alertsService.create('clear');
        }
    }

    sendEmail() {
        if (this.forgottenTwoFactorForm.valid) {
            // Show loading alert
            this.alertsService.create('loading');

            this.emailUser = this.forgottenTwoFactorForm.controls.email.value;

            const asyncTaskPipe = this.myUserService.forgotTwoFactor(
                {
                    email: this.emailUser,
                });

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    if (data && data[1] && data[1].Data && data[1].Data[0].Status && data[1].Data[0].Status === 'OK') {
                        this.emailSent = true;
                        const intervalCountdown = setInterval(
                            () => {
                                this.countdown -= 1;
                            },
                            1000,
                        );

                        this.alertsService.create('clear');

                        setTimeout(
                            () => {
                                clearInterval(intervalCountdown);
                                this.closeTwoFactorModal();
                            },
                            5000,
                        );
                    } else {
                        this.alertsService.create('clear');
                        this.alertsService.create(
                            'error',
                            `<span class="text-warning"> ${data[1].Data[0].Message}</span>`,
                        );
                        this.closeTwoFactorModal();
                    }
                },
                () => {
                    this.alertsService.create('clear');
                    this.alertsService.create(
                        'error',
                        '<span class="text-warning">Sorry, your Two-Factor reset request could not be completed.' +
                        '<br>Please try again later!</span>');
                    this.closeTwoFactorModal();
                }),
            );

            this.changeDetectorRef.markForCheck();
        }
    }

    verifyTwoFactorToken() {
        const asyncTaskPipe = this.myUserService.validToken(
            {
                token: this.resetToken,
            });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            (data) => {
                if (data && data[1] && data[1].Data && data[1].Data[0].Status && data[1].Data[0].Status === 'OK') {
                    // add a delay to prevent the appearance of effect side effects
                    setTimeout(
                        () => {
                            this.showResetInstruction = true;
                            this.verifiedToken.emit(true);
                        },
                        1500,
                    );
                } else {
                    this.alertsService.create(
                        'error',
                        `<span class="text-warning">${data[1].Data[0].Message}</span>`);
                }
            },
            () => {
                // add a delay to prevent the appearance of effect side effects
                setTimeout(
                    () => {
                        this.alertsService.create(
                            'error',
                            '<span class="text-warning">Your Two-Factor reset request could not be completed.</span>');
                    },
                    1500,
                );
            }),
        );
    }

    showForgottonTwoFactorModal() {
        this.showForgottenTwoFactorModal = true;
    }

    closeTwoFactorModal() {
        this.modalCancelled.emit(true);
        this.forgottenTwoFactorForm.reset();
        this.countdown = 10;
        this.showForgottenTwoFactorModal = false;
        this.emailSent = false;
        this.changeDetectorRef.markForCheck();
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
