import { Injectable } from '@angular/core';

import { ToasterService } from 'angular2-toaster';
import { NgRedux } from '@angular-redux/store';

import {
    MemberSocketService,
    WalletNodeSocketService,
} from '@setl/websocket-service';

import { MyUserService } from '../my-user/my-user.service';
import { WalletnodeChannelService } from '../walletnode-channel/service';

import { BehaviorSubject, timer, merge, of } from 'rxjs';
import { mapTo, distinctUntilChanged, switchMap, map, filter, switchAll } from 'rxjs/operators';

@Injectable()
export class NodeAlertsService {
    private waitTime = 10000;
    private waitCount = 3;
    private walletNodeTTL = 30000;
    private deathSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private disconnectedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private toasterService: ToasterService,
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
        private myUserService: MyUserService,
        private walletNodeSocketService: WalletNodeSocketService,
        private walletNodeChannelService: WalletnodeChannelService,
    ) {
        this.setNodesCallbacks();
    }

    get dead() {
        return this.deathSubject.asObservable();
    }

    get disconnected() {
        return this.disconnectedSubject.asObservable();
    }

    setNodesCallbacks() {
        this.setMemberNodeCallbacks();
        this.setWalletNodeCallbacks();
    }

    setMemberNodeCallbacks() {
        const callbacks = this.setTimers({
            success: 'Member node connection reconnected',
            error: 'Member node connection disconnected',
            errorType: 'error',
        });

        this.memberSocketService.disconnectCallback = callbacks.disconnect;
        this.memberSocketService.reconnectCallback = () => {
            callbacks.reconnect();

            // If this connection is connected, let backend know about it, by sending the backend a request(in the case,
            // extend session call would do here).
            this.myUserService.defaultRefreshToken();
        };
    }

    setWalletNodeCallbacks() {
        const callbacks = this.setTimers({
            success: 'Wallet node connection reconnected',
            error: 'Wallet node connection is closed',
            errorType: 'warning',
        });

        this.walletNodeSocketService.walletnodeUpdateCallback = (id, message, userData) => {
            this.walletNodeChannelService.resolveChannelMessage(
                id,
                message,
                userData,
            );
        };

        merge(
            this.walletNodeSocketService.open.pipe(mapTo('open')),  // 1.  Listen to open and emit "open"
            this.walletNodeSocketService.close.pipe(mapTo('close')) // 2.  Listen to close and emit "close"
        ).pipe(                                                     // 3.  Merge them in to single stream
            distinctUntilChanged(),                                 // 4.  Only emit if it has changed
            switchMap((ob) => {                                     // 5.  Create inner observable for each event
                return of(ob).pipe(                                 // 6.  Create duplicate observable
                    filter(e => e === 'close'),                     // 7.  Only listen to close events
                    map(x => timer(this.walletNodeTTL)),            // 8.  Start timer
                    switchAll(),                                    // 9.  Reset timer each time we get an event
                );                                                  //
            })                                                      //
        ).subscribe(x => this.deathSubject.next(true));             // 10. Emit true to deathSubject
        // The switchMap above causes the inner observable (ob) to complete each time a new event is received. This means
        // if the connection has closed, and then re-opens, the timer is stopped and will not emit that it is dead.
        this.walletNodeSocketService.close.subscribe(callbacks.disconnect);
        this.walletNodeSocketService.open.subscribe((message) => {
            this.deathSubject.next(false);
            callbacks.reconnect();
        });
    }

    setTimers(messages) {
        const waitCount = this.waitCount;

        let connectionErrors = 0;
        let timer;
        let poppedDisconnect = false;

        const disconnectCallback = () => {
            connectionErrors++;
            if (timer) {
                clearTimeout(timer);
            }

            if (!poppedDisconnect) {
                timer = setTimeout(() => {
                    popDisconnect();
                }, this.waitTime);
                if (connectionErrors >= waitCount) {
                    popDisconnect();
                }
            }
        };
        const reconnectCallback = () => {
            if (poppedDisconnect) {
                this.toasterService.pop('success', messages.success);
                poppedDisconnect = false;
                connectionErrors = 0;
                this.disconnectedSubject.next(false);
            }
            clearTimeout(timer);
        };
        const popDisconnect = () => {
            clearTimeout(timer);
            this.toasterService.pop(messages.errorType, messages.error);
            poppedDisconnect = true;
            connectionErrors = 0;
            this.disconnectedSubject.next(true);
        };

        return {
            disconnect: disconnectCallback,
            reconnect: reconnectCallback,
        };
    }
}
