import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, Output, EventEmitter } from '@angular/core';
import { MultilingualService } from '@setl/multilingual';
import { APP_CONFIG } from '@setl/utils/appConfig/appConfig';
import { AppConfig } from '@setl/utils/appConfig/appConfig.model';
import { mapTo } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NodeAlertsService, MyUserService } from '@setl/core-req-services';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { ToasterService } from 'angular2-toaster';
import { select } from '@angular-redux/store';
import { Router } from '@angular/router';
import { get } from 'lodash';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'connection-status-alerts',
    templateUrl: './component.html',
})

export class ConnectionStatusAlerts implements OnInit, OnDestroy {

    @Output() activeAlert: EventEmitter<any> = new EventEmitter();

    public appConfig: AppConfig;
    public onlineOb;
    public connectionStatus: any = {};
    public showCountdownModal: boolean;
    public remainingSecond: number;

    private subscriptions: Subscription[] = [];

    @select(['user', 'connected', 'memberNodeSessionManager']) memberNodeSessionManagerOb;

    constructor(public translate: MultilingualService,
                public changeDetectorRef: ChangeDetectorRef,
                private nodeAlertsService: NodeAlertsService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
                private toaster: ToasterService,
                private router: Router,
                private myUserService: MyUserService,
    ) {
        this.appConfig = appConfig;
        this.appConfig.platform = !this.appConfig.platform ? 'OpenCSD' : this.appConfig.platform;

        /* Create observable from navigator.onLine event which returns the online status of the browser */
        this.onlineOb = Observable.merge(
            Observable.of(navigator.onLine),
            Observable.fromEvent(window, 'online').pipe(mapTo(true)),
            Observable.fromEvent(window, 'offline').pipe(mapTo(false)),
        );
    }

    ngOnInit() {
        this.connectionStatus = {
            nodeDead: false,
            internetDead: false,
        };

        // Wallet/Member Node Connection subscriptions
        this.subscriptions.push(
            combineLatest(
                this.nodeAlertsService.walletNodeDead$,
                this.nodeAlertsService.memberNodeDead$,
            )
            .subscribe(([walletNodeDisconnected, memberNodeDisconnected]) => {
                (walletNodeDisconnected || memberNodeDisconnected) ? this.nodeDead() : this.nodeAlive();
            }));

        // Internet Connection Subscription
        this.subscriptions.push(this.onlineOb.subscribe(status => this.internetDead(status)));

        // Session Timeout Subscription
        this.subscriptions.push(this.memberNodeSessionManagerOb.subscribe(
            (memberNodeSessionManager) => {
                this.showCountdownModal = get(memberNodeSessionManager, 'startCountDown', 0);

                const remainingSecond = get(memberNodeSessionManager, 'remainingSecond', 0);
                this.remainingSecond = remainingSecond;

                if (remainingSecond <= 0) {
                    this.router.navigateByUrl('/logout');
                }

            },
        ));
    }

    /**
     * Handles the users internet disconnected and reconnected alerts
     * @param status - users internet connected boolean
     */
    internetDead(status) {
        if (this.connectionStatus.internetDead && status) {
            this.toaster.pop(
                'success',
                this.translate.translate('Reconnected'),
                this.translate.translate('You\'re reconnected to the internet'),
            );
        }
        this.connectionStatus.internetDead = !status;
        this.isActiveConnectionAlert();
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Handles displaying the wallet/member node reconnected alert
     */
    nodeAlive() {
        if (this.connectionStatus.nodeDead) {
            this.toaster.pop(
                'success',
                this.translate.translate('Reconnected'),
                this.translate.translate('You\'re reconnected to our servers'),
            );
        }
        this.connectionStatus.nodeDead = false;
        this.isActiveConnectionAlert();
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Handles displaying the wallet/member node disconnection alert
     */
    nodeDead() {
        if (!this.connectionStatus.nodeDead) {
            this.connectionStatus.nodeDead = true;
            this.isActiveConnectionAlert();
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Emits boolean to activeAlert based on if a connection alert is visible
     */
    isActiveConnectionAlert() {
        this.activeAlert.emit(this.connectionStatus.nodeDead || this.connectionStatus.internetDead);
    }

    /**
     * Makes a call to extend the users session
     */
    handleExtendSession() {
        this.myUserService.defaultRefreshToken();
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.changeDetectorRef.detach();
    }
}
