import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ConfirmationService, SagaHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { Subscription } from 'rxjs/Subscription';
import { MyUserService } from '@setl/core-req-services';
import { MemberSocketService } from '@setl/websocket-service';

@Component({
    selector: 'app-enroll',
    templateUrl: './enroll.component.html',
    styleUrls: ['./enroll.component.scss'],
})
export class EnrollComponent implements OnDestroy, OnInit {
    userId: number;
    useTwoFactor: number;
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
            twoFactorVerified: twoFactorAuthentication,
            type: 'GoogleAuth',
            userID: String(this.userId),
        });

        this.confirmationService.create(
            `<span>${setting ? 'Enable' : 'Disable'} Two-Factor Authentication</span>`,
            `<span class="text-warning">Are you sure you want to
                 ${setting ? 'enable' : 'disable'} Two-Factor Authentication?</span>`,
        ).subscribe((ans) => {
            if (ans.resolved) {
                if (setting) {
                    this.showQRCodeChallenge = true;
                } else {
                    this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                        asyncTaskPipe,
                        () => {
                            this.alertsService.generate('success', 'Two-Factor Authentication has been disabled.');

                        },
                        (data) => {
                            console.error('error: ', data);
                            this.alertsService.generate('error', 'Two-Factor Authentication could not be disabled.');
                        }),
                    );
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
