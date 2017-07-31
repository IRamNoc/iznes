/**
 * todo
 * 1. Include compression
 * 2. Handle JWT when talking to walletnode, if we are going to communicate to walletnode directly.
 */

import _ from 'lodash';
import sha256 from 'sha256';
import * as SocketCluster from 'socketcluster-client';
import sodium from 'libsodium-wrappers';

const GibberishAES = require('./gibberish-aes-1.0.0.min');

const initialRequestTemplate = {
    EndPoint: 'member',
    MessageType: 'Initialise',
    MessageHeader: '',
    MessageBody: {},
};

export class SocketClusterWrapper {
    constructor(protocol, hostname, port, route) {
        let defaultProtocol = window.location.protocol === 'https' ? 'wws' : 'ws';

        this.protocol = _.defaultTo(protocol, defaultProtocol);
        this.hostName = _.defaultTo(hostname, window.location.hostname);
        this.port = _.defaultTo(port, '9788');
        this.route = _.defaultTo(route, 'db');

        // socketcluster connection option.
        this.socketClusterOption = {
            port: this.port,
            hostname: this.hostName,
            path: '/' + this.route
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

    }

    openWebSocket() {

        if (SocketCluster === undefined) {
            console.error("Socketcluster is undefined");
            return false;
        }

        // If there is not yet a socketcluster connection.
        if (!this.webSocketConn) {
            // If initialising, don't do it again.
            if (this.initialising) {
                return false;
            }

            this.initialising = true;

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

                    // Generate my public-private key pair.
                    this.encryption.mySecret = sodium.randombytes_buf(sodium.crypto_box_SECRETKEYBYTES);
                    this.encryption.myPublicKey = sodium.crypto_scalarmult_base(this.encryption.mySecret, 'hex');

                    // Send my public key to server.
                    let requestBody = {
                        pub: this.encryption.myPublicKey,
                    };

                    // Initial handshake request.
                    let initialRequest = Object.assign({}, initialRequestTemplate, {MessageBody: requestBody});
                    let initialRequestText = JSON.stringify(initialRequest);

                    this.webSocketConn.emit('onMessage', initialRequestText, (errorCode, data) => {
                        // We should receive server's public key now.
                        if (data != false) {
                            this.encryption.serverPublicKey = data.Data;

                            let shared = sodium.crypto_scalarmult(this.encryption.mySecret, sodium.from_hex(this.encryption.serverPublicKey));
                            this.encryption.shareKey = sha256(sodium.to_hex(shared));

                            this.initialising = false;

                            while (this.messageQueue.length > 0) {
                                this.sendRequest(this.messageQueue.shift());
                            }
                        }
                    });

                    this.webSocketConn.on('error', (error) => {
                        console.error(error);
                    });

                });

                this.defaultOnOpen();

            } catch (error) {
                this.showTryCatchError(error);
            }
        }
    }

    sendRequest([request, callback]) {

        // Log the request we sending out.
        try {
            console.log('sendRequest(): ' + _.get(request, 'MessageBody.RequestName'));
        } catch (error) {
            this.showTryCatchError(error);
        }

        /**
         * Cache the requests from the browser when:
         * 1. Initialising
         * 2. Required authentication and has not authenticated and the request message type is not
         *      this.authMessageTypes: ['authentication']
         */
        if (this.initialising || this.encryption.shareKey === false) {
            this.messageQueue.push([request, callback]);
        } else {
            // Send request

            let requestText = JSON.stringify(request);

            if (this.encryption.shareKey !== false) {
                requestText = GibberishAES.enc(requestText, this.encryption.shareKey);
            }

            this.webSocketConn.emit('onMessage', requestText, (error, responseData) => {
                console.log('receive message')
                console.log(responseData)
                let decoded = GibberishAES.dec(responseData, this.encryption.shareKey);


                let message = JSON.parse(decoded);


                callback(error, message);
            });

        }
    }

    defaultOnOpen() {
        console.info("Connection established to web socket server!");
    }

    closeWebSocket() {
        if (this.webSocketConn) {
            // Deauthenticate this connection.
            // It is seen that deauthenticate() can make sure the auth token is clear in local storage.
            this.webSocketConn.deauthenticate(() => {
                console.info('Connection deauthenticated.');
            });

            this.webSocketConn.destroy(this.socketClusterOption);
            this.resetConnectionData();
        }
    }

    resetConnectionData() {
        this.webSocketConn.false;
        this.initialising = false;
    }

    static showTryCatchError(error) {
        console.log("Error: " + error.message + ', file: ' + error.fileName + ', line: ' + error.lineNumber);
    }
}
