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
import {mapTo, distinctUntilChanged, switchMap, map, filter, switchAll, takeUntil} from 'rxjs/operators';

@Injectable()
export class NodeAlertsService {
    private walletNodeTTL = 30000;
    private walletNodeDeathSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private memberNodeTTL = 30000;
    private memberNodeDeathSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private toasterService: ToasterService,
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
        private myUserService: MyUserService,
        private walletNodeSocketService: WalletNodeSocketService,
        private walletNodeChannelService: WalletnodeChannelService,
    ) {
        this.setMemberNodeCallbacks();
        this.walletNodeSocketService.freshConnection.subscribe(s => this.setWalletNodeCallbacks());
    }

    // wallet node dead observable
    get walletNodeDead$() {
        return this.walletNodeDeathSubject.asObservable();
    }

    // membernode node dead observable
    get memberNodeDead$() {
        return this.memberNodeDeathSubject.asObservable();
    }

    setMemberNodeCallbacks() {
        merge(
            this.memberSocketService.getReconnectStatus().pipe(mapTo('reconnect')),  // 1.  Listen to reconnect and emit "reconnect"
            this.memberSocketService.disconnect$().pipe(mapTo('disconnect')) // 2.  Listen to disconnect and emit "disconnect"
        ).pipe(                                                     // 3.  Merge them in to single stream
            distinctUntilChanged(),                                 // 4.  Only emit if it has changed
            switchMap((ob) => {                                     // 5.  Create inner observable for each event
                return of(ob).pipe(                                 // 6.  Create duplicate observable
                    map(x => timer(this.memberNodeTTL).map(t => x)),            // 7.  Start timer
                    switchAll(),                                    // 8.  Reset timer each time we get an event
                );                                                  //
            })                                                      //
        ).subscribe(x => {
            this.memberNodeDeathSubject.next(x === 'disconnect')
        });
    }

    setWalletNodeCallbacks() {
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
                    map(x => timer(this.walletNodeTTL).map(t => x)),            // 7.  Start timer
                    switchAll(),                                    // 8.  Reset timer each time we get an event
                );                                                  //
            })                                                      //
        ).pipe(
            takeUntil(this.walletNodeSocketService.waiveConnection),
        ).subscribe(x => this.walletNodeDeathSubject.next(x === 'close'));             // 9. Emit true to deathSubject
        // The switchMap above causes the inner observable (ob) to complete each time a new event is received. This means
        // if the connection has closed, and then re-opens, the timer is stopped and will not emit that it is dead.
    }

}
