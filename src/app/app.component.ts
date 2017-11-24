import {Component, HostListener, AfterViewInit} from '@angular/core';
import {MemberSocketService, WalletNodeSocketService} from '@setl/websocket-service';
import {WalletnodeChannelService, InitialisationService} from '@setl/core-req-services';
import {OfiMemberNodeChannelService, OfiPostTxService, OfiWalletnodeChannelService} from '@ofi/ofi-main';
import {ToasterService} from 'angular2-toaster';
import {NgRedux, select} from '@angular-redux/store';
import {MyUserService} from '@setl/core-req-services';

import {
    setMenuShown
} from '@setl/core-store';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
    title = 'app';
    users: Array<object>;
    public toasterconfig: any;
    jasperoAlertoptions: any = {
        overlay: true,
        overlayClickToClose: true,
        showCloseButton: true,
        duration: 500000
    };
    jasperoConfirmaSetting: any = {
        overlay: true,
        overlayClickToClose: true,
        showCloseButton: true,
        confirmText: 'Yes',
        declineText: 'No'
    };

    constructor(private ngRedux: NgRedux<any>,
                private memberSocketService: MemberSocketService,
                private walletnodeChannelService: WalletnodeChannelService,
                private walletNodeSocketService: WalletNodeSocketService,
                private  toasterService: ToasterService,
                private initialisationService: InitialisationService,
                private ofiMemberNodeChannelService: OfiMemberNodeChannelService,
                private ofiPostTxService: OfiPostTxService,
                private _myUserService: MyUserService,
                private _ofiWalletnodeChannelService: OfiWalletnodeChannelService) {

        memberSocketService.disconnectCallback = () => {
            this.toasterService.pop('error', 'Member node connection disconnected');

        };

        // memberSocketService.errorCallback = () => {
        //     this.toasterService.pop('warning', 'Member node connection error');
        // };

        memberSocketService.reconnectCallback = () => {
            this.toasterService.pop('success', 'Member node connection reconnected');

            // If this connection is connected, let backend know about it, by sending the backend a request(in the case,
            // extend session call would do here).
            this._myUserService.defaultRefreshToken(this.ngRedux);
        };

        /**
         * Handle walletnode update message.
         * @param id
         * @param message
         * @param userData
         */
        this.walletNodeSocketService.walletnodeUpdateCallback = (id, message, userData) => {
            this.walletnodeChannelService.resolveChannelMessage(id, message, userData);
            this._ofiWalletnodeChannelService.resolveChannelMessage(id, message, userData);
        };

        this.initialisationService.channelUpdateCallbacks.push((data) => {
            this.ofiMemberNodeChannelService.resolveChannelUpdate(data);
        });
    }

    /**
     * Handle Menu hiding on Smaller Screens less than 1400
     * @param event
     */
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (event.target.innerWidth <= 1440) {
            this.ngRedux.dispatch(setMenuShown(false));
        } else {
            this.ngRedux.dispatch(setMenuShown(true));
        }
    }

    ngAfterViewInit() {

    }
}

