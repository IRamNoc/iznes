import {Component} from '@angular/core';
import {MemberSocketService, WalletNodeSocketService} from '@setl/websocket-service';
import {WalletnodeChannelService, InitialisationService} from '@setl/core-req-services';
import {OfiMemberNodeChannelService} from '@ofi/ofi-main';
import {ToasterService} from 'angular2-toaster';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
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

    constructor(private memberSocketService: MemberSocketService,
                private walletnodeChannelService: WalletnodeChannelService,
                private walletNodeSocketService: WalletNodeSocketService,
                private  toasterService: ToasterService,
                private initialisationService: InitialisationService,
                private ofiMemberNodeChannelService: OfiMemberNodeChannelService) {

        memberSocketService.disconnectCallback = () => {
            this.toasterService.pop('error', 'Member node connection disconnected');

        };

        // memberSocketService.errorCallback = () => {
        //     this.toasterService.pop('warning', 'Member node connection error');
        // };

        memberSocketService.reconnectCallback = () => {
            this.toasterService.pop('success', 'Member node connection reconnected');
        };

        /**
         * Handle walletnode update message.
         * @param id
         * @param message
         * @param userData
         */
        this.walletNodeSocketService.walletnodeUpdateCallback = (id, message, userData) => {
            this.walletnodeChannelService.resolveChannelMessage(id, message, userData);
        };

        this.initialisationService.channelUpdateCallbacks.push((data) => {
            this.ofiMemberNodeChannelService.resolveChannelUpdate(data);
        });
    }
}
