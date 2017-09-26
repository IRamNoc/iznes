import {Component} from '@angular/core';
import {MemberSocketService, WalletNodeSocketService} from '@setl/websocket-service';
import {WalletnodeChannelService} from '@setl/core-req-services';
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
                private  toasterService: ToasterService) {

        memberSocketService.disconnectCallback = () => {
            this.toasterService.pop('warning', 'Member node connection disconnected');

        };

        // memberSocketService.errorCallback = () => {
        //     this.toasterService.pop('warning', 'Member node connection error');
        // };

        memberSocketService.reconnectCallback = () => {
            this.toasterService.pop('warning', 'Member node connection reconnected');
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


    }
}
