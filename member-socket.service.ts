import {Injectable} from '@angular/core';
import {SocketClusterWrapper} from '@setl/socketcluster-wrapper';

@Injectable()
export class MemberSocketService {
    private socket: SocketClusterWrapper;
    public accessToken: string;

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

    }

    sendRequest(Request, callBack) {
        this.socket.sendRequest([Request, callBack]);
    }


}
