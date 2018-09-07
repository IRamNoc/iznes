import { Injectable } from '@angular/core';
import { SetlCallbackRegister, SetlWebSocket } from '@setl/vanilla-websocket-wrapper';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';
import { Subject } from 'rxjs';

@Injectable()
export class WalletNodeSocketService {
    public closeSubject: Subject<string> = new Subject<string>();
    public openSubject: Subject<string> = new Subject<string>();

    private websocket: SetlWebSocket;
    private callBackRegister: SetlCallbackRegister;
    private walletNodeToken: string;

    // Expose on update callback.
    // Default to nothing now.
    public walletnodeUpdateCallback: any = () => true;

    constructor(private toasterService: ToasterService) {
    }

    get open() {
        return this.openSubject.asObservable();
    }

    get close() {
        return this.closeSubject.asObservable();
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
                    console.log('reconnect to wallet node');
                    this.closeSubject.next(message);
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
                                    this.openSubject.next(message1);
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
                    topic: ['block', 'stateview', 'blockchanges', 'applied']
                },
                requestID: messageID
            };

            this.websocket.sendRequest(Request);

        }
    }

    sendRequest(request, callBack) {
        const messageId = this.callBackRegister.uniqueIDValue;
        this.callBackRegister.addHandler(messageId, callBack, {});

        const thisRequest = Object.assign({}, request, { requestID: messageId });

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

