import { Component, OnInit, ChangeDetectorRef, OnDestroy, Inject, Input, EventEmitter, Output } from '@angular/core';
import { SagaHelper, APP_CONFIG, AppConfig } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { UPDATE_TWO_FACTOR } from '@setl/core-store';
import { MyUserService } from '@setl/core-req-services';
import { MultilingualService } from '@setl/multilingual';
import { LoginService } from '../../login.service';
import { style, state, animate, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-authenticate',
    templateUrl: './authenticate.component.html',
    styleUrls: ['./authenticate.component.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(500, style({ opacity: 1 })),
            ]),
            state('*', style({ opacity: 1 })),
        ]),
    ],
})
export class AuthenticateComponent implements OnDestroy, OnInit {
    @Input() qrCode: string = '';
    @Input() showSuccessAlert: boolean = false;
    @Input() resetToken: string = '';
    @Input() displayAsModals: boolean = true;
    @Output() modalCancelled: EventEmitter<any> = new EventEmitter();
    @Output() verifiedToken: EventEmitter<any> = new EventEmitter();
    @Output() clearToken: EventEmitter<any> = new EventEmitter();

    appConfig: AppConfig;
    connectedWalletId: number;
    username: string;
    userId: number;
    emailUser: string = '';

    showModal: boolean = true;
    showForgottenTwoFactorModal: boolean = false;
    showResetInstruction: boolean = false;
    forgottenTwoFactorForm: FormGroup;
    emailSent = false;
    countdown = 10;
    authenticateQRForm: FormGroup;

    @select(['user', 'myDetail']) getUserDetails$;
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
        private loginService: LoginService,
        @Inject(APP_CONFIG) appConfig: AppConfig,
        ) {
        this.appConfig = appConfig;

        this.authenticateQRForm = new FormGroup(
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
                    Validators.pattern(/^(((\([A-z0-9]+\))?[^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
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
        }));

        this.subscriptionsArray.push(this.connectedWalletId$.subscribe((id) => {
            this.connectedWalletId = id;
        }));
    }

    /**
     * Authenticates the QR code given by the user
     *
     * @return {void}
     */
    authenticateQRCode() {
        if (this.authenticateQRForm.valid) {
            // Show loading alert
            this.alertsService.create('loading');

            const qrCodeNumber = this.authenticateQRForm.controls.qrCodeNumber.value;

            const asyncTaskPipe = this.myUserService.authenticateTwoFactorAuthentication({
                twoFactorCode: qrCodeNumber,
                userID: String(this.userId),
                type: 'GoogleAuth',
            });

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [UPDATE_TWO_FACTOR],
                [],
                asyncTaskPipe,
                {},
                (data) => {
                    if (this.showSuccessAlert) {
                        this.alertsService.generate('success', data[1].Data[0].Message);
                    }

                    this.loginService.postLoginRequests();

                    this.modalCancelled.emit(true);
                    this.changeDetectorRef.markForCheck();
                },
                (data) => {
                    this.changeDetectorRef.markForCheck();
                    console.error('error: ', data);
                    this.alertsService.generate('error', data[1].Data[0].Message);

                    if (data[1].Data[0].hasOwnProperty('AccountLocked') && data[1].Data[0].AccountLocked) {
                        const lockedMessage = this.translate.translate(
                            'Sorry, your account has been locked. Please contact your Administrator.');
                        this.alertsService.generate(
                            'info',
                            lockedMessage,
                            { buttonMessage: this.translate.translate('Close') });
                    }
                }),
            );

            this.alertsService.create('clear');
        }
    }

    /**
     * Sends an email to the user with a link to reset their Two-Factor Authentication code
     *
     * @return {void}
     */
    sendForgottonTwoFactorEmail() {
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
                            10000,
                        );
                    } else {
                        this.alertsService.create('clear');
                        this.alertsService.generate(
                            'error',
                            data[1].Data[0].Message,
                        );
                        this.closeTwoFactorModal();
                    }
                },
                () => {
                    this.alertsService.create('clear');
                    this.alertsService.generate(
                        'error',
                        this.translate.translate(
                            'Sorry, your Two-Factor reset request could not be completed. Please try again later'),
                        );
                    this.closeTwoFactorModal();
                }),
            );

            this.changeDetectorRef.markForCheck();
        }
    }

    /**
     * Validates the reset token sent to the user following a request to reset their Two-Factor Authentication code
     *
     * @return {void}
     */
    verifyTwoFactorToken() {
        const asyncTaskPipe = this.myUserService.resetTwoFactor(
            {
                resetToken: this.resetToken,
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
                    this.alertsService.generate(
                        'error',
                        data[1].Data[0].Message,
                    );
                }
            },
            () => {
                // add a delay to prevent the appearance of effect side effects
                setTimeout(
                    () => {
                        this.alertsService.generate(
                            'error',
                            this.translate.translate('Your Two-Factor reset request could not be completed.'),
                        );
                        this.clearToken.emit(true);
                        this.closeTwoFactorModal();
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
