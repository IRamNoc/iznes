
import {throttleTime} from 'rxjs/operators';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { MemberSocketService, WalletNodeSocketService } from '@setl/websocket-service';
import {
    InitialisationService,
    MyUserService,
    WalletnodeChannelService,
    NodeAlertsService
} from '@setl/core-req-services';
import { OfiMemberNodeChannelService, OfiPostTxService, OfiWalletnodeChannelService } from '@ofi/ofi-main';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { NgRedux } from '@angular-redux/store';


import { setLanguage, setMenuShown } from '@setl/core-store';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit, OnInit {
    title = 'app';
    users: Array<object>;
    public toasterconfig: any = new ToasterConfig({
        positionClass: 'toast-bottom-right'
    });
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
                private _ofiWalletnodeChannelService: OfiWalletnodeChannelService,
                private nodeAlerts: NodeAlertsService) {
    }

    ngOnInit() {

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

        this.walletNodeSocketService.closeSubject.pipe(throttleTime(2000)).subscribe((message) => {
            // commented out as the wallet connection close when no activities to walletnode for 2 minutes.
            // this.toasterService.pop('warning', 'Wallet node connection is closed');
        });

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

