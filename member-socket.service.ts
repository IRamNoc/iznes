import {Injectable} from '@angular/core';
import {SocketClusterWrapper} from '@setl/socketcluster-wrapper';

@Injectable()
export class MemberSocketService {
    private socket: SocketClusterWrapper;
    public accessToken: string;
    public disconnectCallback: any;
    public errorCallback: any;
    public connectCallback: any;
    public reconnectCallback: any;

    constructor(private hostname: string,
                private port: string,
                private path: string) {
        this.socket = new SocketClusterWrapper(
            'ws',
            hostname,
            port,
            path
        );

        this.socket.disconnectCallback = () => {
            this.disconnectCallback();
        };

        this.socket.errorCallback = () => {
            this.errorCallback();
        };

        this.socket.connectCallback = () => {
            if (this.socket.connectTries > 1) {
                this.reconnectCallback();
            }
        };


        this.socket.openWebSocket();


    }

    sendRequest(Request, callBack) {
        this.socket.sendRequest([Request, callBack]);
    }

    /**
     * Subscribe to Channel Callback using in Init
     * @param callback
     */
    subscribeToChannel(callback) {
        this.socket.subscribeToChannel(null, (data) => {
            callback(data);
        });
    }


}
