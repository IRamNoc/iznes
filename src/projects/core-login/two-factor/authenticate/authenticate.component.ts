import { Component, OnInit, ChangeDetectorRef, OnDestroy, Inject, Input, EventEmitter, Output } from '@angular/core';
import { SagaHelper, APP_CONFIG, AppConfig } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { UPDATE_TWO_FACTOR } from '@setl/core-store';
import { MyUserService } from '@setl/core-req-services';
import { MultilingualService } from '@setl/multilingual';
import { LoginService } from '../../login.service';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { ClrLoadingState } from '@clr/angular';

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
    @Input() twoFactorSecret: string = '';
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

    loadingState = ClrLoadingState;
    submitBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
    alert: any = { show: false, type: '', content: '' };

    @select(['user', 'myDetail']) getUserDetails$;
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletId$;

    // List of observable subscription
    subscriptionsArray: Subscription[] = [];

    constructor(
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
     * Authenticates the 2FA code given by the user
     *
     * @return {void}
     */
    authenticate2FACode() {
        if (this.authenticateQRForm.valid) {
            this.submitBtnState = ClrLoadingState.LOADING;

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
                        this.showAlert('success', data[1].Data[0].Message);
                    }

                    this.loginService.postLoginRequests();

                    this.submitBtnState = ClrLoadingState.DEFAULT;
                    this.modalCancelled.emit(true);
                    this.changeDetectorRef.markForCheck();
                },
                (data) => {
                    this.submitBtnState = ClrLoadingState.DEFAULT;

                    this.changeDetectorRef.markForCheck();
                    console.error('error: ', data);
                    this.showAlert('error', data[1].Data[0].Message);

                    if (data[1].Data[0].hasOwnProperty('AccountLocked') && data[1].Data[0].AccountLocked) {
                        this.showAlert('error', this.translate.translate(
                            'Sorry, your account has been locked. Please contact your administrator.'));
                    }
                }),
            );
        }
    }

    /**
     * Sends an email to the user with a link to reset their Two-Factor Authentication code
     *
     * @return {void}
     */
    sendForgottonTwoFactorEmail() {
        if (this.forgottenTwoFactorForm.valid) {
            this.submitBtnState = ClrLoadingState.LOADING;

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

                        setTimeout(
                            () => {
                                clearInterval(intervalCountdown);
                                this.closeTwoFactorModal();
                            },
                            10000,
                        );
                    } else {
                        this.showAlert(
                            'error',
                            data[1].Data[0].Message,
                        );
                        this.closeTwoFactorModal();
                    }
                },
                () => {
                    this.showAlert(
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
     * Simply copy value into clipboard
     *
     * @return {void}
     */
    copyToClipboard(val: string) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
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
                    this.showAlert(
                        'error',
                        data[1].Data[0].Message,
                    );
                }
            },
            () => {
                // add a delay to prevent the appearance of effect side effects
                setTimeout(
                    () => {
                        this.showAlert(
                            'error',
                            this.translate.translate(
                                'Sorry, your Two-Factor reset request could not be completed. Please try again later.'),
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
        this.submitBtnState = ClrLoadingState.DEFAULT;
        this.showForgottenTwoFactorModal = true;
    }

    closeTwoFactorModal() {
        this.modalCancelled.emit(true);
        this.forgottenTwoFactorForm.reset();
        this.countdown = 10;
        this.showForgottenTwoFactorModal = false;
        this.emailSent = false;
        this.submitBtnState = ClrLoadingState.DEFAULT;
        this.changeDetectorRef.markForCheck();
    }

    showAlert(type: 'success' | 'warning' | 'info' | 'error' | 'clear', content: string = '') {
        const alertMapping = {
            success: { type: 'alert-success', icon: 'check-circle' },
            warning: { type: 'alert-warning', icon: 'exclamation-triangle' },
            info: { type: 'alert-info', icon: 'info-circle' },
            error: { type: 'alert-danger', icon: 'exclamation-circle' },
        };

        if (!content || !alertMapping[type]) {
            this.alert.show = false;
            this.changeDetectorRef.detectChanges();
            return;
        }

        setTimeout(
            () => {
                this.alert = {
                    show: true,
                    type: alertMapping[type].type,
                    icon: alertMapping[type].icon,
                    content,
                };
            },
            5,
        );
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
