/**
 * todo
 * 1. Include compression
 * 2. Handle JWT when talking to walletnode, if we are going to communicate to walletnode directly.
 */

import * as _ from 'lodash';
import * as sha256 from 'sha256';
import * as SocketCluster from 'socketcluster-client';
import * as _sodium from 'libsodium-wrappers';

const initialRequestTemplate = {
    EndPoint: 'member',
    MessageType: 'Initialise',
    MessageHeader: '',
    MessageBody: {},
};

const GibberishAES = (<any>window).GibberishAES;

export class SocketClusterWrapper {
    defaultProtocol: string;
    protocol: string;
    hostName: string;
    port: string;
    route: string;
    socketClusterOption: object;
    webSocketConn: any;
    encryption: any;
    messageQueue: Array<any>;
    initialising: boolean;
    hasConnected: boolean;
    connectTries: number;
    channels: Array<any>;
    onConnectionInterval: any;
    errorCallback = () => true;
    disconnectCallback = () => true;
    connectCallback = () => true;
    reconnecteInterval: any;

    constructor(protocol, hostname, port, route) {
        this.defaultProtocol = window.location.protocol === 'https' ? 'wws' : 'ws';

        this.protocol = _.defaultTo(protocol, this.defaultProtocol);
        this.hostName = _.defaultTo(hostname, window.location.hostname);
        this.port = _.defaultTo(port, '9788');
        this.route = _.defaultTo(route, 'db');

        // socketcluster connection option.
        this.socketClusterOption = {
            port: this.port,
            hostname: this.hostName,
            path: '/' + this.route,
            ackTimeout: 60000 // increased to 60 from 10 to allow for longer request times
        };

        // The socketcluster connection instance.
        this.webSocketConn = false;

        // Store encryption data
        // - server pub
        // - my secrete
        // - my pub
        // - share secret
        this.encryption = {};

        // Maintain a queue of messages, in case of messages would  need to wait for be ready to be sent.
        this.messageQueue = [];
        // Is we are doing initialising.
        this.initialising = false;
        this.hasConnected = false;
        // Track connection attempts.
        this.connectTries = 0;

        this.channels = [];

    }

    openWebSocket() {

        if (SocketCluster === undefined) {
            console.error('Socketcluster is undefined');
            return false;
        }

        // If there is not yet a socketcluster connection.
        if (!this.webSocketConn) {
            // If initialising, don't do it again.
            if (this.initialising) {
                return false;
            }

            this.initialising = true;

            _sodium.ready.then(() => {
                const sodium = _sodium;
                try {

                    try {
                        this.connectTries += 1;

                        this.webSocketConn = SocketCluster.connect(this.socketClusterOption);
                    } catch (error) {
                        this.initialising = false;
                        this.webSocketConn = false;
                        return false;
                    }

                    this.webSocketConn.on('connect', () => {

                        this.hasConnected = true;

                        // On connection:
                        this.connectCallback();
                        console.log('connected');

                        // Generate my public-private key pair.
                        this.encryption.mySecret = sodium.randombytes_buf(sodium.crypto_box_SECRETKEYBYTES);
                        this.encryption.myPublicKey = sodium.crypto_scalarmult_base(this.encryption.mySecret, 'hex');

                        // Send my public key to server.
                        const requestBody = {
                            pub: this.encryption.myPublicKey,
                        };

                        // Initial handshake request.
                        const initialRequest = Object.assign({}, initialRequestTemplate, { MessageBody: requestBody });
                        const initialRequestText = JSON.stringify(initialRequest);

                        this.webSocketConn.emit('onMessage', initialRequestText, (errorCode, data) => {
                            // We should receive server's public key now.
                            if (data !== false) {
                                this.encryption.serverPublicKey = data.Data;
                                const shared = sodium.crypto_scalarmult(this.encryption.mySecret,
                                    sodium.from_hex(this.encryption.serverPublicKey));
                                this.encryption.shareKey = sha256(sodium.to_hex(shared));

                                this.initialising = false;

                                while (this.messageQueue.length > 0) {
                                    this.sendRequest(this.messageQueue.shift());
                                }
                            }
                        });

                        // Subscribe to Channel is now used in Channel Service
                    });

                    this.webSocketConn.on('error', (error) => {
                        /**
                         * Reconnect when error. Hopefully, the make the connection more stable.
                         */

                        console.error('socket error: ', error);
                        this.errorCallback();
                        try {
                            if (this.reconnecteInterval) {
                                clearInterval(this.reconnecteInterval);
                            }
                        } catch (e) {
                        }

                        this.closeWebSocket();

                        const reconnecteInterval = setInterval(() => {
                            if (!this.hasConnected) {
                                this.openWebSocket();
                                console.log('error: reconnect');
                            } else {
                                clearInterval(reconnecteInterval);
                            }
                        }, 2000);
                    });

                    this.webSocketConn.on('disconnect', (error) => {
                        /**
                         * Reconnect when error. Hopefully, the make the connection more stable.
                         */
                        console.error('socket disconnect: ', error);
                        this.disconnectCallback();

                        try {
                            if (this.reconnecteInterval) {
                                clearInterval(this.reconnecteInterval);
                            }
                        } catch (e) {
                        }

                        this.closeWebSocket();

                        const reconnecteInterval = setInterval(() => {
                            if (!this.hasConnected) {
                                this.openWebSocket();
                                console.log('disconnect: reconnect');
                            } else {
                                clearInterval(reconnecteInterval);
                            }
                        }, 2000);
                    });

                    this.defaultOnOpen();

                } catch (error) {
                    this.showTryCatchError(error);
                }
            });
        }
    }

    sendRequest([request, callback]) {
        _sodium.ready.then(() => {
            /**
             * Cache the requests from the browser when:
             * 1. Initialising
             * 2. Required authentication and has not authenticated and the request message type is not
             *      this.authMessageTypes: ['authentication']
             */
            if (this.initialising || this.encryption.shareKey === false) {
                this.messageQueue.push([request, callback]);
            } else {

                // Log the request we sending out.
                try {
                    console.log('sendRequest(): ' + _.get(request, 'MessageBody.RequestName'));
                } catch (error) {
                    this.showTryCatchError(error);
                }

                // Send request

                let requestText = JSON.stringify(request);

                if (this.encryption.shareKey !== false) {
                    requestText = GibberishAES.enc(requestText, this.encryption.shareKey);
                }

                this.webSocketConn.emit('onMessage', requestText, (error, responseData) => {
                    if (error) {
                        console.warn(error);
                    } else {
                        const decoded = GibberishAES.dec(responseData, this.encryption.shareKey);
                        const message = JSON.parse(decoded);
                        callback(error, message);
                    }
                });
            }
        });
    }

    subscribeToChannel(channelName, callback) {

        /* Validate. */
        if (!channelName) {
            channelName = this.webSocketConn.id;
        }

        /**
         * Handle the assignment of a watcher to a channel.
         * 1. Spawn a channel.
         * 2. Assign the callback as a watcher to the channel.
         */

        // if (this.initialising || this.encryption.shareKey === false) {
        //     this.messageQueue.push([request, callback]);
        // } else {
        //
        //     // Log the request we sending out.
        //     try {
        //         console.log('sendRequest(): ' + _.get(request, 'MessageBody.RequestName'));
        //     } catch (error) {
        //         this.showTryCatchError(error);
        //     }
        //
        //     // Send request
        //
        //     let requestText = JSON.stringify(request);
        //
        //     if (this.encryption.shareKey !== false) {
        //         requestText = GibberishAES.enc(requestText, this.encryption.shareKey);
        //     }
        //
        //     this.webSocketConn.emit('onMessage', requestText, (error, responseData) => {
        //         let decoded = GibberishAES.dec(responseData, this.encryption.shareKey);
        //
        //
        //         let message = JSON.parse(decoded);
        //
        //
        //         callback(error, message);
        //     });
        //
        // }

        /* Create the channel if it doesn't exist. */
        if (!this.channels[channelName]) {
            console.log('Subscribing to ' + channelName + ': ', this.channels[channelName]);
            this.channels[channelName] = this.webSocketConn.subscribe(channelName);
        }

        /* Unwatch any handlers already on the channel. */
        this.channels[channelName].unwatch();

        /* Add a watcher to the channel, we'll do the decryption in here. */
        this.channels[channelName].watch((transmissionData) => {
            /* Now we can decrypt the data. */
            // console.log('|- Incoming Channel Publish...');
            // console.log('| TRANSMISSION DATA: ', transmissionData);
            const decrypted = GibberishAES.dec(transmissionData, this.encryption.shareKey) || transmissionData;

            // console.log('| DESCRYPTED DATA: ', decrypted);
            /* Callback. */
            callback(decrypted);
        });
    }

    defaultOnOpen() {
        console.log('Connection established to web socket server!');
    }

    closeWebSocket() {
        if (this.webSocketConn) {
            // Deauthenticate this connection.
            // It is seen that deauthenticate() can make sure the auth token is clear in local storage.
            this.webSocketConn.deauthenticate(() => {
                console.log('Connection deauthenticated.');
            });

            SocketCluster.destroy(this.socketClusterOption);
            this.resetConnectionData();
        }
    }

    resetConnectionData() {
        this.webSocketConn = false;
        this.initialising = false;
        this.encryption = {};
        this.messageQueue = [];
        this.hasConnected = false;
        this.channels = [];
    }

    showTryCatchError(error) {
        console.log('Error: ' + error.message + ', file: ' + error.fileName + ', line: ' + error.lineNumber);
    }
}
