import {Injectable} from '@angular/core';
import {SocketClusterWrapper} from '@setl/socketcluster-wrapper';

@Injectable()
export class MemberSocketService {
    private socket: SocketClusterWrapper;

    constructor(private hostname: string,
                private port: string,
                private path: string,) {
        this.socket = new SocketClusterWrapper(
            'ws',
            hostname,
            port,
            path
        );

        this.socket.openWebSocket();

        this.socket.onConnection().then(() => {
            if (this.socket.webSocketConn.id) {
                this.socket.subscribeToChannel(this.socket.webSocketConn.id, function (data) {
                    console.log('FROM CHANNEL: ', data);
                });
            }
        });


    }

    sendRequest(Request, callBack) {
        this.socket.sendRequest([Request, callBack]);
    }


}
