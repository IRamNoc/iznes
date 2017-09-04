import {Injectable} from '@angular/core';
import {SetlCallbackRegister, SetlWebSocket} from '@setl/vanilla-websocket-wrapper';
import {ToasterService} from 'angular2-toaster';
import _ from 'lodash';
import {NgRedux} from '@angular-redux/store';
import {
    getAuthentication,
    getMyDetail
} from '@setl/core-store';


@Injectable()
export class WalletNodeSocketService {
    private websocket: SetlWebSocket;
    private callBackRegister: SetlCallbackRegister;
    private walletNodeToken: string;

    constructor(private toasterService: ToasterService,
                private ngRedux: NgRedux<any>) {
        ngRedux.subscribe(() => this.connectToNode());
    }

    /**
     * Connect to walletnode
     */
    connectToNode() {
        /**
         * Get Authentication and user data from app store,
         * use them to connect to walletnode.
         */
        const newState = this.ngRedux.getState();
        const authenData = getAuthentication(newState);
        const myDetail = getMyDetail(newState);

        const userId = myDetail.userId;
        const {isLogin, apiKey} = authenData;

        // If websocket instance is not created and user is not login.
        // return.
        if (this.websocket || !isLogin) {
            return;
        }

        this.callBackRegister = new SetlCallbackRegister();

        // If socket closes, re-open it.
        this.callBackRegister.addHandler('OnClose',
            (ID, message, UserData) => {
                if (this.websocket) {
                    // toast('Wallet Node Connection', 'Wallet Node Closed', 'info');
                    console.log('reconnect to wallet node');
                    setTimeout(this.websocket.openWebSocket, 2000);
                }
            }, {}
        );

        this.callBackRegister.addHandler('Update', (data, response) => {
            console.log(data);
        }, {});


        try {

            // Instantiate WebSocket object.
            this.websocket = new SetlWebSocket('ws:', '10.0.1.106', 13535, '', this.callBackRegister, true, ['authenticate']);

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
    }

    walletNodeSubscribeForUpdate(ID, message, UserData) {
        // ID would be 'authenticate'
        // Message will be {}
        // UserData will not be set.

        try {
            if ((this.websocket !== undefined)) {
                // Get the initial snapshot, and handle it.
                this.getInitialSnapshotFromThroughSocket();
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
                    topic: ['block', 'balanceview', 'proposal', 'transaction', 'serverstatus', 'stateview', 'blockchanges']
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
}

