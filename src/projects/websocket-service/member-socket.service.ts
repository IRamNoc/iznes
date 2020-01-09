import {Injectable} from '@angular/core';
import {SocketClusterWrapper} from '@setl/socketcluster-wrapper';
import {Subject} from 'rxjs';

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
    private reconnectSubject = new Subject<boolean>();
    public disconnectSubject: Subject<boolean> = new Subject<boolean>();

    constructor() {
    }

    updateConfig(hostname: string, port: number, path: string) {
        this.hostname = hostname;
        this.port = port;
        this.path = path;

        this.connect();
    }

    async clearConnection() {
        await this.socket.closeWebSocket();
    }

    async connect() {
        if (this.socket) {
            try {
                await this.socket.closeWebSocket();
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
            this.disconnectSubject.next(true);
            return true;
        };

        this.socket.errorCallback = () => {
            if (this.errorCallback) {
                this.errorCallback();
            }
            return true;
        };

        this.socket.connectCallback = () => {

            this.reconnectSubject.next(true);

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

    getReconnectStatus() {
        return this.reconnectSubject.asObservable();
    }

    disconnect$() {
        return this.disconnectSubject.asObservable();
    }

}
