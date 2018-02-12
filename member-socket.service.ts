import {Injectable} from '@angular/core';
import {SocketClusterWrapper} from '@setl/socketcluster-wrapper';

@Injectable()
export class MemberSocketService {
    private socket: SocketClusterWrapper;
    public accessToken: string;
    public token: string;
    public disconnectCallback: any;
    public errorCallback: any;
    public connectCallback: any;
    public reconnectCallback: any;
    private hostname = 'localhost';
    private port = 9788;
    private path = 'db';

    constructor() {
    }

    updateConfig(hostname: string, port: number, path: string) {
        this.hostname = hostname;
        this.port = port;
        this.path = path;

        this.connect();
    }

    connect() {
        if (this.socket) {
            try {
                this.socket.closeWebSocket();
            } catch (err) {
                throw new Error('Warning - Fail to close membernode websocket.');
            }
        }

        this.socket = new SocketClusterWrapper(
            'ws',
            this.hostname,
            this.port,
            this.path
        );

        this.socket.disconnectCallback = () => {
            this.disconnectCallback();
            return true;
        };

        this.socket.errorCallback = () => {
            if (this.errorCallback) {
                this.errorCallback();
            }
            return true;
        };

        this.socket.connectCallback = () => {
            if (this.socket.connectTries > 1) {
                this.reconnectCallback();
            }
            return true;
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
