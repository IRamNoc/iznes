import {Injectable} from '@angular/core';
import {SocketClusterWrapper} from '@setl/socketcluster-wrapper';
import {ToasterService} from 'angular2-toaster';

@Injectable()
export class MemberSocketService {
    private socket: SocketClusterWrapper;

    constructor(private toasterService: ToasterService) {
        this.socket = new SocketClusterWrapper(
            'ws',
            'localhost',
            '9788',
            'db'
        );

        this.socket.openWebSocket();

        // this.socket.onConnection().then(() => {
        //     if (this.socket.webSocketConn.id) {
        //         this.socket.subscribeToChannel(this.socket.webSocketConn.id, function (data) {
        //             console.log('FROM CHANNEL: ', data);
        //         });
        //     }
        // });
    }

    sendRequest(Request, callBack) {
        this.socket.sendRequest([Request, callBack]);
    }

}
