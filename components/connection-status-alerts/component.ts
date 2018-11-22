import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, Output, EventEmitter } from '@angular/core';
import { MultilingualService } from '@setl/multilingual';
import { APP_CONFIG } from '@setl/utils/appConfig/appConfig';
import { AppConfig } from '@setl/utils/appConfig/appConfig.model';
import { mapTo } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NodeAlertsService } from '@setl/core-req-services';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'connection-status-alerts',
    templateUrl: './component.html',
})

export class ConnectionStatusAlerts implements OnInit, OnDestroy {

    @Output() activeAlert: EventEmitter<any> = new EventEmitter();

    private appConfig: AppConfig;

    public onlineOb;
    private timerSecs = 7;
    public connectionStatus: any = {
        walletNodeDead: false,
        walletNodeReconnected: false,
        walletNodeTimer: this.timerSecs,
        walletNodeTimerString:
            `You've been disconnected from our servers, you should be reconnected in ${this.timerSecs} sec`,
        loading: false,
        internetDead: false,
        internetReconnected: false,
    };

    public walletNodeDeadModal: Observable<boolean>;

    private subscriptions: Subscription[] = [];

    constructor(public translate: MultilingualService,
                public changeDetectorRef: ChangeDetectorRef,
                private nodeAlertsService: NodeAlertsService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {

        this.appConfig = appConfig;
        this.appConfig.platform = !this.appConfig.platform ? 'OpenCSD' : this.appConfig.platform;

        /* Create observable from navigator.onLine event which returns the online status of the browser */
        this.onlineOb = Observable.merge(
            Observable.of(navigator.onLine),
            Observable.fromEvent(window, 'online').pipe(mapTo(true)),
            Observable.fromEvent(window, 'offline').pipe(mapTo(false)),
        );

        this.walletNodeDeadModal = this.nodeAlertsService.dead;
    }

    ngOnInit() {
        /* Connection subscriptions */
        this.subscriptions.push(this.nodeAlertsService.disconnected.subscribe((disconnected) => {
            disconnected ? this.walletNodeDead() : this.walletNodeAlive();
        }));
        this.subscriptions.push(this.onlineOb.subscribe(status => this.internetDead(status)));
    }

    /**
     * Handles the users internet disconnected and reconnected alerts
     * --------------------------------------------------------------
     * @param status - users internet connected boolean
     */
    internetDead(status) {
        if (this.connectionStatus.internetDead && status) {
            this.connectionStatus.internetReconnected = true;
            setTimeout(
                () => {
                    this.connectionStatus.internetReconnected = false;
                    this.isActiveConnectionAlert();
                    this.changeDetectorRef.detectChanges();
                },
                3000,
            );
        }
        this.connectionStatus.internetDead = !status;
        this.isActiveConnectionAlert();
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Handles displaying the wallet node reconnected alert
     * ----------------------------------------------------
     */
    walletNodeAlive() {
        if (this.connectionStatus.walletNodeDead) {
            this.connectionStatus.walletNodeReconnected = true;
            setTimeout(
                () => {
                    this.connectionStatus.walletNodeReconnected = false;
                    this.isActiveConnectionAlert();
                    this.changeDetectorRef.detectChanges();
                },
                3000,
            );
        }
        this.connectionStatus.walletNodeDead = false;
        this.isActiveConnectionAlert();
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Handles displaying the wallet node disconnection alert
     * -----------------------------------------------------
     */
    walletNodeDead() {
        if (!this.connectionStatus.walletNodeDead) {
            const timer = setInterval(
                () => {
                    this.connectionStatus.walletNodeTimer -= 1;
                    this.connectionStatus.walletNodeTimerString =
                        this.translate.translate(
                            'You\'ve been disconnected from our servers, you should be reconnected in @timer@ sec',
                            { timer: this.connectionStatus.walletNodeTimer },
                        );
                    this.connectionStatus.loading = false;
                    this.changeDetectorRef.detectChanges();
                },
                1000,
            );
            setTimeout(
                () => {
                    clearInterval(timer);
                    this.connectionStatus.walletNodeTimerString = this.translate.translate(
                        'You\'ve been disconnected from our servers, you should be reconnected soon');
                    this.connectionStatus.loading = true;
                    this.connectionStatus.walletNodeTimer = this.timerSecs;
                    this.changeDetectorRef.detectChanges();
                },
                1000 * this.timerSecs,
            );
            this.connectionStatus.walletNodeDead = true;
            this.connectionStatus.walletNodeReconnected = false;
            this.isActiveConnectionAlert();
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Emits boolean to activeAlert based on if a connection alert is visible
     * ----------------------------------------------------------------------
     */
    isActiveConnectionAlert() {
        this.activeAlert.emit(this.connectionStatus.walletNodeDead || this.connectionStatus.internetDead ||
            this.connectionStatus.walletNodeReconnected || this.connectionStatus.internetReconnected);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.changeDetectorRef.detach();
    }
}
