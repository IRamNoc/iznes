import {Component} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
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
    JasperoAlertoptions: any = {
        overlay: true,
        overlayClickToClose: true,
        showCloseButton: true,
        duration: 500000
    };

    constructor(private memberSocketService: MemberSocketService,
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
    }
}
