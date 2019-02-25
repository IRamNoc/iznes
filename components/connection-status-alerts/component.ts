import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, Output, EventEmitter } from '@angular/core';
import { MultilingualService } from '@setl/multilingual';
import { APP_CONFIG } from '@setl/utils/appConfig/appConfig';
import { AppConfig } from '@setl/utils/appConfig/appConfig.model';
import { mapTo } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NodeAlertsService } from '@setl/core-req-services';
import {combineLatest} from "rxjs";

@Component({
    styleUrls: ['./component.scss'],
    selector: 'connection-status-alerts',
    templateUrl: './component.html',
})

export class ConnectionStatusAlerts implements OnInit, OnDestroy {

    @Output() activeAlert: EventEmitter<any> = new EventEmitter();

    public appConfig: AppConfig;

    public onlineOb;
    private timerSecs = 7;
    public connectionStatus: any = {};

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

    }

    ngOnInit() {
        const nodeTimerString = this.translate.translate(
            "You've been disconnected from our servers, you should be reconnected in @timerSecs@ sec",
            { timerSecs: this.timerSecs },
        );

        this.connectionStatus = {
            nodeDead: false,
            nodeReconnected: false,
            nodeTimer: this.timerSecs,
            nodeTimerString,
            loading: false,
            internetDead: false,
            internetReconnected: false,
        };

        /* Connection subscriptions */
        this.subscriptions.push(
            combineLatest(
                this.nodeAlertsService.walletNodeDead$,
                this.nodeAlertsService.memberNodeDead$,
            )
            .subscribe(([walletDodeDisconnected, memberDodeDisconnected]) => {
                (walletDodeDisconnected || memberDodeDisconnected) ? this.nodeDead() : this.nodeAlive();
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
     * Handles displaying the wallet/member node reconnected alert
     * ----------------------------------------------------
     */
    nodeAlive() {
        if (this.connectionStatus.nodeDead) {
            this.connectionStatus.nodeReconnected = true;
            setTimeout(
                () => {
                    this.connectionStatus.nodeReconnected = false;
                    this.isActiveConnectionAlert();
                    this.changeDetectorRef.detectChanges();
                },
                3000,
            );
        }
        this.connectionStatus.nodeDead = false;
        this.isActiveConnectionAlert();
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Handles displaying the wallet/member node disconnection alert
     * -----------------------------------------------------
     */
    nodeDead() {
        if (!this.connectionStatus.nodeDead) {
            const timer = setInterval(
                () => {
                    this.connectionStatus.nodeTimer -= 1;
                    this.connectionStatus.nodeTimerString =
                        this.translate.translate(
                            'You\'ve been disconnected from our servers, you should be reconnected in @timer@ sec',
                            { timer: this.connectionStatus.nodeTimer },
                        );
                    this.connectionStatus.loading = false;
                    this.changeDetectorRef.detectChanges();
                },
                1000,
            );
            setTimeout(
                () => {
                    clearInterval(timer);
                    this.connectionStatus.nodeTimerString = this.translate.translate(
                        'You\'ve been disconnected from our servers, you should be reconnected soon');
                    this.connectionStatus.loading = true;
                    this.connectionStatus.nodeTimer = this.timerSecs;
                    this.changeDetectorRef.detectChanges();
                },
                1000 * this.timerSecs,
            );
            this.connectionStatus.nodeDead = true;
            this.connectionStatus.nodeReconnected = false;
            this.isActiveConnectionAlert();
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Emits boolean to activeAlert based on if a connection alert is visible
     * ----------------------------------------------------------------------
     */
    isActiveConnectionAlert() {
        this.activeAlert.emit(this.connectionStatus.nodeDead || this.connectionStatus.internetDead ||
            this.connectionStatus.nodeReconnected || this.connectionStatus.internetReconnected);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.changeDetectorRef.detach();
    }
}
