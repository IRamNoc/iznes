import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ConfirmationService, SagaHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { Subscription } from 'rxjs/Subscription';
import { UPDATE_TWO_FACTOR } from '@setl/core-store';
import { MyUserService } from '@setl/core-req-services';
import { MemberSocketService } from '@setl/websocket-service';
import { MultilingualService } from '@setl/multilingual';
import * as _ from 'lodash';

@Component({
    selector: 'app-enroll',
    templateUrl: './enroll.component.html',
    styleUrls: ['./enroll.component.scss'],
})
export class EnrollComponent implements OnDestroy, OnInit {
    userId: number;
    useTwoFactor: number;
    qrCode: string = '';
    showQRCodeChallenge: boolean = false;

    @select(['user', 'myDetail']) getUserDetails$;
    @select(['user', 'authentication']) authentication$;
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletId$;

    // List of observable subscriptions
    subscriptionsArray: Subscription[] = [];

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private ngRedux: NgRedux<any>,
        private memberSocketService: MemberSocketService,
        private myUserService: MyUserService,
        private confirmationService: ConfirmationService,
        public translate: MultilingualService,
    ) {
    }

    ngOnInit() {
        this.subscriptionsArray.push(this.getUserDetails$.subscribe((userDetails) => {
            this.userId = userDetails.userId;
        }));

        this.subscriptionsArray.push(this.authentication$.subscribe((auth) => {
            this.useTwoFactor = auth.useTwoFactor;
        }));
    }

    /**
     * Enables/disables a user's Two Factor Authentication setting
     *
     * @param {boolean} setting
     *
     * @return {void}
     */
    setTwoFactorAuthentication(setting: boolean) {
        this.alertsService.create('loading');

        const twoFactorAuthentication = String(Number(setting));

        const asyncTaskPipe = this.myUserService.setTwoFactorAuthentication({
            twoFactorAuthentication,
            type: 'GoogleAuth',
        });

        let confirmationTitle = '';
        let confirmationMessage = '';

        if (setting) {
            confirmationTitle = this.translate.translate(
                'Enable Two-Factor Authentication');
            confirmationMessage = this.translate.translate(
                'Are you sure you want to enable Two-Factor Authentication?');
        } else {
            confirmationTitle = this.translate.translate(
                'Disable Two-Factor Authentication');
            confirmationMessage = this.translate.translate(
                'Are you sure you want to disable Two-Factor Authentication?');
        }

        this.confirmationService.create(
            `<span>${confirmationTitle}</span>`,
            `<span class="text-warning">${confirmationMessage}</span>`,
        ).subscribe((ans) => {
            if (ans.resolved) {
                if (setting) {
                    const asyncTaskPipe = this.myUserService.getTwoFactorQrCode();

                    this.ngRedux.dispatch(SagaHelper.runAsync(
                        [],
                        [],
                        asyncTaskPipe,
                        {},
                        (data) => {
                            if (_.get(data, '[1].Data[0].qrCode', '')) {
                                this.qrCode = data[1].Data[0].qrCode;
                                this.showQRCodeChallenge = true;
                                this.changeDetectorRef.markForCheck();
                            }
                        },
                        () => {
                        }),
                    );
                } else {
                    this.ngRedux.dispatch(SagaHelper.runAsync(
                        [UPDATE_TWO_FACTOR],
                        [],
                        asyncTaskPipe,
                        {},
                        () => {
                            this.alertsService.generate('success', this.translate.translate(
                                'Two-Factor Authentication has been disabled.'));
                        },
                        (data) => {
                            console.error('error: ', data);
                            this.alertsService.generate('error', this.translate.translate(
                                'Two-Factor Authentication could not be disabled.'));
                        }),
                    );
                    this.showQRCodeChallenge = false;
                }

                this.changeDetectorRef.markForCheck();
            }

            this.alertsService.create('clear');
        });
    }

    ngOnDestroy() {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
