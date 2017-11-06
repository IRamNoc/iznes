import {Injectable} from '@angular/core';
import {SetlCallbackRegister, SetlWebSocket} from '@setl/vanilla-websocket-wrapper';
import {ToasterService} from 'angular2-toaster';
import _ from 'lodash';

@Injectable()
export class WalletNodeSocketService {
    private websocket: SetlWebSocket;
    private callBackRegister: SetlCallbackRegister;
    private walletNodeToken: string;

    // Expose on update callback.
    // Default to nothing now.
    public walletnodeUpdateCallback: any = () => true;

    constructor(private toasterService: ToasterService) {
    }

    /**
     * Connect to walletnode
     */
    connectToNode(protocol: string = 'ws', hostName: string = '127.0.0.1', port: number = 13535, nodePath = '', userId, apiKey) {
        let resolveConnect = () => {
        };
        let rejectConnect = () => {
        };

        // Clear current connection.
        this.clearConnection();

        this.callBackRegister = new SetlCallbackRegister();

        // If socket closes, re-open it.
        this.callBackRegister.addHandler('OnClose',
            (ID, message, UserData) => {
                if (this.websocket) {
                    // toast('Wallet Node Connection', 'Wallet Node Closed', 'info');
                    console.log('reconnect to wallet node');
                    setTimeout(() => this.websocket.openWebSocket(), 2000);
                }
            }, {}
        );

        this.callBackRegister.addHandler('Update', this.walletnodeUpdateCallback, {});

        try {

            // Instantiate WebSocket object.
            this.websocket = new SetlWebSocket(protocol + ':', hostName, port, nodePath, this.callBackRegister, true, ['authenticate']);

            this.websocket.openWebSocket();

            // Do authentication.
            this.callBackRegister.addHandler('OnOpen',
                (ID, message, UserData) => {
                    if (this.websocket) {
                        this.callBackRegister.addHandler('authenticate',
                            (ID1, message1, UserData1) => {
                                if (this.websocket) {
                                    const thisToken = _.get(message1, 'data.token', '');
                                    this.walletNodeToken = thisToken;

                                    this.websocket.authenticatedSet('Token', thisToken);

                                    if (thisToken !== '') {
                                        this.walletNodeSubscribeForUpdate(ID1, message1, UserData1);
                                    }

                                    // Done connection and authenticate. can resolve here.
                                    resolveConnect();

                                }
                            }, {}
                        );

                        // Send Initialise Message
                        // Start initial authentication.

                        const Request = {
                            'messageType': 'authenticate',
                            'requestID': 'authenticate',
                            'messageBody': {
                                'userid': userId,
                                'apikey': apiKey
                            }
                        };

                        this.websocket.sendRequest(Request);
                    }
                }, {}
            );


        } catch (e) {
            console.log('Connection failed!');
        }

        // Connection promise
        return new Promise((resolve, reject) => {
            resolveConnect = resolve;
            rejectConnect = reject;
        });
    }

    walletNodeSubscribeForUpdate(ID, message, UserData) {
        // ID would be 'authenticate'
        // Message will be {}
        // UserData will not be set.

        try {
            if ((this.websocket !== undefined)) {
                // Disable snapshot for now.
                // Get the initial snapshot, and handle it.
                // this.getInitialSnapshotFromThroughSocket();

                // Subscribe to topics
                this.walletNodeMessagingSubscribe(ID, message, UserData);

            }
        }
        catch (e) {
            console.log('Error : ' + e.message + 'socket.js, line ' + e.lineNumber);
        }
    }

    walletNodeMessagingSubscribe(ID, message, UserData) {
        // Any Message with 'Token' in the body will serve to register the Token (User ID) with the WebSocket Server.
        // This message will also register for all Update messages.

        if (this.websocket) {

            const messageID = this.callBackRegister.uniqueIDValue;

            const Request = {
                messageType: 'subscribe',
                messageHeader: '',
                messageBody: {
                    requestName: '',
                    // Subscribe less topics.
                    // topic: ['block', 'balanceview', 'proposal', 'transaction', 'serverstatus', 'stateview', 'blockchanges']
                    topic: ['block', 'stateview', 'blockchanges']
                },
                requestID: messageID
            };

            this.websocket.sendRequest(Request);

        }
    }

    getInitialSnapshotFromThroughSocket() {

        const messageID = this.callBackRegister.uniqueIDValue;
        this.callBackRegister.addHandler(messageID, this.renderSnapshot, {});


        const Request = {
            messageType: 'Request',
            messageHeader: '',
            messageBody: {
                topic: 'state'
            },
            requestID: messageID
        };

        this.websocket.sendRequest(Request);
    }

    /**
     * render initial snapshot.
     */
    renderSnapshot(ID, initialSnapshot, UserData) {
        console.log(initialSnapshot);
    }

    sendRequest(request, callBack) {
        const messageId = this.callBackRegister.uniqueIDValue;
        this.callBackRegister.addHandler(messageId, callBack, {});

        const thisRequest = Object.assign({}, request, {requestID: messageId});

        this.websocket.sendRequest(thisRequest);
    }

    clearConnection() {
        // Close the current connection if any.
        if (this.websocket && this.websocket.webSocketConn) {
            try {
                this.websocket.webSocketConn.onclose = () => true;
                this.websocket.webSocketConn.close();
            } catch (e) {
                console.error('Fail to close websocket (walletnode).');
            }
        }

        // Clear the callback register.
        this.callBackRegister = undefined;
    }
}

