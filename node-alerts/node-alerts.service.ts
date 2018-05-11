import {Injectable} from '@angular/core';

import {ToasterService} from 'angular2-toaster';
import {NgRedux} from '@angular-redux/store';

import {MemberSocketService, WalletNodeSocketService} from '@setl/websocket-service';

import {MyUserService} from '../my-user/my-user.service';
import {WalletnodeChannelService} from '../walletnode-channel/service';


@Injectable()
export class NodeAlertsService {

    private waitTime = 3000;
    private waitCount = 3;

    constructor(
        private toasterService: ToasterService,
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
        private myUserService: MyUserService,
        private walletNodeSocketService: WalletNodeSocketService,
        private walletNodeChannelService: WalletnodeChannelService,
    ) {
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
            this.myUserService.defaultRefreshToken(this.ngRedux);
        };
    }

    setWalletNodeCallbacks() {
        const callbacks = this.setTimers({
            success: 'Wallet node connection reconnected',
            error: 'Wallet node connection is closed',
            errorType: 'warning',
        });

        this.walletNodeSocketService.walletnodeUpdateCallback = (id, message, userData) => {
            this.walletNodeChannelService.resolveChannelMessage(id, message, userData);
        };

        this.walletNodeSocketService.walletnodeClose.subscribe(callbacks.disconnect);
        this.walletNodeSocketService.walletnodeOpen.subscribe(callbacks.reconnect);
    }

    setTimers(messages) {
        const waitCount = this.waitCount;

        let connectionErrors = 0;
        let timer;
        let poppedDisconnect = false;

        const disconnectCallback = () => {
            connectionErrors++;
            clearInterval(timer);

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
            }
            clearInterval(timer);
        };
        const popDisconnect = () => {
            clearInterval(timer);
            this.toasterService.pop(messages.errorType, messages.error);
            poppedDisconnect = true;
            connectionErrors = 0;
        };

        return {
            disconnect: disconnectCallback,
            reconnect: reconnectCallback
        };
    }

}
