import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { ConfirmationService, SagaHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { UPDATE_TWO_FACTOR } from '@setl/core-store';
import { MyUserService } from '@setl/core-req-services';
import { MemberSocketService } from '@setl/websocket-service';

@Component({
    selector: 'app-authenticate',
    templateUrl: './authenticate.component.html',
    styleUrls: ['./authenticate.component.scss'],
})
export class AuthenticateComponent implements OnDestroy, OnInit {
    @Input() showQRCode: boolean = true;
    @Output() modalCancelled: EventEmitter<any> = new EventEmitter();

    connectedWalletId: number;
    username: string;
    userId: number;

    twoFactorSecret: string = '';
    sessionTimeout: number = 600;
    showModal: boolean = true;

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
        private memberSocketService: MemberSocketService,
        private changeDetectorRef: ChangeDetectorRef,
        private myUserService: MyUserService,
        private confirmationService: ConfirmationService,
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
    }

    ngOnInit() {
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

    ngOnDestroy() {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
