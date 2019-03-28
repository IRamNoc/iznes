import * as _ from 'lodash';
import * as sha256 from 'sha256';
import * as _sodium from 'libsodium-wrappers';
import * as pako from 'pako';

const GibberishAES = (<any>window).GibberishAES;

export class SetlWebSocket {
    protocol: string;
    hostName: string;
    port: string;
    route: string;
    callbackHandler: any;
    requiredAuthentication: any;
    authMessageTypes: any;
    url: string;
    initialProtocol: string;
    intialHostname: string;
    intialPort: string;
    initialRoute: string;
    haveTriedWs: boolean;
    webSocketConn: any;
    initMessageID: any;
    encryption: any;
    messageQueue: Array<any>;
    initialising: boolean;
    authTokenName: any;
    authToken: any;
    authenticated: boolean;
    hasConnected: boolean;
    connectTries: number;

    constructor(protocol, hostname, port, route, callbackHandler, requiredAuthentication, authMessageTypes) {
        this.protocol = protocol || ((window.location.protocol === 'https') ? 'wss' : 'ws');
        this.hostName = hostname || window.location.hostname;
        this.port = port || '9788';
        this.route = route || 'db';
        this.callbackHandler = callbackHandler;
        this.requiredAuthentication = requiredAuthentication || false;
        this.authMessageTypes = authMessageTypes || ['authenticate'];

        this.url = this.protocol + '//' + this.hostName + ':' + this.port + '/' + this.route;
        this.initialProtocol = this.protocol;
        this.intialHostname = this.hostName;
        this.intialPort = this.port;
        this.initialRoute = this.route;
        this.haveTriedWs = false;
        this.haveTriedIFrame = false;

        this.webSocketConn = false;
        this.initMessageID = false;

        this.encryption = {};

        this.messageQueue = [];
        this.initialising = false;
        this.authTokenName = false;
        this.authToken = '';

        this.authenticated = false;
        this.hasConnected = false;
        this.connectTries = 0;

    }

    get websocketConn() {
        return this.webSocketConn;
    }

    initResponse(id, message, userData) {
        const thisData = _.get(message, 'data', false);
        if (thisData !== false) {
            this.encryption.serverPublicKey = thisData;

            _sodium.ready.then(() => {
                const sodium = _sodium;
                const shared = sodium.crypto_scalarmult(this.encryption.mySecret, sodium.from_hex(this.encryption.serverPublicKey));
                this.encryption.shareKey = sha256(sodium.to_hex(shared));
            });
        }
    }

    defaultOnOpen() {
        console.log('Connection established to web socket server!');
    }

    defaultOnClose(e) {
        console.log('Connection closed! No longer connected to web socket server');

        this.webSocketConn = false;
        this.initialising = false;
        this.authenticated = false;
        this.authTokenName = false;
        this.authToken = '';
    }

    defaultOnError(e) {
        console.log('Error detail: ' + e.data);
    }

    defaultOnMessage(e) {
        let message;
        let decoded;
        let id = 0;
        let isEncrypted = false;

        if (this.encryption.serverPublicKey === false) {
            if (e.data.substr(0, 3) === 'LZ_') {
                const decompress = pako.inflate(atob(decoded.substr(3)));
                message = JSON.parse(String.fromCharCode.apply(null, decompress));
            } else {
                message = JSON.parse(e.data);
            }

        } else {
            decoded = GibberishAES.dec(e.data, this.encryption.shareKey);
            isEncrypted = true;

            if (decoded.substr(0, 3) === 'LZ_') {
                const decompress = pako.inflate(atob(decoded.substr(3)));
                message = JSON.parse(String.fromCharCode.apply(null, decompress));
            } else {
                message = JSON.parse(decoded);
            }
        }

        id = _.get(message, 'requestid', 0) || _.get(message, 'RequestID', 0);

        // Only process callbacks if id is the initMessageID or encryption is in place

        try {
            console.log('%cOn Message : %c' + _.defaultTo(_.get(message, 'Request.MessageBody.RequestName', undefined),
                _.get(message, 'Request.MessageType', undefined)), 'color: green', 'color: black');
        } catch (e) {
            console.log('Fail to get message RequestName/MessageType');
        }

        if ((isEncrypted) || (id === this.initMessageID)) {
            if (this.callbackHandler) {
                this.callbackHandler.handleEvent(id, message);
            }
        }
    }

    authenticatedSet(tokenName, token) {
        this.authenticated = true;
        this.authTokenName = _.defaultTo(tokenName, false);
        this.authToken = _.defaultTo(token, '');

        if ((!this.requiredAuthentication) || (this.authenticated)) {
            while (this.messageQueue.length > 0) {
                this.sendRequest(this.messageQueue.shift());
            }
        }
    }

    send(data) {
        return this.webSocketConn.send(data);
    }

    sendRequest(request) {
        try {
            console.log('%csendRequest() : %c' + _.get(request, 'MessageBody.RequestName'), 'color: #229b9c', 'color: black');
        } catch (e) {
        }

        _sodium.ready.then(() => {
            /**
             * Cache the requests from the browser when:
             * 1. Initialising
             * 2. Required authentication and has not authenticated and the request message type is not
             *      this.authMessageTypes: ['authentication']
             */
            if (
                (this.initialising) ||
                (this.requiredAuthentication && (!this.authenticated) &&
                    (!_.includes(this.authMessageTypes, String(_.get(request, 'messageType', '')).toLowerCase()))
                )
            ) {
                this.messageQueue.push(request);
            } else {
                if (!this.webSocketConn) {
                    this.messageQueue.push(request);
                    this.openWebSocket();
                } else {
                    request['Compress'] = 'lz';
                    if (this.requiredAuthentication && this.authenticated && (this.authTokenName !== false)) {
                        request[this.authTokenName] = this.authToken;
                    }

                    let messageText = JSON.stringify(request);
                    if (this.encryption.shareKey !== false) {

                        messageText = GibberishAES.enc(messageText, this.encryption.shareKey);
                    }

                    return this.webSocketConn.send(messageText);
                }
            }
        });
    }

    openWebSocket(userCallback?: any, userCallbackData?: any) {
        if (WebSocket === undefined) {
            return false;
        }

        // If there is not yet a websocket connection
        if (!this.webSocketConn) {
            // If it is not initialising the websocket connection
            if (!this.initialising) {
                try {
                    this.initialising = true;

                    try {
                        // If we are having problems connecting, try using non-secure socket, if we are on a
                        // secure sites.
                        // Try none-secure connection on every second try: this.connectTries % 2 == 0
                        if (
                            (!this.hasConnected) && (this.initialProtocol === 'wss:') && (this.connectTries > 1) &&
                            (this.connectTries % 2 === 0)
                        ) {

                            if ((this.connectTries % 4 !== 0)) { // not sure why we doing this
                                this.url = 'ws://' + this.initialProtocol + ':80' + this.initialRoute;
                                this.haveTriedWs = true;

                            } else {
                                this.url = this.initialProtocol + '//' + this.intialHostname + ':' + this.intialPort +
                                    '/' + this.initialRoute;
                            }
                        }

                        console.log('Socket : ' + this.url);
                        this.connectTries += 1;
                        this.webSocketConn = new WebSocket(this.url);
                    } catch (e) {
                        // Socket failed to open.
                        this.initialising = false;
                        this.authenticated = false;
                        this.authTokenName = false;
                        this.authToken = '';
                        this.webSocketConn = false;
                        return false;
                    }

                    if (this.webSocketConn.readyState === WebSocket.CLOSED) {
                        // Socket failed to open.
                        this.initialising = false;
                        this.authenticated = false;
                        this.authTokenName = false;
                        this.authToken = '';
                        this.webSocketConn = false;

                        return false;
                    }

                    this.encryption.shareKey = false;
                    this.encryption.mySecret = false;
                    this.encryption.myPublicKey = false;
                    this.encryption.serverPublicKey = false;
                    this.encryption.Curve = false;

                    // Handle when the websocket connection is opened
                    this.webSocketConn.onopen = () => {
                        this.hasConnected = true;
                        this.authToken = false;
                        this.authTokenName = false;
                        this.authToken = '';
                        // todo
                        // callHandler funciton

                        _sodium.ready.then(() => {
                            const sodium = _sodium;
                            this.initMessageID = this.callbackHandler.uniqueIDValue;
                            this.encryption.mySecret = sodium.randombytes_buf(sodium.crypto_box_SECRETKEYBYTES);
                            this.encryption.myPublicKey = sodium.crypto_scalarmult_base(this.encryption.mySecret, 'hex');

                            this.callbackHandler.addHandler(
                                this.initMessageID,
                                (pID, pMessage, pData) => {
                                    this.initResponse(pID, pMessage, pData);
                                    this.initialising = false;

                                    if (Object.prototype.toString.call(userCallback) === '[object Function]') {
                                        userCallback(pID, pMessage, pData);
                                    }

                                    if (this.callbackHandler) {
                                        this.callbackHandler.handleEvent('OnOpen', {});
                                    }

                                    if ((!this.requiredAuthentication) || (this.authenticated)) {
                                        while (this.messageQueue.length > 0) {
                                            this.sendRequest(this.messageQueue.shift());
                                        }
                                    }
                                },
                                {}
                            );

                            const messageBody = {
                                pub: this.encryption.myPublicKey,
                            };

                            const request = {
                                MessageType: 'Initialise',
                                MessageHeader: '',
                                RequestID: this.initMessageID,
                                MessageBody: messageBody,
                            };


                            const messageText = JSON.stringify(request);

                            this.webSocketConn.send(messageText);

                            this.defaultOnOpen();
                        });
                    };

                    this.webSocketConn.onclose = (e) => {
                        this.defaultOnClose(e);

                        // if (this.hasConnected) {
                        if (this.callbackHandler) {
                            this.callbackHandler.handleEvent('onClose', {});
                        }
                        // }
                    };

                    this.webSocketConn.onerror = (e) => {
                        this.defaultOnError(e);

                        if (this.callbackHandler) {
                            this.callbackHandler.handleEvent('OnError', {});
                        }
                    };

                    this.webSocketConn.onmessage = (e) => {
                        this.defaultOnMessage(e);
                    };
                } catch (e) {
                    console.log('%cError : %c' + e.message + ', socket.js, line ' + e.lineNumber,
                        'color: #229b9c', 'color: black');
                }
            }
        }


    }

    closeWebSocket() {
        if (this.webSocketConn) {
            this.webSocketConn.close();
            this.webSocketConn = false;
            this.initialising = false;
            this.authenticated = false;
            this.authTokenName = false;
            this.authToken = '';
        }
    }

    get haveTriedWsVal() {
        return this.haveTriedWs;
    }

    get haveConnectedVal() {
        return this.hasConnected;
    }

    get connectTriesVal() {
        return this.connectTries;
    }

    set haveTriedIFrame(setValue) {
        if (setValue === true) {
            this.haveTriedIFrame = setValue;
        }
    }

    get haveTriedIFrame() {
        return this.haveTriedIFrame;
    }
}

